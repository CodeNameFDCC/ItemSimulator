import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "error.log");

// 에러 로그 핸들러
const errorLogger = (err, req, res, next) => {
  const logEntry = `${new Date().toISOString()} - ${req.method} - ${
    req.url
  } - ${req.query} - ${req.body}- ${req.headers} - ${err.message}\n`;

  // 로그 파일에 기록
  fs.appendFile(logFilePath, logEntry, (fileErr) => {
    if (fileErr) {
      console.error("로그 파일 기록 중 오류 발생:", fileErr);
    }
  });

  // 다음 미들웨어로 전달
  next(err);
};

export default errorLogger;
