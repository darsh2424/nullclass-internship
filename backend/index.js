const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
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
      const user = req.body;
      const result = await usercollection.insertOne(user);
      res.send(result);
    });

    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email }).toArray();
      res.send(user);
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
      const filter = { email: req.params.email }; // ✅ Correct usage
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };

      try {
        const result = await usercollection.updateOne(filter, updateDoc, options);
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