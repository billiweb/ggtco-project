const API_KEY = "80c38cc9c69682fd582acd0a315aa611";
const myLatitude = 37.579617;
const myLongitude = 126.977041;

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${myLatitude}&lon=${myLongitude}&appid=${API_KEY}&units=metric`;

async function getWeatherData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // 각각의 데이터 값을 변수에 저장
    area = data.name;
    temp = Math.round(data.main.temp);
    return data;
  } catch (error) {
    console.error("날씨 데이터 에러:", error.message);
  }
}

// 오늘 날짜 출력
const today = new Date().toLocaleDateString("ko-KR");

(async () => {
  const weatherData = await getWeatherData();
  if (weatherData) {
    // 가져온 날씨 데이터를 HTML 문서에 업데이트
    document.getElementById("area").innerText = `${area}`;
    document.getElementById("temp").innerText = `${temp} °C`;
    document.getElementById("today").innerText = `${today}`;
  }
})();
