const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // 콘솔에 에러 스택 출력
  res.status(500).json({
    message: "서버에서 오류가 발생했습니다.",
    error: err.message, // 개발 중에는 에러 메시지를 포함할 수 있음
  });
};

export default errorHandler;
