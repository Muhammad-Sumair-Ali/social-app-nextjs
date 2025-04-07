import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: Object,
    required: true,
  },
  sender: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    enum: ["follow", "like", "comment"],
    required: true,
  },
  post: {
    type: Object,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
