const jwt = require("jsonwebtoken");

exports.decodeToken = function (req) {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token, { complete: true });
  return decoded.payload;
};
