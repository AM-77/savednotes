const jwt = require("jsonwebtoken")

const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        req.verified_token = jwt.verify(token, process.env.JWT_KEY || "15zM4X4S5s0s8E1ApOk4r")
        next()
    } catch (error) {
        res.status(401).json({ message: "Authentication Failed." })
    }
}

module.exports = authentication