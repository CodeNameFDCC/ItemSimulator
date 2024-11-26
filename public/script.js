const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const messageDiv = document.getElementById("message");

// 페이지 로드 시 로그인 상태 확인
window.onload = () => {
  const token = localStorage.getItem("jwt"); // JWT 확인

  if (token) {
    // JWT가 존재하면 대시보드로 리다이렉트
    window.location.href = "dashboard.html";
  }
};

// 로그인 처리

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3018/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // JWT를 로컬 스토리지에 저장
        localStorage.setItem("jwt", data.token);
        console.log("발급된 JWT:", data.token); // JWT 출력
        window.location.href = "dashboard.html"; // 대시보드로 리다이렉트
      } else {
        console.error(`로그인 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
    }
  });
}

// 회원가입 처리
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    const regUsername = document.getElementById("regUsername").value;
    const regPassword = document.getElementById("regPassword").value;
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("http://localhost:3018/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.innerText = "회원가입 성공! 로그인 해주세요.";
        registerForm.reset();
      } else {
        messageDiv.innerText = `회원가입 실패: ${data.message}`;
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
    }
  });
}
