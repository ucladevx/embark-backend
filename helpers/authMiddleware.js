const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //res.send({message:req.headers});
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, req.app.get('secretKey'));

        next()
    }
    catch (error) {
        if (error.message.includes("split")) {
            return res.status(401).json({ message: "Authorization header was not included" });
        }
        res.status(401).json({
            message: error.message
        });
    }
}