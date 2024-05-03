const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xmq0nwv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        // Connect the client to the server
        await client.connect();
        const productsCollection = client.db('storeitems').collection('products');
        console.log("Hey, Noman the shopKeeper! You've successfully connected to MongoDB!");

        //CREATE: Using POST method
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        });

        // READ : Show all the products 
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running!')
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})