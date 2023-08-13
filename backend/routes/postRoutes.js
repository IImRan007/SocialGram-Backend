const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createPost).get(protect, getPosts);

router.get("/all", getAllPosts);

router
  .route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
