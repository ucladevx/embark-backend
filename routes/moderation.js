const express = require("express");
const router = express.Router();
const postModel = require("../models/post");


router.get("/", async function (req, res) {
	try {
		const posts = await postModel.find({});
		return res.status(200).json({
			message: "Posts for moderation queried",
			posts
		})
	} catch (err) {
		return res.status(400).json({
			message: err.message
		})
	}
})

router.post("/", async function (req, res) {
	try {
		const {post_id} = req.body;
		await postModel.findByIdAndDelete(post_id);
		return res.status(200).json({
			message: "Posts deleted successfully"
		})
	} catch (err) {
		return res.status(400).json({
			message:err.message
		})
	}
})

module.exports = router;