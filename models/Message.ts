import { IMessages } from "@/lib/types";
import mongoose from "mongoose";


const messageSchema = new mongoose.Schema<IMessages>({
  sender: {
    type: Object,
    required: true,
  },
  receiver: {
    type: Object,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
