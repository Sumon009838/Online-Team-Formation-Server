//sumio
//sumonahmedbin
//sumon
const { MongoClient } =require("mongodb");
const express=require('express');
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
const app=express();
const port=5000;


app.use(cors());
app.use(express.json());

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://sumonahmedbin:sumon@cluster0.5ewdox6.mongodb.net/?retryWrites=true&w=majority";

// Create a new client and connect to MongoDB
const client = new MongoClient(uri);


  

async function run() {
  try {
      await client.connect();
      const db = client.db('contestweb');
    const contestCollection = db.collection('contests');
    const contestdetailsCollection = db.collection('students');
    const teamCollection=db.collection('teams');

    //post
    app.post('/addteams', async (req, res) => {
      try {
        const { teamName,member1,member2,member3 } = req.body;
        const result = await teamCollection.insertOne({ name: teamName,member1:member1,member2:member2,member3:member3});
        res.json({ message: `Team ${teamName} added with ID: ${result.insertedId}` });
      } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    app.post('/addContest', async (req, res) => {
      try {
        const { contestName } = req.body;
        const result = await contestCollection.insertOne({ name: contestName, contestdetails: [] });
        res.json({ message: `Course ${contestName} added with ID: ${result.insertedId}` });
      } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.post('/addContest/:contestId', async (req, res) => {
      try {
        const contestId = req.params.contestId;
        const { studentName,rank } = req.body;
        const classResult = await contestdetailsCollection.insertOne({ name: studentName, rank:rank });
        await contestCollection.updateOne({ _id:new ObjectId(contestId) }, { $push: { contestdetails: classResult.insertedId } });
        res.json({ message: `Student ${studentName} added to contest with ID: ${contestId}` });
      } catch (error) {
        console.error('Error adding class:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

   


    //get

    app.get('/getContest/:contestId',async(req,res)=>{
      const contestId=req.params.contestId;
      const query={_id:new ObjectId(contestId)};
      const contest = await contestCollection.findOne(query);
      res.send(contest);
    })
    app.get('/getcontestdetails/:contestdetailsId',async(req,res)=>{
      const contestdetailsId=req.params.contestdetailsId;
      const query={_id:new ObjectId(contestdetailsId)};
      const contest = await contestdetailsCollection.findOne(query);
      res.send(contest);
    })
   
   
    app.get('/getcontestdetails', async (req, res) => {
      try {
        const contestdetails = await contestdetailsCollection.find().toArray();
        res.json({ contestdetails });
      } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/getContest', async (req, res) => {
      try {
        const contest = await contestCollection.find().toArray();
        res.json({ contest });
      } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    app.get('/getTeams', async (req, res) => {
      try {
        const contest = await teamCollection.find().toArray();
        res.json({ contest });
      } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
  } finally {
     // Close the MongoDB client connection
    // await client.close();
  }
}
// Run the function and handle any errors
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('connected');
});

app.listen(port,()=>{
    console.log('running server on port',port);
});