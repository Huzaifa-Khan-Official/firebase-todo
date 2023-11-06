import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDKbcJ3CVh0M6_MnGQjF2Iw_LmskUabrdE",
    authDomain: "fir-todo-5ed69.firebaseapp.com",
    projectId: "fir-todo-5ed69",
    storageBucket: "fir-todo-5ed69.appspot.com",
    messagingSenderId: "70260766093",
    appId: "1:70260766093:web:5ec9b1faef82084c2df9c4"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();


let sbtn = document.querySelector("#sbtn"); // get signin btn
let errorPara = document.querySelector("#errorPara"); // get error paragraph


sbtn.addEventListener("click", () => {
    let semail = document.querySelector("#semail"); // get email to signin user
    let spassword = document.querySelector("#spassword"); // get password to signin user
    let sname = document.querySelector("#sname");  // get name of a user

    if (sname.value == "") {
        errorPara.innerText = "Please fill name field!";
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    } else {

        // storing data in a array
        let userData = {
            sname: sname.value,
            semail: semail.value,
            spassword: spassword.value
        }
        // creating user with eamil and password
        createUserWithEmailAndPassword(auth, userData.semail, userData.spassword)
            // email value  , password value
            .then(async (userCredential) => {
                const user = userCredential.user; // getting user from firebase
                await setDoc(doc(db, "users", user.uid), {
                    // collection name,   unique id of user
                    ...userData, // setting array in a database
                    userid: user.uid   // also user id in the database
                });
                
                location.href = "../login/login.html"
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
    }
})

spassword.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        sbtn.click()
    }
})


onAuthStateChanged(auth, (user) => {
    if (user) {
        const userUid = user.uid;
    } else {
        localStorage.removeItem("userUid")
    }
});

if (localStorage.getItem("userUid")) {
    location.href = "../index.html"
}