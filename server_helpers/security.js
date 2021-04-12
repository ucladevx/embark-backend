const rateLimit = require("express-rate-limit");

//  all limiters used in app
exports.allLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
});
exports.postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
});
exports.studentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 100 requests per windowMs
});
exports.clubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
});
exports.eventLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 100 requests per windowMs
});

//  maintenance mode settings
exports.maintenance_options = {
  mode: false,
  /**Hot-Switch options below
   * endpoint: false,
   * url: '/maintenance',
   * accessKey: 'CHANGE_ME',
   */
  status: 503,
  message: "Sorry, Embark is on maintenance, please check back later",
  checkpoint: "/status",
  retryAfter: 30,
};
