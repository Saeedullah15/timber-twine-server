const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyrxfdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const craftCollection = client.db("craftDB").collection("craftCollection");

        // API's here
        app.post("/addItem", async (req, res) => {
            const newItemInfo = req.body;
            const result = await craftCollection.insertOne(newItemInfo);
            res.send(result);
        })

        app.get("/craftItems", async (req, res) => {
            const cursor = await craftCollection.find().toArray();
            const result = res.send(cursor);
        })

        app.get("/craftItemDetails/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftCollection.findOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// testing api
app.get("/", (req, res) => {
    res.send("art and craft store server is running....");
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})