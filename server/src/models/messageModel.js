import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "Conversations" },
    sender: { type: mongoose.Types.ObjectId, ref: "Users" },
    senderId:String,
    text: String,
    media: Array,
    call: Object,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Messages", messageSchema);
