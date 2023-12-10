const modal = document.getElementById("myModal");
const modalOpen = document.getElementById("write");
const modalClose = document.getElementById("modalClose");

// 모달 열기
modalOpen.addEventListener("click", () => {
  modal.style.display = "block";
});

// 모달 닫기
modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// 모달 창 외부 클릭 시 닫기
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
