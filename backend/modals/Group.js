const mongoose = require("mongoose");
const { z } = require("zod");

// zod schema
const groupZodSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  activityType: z
    .string()
    .min(3, "Activity type must be at least 3 characters"),
  schedule: z.string().min(3, "Schedule must be at least 3 characters"),
  location: z
    .object({
      type: z.string().default("Point"),
      coordinates: z.array(z.number()).length(2),
    })
    .optional(),
  description: z.string().optional().default(""),
  organizer: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val))
    .optional(),
  members: z
    .array(
      z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Member ID must be a valid ObjectId",
      })
    )
    .optional()
    .default([]),
  joinRequests: z
    .array(
      z.object({
        userId: z
          .string()
          .refine((val) => mongoose.Types.ObjectId.isValid(val)),
        requestDate: z.date().default(() => new Date()),
        status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
      })
    )
    .optional()
    .default([]),
});

// groupSchema
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    activityType: { type: String, required: true },
    schedule: { type: String, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    description: { type: String },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    joinRequests: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        requestDate: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { timestamp: true }
);

groupSchema.index({ location: "2dsphere" });
// zod validation
groupSchema.statics.validateGroup = (data) => {
  return groupZodSchema.parse(data);
};

module.exports = mongoose.model("Group", groupSchema);
