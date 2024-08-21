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

        // sub categories info posting to mongodb
        const categoriesCollection = client.db("craftDB").collection("categoriesCollection");
        const docs = [
            { image: "https://i.ibb.co/28wJKpG/Stock-Snap-69-HGCEWOIR.jpg", subcategory_name: "Wooden Furniture & Sculptures" },
            { image: "https://i.ibb.co/r0gNRV3/Stock-Snap-ZHZOIIFITB.jpg", subcategory_name: "Wooden Home Decor" },
            { image: "https://i.ibb.co/vZnH6nH/Stock-Snap-49-FQQBTLIN.jpg", subcategory_name: "Wooden Utensils and Kitchenware" },
            { image: "https://i.ibb.co/qxSFxkR/Stock-Snap-FOJAKAHGFY.jpg", subcategory_name: "Jute Home Decor" },
            { image: "https://i.ibb.co/V33Qyyg/Stock-Snap-9-M2-UOGJ5-XN.jpg", subcategory_name: "Jute Kitchenware & utensils" },
            { image: "https://i.ibb.co/qxSFxkR/Stock-Snap-FOJAKAHGFY.jpg", subcategory_name: "Jute and wooden jewellery" }
        ];
        const options = { ordered: true };
        // const result = await categoriesCollection.insertMany(docs, options);
        // console.log(`${result.insertedCount} documents were inserted`);

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

        // sub categories api start
        app.get("/subcategories", async (req, res) => {
            const cursor = await categoriesCollection.find().toArray();
            const result = res.send(cursor);
        })

        app.get("/subcategoryItems/:subcategory", async (req, res) => {
            const subcategory = req.params.subcategory;
            const query = { subcategory_name: subcategory };
            const result = await craftCollection.find(query).toArray();
            res.send(result);
        })
        // sub categories api end

        app.get("/craftItemDetails/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftCollection.findOne(query);
            res.send(result);
        })

        app.get("/myCraftItems/:email", async (req, res) => {
            const email = req.params.email;
            const query = { user_email: email };
            const result = await craftCollection.find(query).toArray();
            res.send(result);
        })

        app.put("/updateItem/:id", async (req, res) => {
            const id = req.params.id;
            const updatedItemInfo = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    image: updatedItemInfo.image,
                    item_name: updatedItemInfo.item_name,
                    subcategory_name: updatedItemInfo.subcategory_name,
                    description: updatedItemInfo.description,
                    price: updatedItemInfo.price,
                    rating: updatedItemInfo.rating,
                    customization: updatedItemInfo.customization,
                    processing_time: updatedItemInfo.processing_time,
                    stock_status: updatedItemInfo.stock_status
                }
            };
            const result = await craftCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete("/deleteCraftItem/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftCollection.deleteOne(query);
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