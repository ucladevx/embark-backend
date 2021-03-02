const studentModel = require('../models/student');
const clubModel = require('../models/club');
const postModel = require('../models/post')
const MongoPaging = require("mongo-cursor-pagination")
const ObjectId = require("mongodb").ObjectId;


exports.getPostsPage = async (res, limitNum, nextPage, previousPage, tags, clubs, reachedEnd, email) => {
    //const {limitNum,nextPage,previousPage}=req.query;
    /*tags=tags.substring(1, -1);
    console.log(tags);
    tags=tags.split(",");
    console.log(typeof tags);
    console.log(tags);*/

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
            const result = await MongoPaging.find(postModel.collection,
                {
                    query: {
                        $and: [{
                            $or: [{
                                tags: {
                                    $in: tags
                                }
                            }, {
                                authorEmail: {
                                    $in: clubs
                                }
                            }]
                        }, { _id: { $nin: likedPosts, commentedPosts } }]


                    },
                    paginatedField: "timestamp",
                    limit: parseInt(limitNum),   //number of pages we want
                    sortAscending: false,
                    next: nextPage,       //the next string that is produced after running getPostsPage once
                    previous: previousPage

                });
            return result;

        } else {
            const result = await MongoPaging.find(postModel.collection,
                {
                    query: {
                        $or: [{
                            tags: {
                                $in: tags
                            }
                        }, {
                            authorEmail: {
                                $in: clubs
                            }
                        }]

                    },
                    paginatedField: "timestamp",
                    limit: parseInt(limitNum),   //number of pages we want
                    sortAscending: false,
                    next: nextPage,       //the next string that is produced after running getPostsPage once
                    previous: previousPage

                });
            return result;
        }

    } catch (err) {
        return res.send({ message: err.message });
    }
}
