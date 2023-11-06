import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDKbcJ3CVh0M6_MnGQjF2Iw_LmskUabrdE",
    authDomain: "fir-todo-5ed69.firebaseapp.com",
    projectId: "fir-todo-5ed69",
    storageBucket: "fir-todo-5ed69.appspot.com",
    messagingSenderId: "70260766093",
    appId: "1:70260766093:web:5ec9b1faef82084c2df9c4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();

let lemail = document.querySelector("#lemail"); // get email to login user
let lpassword = document.querySelector("#lpassword"); // get password to login user
let lbtn = document.querySelector("#lbtn"); // get login btn
let errorPara = document.querySelector("#errorPara"); // get error paragraph


lbtn.addEventListener("click", () => {

    signInWithEmailAndPassword(auth, lemail.value, lpassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem("userUid", user.uid)
            location.href = "../index.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = errorCode.slice(5).toUpperCase();
            const errMessage = errorMessage.replace(/-/g, " ")
            errorPara.innerText = errMessage;
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        });
})

lpassword.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        lbtn.click()
    }
})

if (localStorage.getItem("userUid")) {
    location.href = "../index.html"
}