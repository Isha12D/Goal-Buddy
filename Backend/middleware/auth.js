import jwt from 'jsonwebtoken';
//What Is JWT?
//A JWT (JSON Web Token) is a string token given to a user after they log in. It acts like a badge. When the user sends a request to a protected route, the token proves they’re authenticated.

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id },   // EXPLICIT
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};




//middleware to authenticate user
export const authenticateUser = (req, res, next) => {
  console.log("Auth header:", req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token payload:", verified);

    req.user = verified; // { id: "...", email: "..." }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

//module.exports = {generateAccessToken, generateRefreshToken, authenticateUser};