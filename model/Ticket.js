import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    // ticket unique id
    ticketId: {
      type: Number,
      unique: true
    },
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

//ticketSchema.plugin(AutoIncrement, { inc_field: 'ticketId' });


export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
