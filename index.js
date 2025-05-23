const API_URL = "https://68272e786b7628c5290f5ab4.mockapi.io/tasks";
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");



todoInput.addEventListener("keypress",(event) => {
 if(event.key == "Enter"){
  addTodo();
 }
});
document.addEventListener("DOMContentLoaded", getTodos);
addButton.addEventListener("click", addTodo);
// fecth dung de chua link + endpoint
// sau khi fetch xg sẽ hiện promise pending thì chỉ cần xử lí 2 dữ liệu là đúng thì .then, sai thì .catch
// function getTodos(){
//    fetch("https://68272e786b7628c5290f5ab4.mockapi.io/tasks")
//   Chuuyển về dạng JSON
//     .then((response) => response.json())
//     // In ra dữ liệu sau khi đã chuyển xong
//     .then((data) => console.log(data))
//     // In ra lỗi nếu có lỗi
//     .catch((error) => console.log("Thất bại ròi" + error));
// phiên bản cũ dùng mockAPI
// } get Function


// đồng bộ dữ liệu dùng async + funcion thêm tên
// để đợi dữ liệu từ link mà database dùng await
async function getTodos(){
    try{
 const response = await axios.get(API_URL);
      const ul = document.querySelector(".todo-list");
     ul.innerHTML = "";
     response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  response.data.forEach((item) => {
   const date = new Date(item.createdAt);
   const formatDate = `${date.toLocaleDateString ()} - ${ date.toLocaleTimeString()}`;
  
    // tạo li
    const li = document.createElement("li");
// gắn class todo-items
    li.className = "todo-item";
// gắn tk con và nd từ api cho tk con
   li.innerHTML = ` <div class="todo-content">
              <input type="checkbox" />
              <div>
                <span>${item.content}</span>
                <p>Created: ${formatDate}</p>
              </div>
            </div>

            <div class="todo-actions">
               <button onclick="handleUpdate(${item.id}, '${item.content}')"><i class="fa-solid fa-pen-to-square"></i></button>
              <button onclick="handleDelete(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div> `;
            // `` tem let string dùng để đặt biến
            // '' dùng thể hiện chuỗi vd '+ chuỗi'
// gắn vÀO UL
    const ul = document.querySelector(".todo-list");
    ul.appendChild(li);
  });

    }catch(error){
        console.log("thất bại r:"+ error);
    }
}

// Post function
async function addTodo() {
  // nếu báo lỗi promise ... thì thêm async
   const inputData = todoInput.value.trim();
   const newTodo = {
    "createdAt": new Date().toISOString(),
    "content": inputData,
    "isComplete": false,
   };
   try{
    const response = await axios.post(
   "https://68272e786b7628c5290f5ab4.mockapi.io/tasks", newTodo);
   console.log(response);
   todoInput.value= "";
   getTodos();

Swal.fire({
  title: "Good job!",
  text: "concac",
  icon: "success"
})
   }catch (error){
    console.log("thất bại rồi" + error);
   }


}

// put Functuon 
function handleUpdate(id,content){
//   console.log(id);
//   console.log(content);
  Swal.fire({
  title: "Edit your task",
  input: "text",
  inputAttributes: {
    autocapitalize: "off"
  },
  inputValue: content,
  showCancelButton: true,
  confirmButtonText: "Look up",
  showLoaderOnConfirm: true,
  preConfirm: async (dataInput) =>{
  await axios.put(`${API_URL}/${id}`,
    {
      content: dataInput,
    }
  );
  getTodos();
    showNotification("Updated successfully!!!!");
  },
});
}
// delete
function handleDelete(id){
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger mr-3 "
  },
  buttonsStyling: false
});
swalWithBootstrapButtons.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "No, cancel!",
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
  axios.delete(`${API_URL}/${id}`);
  getTodos();
  showNotification("Delete successfully!");
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire({
      title: "Cancelled",
      text: "Your imaginary file is safe :)",
      icon: "error"
    });
  }
});
}

function showNotification(message){
  Swal.fire({
  title: message,
  text: "Updated successfully!",
  icon: "success"
});
}
 

