require("dotenv").config();
const jwt = require("jsonwebtoken");
const verifyToken = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ error: "Authorization Token Is Missing" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    req.info = decoded.alreadyExist.rows[0];
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};



const isAdmin = async (req, res, next) => {
  await verifyToken(req, res);
  if (!req.info?.isadmin) {
    res.status(401).json({ message: "FORBIDDEN" });
  }
  next();
};
module.exports = { isAdmin };
