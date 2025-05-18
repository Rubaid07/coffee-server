const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT  || 3000;

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ynxyt70.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const coffeeaCollection = client.db('coffeeDB').collection('coffees')
    const usersCollection = client.db('coffeeDB').collection('users')

    app.get('/coffees', async(req, res)=> {
      const result = await coffeeaCollection.find().toArray()
      res.send(result)
    })

    app.get('/coffees/:id', async(req, res)=> {
      const id = req.params.id
      const quary = {_id: new ObjectId(id)}
      const result = await coffeeaCollection.findOne(quary)
      res.send(result)
    })

    app.post('/coffees', async(req, res)=> {
        const newCoffee = req.body;
        const result = await coffeeaCollection.insertOne(newCoffee)
        res.send(result)
    })

    app.put('/coffees/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCoffee = req.body
      const updatedDoc = {
        $set: updatedCoffee
      }
      const result = await coffeeaCollection.updateOne(filter, updatedDoc, options)

      res.send(result)
    })

    app.delete('/coffees/:id', async(req, res)=> {
      const id = req.params.id;
      const quary = {_id: new ObjectId(id)}
      const result = await coffeeaCollection.deleteOne(quary)
      res.send(result)
    })

    //user related api
    app.get('/users', async(req, res)=> {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    app.post('/users', async(req, res)=> {
      const userPtofile = req.body;
      console.log(userPtofile);
      const result = await usersCollection.insertOne(userPtofile) 
      res.send(result)
    })

    app.patch('/users', async(req, res)=>{
      const {email, lastSignInTime} = req.body;
      const filter = {email: email}
      const updatedDoc = {
        $set: {
          lastSignInTime: lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)} 
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('Coffee server is getting hotter.')
})

app.listen(port, ()=> {
    console.log(`coffee server is running on port ${port}`);
})
