import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyABpF5Aq3pvwYfqSGd4A1LfyhjgKApnFmE",
  authDomain: "test-project-2b.firebaseapp.com",
  projectId: "test-project-2b",
  storageBucket: "test-project-2b.appspot.com",
  messagingSenderId: "545460196890",
  appId: "1:545460196890:web:c8718f9b0776412ddaa3a3",
  measurementId: "G-24X003ETZV",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const auth = getAuth();

let sbtn = document.querySelector("#sbtn"); // get signin btn
let errorPara = document.querySelector("#errorPara"); // get error paragraph

sbtn.addEventListener("click", () => {
  let semail = document.querySelector("#semail"); // get email to signin user
  let spassword = document.querySelector("#spassword"); // get password to signin user
  let sname = document.querySelector("#sname"); // get name of a user

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
      spassword: spassword.value,
    };
    // creating user with eamil and password
    createUserWithEmailAndPassword(auth, userData.semail, userData.spassword)
      // email value  , password value
      .then(async (userCredential) => {
        const user = userCredential.user; // getting user from firebase
        await setDoc(doc(db, "users", user.uid), {
          // collection name,   unique id of user
          ...userData, // setting array in a database
          userid: user.uid, // also user id in the database
        });
        location.href = "../login/login.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = errorCode.slice(5).toUpperCase();
        const errMessage = errorMessage.replace(/-/g, " ");
        errorPara.innerText = errMessage;
        setTimeout(() => {
          errorPara.innerHTML = "";
        }, 3000);
      });
  }
});

spassword.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    sbtn.click();
  }
});

// const googleSignInBtn = document.getElementById("googleSignInBtn");

// googleSignInBtn.addEventListener("click", () => {
//   signInWithPopup(auth, provider)
//     .then(async (result) => {
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;

//       const user = result.user;

//       let userData = {
//         sname: user.displayName,
//         semail: user.email,
//       };

//       await setDoc(doc(db, "users", user.uid), {
//         // collection name,   unique id of user
//         ...userData, // setting array in a database
//         userid: user.uid, // also user id in the database
//       });

//       localStorage.setItem("userUid", user.uid);

//       location.href = "../index.html";
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//         const credential = GoogleAuthProvider.credentialFromError(error);
        
//       if (email) {
//         errorPara.innerText = email;
//         setTimeout(() => {
//           errorPara.innerHTML = "";
//         }, 3000);
//       }
//     });
// });

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userUid = user.uid;
  } else {
    localStorage.removeItem("userUid");
  }
});

if (localStorage.getItem("userUid")) {
  location.href = "../index.html";
}
