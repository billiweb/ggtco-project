const myMusic = document.getElementById("my-music");
const playIcon = document.getElementById("play-icon");

playIcon.onclick = function () {
  if (myMusic.paused) {
    myMusic.play();
    playIcon.src = "/images/pause.png"; // 변수명 수정
  } else {
    myMusic.pause();
    playIcon.src = "/images/play.png";
  }
};
