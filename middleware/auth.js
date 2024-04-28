const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token'];
    if (!token) {
        throw new Error('Permission denied');
      }
    let decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    console.log(decodedToken)
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed try Again" });
  }
};

module.exports = auth;