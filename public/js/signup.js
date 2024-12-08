const ORIGIN = window.location.origin;
const form = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const phNumberInput = document.getElementById('phNumber');
const password1Input = document.getElementById('password1');
const password2Input = document.getElementById('password2');
const errorMsg = document.getElementById('err-msg');
const successMsg = document.getElementById('success-msg');
function addUser(e){
    e.preventDefault();
    if(password1Input.value !== password2Input.value){
        showErrorInDOM('Passwords must match!');
        const oldBorderColor = password1Input.style.borderColor;
        password1Input.style.borderColor = 'red';
        password2Input.style.borderColor = 'red';
        setTimeout(() => {
            password1Input.style.borderColor = oldBorderColor;
            password2Input.style.borderColor = oldBorderColor;
        }, 5000);
        return;
    }
    if(phNumberInput.value.length != 10){
        showErrorInDOM('Enter a valid phone number!');
        const oldBorderColor = phNumberInput.style.borderColor;
        phNumberInput.style.borderColor = 'red';
        setTimeout(() => {
            phNumberInput.style.borderColor = oldBorderColor;
        }, 5000);
        return;
    }
    const user = {
        username: usernameInput.value,
        email: emailInput.value,
        phNumber: phNumberInput.value,
        password: password1Input.value
    };
    axios.post(`${ORIGIN}/signup`, user)
    .then((res) => {
        const msg = res.data.msg;
        showSuccessInDOM(msg);
        usernameInput.value = '';
        emailInput.value = '';
        phNumberInput.value = '';
        password1Input.value = '';
        password2Input.value = '';
    })
    .catch((err) => {
        const msg = err.response.data.msg ? err.response.data.msg : 'Could not add user';
        showErrorInDOM(msg);
    });
}
function showSuccessInDOM(msg){
    successMsg.innerText = msg;
    setTimeout(() => successMsg.innerText = '', 3000);
}
function showErrorInDOM(msg){
    errorMsg.innerText = msg;
    setTimeout(() => errorMsg.innerText = '', 3000);
}
form.addEventListener('submit', addUser);