require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const mongoose = require("mongoose");

const voteRouter = require("./routes/VoteRoutes");

const app = express();
const fs = require('fs');
const port = 3001;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use("/api/votes", voteRouter);
//configure mongoose
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/CRUD";
const mongodb_options = {
};
mongoose.connect(mongodb_uri, mongodb_options)
  .catch(err => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Cookie Vote app listening on port ${port}`)
});