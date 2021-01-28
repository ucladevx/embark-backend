const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //res.send({message:req.headers});
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, req.app.get('secretKey'));

        return decodedToken;
    }
    catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
}