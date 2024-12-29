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
  profilePicture: z.string().url().optional(),
  role: z.enum(["BuddyFinder", "Organizer"], "Invalid role"),
  location: z.object({
    type: z.string().default("Point"),
    coordinates: z.array(z.number()).min(2).max(2),
  }),
  fitnessDetails: z
    .object({
      fitnessGoals: z.string().optional(),
      workoutPreferences: z.array(z.string()).optional(),
      availability: z.string().optional(),
    })
    .optional(),
  groups: z.array((val) => mongoose.Types.ObjectId.isValid(val)),
});

// mongoDB
const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        "https://nftcrypto.io/wp-content/uploads/2023/05/2023-05-18-17_57_18-The-Journey-of-an-NFT-Avatar-Word-Product-Activation-Failed.png",
    },
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
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
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
