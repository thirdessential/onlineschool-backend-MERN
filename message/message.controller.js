const db = require("_helpers/db");
const Message = db.Messages;
const User = db.User;

function saveMessage(data) {
  // save the sent messages by a particular user
  // User.findOneAndUpdate({email: message.sender}, {$set: {}}).then((user) => saveSentMessages(user))
  console.log(data);
  let message = new Message({
    message: data.message,
    sender: data.sender,
    reciever: data.reciever,
    isRead: data.isRead,
    createdAt: data.createdAt,
    room1: data.room,
    room2: data.room2
  });
  message.save();
  console.log({ message: message });
  // function saveSentMessages(user){

  // }
  //save the received messages
}

// sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// reciever: { type: mongoose.Types.Schema.objectId, ref: 'User' },

// function to get message from db by email
function fetchMessage(req, res) {
  Message.find({ sender: req.body.sendemail, reciever: req.body.recemail })
    .sort({ createdAt: 1 })
    .then(content => res.json({ status: true, messages: content }))
    .catch(err => res.json({ status: false, error: err }));
}

module.exports = {
  saveMessage,
  fetchMessage
};
