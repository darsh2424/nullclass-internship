const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const uri = "mongodb+srv://iamdarsh2424:QcUbXjAj6lBMOUgc@twitter-clone.zdbvwbl.mongodb.net/?retryWrites=true&w=majority&appName=twitter-clone";
const port = 5000;

const app = express();
app.use(cors());
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

    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send("Email is required");

      const user = await usercollection.findOne({ email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json(user); 
    });

    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postcollection.insertOne(post);
      res.send(result);
    });

    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });

    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postcollection.find({ email }).toArray()
      ).reverse();
      res.send(post);
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