const VoteModel = require("../models/Vote");

exports.getAllVotes = async () => {
return await VoteModel.find();
};

exports.createVote = async (vote) => {
return await VoteModel.create(vote);
};