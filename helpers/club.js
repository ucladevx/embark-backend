const clubModel = require('../models/club')

function getClubFromToken(token,email){
    const decodedToken=jwt.verify(token,req.app.get('secretKey'));
    return clubModel.findOne({email:decodedToken.email});
}
exports.editProfile = async function (req, res, next) {
    const {name,email,tags,description,profilePicURL,coverPicURL,website}=req.body;
    try{
    const token=req.headers.authorization.split(" ")[1];
    const club=getClubFromToken(token);
    clubModel.updateOne({id:club._id},
        {$set: {
            "name": name,
            "email":email,
            "tags":tags,
            "website":website,
            "description":description,
            "profilePicURL":profilePicURL,
            "coverPicURL":coverPicURL

        }});
    }
    catch(err){
        return res.json({message:err.message});
    }
    res.redirect('/profile');
}

exports.profile = async function (req, res, next) {
    const token=req.headers.authorization.split(" ")[1];
    const student=getClubFromToken(token);
    res.status(200).send({club});
}
