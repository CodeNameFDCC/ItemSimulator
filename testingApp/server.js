// server.js
import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const REFRESH_SECRET_KEY =
  process.env.REFRESH_SECRET_KEY || "your_refresh_secret_key";

app.use(cors());
app.use(bodyParser.json());

// 사용자 데이터 (예시)
const users = [{ username: "user1", password: "password1" }];

// 로그인 API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { username: user.username },
      REFRESH_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.json({ accessToken, refreshToken });
  } else {
    res.sendStatus(403);
  }
});

// 토큰 갱신 API
app.post("/api/token", (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "15m",
    });
    res.json({ accessToken });
  });
});

// 요청을 보호하는 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 보호된 API
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "이곳은 보호된 API입니다.", user: req.user });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
