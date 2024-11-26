import jwt from "jsonwebtoken";

const jwtMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>" 형식에서 토큰 추출

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "유효하지 않은 토큰입니다.", error: err.message });
    }

    req.userId = decoded.id; // 디코딩된 토큰에서 사용자 ID 추출
    next();
  });
};

export default jwtMiddleware;
