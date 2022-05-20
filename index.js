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
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('booking');

        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = await serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/booking', async(req, res) =>{
            const patient = req.query.patient;
            const query = {patient: patient};
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        })


        app.post('/booking', async(req, res) =>{
                const booking = req.body;

                const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}

                const exist = await bookingCollection.findOne(query);
                if(exist){
                   return res.send({success: false, booking: exist })
                }
                const results = await bookingCollection.insertOne(booking);
                res.send({success: true,results});

        });
        app.get('/available', async(req, res) =>{
            const date = req.query.date;

            const services = await serviceCollection.find().toArray();

            const query = {date : date};
            const booking = await bookingCollection.find(query).toArray();

            services.forEach(service => {

                const serviceBookings = booking.filter(book => book.treatment === service.name )
                const bookedSlots = serviceBookings.map(book => book.slot);
                const available = service.slots.filter(slot => !bookedSlots.includes(slot));
                service.slots = available;

            })
            res.send(services);



        })




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