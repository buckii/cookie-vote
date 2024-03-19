require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const mongoose = require("mongoose");

const voteRouter = require("./routes/VoteRoutes");

const app = express();
const fs = require('fs');
const port = 3002;
const port_ssl = 3001;
const ssl_options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
http.createServer(app).listen(port);
https.createServer(ssl_options, app).listen(port_ssl);
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

app.use("/api/votes", voteRouter);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/*
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    db: 'cookie_votes',
    strict: true,
    deprecationErrors: true,
  }
});
*/
//configure mongoose
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/CRUD";
const mongodb_options = {
};
mongoose.connect(mongodb_uri, mongodb_options)
  .catch(err => {
    console.log(err);
  });

async function test_connection() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("cookie_vote").command({ ping: 1 });
    return "Pinged your deployment. You successfully connected to MongoDB!";
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

app.get('/', (req, res) => {
  test_connection().catch(console.dir).then(dbsuccess => res.send(dbsuccess));
});

app.get('/votes', async (req, res) => {
  try {
    await client.connect();
    await client.db("cookie_votes").collection("votes").insertOne({picks:[3,1,4,5]});
    let votes = await client.db("cookie_votes").collection("votes").find();
    res.send(votes.toArray());
    return;
    await client.db("cookie_votes").collection("votes").find().toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
    res.send('no votes found');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.post('/vote', async (req, res) => {
  try {
    await client.connect();
    await client.db("cookie_votes").collection('votes').insertOne({picks:req.body});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

/*
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
*/
