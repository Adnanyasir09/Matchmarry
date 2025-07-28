import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Basic Info
    age: Number,
    gender: String,
    religion: String,
    dob: Date,

    // Physical & Professional Info
    height: Number,
    weight: Number,
    profession: String,
    salary: Number,
    bodyType: {
      type: String,
      enum: ["slim", "normal", "fat"],
    },

    // Additional Personal Info
maritalStatus: {
  type: String,
  enum: ["single", "divorced", "widow"],
},
state: {
  type: String,
},
livingWithFamily: {
  type: String,
  enum: ["with family", "separate"],
},
height: {
  type: String,
},
weight: {
  type: String,
},
bodyType: {
  type: String,
  enum: ["slim", "normal", "average", "athletic", "heavy"], // Combined all valid options
},
familyStatus: {
  type: String,
  enum: ["rich", "upper middle", "middle", "below middle"],
},
diet: {
  type: String,
  enum: ["veg", "non veg"],
},

   partnerPreferences: {
  religion: { type: String },
  education: { type: String },
  maritalStatus: {
    type: String,
    enum: ["single", "divorced", "widow"], // Match frontend exactly
  },
  diet: {
  type: String,
  enum: ["veg", "non veg"],
},
  ageRange: {
    min: { type: Number },
    max: { type: Number },
  },
},

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
