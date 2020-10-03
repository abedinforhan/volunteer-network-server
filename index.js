const express = require('express')
require('dotenv').config()
const cors=require('cors')
const  bodyParser=require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = 8080
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qhxza.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});

client.connect(err => {
  const registeredEventsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
  console.log('monodb connected YAY')

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get('/events',(req,res) => {
        const queryEmail=req.query.email
        console.log(queryEmail)
        registeredEventsCollection.find({email:queryEmail})
        .toArray((err,documents)=>{
          res.send(documents)
        })

  })
  
  app.post('/addEvent', (req, res) => {
     const registeredData=req.body;
     console.log(registeredData)
    registeredEventsCollection.insertOne(registeredData)
   
  })

  app.delete('/delete/:id',(req,res)=>{
    const id=req.params.id
    registeredEventsCollection.deleteOne({
      _id: ObjectId(id) })
      .then((result) =>{
        console.log(result)
      })
  })
  
  // client.close();
});


app.listen(process.env.PORT ||  port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})