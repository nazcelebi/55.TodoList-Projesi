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
    form.addEventListener("submit", addToDo); //forma bir click yapıldığında ve submit gerçekleştiğinde addToDo methoduna gitmesi söylenildi
    document.addEventListener("DOMContentLoaded", pageLoaded) //sayfa yüklendiğinde pageLoaded methodunu çalıştır 
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

                todo.setAttribute("style","display : block") //birbirine uyanları ekranda göster 
            }else{
 
                todo.setAttribute("style","display : none !important") //birbirine uymayanları ekranda gösterme
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

    if (e.target.className === "fa fa-remove") {//bastığı etiketin class ismi bu ise içerideki kodu çalıştır dedik
        //arayüzden silme
        const todo = e.target.parentElement.parentElement; //li elementine ulaşıldı silmek için
        todo.remove();//seçilen todo silindi

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
    checkTodosFromStorage(); //todosların güncel halini getirir.
    todos.forEach(function (todo) { //todoların üzerinde dön ve arayüze yazdır
        addToDoUI(todo);
    });
}

function addToDo(e) {
    const inputText = addInput.value.trim(); //eklenen değer alındı, kenarında boşluk varsa temizlendi ve değişkene atandı.
    if (inputText == null || inputText == "") { //boş bırakılıp bırakılmadığı kontrol edildi
        showAlert("warning", "Lütfen boş bırakmayınız !") //boş bırakılıp butona tıklanmışsa sarı renkli bir uyarı alınacak.
    } else {
        addToDoUI(inputText); //eğer boş bırakılmamışsa arayüze ekleme methodu çağırıldı ve girilen değer parametre olarak atandı.
        addTodoToStorage(inputText);//girilen değerin storage'a da eklenmesi için tanımlanan method.
        showAlert("success", "Todo Eklendi :)") //eklenme başarı ile gerçekleşmişse yeşil renkli bir uyarı alınacak
    }
    //   arayüze ekleme

    // storage'e ekleme

    e.preventDefault(); //default özellikler engellendi
}

function addToDoUI(newToDo) { //arayüze todo eklemek için method
    /*  
    <li class="list-group-item d-flex justify-content-between">Todo 1
         <a href="#" class="delete-item">
             <i class="fa fa-remove"></i>
        </a>
    </li>  
    */

    const li = document.createElement("li"); //li elementi ve özellikleri oluşturuldu
    li.className = "list-group-item d-flex justify-content-between"
    li.textContent = newToDo; //oluşturulan her li'nin içerisine girilen yeni değerin verilmesi söylendi


    const a = document.createElement("a"); //a elementi ve özellikleri oluşturuldu
    a.href = "#"
    a.className = "delete-item"


    const i = document.createElement("i"); //i elementi ve özellikleri oluşturuldu
    i.className = "fa fa-remove"


    a.appendChild(i);
    li.appendChild(a)
    todoList.appendChild(li)

    addInput.value = ""; //ekleme yapıldıktan sonra input kısmının boşaltılması için kullanıldı
}

function addTodoToStorage(newToDo) {
    checkTodosFromStorage(); //kontroller yapıldı
    todos.push(newToDo); //push methodu ile yeni değer eklendi 
    localStorage.setItem("todos", JSON.stringify(todos)); //güncel olan todos da yazdırıldı.
}


function checkTodosFromStorage() { //bu kodlarla birlikte todos ya boş doldu ya da var olan değerler ile dolduruldu.
    if (localStorage.getItem("todos") === null) { //localStorage da daha önce tanımlanan bir todos var mı ? yoksa temiz bir dizi şeklinde oluştur denildi.
        todos = [];
    } else {
        //bu kontrolü yapmayıp direkt üzerine yazdırma yapılırsa eski değerler kaybedilir!! değeri alıp üzerine koyup yenisi vermemiz gerekir.
        todos = JSON.parse(localStorage.getItem("todos"));
        //eğer daha önceden todos değişkeni orada varsa o oradan alındı, diziye çevrildi ve todos değişkenine setlenildi.
        //buradaki setlenilen todos en yukarıda tanımlanan global bir değişkendir.
    }
}


function showAlert(type, message) { //değişecek iki tane değer olduğu için bu değerler verildi
    /*  <div class="alert alert-warning" role="alert">
        A simple success alert—check it out!
    </div>*/

    const div = document.createElement("div"); //div elementi oluşturuldu
    div.className = `alert alert-${type}`; //uyarı tipine göre renk değiştirme modüler bir şekilde yazıldı
    div.textContent = message;

    firstCardBody.appendChild(div); //1. card-body classının sonunda yer alacağı belirtildi

    setTimeout(function () { //verilen uyarının 2.5 saniye sonra kaldırılması için kullanıldı
        div.remove();
    }, 2500)

}