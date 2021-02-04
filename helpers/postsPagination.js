

const postModel = require('../models/post')
const MongoPaging=require("mongo-cursor-pagination")
const ObjectId=require("mongodb").ObjectId;


exports.getPostsPage=async(limitNum, nextPage,previousPage,tags,clubs) =>{
    //const {limitNum,nextPage,previousPage}=req.query;
    console.log(limitNum);
    try{
        
        // const result = await MongoPaging.find(postModel.collection, 
        // {
        //     paginatedField:"timestamp",
        //     limit:parseInt(limitNum),   //number of pages we want
        //     sortAscending:true, 
        //     next:nextPage,       //the next string that is produced after running getPostsPage once
        //     previous:previousPage
        // });
        console.log(tags);
        const result=await MongoPaging.find(postModel.collection,
            {
                query:{
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
                paginatedField:"timestamp",
                limit:parseInt(limitNum),   //number of pages we want
                sortAscending:true, 
                next:nextPage,       //the next string that is produced after running getPostsPage once
                previous:previousPage

             });
        
        //console.log(result);

        // const result = await MongoPaging.search(postModel.collection, 
        //     {
        //         //paginatedField:"timestamp",
        //         limit:13,   //number of pages we want
        //         sortAscending:true, 
        //         next:nextPage,       //the next string that is produced after running getPostsPage once
        //         previous:previousPage
        //     });
       // return result;
       return result;
    } catch(err){
        console.log(err);
        res.send({message:err.message});
    }
}
