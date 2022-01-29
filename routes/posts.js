const express = require("express");
const router = express.Router();

const {
  createPosts,
  getPosts,
  savePost,
  unsavePost,
  getSavedPosts,
  addPostLike,
  getPostLikes,
  addPostComment,
  getPostComments,
  getPostsbyUser,
  addResource
} = require("../helpers/posts");

const { getPostsPage } = require("../helpers/postsPagination");
const authorize = require("../helpers/authMiddleware");

router.post("/", authorize, createPosts);
router.get("/", authorize, getPosts);

router.post("/saved", authorize, savePost);
router.get("/saved", authorize, getSavedPosts);

// likes
router.post("/likes", authorize, addPostLike);
router.get("/likes", authorize, getPostLikes);

//resources
router.post("/resource", authorize, addResource);


// comments
/**
 * @swagger
 * /posts/comments:
 *  post:
 *    tags:
 *      - Posts
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: authorID
 *        schema:
 *          type: string
 *        required: true
 *      - in: query
 *        name: post_id
 *        schema:
 *          type: string
 *        required: true
 *      - in: query
 *        name: commentBody
 *        schema:
 *          type: string
 *        required: true
 */
router.post("/comments", authorize, addPostComment);
/**
 * @swagger
 * /posts/comments:
 *  get:
 *    tags:
 *      - Posts
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: postId
 *        schema:
 *          type: string
 *        required: true
 *      - in: query
 *        name: limit
 *        schema:
 *          type: number
 *      - in: query
 *        name: nextPage
 *        schema:
 *          type: string
 *      - in: query
 *        name: prevPage
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: get comments successful
 */
router.get("/comments", authorize, getPostComments);

//router.get("/postsPage", authorize, getPostsPage)

// posts authored by user
router.get("/me", authorize, getPostsbyUser);

module.exports = router;
