import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    collection
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDKbcJ3CVh0M6_MnGQjF2Iw_LmskUabrdE",
    authDomain: "fir-todo-5ed69.firebaseapp.com",
    projectId: "fir-todo-5ed69",
    storageBucket: "fir-todo-5ed69.appspot.com",
    messagingSenderId: "70260766093",
    appId: "1:70260766093:web:5ec9b1faef82084c2df9c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

let usersName;
let usersEmail;
let usersRef;

// get usernameDiv
const usernameDiv = document.querySelector('#uptName');
// get useremailDiv
const useremailDiv = document.querySelector('#uptEmail');

if (!localStorage.getItem("userUid")) {
    location.href = "../signup/signup.html"
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // give reference of the User
        usersRef = doc(db, "users", user.uid);
        // get the details of the user
        const userSnap = await getDoc(usersRef);
        // get user all data
        const usersData = userSnap.data()
        let userName = usersData.sname;
        let nameFirstLetter = userName.slice(0, 1).toUpperCase();
        let nameRemainLetters = userName.slice(1).toLowerCase();
        userName = nameFirstLetter + nameRemainLetters

        usersName = userName; // get the user name
        usersEmail = usersData.semail; // get the user name 

        usernameDiv.value = usersName
        useremailDiv.value = usersEmail
    } else {
        localStorage.removeItem("userUid")
        location.href = "../signup/signup.html";
    }
});

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    auth.signOut().then(() => {
        location.href = "../signup/signup.html";
    })
})


// get updBtn
const updBtn = document.querySelector('#updBtn');
// get errorPara
const errorPara = document.querySelector('#errorPara');
// get successPara
const successPara = document.querySelector('#successPara');
// get delBtn
const delBtn = document.querySelector('#delBtn');



updBtn.addEventListener("click", async () => {
    if (usernameDiv.value == "") {
        errorPara.innerText = "Please fill the name field";
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    } else if (usernameDiv.value == usersName) {
        errorPara.innerText = "Can not update previous name";
        setTimeout(() => {
            errorPara.innerHTML = "";
        }, 3000);
    } else {
        const upedName = usernameDiv.value;
        try {
            await updateDoc(usersRef, {
                sname: upedName
            });
            successPara.innerText = "Successfully Updated!";
            setTimeout(() => {
                successPara.innerHTML = "";
            }, 3000);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = errorCode.slice(5).toUpperCase();
            const errMessage = errorMessage.replace(/-/g, " ")
            errorPara.innerText = errMessage;
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        }
    }
});

const ids = [];

const getTodos = () => {
    onSnapshot(collection(db, localStorage.getItem("userUid")), (data) => {
        data.docChanges().forEach((todo) => {
            ids.push(todo.doc.id)
        })
    })
}

getTodos()



delBtn.addEventListener("click", () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "users", localStorage.getItem("userUid"))); // deleted data of user from firestore.
                for (var i = 0; i < ids.length; i++) {
                    await deleteDoc(doc(db, localStorage.getItem("userUid"), ids[i]));
                }
                onAuthStateChanged(auth, async (currentUser) => {
                    deleteUser(currentUser).then(async () => {
                        localStorage.removeItem("userUid")
                        location.href = "../signup/signup.html"
                    }).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = errorCode.slice(5).toUpperCase();
                        const errMessage = errorMessage.replace(/-/g, " ")
                        errorPara.innerText = errMessage;
                        setTimeout(() => {
                            errorPara.innerHTML = "";
                        }, 3000);
                    });
                })
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = errorCode.slice(5).toUpperCase();
                const errMessage = errorMessage.replace(/-/g, " ")
                errorPara.innerText = errMessage;
                setTimeout(() => {
                    errorPara.innerHTML = "";
                }, 3000);
            }

        }
    });
})