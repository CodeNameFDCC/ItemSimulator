const userInfoDiv = document.getElementById("userInfo");
const logoutButton = document.getElementById("logoutButton");

// JWT에서 사용자 정보 가져오기
const token = localStorage.getItem("jwt");

// 로그인 상태 확인
if (!token) {
  // JWT가 없으면 로그인 페이지로 리다이렉트
  window.location.href = "index.html";
}

// 사용자 정보 요청
async function fetchUserInfo() {
  try {
    const response = await fetch("http://localhost:3018/api/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // 올바른 형식으로 헤더 설정
      },
    });

    const data = await response.json();

    if (response.ok) {
      userInfoDiv.innerHTML = `<p>환영합니다, 사용자 ID: ${data.userId}</p>`;
    } else {
      userInfoDiv.innerText = `정보를 가져오는 데 실패했습니다: ${data.message}`;
    }
  } catch (error) {
    console.error("사용자 정보를 가져오는 중 오류 발생:", error);
  }
}

// 로그아웃 처리
logoutButton.addEventListener("click", async () => {
  localStorage.removeItem("jwt"); // 로컬 스토리지에서 JWT 삭제
  window.location.href = "index.html"; // 로그인 페이지로 리다이렉트
});

// 대시보드 로드 시 사용자 정보 가져오기
fetchUserInfo();
