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
  reachedEnd,
  email
) => {
  try {
    if (reachedEnd) {
      let user;
      if (userType === "student") {
        user = await studentModel.findOne({ email: email });
      } else if (userType === "club") {
        user = await clubModel.findOne({ email: email });
      }

      let likedPosts = user.toObject().likedPosts;
      let commentedPosts = user.toObject().commentedPosts;
      const result = await MongoPaging.find(postModel.collection, {
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
            { _id: { $nin: likedPosts, commentedPosts } },
          ],
        },
        paginatedField: "timestamp",
        limit: parseInt(limitNum), //number of pages we want
        sortAscending: false,
        next: nextPage, //the next string that is produced after running getPostsPage once
        previous: previousPage,
      });
      return result;
    } else {
      const result = await MongoPaging.find(postModel.collection, {
        query: {
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
        paginatedField: "timestamp",
        limit: parseInt(limitNum), //number of pages we want
        sortAscending: false,
        next: nextPage, //the next string that is produced after running getPostsPage once
        previous: previousPage,
      });
      return result;
    }
  } catch (err) {
    return res.send({ message: err.message });
  }
};

exports.getComments = async function (postID, limit, nextPage, prevPage) {
  try {
    const result = MongoPaging.find(commentModel.collection, {
      query: {
        postID: postID,
      },
      paginatedField: "timestamp",
      limit: parseInt(limitNum),
      sortAscending: false,
      next: nextPage,
      previous: prevPage,
    });
    return result;
  } catch (err) {
    res.send({ message: err.message });
  }
};
