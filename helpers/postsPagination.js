

const postModel = require('../models/post')
const MongoPaging=require("mongo-cursor-pagination")
const ObjectId=require("mongodb").ObjectId;


exports.getPostsPage=async(req,res,next) =>{
    const {previousPage,nextPage,limitNum}=req.query;
    console.log(limitNum)
    try{
        
        const result = await MongoPaging.find(postModel.collection, 
        {
            paginatedField:"timestamp",
            limit:parseInt(limitNum),
            sortAscending:true, 
            next:nextPage,
            previous:previousPage
        });
        res.send({result});
    } catch(err){
        console.log(err);
        res.send({message:err.message});
    }
}
