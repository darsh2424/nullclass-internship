const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { sendOTPEmail } = require('./utils/sendOTPEmail');
const uri = process.env.MONGODB_URI;
const port = 5000;

const app = express();
app.use(cors({
   origin: [
    "http://localhost:5173",
    "https://6856abc044dae37049f53c82--twitterclone-darsh.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    const db = client.db("twitter-clone-database");
    const postcollection = db.collection("posts");
    const usercollection = db.collection("users");
    const loginlogs = db.collection("loginLogs");
    const otpcollection = db.collection("otps");


    // Your routes here...

    app.post("/register", async (req, res) => {
      try {
        const { username, name, email, password } = req.body;

        if (!username || !name || !email || !password) {
          return res.status(400).send({ error: "Missing required fields" });
        }

        const existingUser = await usercollection.findOne({
          $or: [{ email }, { username }],
        });

        if (existingUser) {
          return res.status(400).send({ error: "Email or username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
          username,
          name,
          email,
          password: hashedPassword,
          followers: [],
          followings: [],
          bio: null,
          dob: null,
          location: null,
          website: null,
          profileImage: null,
          coverImage: null,
          dailyPostInfo: {
            date: new Date().toISOString().split('T')[0],
            count: 0,
          },
          lastPostAt: null,
          createdAt: new Date(),
        };

        const result = await usercollection.insertOne(newUser);

        if (result.acknowledged) {
          res.status(201).send({ acknowledged: true, insertedId: result.insertedId });
        } else {
          res.status(500).send({ error: "Failed to register user" });
        }
      } catch (err) {
        console.error("Error in /register:", err);
        res.status(500).send({ error: "Internal server error" });
      }
    });
    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        const user = await usercollection.findOne({ email });

        if (!user) {
          return res.status(400).send({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).send({ error: "Incorrect password" });
        }
        const { password: pw, ...userData } = user;

        res.status(200).send({ message: "Login successful", user: userData });
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).send({ error: "Internal server error" });
      }
    });
    app.post("/logInfo", async (req, res) => {
      const { email, browser, os, device, ip } = req.body;

      const currentHour = new Date().getHours();

      // 1. Block mobile users except 10 AM to 1 PM
      if (device === "mobile" && (currentHour < 10 || currentHour >= 13)) {
        return res.status(403).send("Mobile access allowed only from 10 AM to 1 PM");
      }

      // 2. If Microsoft browser → allow directly
      if (browser?.toLowerCase().includes("edge")) {
        await saveLoginToDB(email,browser,os,device,ip);
        return res.send({ message: "Logged in successfully - Edge browser" });
      }

      // 3. If Chrome → send OTP
      if (browser?.toLowerCase().includes("chrome")) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        await otpcollection.insertOne({ email, otp, createdAt: new Date() });

        // send OTP by email logic here
        await sendOTPEmail(email, otp);
        return res.send({ otpRequired: true, message: "OTP sent to email" });
      }

      await saveLoginToDB(email,browser,os,device,ip);
      return res.send({ message: "Logged in successfully" });
    });
    async function saveLoginToDB(email,browser,os,device,ip) {
      await loginlogs.insertOne({
        email,
        browser,
        os,
        device,
        ip,
        time: new Date(),
      });
    }
    app.post("/verify-otp", async (req, res) => {
      const { email, otp, browser, os, device, ip } = req.body;
      const record = await otpcollection.findOne({ email, otp: parseInt(otp), createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, });
      if (!record) return res.status(401).json({ error: "Invalid OTP" });

      await saveLoginToDB(email,browser,os,device,ip);
      await otpcollection.deleteMany({ email });
      res.json({ message: "OTP verified. Logged in successfully." });
    });

    app.get("/login-history", async (req, res) => {
      const { email } = req.query;
      const logs = await loginlogs
        .find({ email })
        .sort({ time: -1 })
        .limit(10)
        .toArray();

      res.send(logs);
    });

    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send("Email is required");

      const user = await usercollection.findOne({ email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json(user);
    });

    app.post("/follow", async (req, res) => {
      const { currentUsername, targetUsername } = req.body;

      if (!currentUsername || !targetUsername) return res.status(400).send("Both usernames are required");

      try {
        const currentUser = await usercollection.findOne({ username: currentUsername });
        const targetUser = await usercollection.findOne({ username: targetUsername });

        if (!currentUser || !targetUser) return res.status(404).send("One or both users not found");

        await usercollection.updateOne(
          { _id: currentUser._id },
          { $addToSet: { followings: targetUser._id } }
        );
        await usercollection.updateOne(
          { _id: targetUser._id },
          { $addToSet: { followers: currentUser._id } }
        );

        res.send({ message: "Followed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to follow");
      }
    });

    app.post("/unfollow", async (req, res) => {
      const { currentUsername, targetUsername } = req.body;

      if (!currentUsername || !targetUsername) return res.status(400).send("Both usernames are required");

      try {
        const currentUser = await usercollection.findOne({ username: currentUsername });
        const targetUser = await usercollection.findOne({ username: targetUsername });

        if (!currentUser || !targetUser) return res.status(404).send("One or both users not found");

        await usercollection.updateOne(
          { _id: new ObjectId(currentUser._id) },
          { $pull: { followings: targetUser._id } }
        );
        await usercollection.updateOne(
          { _id: new ObjectId(targetUser._id) },
          { $pull: { followers: currentUser._id } }
        );
        res.send({ message: "Unfollowed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to unfollow");
      }
    });

    app.get("/can-post", async (req, res) => {
      const userId = req.query.userId;
      if (!userId) return res.status(400).send({ canPost: false, reason: "Missing userId" });

      try {
        const user = await usercollection.findOne({ _id: new ObjectId(userId) });
        if (!user) return res.status(404).send({ canPost: false, reason: "User not found" });

        const followerCount = Array.isArray(user.followers) ? user.followers.length : 0;

        // Get IST time
        const nowUTC = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const nowIST = new Date(nowUTC.getTime() + istOffset);
        const hour = nowIST.getHours();
        const minute = nowIST.getMinutes();

        // Check how many posts user made today
        const startOfDayIST = new Date(
          nowIST.getFullYear(),
          nowIST.getMonth(),
          nowIST.getDate(),
          0, 0, 0
        );

        const todayPosts = await postcollection.countDocuments({
          userId: new ObjectId(userId),
          createdAt: { $gte: startOfDayIST },
        });

        if (followerCount < 2) {
          if (hour === 10 && minute <= 30) {
            if (todayPosts === 0) {
              return res.send({ canPost: true });
            } else {
              return res.send({
                canPost: false,
                reason: "You’ve already posted today. Users with less than 2 followers can only post once per day between 10:00–10:30 AM IST.",
              });
            }
          } else {
            return res.send({
              canPost: false,
              reason: "You can only post between 10:00–10:30 AM IST if you have fewer than 2 followers.",
            });
          }
        }

        if (followerCount >= 2 && followerCount < 10) {
          if (todayPosts < 2) {
            return res.send({ canPost: true });
          } else {
            return res.send({
              canPost: false,
              reason: "You’ve reached your 2-post daily limit for today.",
            });
          }
        }

        if (followerCount >= 10) {
          return res.send({ canPost: true });
        }

        return res.send({
          canPost: false,
          reason: "Unable to evaluate post permission.",
        });

      } catch (err) {
        console.error("Error in /can-post:", err);
        return res.status(500).send({ canPost: false, reason: "Server error" });
      }
    });


    app.post("/post", async (req, res) => {
      const { profileImage, post, photo, username, name, email, userId } = req.body;

      if (!userId || !email || !name || !username || !post || !profileImage) return res.status(400).send("User ID and content required");

      try {
        const user = await usercollection.findOne({ _id: new ObjectId(userId) });
        if (!user) return res.status(404).send("User not found");

        const today = new Date().toISOString().slice(0, 10); // e.g., "2025-06-13"
        const now = new Date();

        const followers = user.followers || [];
        const followerCount = followers.length;
        const postInfo = user.dailyPostInfo || { date: today, count: 0 };

        if (postInfo.date !== today) {
          postInfo.date = today;
          postInfo.count = 0;
        }

        let canPost = false;


        if (followerCount < 2) {
          const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
          const hours = istTime.getHours();
          const minutes = istTime.getMinutes();
          const allowed = hours === 10 && minutes >= 0 && minutes <= 30;

          if (allowed && postInfo.count < 1) {
            canPost = true;
          }
        } else if (followerCount >= 2 && followerCount < 10) {
          if (postInfo.count < 2) {
            canPost = true;
          }
        } else {
          // 10 or more followers
          canPost = true;
        }

        if (!canPost) return res.status(403).send({ error: "Posting limit exceeded or time window invalid" });

        const newPost = {
          profileImage, post, photo, username, name, email,
          createdAt: new Date(),
          likes: [],
        };
        await postcollection.insertOne(newPost);

        const result = await postcollection.insertOne(newPost);
        newPost._id = result.insertedId;

        await usercollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              dailyPostInfo: { date: today, count: postInfo.count + 1 },
              lastPostAt: new Date()
            }
          }
        );

        res.send({ message: "Post created successfully", post: newPost });
      } catch (err) {
        console.error("Post error:", err);
        res.status(500).send({ error: "Post failed" });
      }
    });

    app.post("/like", async (req, res) => {
      const { userId, postId } = req.body;

      if (!userId || !postId) return res.status(400).send("userId and postId are required");

      try {
        const post = await postcollection.findOne({ _id: new ObjectId(postId) });
        if (!post) return res.status(404).send("Post not found");

        const alreadyLiked = post.likes?.includes(userId);

        const update = alreadyLiked
          ? { $pull: { likes: userId } }
          : { $addToSet: { likes: userId } };

        await postcollection.updateOne(
          { _id: new ObjectId(postId) },
          update
        );

        res.send({ message: alreadyLiked ? "Post unliked" : "Post liked" });
      } catch (err) {
        console.error("Like error:", err);
        res.status(500).send({ error: "Failed to toggle like" });
      }
    });


    app.get("/user/:username", async (req, res) => {
      const username = req.params.username;
      try {
        const user = await usercollection.findOne({ username });
        if (!user) return res.status(404).send("User not found");

        const { password, ...safeData } = user;
        res.send(safeData);
      } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).send("Internal server error");
      }
    });
    app.get("/userWithId/:id", async (req, res) => {
      const userID = req.params.id;
      if (!ObjectId.isValid(userID)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      try {
        const user = await usercollection.findOne({ _id: new ObjectId(userID) });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const { password, ...safeData } = user;
        res.json(safeData);
      } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/popular-users", async (req, res) => {
      try {
        const users = await usercollection.aggregate([
          {
            $addFields: {
              followerCount: { $size: { $ifNull: ["$followers", []] } }
            }
          },
          { $sort: { followerCount: -1 } },
          { $limit: 10 },
          {
            $project: {
              name: 1,
              username: 1,
              profileImage: 1,
              followerCount: 1
            }
          }
        ]).toArray();

        res.send(users);
      } catch (err) {
        console.error("Popular user fetch error:", err);
        res.status(500).send("Internal server error");
      }
    });

    app.get("/search-users", async (req, res) => {
      const query = req.query.q;
      if (!query) return res.status(400).send("Query is required");

      try {
        const regex = new RegExp(query, "i");
        const users = await usercollection.find({
          $or: [
            { name: { $regex: regex } },
            { username: { $regex: regex } }
          ]
        }).project({ name: 1, username: 1, profileImage: 1 }).limit(20).toArray();

        res.send(users);
      } catch (err) {
        console.error("Search error:", err);
        res.status(500).send("Internal server error");
      }
    });


    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      const enrichedPosts = await Promise.all(
        post.map(async (post) => {
          const user = await usercollection.findOne({ username: post.username });
          return {
            ...post,
            followers: user?.followers || [],
          };
        })
      );

      res.send(enrichedPosts);
    });

    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.findOne({ email });
      if (!user) return res.status(404).send("User not found");

      const post = (await postcollection.find({ email: email }).toArray()).reverse();

      const enrichedPosts = await Promise.all(
        post.map(async (post) => {
          const user = await usercollection.findOne({ username: post.username });
          return {
            ...post,
            followers: user?.followers || [],
          };
        })
      );

      res.send(enrichedPosts);
    });


    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    app.patch("/userupdate/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };

      try {
        const result = await usercollection.updateOne(filter, updateDoc, options);
        // console.log(result)
        res.send(result);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ error: "Failed to update user." });
      }
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Twitter-Clone is working");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});