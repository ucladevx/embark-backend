const postModel = require("../models/post");
const MongoPaging = require("mongo-cursor-pagination");

exports.getPostsPage = async (
  res,
  limit,
  nextPage1,
  previousPage1,
  nextPage2,
  previousPage2,
  nextPage3,
  previousPage3,
  tags,
  clubs,
  interactedPosts,
  likedPosts,
  commentedPosts
) => {
  try {
    let level_1 = {
      nextPage: nextPage1,
      previousPage: previousPage1,
      interactedPosts: interactedPosts,
      likedPosts: likedPosts,
      commentedPosts: commentedPosts,
    };

    let level_2 = {
      nextPage: nextPage2,
      previousPage: previousPage2,
      interactedPosts: null,
      likedPosts: likedPosts,
      commentedPosts: commentedPosts,
    };

    let level_3 = {
      nextPage: nextPage3,
      previousPage: previousPage3,
      interactedPosts: null,
      likedPosts: null,
      commentedPosts: null,
    };
    level_arr = [level_1, level_2, level_3];

    for (i = 1; i <= 3; i++) {
      let posts = postsQuery(level_arr[i - 1], limit, tags, clubs);
      if (posts.results.length > 0) {
        return {
          result: posts,
        };
      }
    }
  } catch (err) {
    return res.send({ message: err.message });
  }
};

async function postsQuery(level_obj, limitNum, tags, clubs) {
  const {
    interactedPosts,
    likedPosts,
    commentedPosts,
    nextPage,
    previousPage,
  } = level_obj;
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
