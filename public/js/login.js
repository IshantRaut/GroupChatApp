const ORIGIN = window.location.origin;

const form = document.getElementById('user-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('err-msg');
const successMsg = document.getElementById('success-msg');

function loginUser(e){
    e.preventDefault();

    const user = {
        email: emailInput.value,
        password: passwordInput.value
    };

    axios.post(`${ORIGIN}/login`, user)
    .then((res) => {
        localStorage.setItem('token', res.data.token);
        showSuccessInDOM(res.data.msg);
        //window.location.href = '/';
        window.location.href = '/chat';
    })
    .catch((err) => {
        const msg = err.response.data.msg ? err.response.data.msg : 'Could not login user';
        showErrorInDOM(msg);

        if(err.response.status === 404){
            const oldBorderColor = emailInput.style.borderColor;
            emailInput.style.borderColor = 'red';
            setTimeout(() => {
                emailInput.style.borderColor = oldBorderColor;
            }, 5000);
            return;
        }
        if(err.response.status === 401){
            const oldBorderColor = passwordInput.style.borderColor;
            passwordInput.style.borderColor = 'red';
            setTimeout(() => {
                passwordInput.style.borderColor = oldBorderColor;
            }, 5000);
            return;
        }
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

form.addEventListener('submit', loginUser);