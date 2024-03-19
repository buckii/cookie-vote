const VoteModel = require("../models/Vote");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.VUE_APP_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "us2",
  useTLS: true
});
console.log('created pusher');

exports.getAllVotes = async () => {
    let all_votes = await VoteModel.find();
    let summary = [0,0,0,0,0,0,0,0,0];
    // summary
    for(let i in all_votes) {
        summary[all_votes[i].picks[0]]++;
    }
    return summary;
};

exports.createVote = async (vote) => {
    console.log({vote});
    let result = await VoteModel.create(vote);
    let all_votes = await this.getAllVotes();
    pusher.trigger("vote-channel", "vote-cast", {
        message: JSON.stringify(all_votes)
    });
    return result;
};