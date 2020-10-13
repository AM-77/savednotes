const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (jwt.decode(token).exp > Date.now() / 1000) {
      req.verifiedToken = jwt.verify(
        token,
        process.env.JWT_KEY || "15zM4X4S5s0s8E1ApOk4r",
      );
      next();
    } else {
      res
        .status(401)
        .json({ message: "Authentication Failed.", error: "Token Expaired." });
    }
  } catch (error) {
    res.status(401).json({ message: "Authentication Failed." });
  }
};

module.exports = authentication;
