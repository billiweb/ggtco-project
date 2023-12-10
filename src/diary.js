const supabaseUrl = "https://utjjshvehdmjvjpmxahm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ampzaHZlaGRtanZqcG14YWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE2MjE2MDAsImV4cCI6MjAxNzE5NzYwMH0.2QlVefVPltGzVynyH9pHb1aSXWCSEQoji_Xnp1lA2eA";
const database = supabase.createClient(supabaseUrl, supabaseKey);

// console.log(database);

const diaryModal = document.getElementById("myModal");
const save = document.getElementById("save");
const image = document.getElementById("image");
const imgPreview = document.getElementById("imgPreview");
const diaryList = document.getElementById("diaryList");

// 다이어리 목록을 가져오는 함수
const fetchDiaries = async () => {
  try {
    const { data: diaries } = await database
      .from("diaries")
      .select("*")
      .order("id", { ascending: false });

    // console.log(diaries);

    // 다이어리 목록 초기화
    diaryList.innerHTML = "";

    diaries.map((diary) => {
      const listItem = document.createElement("div");
      listItem.innerHTML = `
        <div class="diaryListTop">
        <p>${diary.created_at}</p>
        <div>
        <button onclick="editDiary(${diary.id})">수정하기</button>
        <button onclick="deleteDiary(${diary.id}, '${diary.image_url}')">삭제하기</button>
        </div>
        </div>
        <div class="diaryListBottom">
        <img src="${diary.image_url}" alt="diary image" style="width: 500px; height: 280px; object-fit: cover;" />
          <h3>${diary.title}</h3>
          <h4>${diary.content}</h4>
        </div>
      `;

      diaryList.appendChild(listItem);
    });
  } catch (error) {
    console.log(
      "데이터를 불러오는 중에 문제가 발생했어요. 잠시 후 다시 시도해주세요."
    );
  }
};

// 페이지 로드 시 fetchDiaries 함수 호출 (즉시 호출이 아니므로 중괄호 필요없음 )
window.onload = fetchDiaries;

// 이미지 미리보기를 위한 이벤트 리스너
image.addEventListener("change", () => {
  const imageSrc = URL.createObjectURL(image.files[0]);
  imgPreview.innerHTML = `<img src="${imageSrc}" alt="preview" style="width: 350px; height: 200px; object-fit: cover;" />`;
});

// 저장 버튼에 대한 클릭 이벤트 리스너
save.addEventListener("click", async (event) => {
  event.preventDefault();
  const file = image.files[0];
  const title = document.querySelector("#title").value;
  const content = document.querySelector("#content").value;

  // console.log(file, title, content);

  if (!title || !content) {
    alert("제목과 내용을 입력해주세요.");
    return;
  }

  try {
    // 스토리지에 이미지 업로드
    const fileName = `diary_${Date.now()}`;
    const { data } = await database.storage
      .from("images")
      .upload(fileName, file);

    // console.log(data);

    // 스토리지에 업로드된 이미지 URL 검색
    const { data: imageUrl } = database.storage
      .from("images")
      .getPublicUrl(fileName);

    // console.log(imageUrl);

    // 'diaries' 테이블에 데이터 저장
    const response = await database
      .from("diaries")
      .insert({ image_url: imageUrl.publicUrl, title, content });

    // console.log(response);

    // 저장 후 데이터 다시 불러와서 목록 갱신
    fetchDiaries();

    // 저장 작업 완료 후 모달 창 닫기
    diaryModal.style.display = "none";
  } catch (error) {
    console.log("에러가 발생했어요. 잠시 후 다시 시도해주세요.");
  }
});

// 다이어리 수정하는 함수
const editDiary = async (id) => {
  try {
    const { data } = await database.from("diaries").select("*").eq("id", id);

    // 이전에 저장된 데이터 불러오기
    document.querySelector("#title").value = data[0].title;
    document.querySelector("#content").value = data[0].content;
    const imageUrl = data[0].image_url;

    // 이미지 미리보기
    imgPreview.innerHTML = `<img src="${imageUrl}" alt="preview" style="width: 350px; height: 200px; object-fit: cover;" />`;

    // 모달 띄우기
    diaryModal.style.display = "block";

    // 저장 버튼 이벤트 리스너에 이미지 업로드와 데이터 수정 로직을 추가하기
    save.addEventListener("click", async (event) => {
      event.preventDefault();
      const newFile = image.files[0];
      const newTitle = document.querySelector("#title").value;
      const newContent = document.querySelector("#content").value;

      if (!newTitle || !newContent) {
        alert("제목과 내용을 입력해주세요.");
        return;
      }

      // 스토리지에 이미지 업로드
      const fileName = `diary_${Date.now()}`;
      await database.storage.from("images").update(fileName, newFile);

      // 스토리지에 업로드된 이미지 URL 검색
      const { data: newImageUrl } = database.storage
        .from("images")
        .getPublicUrl(newFile);

      // 이미지 업로드 유무에 따라 다른 URL 사용
      const updatedImageUrl = newFile ? newImageUrl.publicUrl : imageUrl;

      await database
        .from("diaries")
        .update({
          image_url: updatedImageUrl,
          title: newTitle,
          content: newContent,
        })
        .eq("id", id);

      // 수정 후 데이터 다시 불러와서 목록 갱신
      fetchDiaries();

      // 저장 작업 완료 후 모달 창 닫기
      diaryModal.style.display = "none";
    });
  } catch (error) {
    console.log("에러가 발생했어요. 잠시 후 다시 시도해주세요.");
  }
};

// 다이어리 삭제하는 함수
const deleteDiary = async (id, url) => {
  try {
    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      await database.from("diaries").delete().eq("id", id);
      // const fileName = url.split("/").pop();
      // console.log(fileName);
      // const { data } = await database.storage.from("images").remove([fileName]);
      // console.log(data);

      // 삭제 후 데이터 다시 불러와서 목록 갱신
      fetchDiaries();
    }
  } catch (error) {
    console.log("에러가 발생했어요. 잠시 후 다시 시도해주세요.");
  }
};
