

$(document).ready(function() {
    var currentPage = 1;


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

    
    // home-btn 超連結
    $('#home-btn').on('click', function() {
        window.location.href = './homepage.html';
        localStorage.removeItem('homepageCategory');

    });

    // favorite-btn 超連結
    $('#favorite-btn').on('click', function() {
        window.location.href = './favoritepage.html';
        localStorage.removeItem('homepageCategory');

    });   


    // introduction-btn 超連結
    $('#introduction-btn').on('click', function() {
        window.location.href = './introduction.html';
        localStorage.removeItem('homepageCategory');
    
    });  

       
    // 上一頁按鈕點擊事件
    $('#prev-btn').on('click', function() {
        // console.log('上一頁按鈕被點擊');
        if (currentPage > 1) {
            currentPage--;
            slideBook();
        }
        else if (currentPage === 1){
            Swal.fire({
                icon: 'warning', // Set the icon (success, error, warning, info, question)
                title: "It's the first page!",
                showConfirmButton: true               
              });
        }
    });

    // 下一頁按鈕點擊事件
    $('#next-btn').on('click', function() {
        // console.log('下一頁按鈕被點擊');
        if (currentPage < $('.page').length) {
            currentPage++;
            slideBook();
        }
        
        else if (currentPage == $('.page').length){
            Swal.fire({
                icon: 'warning', // Set the icon (success, error, warning, info, question)
                title: 'It\'s the last page! \nThanks for reading~',
                showConfirmButton: true
                // timer: 3000
              });
        }

    });

    function slideBook() {
        var slideAmount = -(currentPage - 1) * 100; // 計算滑動的距離
        console.log('slideAmount:', slideAmount);
        $('.story').animate({
            'margin-left': slideAmount + '%'
        }, 500); // 1000 表示滑動的時間，以毫秒為單位
        
    }
});