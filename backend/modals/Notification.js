import mongoose from "mongoose";
const { z } = require("zod");

const notificationZodSchema = z.object({
  userId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value)),
  type: z.string(), // make enum later
  message: z.string(),
  data: z.object(),
  read: z.boolean().optional().default(false),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
});

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String, // buddymatch, joinreq, chatmessage
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.statics.validateSchema = (notificationData) => {
  return notificationZodSchema.parse(notificationData);
};

module.exports = mongoose.model("Notification", notificationSchema);
