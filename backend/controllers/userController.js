import User from "../models/User.js";

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
  console.log("Received update:", req.body);
  try {
    const allowedFields = [
      "name", "age", "gender", "religion", "profession", "height", "weight", "salary", "dob",
      "maritalStatus", "state", "livingWithFamily", "bodyType", "familyStatus", "diet",
      "partnerPreferences"
    ];

    // Filter req.body to only include allowed fields
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ message: "Profile update failed" });
  }
};

export const getMatchingUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser || !currentUser.partnerPreferences) {
      return res.status(404).json({ message: "Partner preferences not found" });
    }

    const prefs = currentUser.partnerPreferences;

    const matches = await User.find({
      _id: { $ne: currentUser._id },
      age: { $gte: prefs.ageRange?.min || 18, $lte: prefs.ageRange?.max || 99 },
      religion: prefs.religion,
      maritalStatus: prefs.maritalStatus?.toLowerCase(),
      diet: prefs.diet?.toLowerCase(),
    }).select("name age profession state profilePicture");

    res.json(matches);
  } catch (error) {
    console.error("Match fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
};

// GET PUBLIC PROFILE BY USER ID
export const getPublicUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      "-password -email -__v"
    ); // exclude sensitive/private fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Public profile fetch error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};