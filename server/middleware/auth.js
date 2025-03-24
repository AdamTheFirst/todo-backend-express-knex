const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret"

/**
 * 
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Next(callback)
 */
function authentication(req, res, next){
    // Get the token, without the "Bearer "
    const bearer = req.headers.authorization;
    if(!bearer) return res.status(401).send("No token");

    const token = bearer.split(" ")[1];

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).send("Invalid token");
    }
    
}

module.exports = authentication;