const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://medicare:${process.env.DB_PASS}@cluster0.eai30.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() =>{

    try{

        await client.connect();
        const database = client.db('medicare');
        const treatmentCollection = database.collection('treatments');




    }
    finally{



    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send({message: 'hello world'})
})



app.listen(port, ()=>{
    console.log('listening on port', port)
})