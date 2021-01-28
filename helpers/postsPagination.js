

const postModel = require('../models/post')
const MongoPaging=require("mongo-cursor-pagination")
const ObjectId=require("mongodb").ObjectId;


exports.getPostsPage=async(limitNum, nextPage,previousPage) =>{
    //const {limitNum,nextPage,previousPage}=req.query;
    
    try{
        
        const result = await MongoPaging.find(postModel.collection, 
        {
            paginatedField:"timestamp",
            limit:parseInt(limitNum),   //number of pages we want
            sortAscending:true, 
            next:nextPage,       //the next string that is produced after running getPostsPage once
            previous:previousPage
        });
        return result;
    } catch(err){
        console.log(err);
        res.send({message:err.message});
    }
}
