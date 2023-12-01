// 명언을 가져오는 함수
async function fetchQuote() {
  try {
    // Quotable API에서 명언 데이터 가져오기
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    // 가져온 명언 데이터를 HTML에 추가
    document.getElementById("quote-text").textContent = `"${data.content}"`;
    document.getElementById("quote-author").textContent = `- ${data.author}`;
  } catch (error) {
    console.error("명언을 가져오는 중 오류가 발생했습니다.", error);
  }
}

// 페이지 로드 시 초기 명언 가져오기
document.addEventListener("DOMContentLoaded", fetchQuote);

// 새로운 명언 가져오기 버튼 클릭 시 동작
function getRandomQuote() {
  fetchQuote();
}
