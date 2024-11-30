import express from "express";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post("/token", (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ message: "리프레시 토큰이 필요합니다." }); // 리프레시 토큰이 없으면 401 Unauthorized

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "유효하지 않은 리프레시 토큰입니다." }); // 유효하지 않은 리프레시 토큰이면 403 Forbidden

    // 새로운 액세스 토큰 생성
    const accessToken = jwt.sign(
      { username: user.username, id: user.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    res.json({ accessToken });
  });
});

export default router;
