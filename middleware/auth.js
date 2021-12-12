const jwt = require("jsonwebtoken");

const { JWT_KEY, JWT_EXP } = process.env;

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  //Spliting at the space. [0] = "Bearer" [1] = token
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  console.log(token);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_KEY);
    console.log(decodedToken);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
