

const postModel = require('../models/post')
const MongoPaging=require("mongo-cursor-pagination")
const ObjectId=require("mongodb").ObjectId;


exports.getPage=async(req,res,next) =>{
    const {postID}=req.query;
    try{
        const result=await MongoPaging.find(postModel.access().collection("Post"),
        {
            query:{
                postID: ObjectId(postID),
           //change the serviceID
            },
            paginatedField:"timestamp",
            limit:10,
            sortAscending:true,
            next:req.query.next,
        });
        res.send({success:true,...result});
    } catch(err){
        console.log(err);
        res.send({message:err.message});
    }



    }
