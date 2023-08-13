const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;

const User = require("../models/userModel");
const Post = require("../models/postModel");

// @desc Create a new post
// @route POST /api/posts
// @access Private
const createPost = asyncHandler(async (req, res) => {
  const { description, imgFile, audioFile, videoFile } = req.body;

  if (!description) {
    res.status(400);
    throw new Error("Please write something");
  }

  // Get user using the id and the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  let imageFileRes;
  console.log("files", req.files);
  if (req.files?.imgFile) {
    imageFileRes = await cloudinary.uploader.upload(
      req.files.imgFile.tempFilePath,
      { folder: "socialGram" }
    );
  }

  let audioFileRes;
  if (req.files?.audioFile) {
    audioFileRes = await cloudinary.uploader.upload(
      req.files.audioFile.tempFilePath,
      { resource_type: "video", folder: "socialGram" }
    );
  }

  let videoFileRes;
  if (req.files?.videoFile) {
    videoFileRes = await cloudinary.uploader.upload(
      req.files.videoFile.tempFilePath,
      { resource_type: "video", folder: "socialGram" }
    );
  }

  const obj = {};
  obj.description = description;
  if (imageFileRes) {
    obj.imgFile = {
      public_id: imageFileRes.public_id,
      secure_url: imageFileRes.secure_url,
    };
  }
  if (audioFileRes) {
    obj.audioFile = {
      public_id: audioFileRes.public_id,
      secure_url: audioFileRes.secure_url,
    };
  }
  if (videoFileRes) {
    obj.videoFile = {
      public_id: videoFileRes.public_id,
      secure_url: videoFileRes.secure_url,
    };
  }
  obj.user = req.user.id;

  const post = await Post.create(obj);

  // console.log({ post });

  res.status(201).json(post);
});

// @desc Get user posts
// @route GET /api/posts
// @access Private
const getPosts = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const products = await Post.find({ user: req.user.id }).populate(
    "user",
    "name email"
  );

  res.status(200).json(products);
});

// @desc Get all posts
// @route GET /api/posts/all
// @access Public
const getAllPosts = asyncHandler(async (req, res) => {
  const data = await Post.find().populate("user", "name email");

  res.status(200).json(data);
});

// @desc Get user single post
// @route GET /api/posts/:id
// @access Private
const getPost = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  // const user = await User.findById(req.user.id);

  // if (!user) {
  //   res.status(401);
  //   throw new Error("User not found");
  // }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // if (post.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("Not authorized");
  // }

  res.status(200).json(post);
});

// @desc Update post
// @route PUT /api/posts/:id
// @access Private
const updatePost = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedProduct = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedProduct);
});

// @desc Delete post
// @route DELETE /api/posts/:id
// @access Private
const deletePost = asyncHandler(async (req, res) => {
  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const post = await Post.findById(req.params.id);
  console.log("post", post);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  if (post.imgFile?.public_id) {
    await cloudinary.uploader.destroy(post.imgFile.public_id, {
      resource_type: "image",
    });
  }
  if (post.audioFile?.public_id) {
    await cloudinary.uploader.destroy(post.audioFile.public_id, {
      resource_type: "video",
    });
  }
  if (post.videoFile?.public_id) {
    await cloudinary.uploader.destroy(post.videoFile.public_id, {
      resource_type: "video",
    });
  }

  // await post.remove();
  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true });
});

module.exports = {
  createPost,
  getPosts,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};
