const loginLink=document.querySelector('.loginLink');
const registerLink=document.querySelector('.registerLink');
const forgotLink=document.querySelector('.forgot');
const container1=document.querySelector('.container1');
const container2=document.querySelector('.container2');
const container3=document.querySelector('.container3');
const loginButton=document.querySelector('.container2 .submit');
const registerButton=document.querySelector('.container1 button');
const forgotButton=document.querySelector('.container3 button');
const nameInput=document.querySelector('#name');
const loginEmail=document.querySelector('.container2 #email');
const loginPass=document.querySelector('.container2 #password');
const registerEmail=document.querySelector('.container1 #email');
const registerPass=document.querySelector('.container1 #password');
const forgotEmail=document.querySelector('.container3 #email');
const registerError=document.querySelector('.container1 .error');
const loginError=document.querySelector('.container2 .error');
const forgotError=document.querySelector('.container3 .error');
// console.log(registerError);
// console.log(registerButton);
const openRegister=()=>{
    registerEmail.value="";
    nameInput.value="";
    registerPass.value="";
    container1.style.visibility='visible';
    container2.style.visibility='hidden';
    container3.style.visibility='hidden';
    loginLink.style.visibility='visible';
    registerLink.style.visibility='hidden';
}

const openLogin=()=>{
    // console.log('hi');
    loginEmail.value="";
    loginPass.value="";
    container1.style.visibility='hidden';
    container2.style.visibility='visible';
    container3.style.visibility='hidden';
    loginLink.style.visibility='hidden';
    registerLink.style.visibility='visible';
}

const openForgot=()=>{
    forgotEmail.value="";
    container1.style.visibility='hidden';
    container2.style.visibility='hidden';
    container3.style.visibility='visible';
}
openRegister();

const register=async()=>{
    // event.preventDefault();
// console.log('hi');
const email=registerEmail.value;
const password=registerPass.value;
try {
    // console.log(nameInput.value,email,password);
    const {data:{user:{name,userId,image},token}}= await axios.post('/api/v1/auth/register',{
        name:nameInput.value,email,password
    })
    localStorage.setItem("name",name);
    localStorage.setItem("userId",userId);
    localStorage.setItem("image",image);
    localStorage.setItem("token",token);
    window.open("index.html",target="_self");
    // console.log('hi');
} catch (error) {
    // console.log(error);
    registerError.innerHTML=`<p>${error.response.data.msg}</p>`;
   
}
}

const login=async()=>{
    const email=loginEmail.value;
    const password=loginPass.value;
    try {
        // console.log(nameInput.value,email,password);
        const {data:{user:{name,userId,image},token}}= await axios.post('/api/v1/auth/login',{
            email,password
        })
        localStorage.setItem("name",name);
        localStorage.setItem("userId",userId);
        localStorage.setItem("image",image);
        localStorage.setItem("token",token);
        window.open('index.html',target="_self");
        // console.log('hi');
    } catch (error) {
        // console.log(error);
        loginError.innerHTML=`<p>${error.response.data.msg}</p>`;
       
    }
}

const forgot=async ()=>{
    
    const email=forgotEmail.value;
    try {
        const info=await app.get('/api/v1/sendmail',{email});
        forgotError.innerHTML='A mail regarding your request has been sent to the email'
    } catch (error) {
        forgotError.innerHTML=`<p>${error.response.data.msg}</p>`;
    }
}

const debounce=(func)=>{
   
    let timeoutId;
    return ()=>{
        event.preventDefault()
        clearTimeout(timeoutId);
        timeoutId=setTimeout(()=>{
            func();
        },300);
    }
}

loginLink.addEventListener('click',openLogin);
// console.log(loginLink);
registerLink.addEventListener('click',openRegister);
forgotLink.addEventListener('click',openForgot);
registerButton.addEventListener('click',debounce(register));
loginButton.addEventListener('click',debounce(login));
forgotButton.addEventListener('click',debounce(forgot));


