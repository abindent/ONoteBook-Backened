var jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and add it to req object
    const token = req.header("auth-token")
    if (!token) {
        res.status(401).send({ error: "Please Authenticate using a valid token." })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.send(401).send("Some Error Occured.")
    }
}

module.exports = fetchUser;
