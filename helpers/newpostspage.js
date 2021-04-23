const studentModel = require("../models/student");
const clubModel = require("../models/club");
const postModel = require("../models/post");
const MongoPaging = require("mongo-cursor-pagination");
const ObjectId = require("mongodb").ObjectId;

exports.getPostsPage = async (
  res,
  limitNum,
  nextPage,
  previousPage,
  tags,
  clubs,
  email,
  userType
) => {
  try {
    let user;
    if (userType === "student") {
      user = await studentModel.findOne({ email: email });
    } else if (userType === "club") {
      user = await clubModel.findOne({ email: email });
    }
    let interactedPosts = user.toObject().interactedPosts;
    let likedPosts = user.toObject().likedPosts;
    let commentedPosts = user.toObject().commentedPosts;

    const level_1_result = postsQuery(
      limitNum,
      nextPage,
      previousPage,
      tags,
      clubs,
      interactedPosts,
      likedPosts,
      commentedPosts
    );
    const level_2_result = postsQuery(
      limitNum,
      nextPage,
      previousPage,
      tags,
      clubs,
      likedPosts,
      commentedPosts
    );
    const level_3_result = postsQuery(
      limitNum,
      nextPage,
      previousPage,
      tags,
      clubs
    );
  } catch (err) {
    return res.send({ message: err.message });
  }
};

async function postsQuery(
  limitNum,
  nextPage,
  previousPage,
  tags,
  clubs,
  interactedPosts,
  likedPosts,
  commentedPosts
) {
  const posts = await MongoPaging.find(postModel.collection, {
    query: {
      $and: [
        {
          $or: [
            {
              tags: {
                $in: tags,
              },
            },
            {
              authorEmail: {
                $in: clubs,
              },
            },
          ],
        },
        { _id: { $nin: interactedPosts, likedPosts, commentedPosts } },
      ],
    },
    paginatedField: "timestamp",
    limit: parseInt(limitNum),
    sortAscending: false,
    next: nextPage,
    previous: previousPage,
  });
  return posts;
}
