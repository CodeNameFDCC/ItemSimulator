import session from "express-session";

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET_KEY, // 비밀 키
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // HTTPS를 사용할 경우 true로 설정
});

export default sessionMiddleware;
