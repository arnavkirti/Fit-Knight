const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { z } = require("zod");

// userSchema
const userZodSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profilePicture: z.string().optional(),
  role: z.enum(["BuddyFinder", "Organizer"], "Invalid role"),
  fitnessDetails: z
    .object({
      fitnessGoals: z.string().optional(),
      workoutPreferences: z.array(z.string()).optional(),
      availability: z.string().time().optional(),
    })
    .optional(),
  groups: z
    .array(
      z.object({
        activityType: z.string().optional(),
        location: z.string().optional(),
        schedule: z.string().optional(),
        members: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

// mongoDB
const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "default.png" },
    role: { type: String, enum: ["BuddyFinder", "Organizer"], required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
    fitnessDetails: {
      fitnessGoals: String,
      workoutPreferences: [String],
      availability: String,
    },
    groups: [
      {
        activityType: String,
        location: String,
        schedule: String,
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
    ],
  },
  { timestamps: true }
);

// Hashing password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// zod validation
userSchema.statics.validateUser = (data) => {
  return userZodSchema.safeParse(data);
};

module.exports = mongoose.model("User", userSchema);
