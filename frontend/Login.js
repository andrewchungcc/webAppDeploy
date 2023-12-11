/* global axios */


const instance = axios.create({
    baseURL: "http://localhost:8000/api",
  });
  
async function main() {
  setupEventListeners();

  $(document).ready(function() {
    
    // home_before-btn 超連結
    $('#home_before-btn').on('click', function() {
      console.log("0")
      window.location.href = './homepage_before_login.html';
    });
  });
  
  
}
  
// 設定EventListeners，裡面包含Sign up按鈕function
function setupEventListeners() {
    $(".forgetPasswordBox").hide();
    
    const loginButton = document.querySelector("#LoginButton");
    
    //點擊Login按鈕
    loginButton.addEventListener("click", handleLogin);

    //Login按Enter
    document.addEventListener("keydown", (event) => {
      // Check if the pressed key is Enter (key code 13)
      if (event.key === "Enter") {
        handleLogin(event);
        
      }
    });

    

    //點擊send按鈕
    let verification;
    $("#sendButton").on('click', async function() {
      // $("#verifyText").show();
      // $("#passwordText").show();
      $("#verificationBox").show();
      $("#submitButton").show();
      // $("#sendButton").hide();
      

      
      const forgetemail  = document.querySelector("#email");
      const userEmail = forgetemail.value;
      console.log(userEmail);

      verification = await forgetEmail({userEmail});
      console.log("See your password in backend or email.");
    });

    //點擊submit按鈕   
    $("#submitButton").on('click', async function() {
      // check
      const verifyAccount  = document.querySelector("#verifyAccount");
      const account = verifyAccount.value;

      const passwordText = document.querySelector("#newPassword");
      const password = passwordText.value;

      const verifycode  = document.querySelector("#verification");
      const verificationCode = verifycode.value;
      console.log(verificationCode);
      // console.log("share", verification);
    

      if (verification === verificationCode){
        console.log("same");
      } else{
        Swal.fire({
          icon: 'warning',
          title: "verification is not correct!",
          showConfirmButton: true
          // timer: 2000?
        })
        verifycode.value = "";
        passwordText.value = ""
        return;

        
      }

      

      console.log(account, password);
      const newPassword = await resetPassword({account, password});
      // console.log(newPassword);
      if (newPassword){
        Swal.fire({
          icon: 'success',
          title: "Change password successfully!",
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.href = "Login.html";
        });
      };
      return;
      

    });



    
  }

const handleLogin = async (event) => {   
    // Prevent the default form submission behavior
    event.preventDefault();

    const accountInput = document.querySelector("#id");
    const passwordInput = document.querySelector("#password");
    const account = accountInput.value;
    const password = passwordInput.value;

    if (!account && !password) {
      Swal.fire({
        icon: 'warning',
        title: "Please enter an account and a password!",
        showConfirmButton: true,
      });
      return;
    }
    

    if (!account) {
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: "Please enter an account!",
        showConfirmButton: true,
      });
      return;
    }
    
    if (!password){
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: "Please enter a password!",
        showConfirmButton: true,
      });
      return;
    }
      
    try {
      const memberData = await getMembers({account, password});
      console.log(memberData);  
      if (!memberData || memberData.length === 0){
        // 未找到會員警告
        Swal.fire({
          icon: 'error', // Set the icon (success, error, warning, info, question)
          title: 'Account or Password wrong！',
          showConfirmButton: true
          // timer: 3000
        });
        accountInput.value = "";
        passwordInput.value = "";
        return;
      }
      // 確定正確就清空
      else{
        Swal.fire({
          icon: 'success', // Set the icon (success, error, warning, info, question)
          title: 'Log in Successfully！',
          showConfirmButton: false,
          timer: 1500
        }).then( () => {
            storeAndNavigate(event, memberData);
            accountInput.value = "";
            passwordInput.value = "";
        });

      }
    

    } catch (error) {
      Swal.fire({
        icon: 'error', // Set the icon (success, error, warning, info, question)
        title: "Failed to get member!",
        showConfirmButton: true
        // timer: 3000
      });
      return;
    }
    

};


function storeAndNavigate(event, member) {
  // 使用try規避掉enter的event.preventDefault();會錯誤的情況
  try{
    event.preventDefault();
  } finally {
    const accountInput = document.querySelector("#id");
    const id = accountInput.value;


    // console.log('ID:', id);
    localStorage.setItem('ID', id);
    localStorage.setItem('jwt', member);
    window.location.href = 'homepage.html';
  };
}

  // 前端呼叫後端function
async function getMembers(members) {
    const response = await instance.get("/members", {
      params: members
    });
    return response.data;
}
  
async function forgetEmail(email){
  // console.log({params: email});
  const response = await instance.get("/members/forgetemail", {params: email});
  return response.data;
}

async function resetPassword(reset){
  console.log(reset);
  const response = await instance.put("/members/resetPassword", reset);
  return response.data;
}

//點擊a href按鈕
function forgetahref() {
  $(".loginBox").hide();
  $("#verificationBox").hide();
  $("#submitButton").hide();
  $(".forgetPasswordBox").show();
};



main();
  