import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.ObjectId, ref: 'User'},
    replyTicketId: { type: mongoose.Schema.ObjectId, ref: 'Ticket'},
    content: String,
    status:String,
    private:Number,
    attachments:[{id:String,url:String,name:String}]
  },
  { timestamps: true }
);

export default mongoose.models.Reply || mongoose.model("Reply", replySchema);
