import express from "express";
import cors from "cors";
import serverless from "serverless-http";
const mongoose = require("mongoose");

const voteRouter = require("../../routes/VoteRoutes");

const app = express();

app.use(cors());
app.use("/api/votes", voteRouter);
//configure mongoose
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost/CRUD";
const mongodb_options = {
};
mongoose.connect(mongodb_uri, mongodb_options)
  .catch(err => {
    console.log(err);
  });

export const handler = serverless(app);