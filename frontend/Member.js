/* global axios */


const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {

  try {
    // here is empty
    
  } catch (error) {
    Swal.fire({
      icon: 'error', // Set the icon (success, error, warning, info, question)
      title: "Failed to load members!",
      showConfirmButton: true,
    });
  }

  try {
    // 抓member data
    const currentID = localStorage.getItem('ID');
    console.log(currentID);
    const jwt = localStorage.getItem('jwt');
    const user_id = await getMemberdata({"account":jwt});
    rendermember(user_id);
  
  } catch (error) {
    console.log(error);
    $('.container').hide();
    Swal.fire({
      icon: 'error', // Set the icon (success, error, warning, info, question)
      title: 'Fail to Load the Data！',
      showConfirmButton: true
      // timer: 3000
    });
  }
  const user_id = localStorage.getItem('ID');
  const jwt = localStorage.getItem('jwt');
  unsubscribeEventListeners(jwt);
  changeEventListeners();
  


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

  });

}


function changeEventListeners() {
  // Get the button element by its id
  const editButton = document.getElementById('editButton');


  // Add a click event listener to the button
  editButton.addEventListener('click', function() {
    // Get the element with class 'memberBox'
    const memberBox = document.querySelector('.memberBox');


    // Change the class to 'editBox'
    memberBox.classList.remove('memberBox');
    memberBox.classList.add('editBox');

    // Change the content inside the div
    memberBox.innerHTML = `
      <p class="head">Edit Info</p>
      <p> Name </p>
      <table>
        <td class="icon"><i class='fas fa-keyboard'></i></td>
        <td><input type="text" id="user_id" autofocus placeholder="" autocomplete="name"></td>
      </table>
      <p> Email </p>
      <table>
        <td class="icon"><i class='fas fa-envelope'></i></td>
        <td><input type="text" id="email" placeholder="" autocomplete="email"></td>
      </table>
      <p> Password </p>
      <table>
        <td class="icon"><i class='fas fa-lock'></i></td>
        <td> <input type="password" id="password" autocomplete="current-password"></td>
      </table>
      <p> Credit Card Number </p>
      <table>
        <td class="icon"><i class='fas fa-credit-card'></i></td>
        <td><input type="text" id="creditCard_num" placeholder="Please enter 16 digits number" autocomplete="cc-number"></td>
      </table>
      <br><br>
      <button id="saveButton" class="BlueButton">Save Edits</button>
      <br><br>
      <a href="./Member.html" style = "text-align:center; font-size: 20px;"> back </a>
    `;
    
    try {
    setupEventListeners();
   
  } catch (error) {
    console.log(3)
  }
    
  });


  // try {
  //   setupEventListeners();
   
  // } catch (error) {
  //   console.log(3)
  // }

}

{/* <p> Account </p>
      <table>
        <td class="icon"><i class='fas fa-user'></i></td>
        <td><input type="text" id="account" placeholder="" autocomplete="username"></td>
      </table> */}



{/* 設定EventListeners，裡面包含Sign up按鈕function */}
function setupEventListeners() {
  const saveButton = document.querySelector("#saveButton");
  const nameInput = document.querySelector("#user_id");
  const emailInput = document.querySelector("#email");
  // const accountInput = document.querySelector("#account");
  const passwordInput = document.querySelector("#password");
  const creditcardInput = document.querySelector('#creditCard_num')
  const user_id = localStorage.getItem('ID');
  const jwt = localStorage.getItem('jwt');
 
  if (saveButton) {
    saveButton.addEventListener("click",async() => {
    const name = nameInput.value;
    const email = emailInput.value;
    // const account = accountInput.value;
    const password = passwordInput.value;
    const creditCard = creditcardInput.value;



      if (!name) {
        Swal.fire({
          icon: 'warning', // Set the icon (success, error, warning, info, question)
          title: 'Please enter name！', 
          showConfirmButton: true,
        })
        return;
      }
      if (!email) {
        Swal.fire({
          icon: 'warning', // Set the icon (success, error, warning, info, question)
          title: 'Please enter email！', 
          showConfirmButton: true,
        })
        return;
      }
      // if (!account) {
      //   Swal.fire({
      //     icon: 'warning', // Set the icon (success, error, warning, info, question)
      //     title: 'Please enter account！', 
      //     showConfirmButton: true,
      //   })
      //   return;
      // }
      if (!password){
        Swal.fire({
          icon: 'warning', // Set the icon (success, error, warning, info, question)
          title: 'Please enter password！', 
          showConfirmButton: true,
        })
        return;
      }
      if (!creditCard){
        Swal.fire({
          icon: 'warning', // Set the icon (success, error, warning, info, question)
          title: 'Please enter Credit Card Number！', 
          showConfirmButton: true,
        })
        return;
      }
      

      if (!isValidCreditCardNumber(creditCard)){
        Swal.fire({
          icon: 'warning', // Set the icon (success, error, warning, info, question)
          title: 'Invalid credit card number! Please enter a valid 16-digit number！', 
          showConfirmButton: true,
        })
        creditcardInput.value = "";
        return;
      }
      console.log(jwt, name, email, password, creditCard);
      await updateMemberdata(jwt, name, email, password, creditCard);


      nameInput.value = "";
      emailInput.value = "";
      // accountInput.value = "";
      passwordInput.value = "";
      creditcardInput.value = "";

      // Swal.fire({
      //   icon: 'success',
      //   title: 'Sign up Successfully！',
      //   showConfirmButton: true,
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     window.location.href = 'Member.html';
      //   }
      // });
      
      

    });
  }

  function isValidCreditCardNumber(creditCardNumber) {
    
    // Check if the cleaned number has exactly 16 digits
    return /^\d{16}$/.test(creditCardNumber);
  }

  // 前端呼叫後端function
  async function updateMemberdata(jwt, newName, newEmail, newPassword, newCreditCardNumber) {
    try {
      const response = await instance.put("/members/memberdata", {
        account: jwt,
        name: newName,
        email: newEmail,
        password: newPassword,
        creditCard: newCreditCardNumber
        
      });
      Swal.fire({
        icon: 'success',
        title: 'Change Successfully！',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = 'Member.html';
        }
      });
      // 返回响应数据
      return response.data;
    } catch (error) {
      // 使用 SweetAlert 显示错误消息
      Swal.fire({
        icon: 'error',
        title: 'Change Error',
        text: error.message || 'Change Error',
      });
    }
  }


}

// 顯示會員資料
function rendermember(user_id) {
  // Name
  const firstmember = user_id;
  console.log(user_id)
  const name = document.querySelector("#user_id");
  
  name.innerText = `${firstmember.name}`;

  // email
  const email = document.querySelector("#email");
  email.innerText = `${firstmember.email}`;

  // account
  const account = document.querySelector("#account");
  account.innerText = `${firstmember.account}`;

  // creditCard_num
  const creditCard_num = document.querySelector("#creditCard_num");
  creditCard_num.innerText = ` ${firstmember.creditCard}`;
}



// 退訂
function unsubscribeEventListeners(user_id) {
  const unsubscribeButton = document.querySelector("#unsubscribeButton");

  // Add an async click event listener to the button
  unsubscribeButton.addEventListener('click', () => {
    // Display a confirmation dialog with SweetAlert2
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to unsubscribe.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, unsubscribe!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      // Check if the user confirmed
      if (result.isConfirmed) {
        try {
          // Call an async function to handle the unsubscribe logic
          await deleteMemberdata(user_id);
          // If successful, show a success message
          Swal.fire({
            icon: 'success',
            title: 'Unsubscribe successful',
            text: 'You have successfully unsubscribed.',
          }).then(() => {
            // Redirect to the homepage
            window.location.href = './homepage_before_login.html'; // Replace with the actual homepage URL
          });
        } catch (error) {
          // If unsuccessful, show an error message
          Swal.fire({
            icon: 'error',
            title: 'Unsubscribe failed',
            text: 'Please try again later.',
          });
        }
      }
    });
  });
}



// 前端呼叫後端function
async function getMemberdata(member) {
  console.log({params:member});
  const response = await instance.get("/members/memberdata", {params:member});
  return response.data;
}

async function deleteMemberdata(account) {
  const response = await instance.delete("/members/memberdata", {
      data: {account}});
  return response.data;
}



main();
