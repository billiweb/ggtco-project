async function fetchData() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    document.getElementById("quote-text").textContent = `"${data.content}"`;
    document.getElementById("quote-author").textContent = `- ${data.author}`;
  } catch (error) {
    console.error("명언을 가져오는 중 오류가 발생했습니다.", error);
  }
}

// 페이지 로드 시 명언 가져오기
document.addEventListener("DOMContentLoaded", fetchData);

// 새로운 명언 가져오기 버튼 클릭 시 동작
function getRandomQuote() {
  fetchData();
}
