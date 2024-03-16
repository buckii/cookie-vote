const express = require("express");
const {
  getAllVotes,
  createVote,
  getVoteById,
  updateVote,
  deleteVote,
} = require("../controllers/VoteController");
 
const router = express.Router();
 
router.route("/").get(getAllVotes).post(createVote);
 
module.exports = router;