import Notification from "../models/Notification";
import { INotification } from "./types";




export const createNotification = async ({ recipient, sender, type, post }:INotification) => {
  if (recipient.email === sender.email) return;

  await Notification.create({
    recipient: recipient,
    sender: sender,
    type, 
    post: post,
    isRead: false,
    createdAt: new Date(),
  });
};
