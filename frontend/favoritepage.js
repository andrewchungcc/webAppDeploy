/* global axios */

const itemTemplate = document.querySelector("#favorite-book-template");
const bookList = document.querySelector("#favorite_books");

const instance = axios.create({
    baseURL: "http://localhost:8000/api",
  });
  
async function main() {
    
    try {
    
      // 抓書名
      const textValue = localStorage.getItem('storedText');
      console.log('textValue:', textValue);
    
      // 抓用戶
      const id = localStorage.getItem('ID');
      console.log('ID:', id);

      // 抓用戶
      const jwt = localStorage.getItem('jwt');
      console.log('jwt:', jwt);

      const members = await getMembers({"account":jwt});
      members.favorite.forEach((book) => renderFavorite(book))
    
    } catch (error) {
        Swal.fire({
            icon: 'error', // Set the icon (success, error, warning, info, question)
            title: "Failed to load Favorite books!",
            showConfirmButton: true,
          });
        console.log(error);
    }
    
    $(document).ready(function() {

        // Logout Button Click Event
        $('#logout-btn').on('click', function() {
            Swal.fire({
                title: 'Logout',
                text: 'Are you sure you want to logout?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    window.location.href = './homepage_before_login.html'; // Redirect to logout page
                }
            });
           });

        $('#home-btn').on('click', function() {
        window.location.href = './homepage.html';
        localStorage.removeItem('homepageCategory');

        });

        // user-btn 超連結
        $('#user-btn').on('click', function() {
            window.location.href = './Member.html';
            localStorage.removeItem('homepageCategory');
    
        });

        // 所有閱讀按鈕設定事件
        $('ul').on('click', '.read-btn', function() {
            // const bookTitle = $(this).siblings('p').text();
            const bookTitle = $(this).closest('.text-box').find('.bookName').text();
            console.log(bookTitle);
            localStorage.setItem('storedText', bookTitle);
            window.location.href = "./introduction.html";
        });
    
        // 所有刪除按鈕設定事件
        $('ul').on('click', '.delete-btn', function() {
            Swal.fire({
                icon: 'warning', // Set the icon (success, error, warning, info, question)
                title: `Are you sure you want to UNLIKE the book？`,
                showCancelButton: true, // Show the cancel button
                showConfirmButton: true,
                confirmButtonText: 'OK', // Text for the confirm button
                cancelButtonText: 'Cancel' // Text for the cancel button
                // timer: 3000
              }).then( (result) => {
                    if (result.isConfirmed){
                        const bookTitle = $(this).closest('.text-box').find('.bookName').text();
                        const id = localStorage.getItem('ID');
                        const jwt = localStorage.getItem('jwt');
                        
                        $(this).closest('li').remove();
                        deleteMembersFav(jwt, bookTitle);
                    };                
                });
        });
    });
}

  


// 抓取書本資訊
async function renderFavorite(books) {
    const item = itemTemplate.content.cloneNode(true);
    // const container = item.querySelector(".farvorite-book-list");

    favorBook = await getBooks({"name":books});
    
    // 圖片
    const coverImage = item.querySelector(".favorite-image");
    urlpic = "./image/" + favorBook.cover
    coverImage.src = urlpic;

    // 書名
    const names = item.querySelector("p.bookName");
    names.innerText = favorBook.name;

    // 作者
    const author = item.querySelector(".author-name");
    author.innerText = `作者： ${favorBook.author}`;

    // 瀏覽次數
    const times = item.querySelector("span.times");
    times.innerText = `瀏覽次數： ${favorBook.times} ${"次"}`;

    // 加入前端List
    bookList.appendChild(item);
}

// 前端呼叫後端function
async function deleteMembersFav(account, bookName) {
    
    console.log({data: {account,bookName}});
    const response = await instance.put("/members/target", {account, bookName});
    return response.data;
}

async function getMembers(id) {
    const response = await instance.get("/members/target", {params:id});
    return response.data;
}

async function getBooks(bookName) {
    const response = await instance.get("/books", {params:bookName});
    return response.data;
}

main();




