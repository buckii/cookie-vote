const voteService = require("../services/VoteService");
 
exports.getAllVotes = async (req, res) => {
  try {
    const votes = await voteService.getAllVotes();
    res.json({ data: votes, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.createVote = async (req, res) => {
  try {
    console.log({req_body:JSON.stringify(req.body)});
    const vote = await voteService.createVote(req.body);
    const votes = await voteService.getAllVotes();
    res.json({ data: {vote, votes}, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};