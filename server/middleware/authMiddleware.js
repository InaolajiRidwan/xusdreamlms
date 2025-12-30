import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "No token, aunthorization denied",
      });
    }
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      res.status(400).json({
        message: "Token is not valid !!!",
      });
    }
  } else {
    res.status(401).json({
      message: "No token, aunthorization denied",
    });
  }
};
