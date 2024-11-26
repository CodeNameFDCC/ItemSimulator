import express from "express";
import cookieParser from "cookie-parser";
import path from "path"; // path 모듈 import 추가
import UsersRouter from "./routes/users.router.js";
import sessionMiddleware from "./middlewares/auth.session.middleware.js";

const app = express();
const PORT = 3018;

// 정적 파일 제공
app.use(express.static(path.join(process.cwd(), "public"))); // public 폴더의 정적 파일 제공

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

app.use("/api", [UsersRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
