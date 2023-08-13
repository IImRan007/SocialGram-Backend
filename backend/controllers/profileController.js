const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Profile = require("../models/profileModel");
const User = require("../models/userModel");

// @desc Create user profile POST Request
// @route /api/users/profile
// @access Public
const createProfile = asyncHandler(async (req, res) => {
  const { location, designation, linkedinUrl, githubUrl } = req.body;

  // Get user using the id and the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  // Create user
  const profile = await Profile.create({
    user,
    location,
    designation,
    linkedinUrl,
    githubUrl,
  });

  // if user created
  if (profile) {
    res.status(201).json({
      user: req.user.id,
      location: location,
      designation: designation,
      linkedinUrl: linkedinUrl,
      githubUrl: githubUrl,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getProfiles = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const profiles = await Profile.find({ user: req.user.id });

  res.status(200).json(profiles);
});

// @desc Update profile
// @route PUT /api/users/profile/:id
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    res.status(404);
    throw new Error("Profile not found");
  }

  if (profile.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }
  console.log("body", req.body);
  const updatedProfile = await Profile.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      overwrite: true,
    }
  );

  console.log(updatedProfile);

  res.status(200).json(updatedProfile);
});

module.exports = { createProfile, getProfiles, updateProfile };
