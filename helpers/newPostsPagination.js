const postModel = require("../models/post");
const MongoPaging = require("mongo-cursor-pagination");

exports.getPostsPage = async (
  res,
  limitNum,
  nextPage,
  previousPage,
  tags,
  clubs,
  interactedPosts,
  likedPosts,
  commentedPosts,
  level
) => {
  try {
    //TODO (DONE): also send which level it came from in result. That way if there is an update in a previous level, we dont send nextPage

    let level_1 = {
      interactedPosts: interactedPosts,
      likedPosts: likedPosts,
      commentedPosts: commentedPosts,
    };

    let level_2 = {
      interactedPosts: null,
      likedPosts: likedPosts,
      commentedPosts: commentedPosts,
    };

    let level_3 = {
      interactedPosts: null,
      likedPosts: null,
      commentedPosts: null,
    };
    level_arr = [level_1, level_2, level_3];

    for (i = 1; i < 3; i++) {
      if (level != i) {
        nextPage = null;
      }
      let posts = (posts = postsQuery(
        level_arr[i],
        limitNum,
        nextPage,
        previousPage,
        tags,
        clubs
      ));
      if (posts.results.length > 0) {
        return {
          result: posts,
          level: i,
        };
      }
    }
  } catch (err) {
    return res.send({ message: err.message });
  }
};

async function postsQuery(
  level_obj,
  limitNum,
  nextPage,
  previousPage,
  tags,
  clubs
) {
  const { interactedPosts, likedPosts, commentedPosts } = level_obj;
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
