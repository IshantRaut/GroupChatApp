const HOST = 'http://' + window.location.host;
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
        showErrorInDOM('Passwords must match');
        return;
    }
    const user = {
        username: usernameInput.value,
        email: emailInput.value,
        phNumber: phNumberInput.value,
        password: password1Input.value
    };
    axios.post(`${HOST}/user/signup`, user)
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