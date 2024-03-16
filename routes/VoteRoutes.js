const express = require("express");
const {
  getAllVotes,
  createVote,
} = require("../controllers/VoteController");
 
const router = express.Router();
 
router.route("/").get(getAllVotes).post(createVote);
 
module.exports = router;