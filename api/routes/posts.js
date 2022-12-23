const express = require("express");
const router = express.Router();

const PostController = require("../controllers/posts")

router.get("/post/top_ten_posts", PostController.get_top_posts_by_comment);
router.get("/comment", PostController.filter_comments)

module.exports = router;