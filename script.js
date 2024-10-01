// Importing Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
    getFirestore,
    addDoc,
    collection,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASu2jFWUslZLRwaY3O_Egen1Myw5k1U7U",
    authDomain: "crud-98f18.firebaseapp.com",
    projectId: "crud-98f18",
    storageBucket: "crud-98f18.appspot.com",
    messagingSenderId: "811573214194",
    appId: "1:811573214194:web:72abaf352ccaa1715b496b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notify = document.querySelector('.notify');
const addBtn = document.querySelector('#add_Data');
const updateDataBtn = document.querySelector('#update_data');

let currentUserId = null;

// Event listeners
addBtn.addEventListener('click', addData);
updateDataBtn.addEventListener('click', () => updateData(currentUserId));

// Function to add data to Firestore
async function addData() {
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const cpf = document.querySelector('#cpf').value;
    const dateOfBirth = document.querySelector('#date').value;
    const sex = document.querySelector('#sex').value;

    if (!name || !email || !cpf || !dateOfBirth || !sex) {
        showNotification("Todos os campos são obrigatórios.");
        return;
    }

    try {
        await addDoc(collection(db, "users"), { name, email, cpf, dateOfBirth, sex });
        showNotification("Dados adicionados com sucesso");
        clearForm();
        GetData();
    } catch (error) {
        console.error(error);
        showNotification("Erro ao adicionar dados.");
    }
}

// Function to retrieve and display data
async function GetData() {
    try {
        const getDataQuery = await getDocs(collection(db, "users"));
        let html = "";
        getDataQuery.forEach((doc) => {
            const data = doc.data();
            html += `
                <tr data-id="${doc.id}">
                    <td>${doc.id}</td>
                    <td>${data.name}</td>
                    <td>${data.email}</td>
                    <td>${data.cpf}</td>
                    <td>${data.dateOfBirth}</td>
                    <td>${data.sex}</td>
                    <td><button onclick="deleteData('${doc.id}')">Excluir</button></td>
                    <td><button onclick="prepareUpdate('${doc.id}')">Atualizar</button></td>
                </tr>
            `;
        });
        document.querySelector('tbody').innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

// Function to delete user data
window.deleteData = async function (id) {
    try {
        await deleteDoc(doc(db, "users", id));
        showNotification("Dados excluídos com sucesso");
        GetData(); // Refresh data after deletion
    } catch (err) {
        console.error(err);
        showNotification("Erro ao excluir dados.");
    }
};

// Prepare data for updating
window.prepareUpdate = async function (id) {
    currentUserId = id; // Set the current user ID
    try {
        const docSnapShot = await getDoc(doc(db, "users", id));
        const currentUser = docSnapShot.data();
        document.querySelector('#name').value = currentUser.name;
        document.querySelector('#email').value = currentUser.email;
        document.querySelector('#cpf').value = currentUser.cpf;
        document.querySelector('#date').value = currentUser.dateOfBirth;
        document.querySelector('#sex').value = currentUser.sex;

        updateDataBtn.classList.add('show');
        addBtn.classList.add('hide');
    } catch (err) {
        console.error(err);
    }
};

// Update user data
async function updateData(id) {
    const newName = document.querySelector('#name').value;
    const newEmail = document.querySelector('#email').value;
    const newCpf = document.querySelector('#cpf').value;
    const newDateOfBirth = document.querySelector('#date').value;
    const newSex = document.querySelector('#sex').value;

    if (!newName || !newEmail || !newCpf || !newDateOfBirth || !newSex) {
        showNotification("Todos os campos são obrigatórios.");
        return;
    }

    try {
        await updateDoc(doc(db, "users", id), { name: newName, email: newEmail, cpf: newCpf, dateOfBirth: newDateOfBirth, sex: newSex });
        showNotification("Dados atualizados com sucesso");
        clearForm();
        GetData();
        resetForm();
    } catch (err) {
        console.error(err);
        showNotification("Erro ao atualizar dados.");
    }
}

// Helper functions
function showNotification(message) {
    notify.innerHTML = message;
    setTimeout(() => { notify.innerHTML = ""; }, 3000);
}

function clearForm() {
    document.querySelector('#name').value = "";
    document.querySelector('#email').value = "";
    document.querySelector('#cpf').value = "";
    document.querySelector('#date').value = "";
    document.querySelector('#sex').value = "";
}

function resetForm() {
    currentUserId = null;
    updateDataBtn.classList.remove('show');
    addBtn.classList.remove('hide');
}

// Initial data retrieval
GetData();
