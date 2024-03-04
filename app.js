// tüm elementleri seçmek 
const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");
const filterInput = document.querySelector("#todoSearch");

let todos = [];

runEvents();

function runEvents() {
    form.addEventListener("submit", addToDo); 
    document.addEventListener("DOMContentLoaded", pageLoaded) 
    secondCardBody.addEventListener("click", removeTodoToUI);
    clearButton.addEventListener("click", allTodosEverywhere);
    filterInput.addEventListener("keyup", filter);
}

function filter(e) {
    const filterValue = e.target.value.toLowerCase().trim();
    const todoListesi = document.querySelectorAll(".list-group-item");

    if (todoListesi.length > 0) {
        todoListesi.forEach(function (todo) {
            if (todo.textContent.toLowerCase().trim().includes(filterValue)){

                todo.setAttribute("style","display : block")
            }else{
 
                todo.setAttribute("style","display : none !important") 
            }
})
    } else {
        showAlert("warning", "filtreleme yapmak için en az 1 tane todo olmalıdır.")
    }
}

function allTodosEverywhere() {
    const todoListesi = document.querySelectorAll(".list-group-item");
    if (todoListesi.length > 0) {
        todoListesi.forEach(function (todo) {
            todo.remove();
        }); i

        //storagedan silme
        todos = [];
        localStorage.setItem("todos", JSON.stringify(todos));
        showAlert("success", "başarılı bir şekilde silindi")
    } else {
        showAlert("warning", "silmek için ekranda en az 1 tane todo olmalıdır.")
    }
}


function removeTodoToUI(e) {

    if (e.target.className === "fa fa-remove") {
        //arayüzden silme
        const todo = e.target.parentElement.parentElement; 
        todo.remove();

        //storageden silme
        removeTodoToStorage(todo.textContent);
        showAlert("warning", "Todo başarıyle silindi")
    }
}


function removeTodoToStorage(removeTodo) {
    checkTodosFromStorage();
    todos.forEach(function (todo, index) {
        if (removeTodo == todo) {
            todos.splice(index, 1)
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function pageLoaded() {
    checkTodosFromStorage(); 
    todos.forEach(function (todo) { 
        addToDoUI(todo);
    });
}

function addToDo(e) {
    const inputText = addInput.value.trim(); 
    if (inputText == null || inputText == "") { 
        showAlert("warning", "Lütfen boş bırakmayınız !") 
    } else {
        addToDoUI(inputText); 
        addTodoToStorage(inputText);
        showAlert("success", "Todo Eklendi :)") 
    }
    e.preventDefault(); 
}

function addToDoUI(newToDo) { 
    /*  
    <li class="list-group-item d-flex justify-content-between">Todo 1
         <a href="#" class="delete-item">
             <i class="fa fa-remove"></i>
        </a>
    </li>  
    */

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between"
    li.textContent = newToDo;


    const a = document.createElement("a"); 
    a.href = "#"
    a.className = "delete-item"


    const i = document.createElement("i"); 
    i.className = "fa fa-remove"


    a.appendChild(i);
    li.appendChild(a)
    todoList.appendChild(li)

    addInput.value = ""; 
}

function addTodoToStorage(newToDo) {
    checkTodosFromStorage(); 
    todos.push(newToDo); 
    localStorage.setItem("todos", JSON.stringify(todos)); 
}


function checkTodosFromStorage() { 
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}


function showAlert(type, message) { 
    /*  <div class="alert alert-warning" role="alert">
        A simple success alert—check it out!
    </div>*/

    const div = document.createElement("div"); 
    div.className = `alert alert-${type}`; 
    div.textContent = message;

    firstCardBody.appendChild(div); 

    setTimeout(function () { 
        div.remove();
    }, 2500)

}