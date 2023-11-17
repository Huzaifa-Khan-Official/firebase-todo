import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    onSnapshot,
    deleteDoc,
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = getAuth();

if (!localStorage.getItem("userUid")) {
    location.href = "../signup/signup.html";
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        localStorage.removeItem("userUid")
        location.href = "../signup/signup.html";
    }
});
const getul = document.querySelector(".todoList")
const addLi = document.getElementById("addLi");
const updLiBtn = document.getElementById("updLi");
const delAll = document.getElementById("delAll");
const inputLi = document.getElementById("inp");
const updLiInp = document.getElementById("updInp");
let todoList = document.querySelector(".todoList");
let errorPara = document.querySelector("#errorPara"); // get error paragraph
let upderrorPara = document.querySelector("#upderrorPara"); // get error paragraph
const userUid = localStorage.getItem("userUid");
const ids = [];

const getTodos = () => {
    onSnapshot(collection(db, userUid), (data) => {
        data.docChanges().forEach((todo) => {
            if (data.size) {
                delAll.style.display = "block";
            } else {
                delAll.style.display = "none";
            }
            if (todo.type === "removed") {
                let dtodo = document.getElementById(todo.doc.id);
                if (dtodo) {
                    dtodo.remove();
                }
            } else if (todo.type === "added") {
                ids.push(todo.doc.id)
                todoList.innerHTML += `
                <li class="todo-item" id="${todo.doc.id}">
                    <div class="listStyle">
                        <i class="fa-regular fa-circle"></i>
                    </div>
                    <div class="todoItemDiv">
                        <div class="todoContent"><p>${todo.doc.data().todo}</p></div>
                        <div class="editDelBtns">
                            <div class="editBtn" onclick="editLi(this, '${todo.doc.id}')" data-bs-toggle="modal" data-bs-target="#updModal"><i class="fa-regular fa-pen-to-square"></i></div>
                            <div class="delBtn" onclick="delLi('${todo.doc.id}')"><i class="fa-regular fa-trash-can"></i></div>
                        </div>
                    </div>
                </li>
                `;
            }


        })
    })
}

getTodos()

addLi.addEventListener("click", async () => {
    try {
        const inputLi = document.getElementById("inp");
        const todo = inputLi.value
        if (todo == "") {
            errorPara.innerText = "Please fill input field!";
            setTimeout(() => {
                errorPara.innerHTML = "";
            }, 3000);
        } else {
            $('#addTodoModal').modal('hide');
            const date = new Date();
            const docRef = await addDoc(collection(db, userUid), {
                todo: todo,
                data: date.toLocaleString()
            });

        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    inputLi.value = "";

})

inputLi.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        addLi.click()
    }
})


delAll.addEventListener("click", async () => {
    getul.innerHTML = "";
    for (var i = 0; i < ids.length; i++) {
        await deleteDoc(doc(db, userUid, ids[i]));
    }

})

async function delLi(id) {
    await deleteDoc(doc(db, userUid, id));
}

let updateLi;
let updateLiId;

async function editLi(e, id) {
    let previousTodo = e.parentNode.parentNode.childNodes[1].childNodes[0].textContent;
    updLiInp.value = previousTodo;

    updateLi = e;
    updateLiId = id

}

updLiInp.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        updLiFoo(updateLi, updateLiId)
    }
})

updLiBtn.addEventListener("click", () => {
    updLiFoo(updateLi, updateLiId)
})

async function updLiFoo(e, id) {
    let updTodo = updLiInp.value;
    if (updTodo == "") {
        upderrorPara.innerText = "Can not update empty field!";
        setTimeout(() => {
            upderrorPara.innerHTML = "";
        }, 3000);
    } else {
        $('#updModal').modal('hide');
        updLiInp.value = updTodo;
        e.parentNode.parentNode.childNodes[1].childNodes[0].textContent = updTodo;
        await updateDoc(doc(db, userUid, id), {
            todo: updTodo
        })
    }
}

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => {
    auth.signOut().then(() => {
        location.href = "../signup/signup.html";
    })
})

window.delLi = delLi;
window.editLi = editLi;