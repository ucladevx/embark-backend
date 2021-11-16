const postModel = require("../models/post");
const MongoPaging = require("mongo-cursor-pagination");

exports.getPostsPage = async ({
  limit,
  nextPage,
  previousPage,
  tags,
  clubs,
  // nextPage1,
  // previousPage1,
  // nextPage2,
  // previousPage2,
  // nextPage3,
  // previousPage3,
  // tags,
  // clubs,
  // interactedPosts,
  // likedPosts,
  // commentedPosts
}
) => {
  try {
    let level = {
      nextPage: nextPage,
      previousPage: previousPage,
      interactedPosts: [],
      likedPosts: [],
      commentedPosts: [],
    }
    // let level_1 = {
    //   nextPage: nextPage1,
    //   previousPage: previousPage1,
    //   interactedPosts: interactedPosts || [],
    //   likedPosts: likedPosts || [],
    //   commentedPosts: commentedPosts || []
    // };

    // let level_2 = {
    //   nextPage: nextPage2,
    //   previousPage: previousPage2,
    //   interactedPosts: [],
    //   likedPosts: likedPosts || [],
    //   commentedPosts: commentedPosts || []
    // };

    // let level_3 = {
    //   nextPage: nextPage3,
    //   previousPage: previousPage3,
    //   interactedPosts: [],
    //   likedPosts: [],
    //   commentedPosts: []
    // };

    // const level_arr = [level_1, level_2, level_3];
    const level_arr = [level];
    const tags1 = tags || [];
    const clubs1= clubs || [];

    for (let i = 1; i <= 3; i++) {
      let posts = await postsQuery(level_arr[i - 1], limit, tags1, clubs1);
      if (posts.results && posts.results.length > 0) {
        return {
          result: posts
        };
      }
    }
    return {
      result: []
    }
  } catch (err) {
    throw new Error(err.message);
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
        { _id: { $nin: [interactedPosts, likedPosts, commentedPosts] } }
      ],
    },
    paginatedField: "timestamp",
    limit: parseInt(limitNum),
    sortAscending: false,
    next: nextPage,
    previous: previousPage
  });
  return posts;
}
