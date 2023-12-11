/* global axios */


const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    // here is empty

  } catch (error) {
    Swal.fire({
      icon: 'error', // Set the icon (success, error, warning, info, question)
      title: "Failed to load members!",
      showConfirmButton: true,
    });
  }

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
  const signUpButton = document.querySelector("#signupButton");
  const nameInput = document.querySelector("#user_id");
  const emailInput = document.querySelector("#email");
  const accountInput = document.querySelector("#account");
  const passwordInput = document.querySelector("#password");
  const creditcardInput = document.querySelector('#creditCard_num')
  var checkbox = document.getElementById("myCheckbox");
  
  signUpButton.addEventListener("click", async () => {
  const name = nameInput.value;
  const email = emailInput.value;
  const account = accountInput.value;
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
    if (!account) {
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: 'Please enter account！', 
        showConfirmButton: true,
      })
      return;
    }
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
    
    if (!checkbox.checked) {
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: 'Please confirm subscription！', 
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
    try {
      const account = accountInput.value;
      const members = await getMembers({"account":account});
      if (!members === false){
        console.log(!members);
        Swal.fire({
          icon: 'warning', // Set the icon (success, error, warning, info, question)
          title: "Account has already been signed up, please try another account！",
          showConfirmButton: true,
        });
        accountInput.value = "";
        return;
      }

    } catch(error){
      Swal.fire({
        icon: 'warning', // Set the icon (success, error, warning, info, question)
        title: "Failed to get members!",
        showConfirmButton: true,
      });
      console.log(error);
      return;
    }
    try {
      const memeberShip = await createMember({ name, email, account, password, creditCard });
      // console.log(memeberShip);
    } catch (error) {
      Swal.fire({
        icon: 'error', // Set the icon (success, error, warning, info, question)
        title: "Failed to create member!",
        showConfirmButton: true,
      });
      return;
    }
    nameInput.value = "";
    emailInput.value = "";
    accountInput.value = "";
	  passwordInput.value = "";
	  creditcardInput.value = "";

    Swal.fire({
      icon: 'success',
      title: 'Sign up Successfully！',
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'Login.html';
      }
    });
    
    

  });
}

function isValidCreditCardNumber(creditCardNumber) {
  
  // Check if the cleaned number has exactly 16 digits
  return /^\d{16}$/.test(creditCardNumber);
}


// 前端呼叫後端function
async function createMember(members) {
  const response = await instance.post("/members", members);
  return response.data;
}

async function getMembers(account) {
  const response = await instance.get("/members/signup", {params:account});
  return response.data;
}

main();
