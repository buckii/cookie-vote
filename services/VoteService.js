const VoteModel = require("../models/Vote");

exports.getAllVotes = async () => {
return await VoteModel.find();
};

exports.createVote = async (blog) => {
return await VoteModel.create(blog);
};