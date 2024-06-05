import mongoose from "mongoose";
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ticketSchema = new mongoose.Schema(
  {
    // ticket unique id
    title: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.ObjectId, ref: 'User'},
    replyCount: Number,
    description: String,
    status:String,
    privacy:String,
    lastReply:{ type: mongoose.Schema.ObjectId, ref: 'Reply'}
  },
  { timestamps: true }
);


export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
