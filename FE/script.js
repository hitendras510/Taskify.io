const { is } = require("zod/locales");

let isSigningUp = false; //Flags to prevent multiple requests
let isAddingTodo = false;

document.getElementById('signup-form').addEventListener('submit', async (e)=>{
  e.preventDefault(); // stops refresh
  if (isSigningUp) return; //If signup already happening → stop function
  isSigningUp = true;

  const username = document.getElementById("Signup-username").value; 
  //.value → what user typed.
  const password = document.getElementById("Signup-password").value;

  try {
    const response = await fetch("http://localhost:3000/user/signup", {
      method: "POST", // sending data to server.
      headers: {
        "Content-type": "application/json", //tells BE im sending json data.
      },
      body: JSON.stringify({ username, password }), //JS object → JSON string
    });
    const result = await response.json(); //Converts backend response JSON → JS object
    isSigningUp = false; //Signup request finished,Unlock signup button

    if (response.ok) {
        document.getElementById("response-message").innerText = result.message || 'Singup successfull, please sign in';
        document.getElementById("signup-container").style.display = 'none'; // hides signup
        document.getElementById("signin-container").style.display = 'block'; //shows signin screen
    }else{
        document.getElementById("response-message").innerText = result.message || 'Signup failed';
    }
  } catch (error) {
    isSigninUp = false;
    document.getElementById("response-message").innerText = "Error during signup";
  }
});

// Signin Form Submission
document.getElementById("signin-form").addEventListener('submit', async (e) =>{
    e.preventDefault();

    const username = document.getElementById('singin-username').value;
    const password = document.getElementById('signin-password').value;

    try{
        const response = await fetch('http://localhost:3000/user/signin',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({ username, password}),
        });
        const result = await response.json();

      if(response.ok){
        localStorage.setItem('token', result.token);
        //show todo ui
        document.getElementById('signin-container').style.display = 'none';
        document.getElementById('todo-container').style.display = 'block';
        document.getElementById('response-message').innerHTML = 
             `Logged in successfully. <a href="#" id="logout-link">Logout</a>`;
             loadTodos(); // fecthes all todos from BE

             // Add event listener for the logout link
             document.getElementById('logout-link').addEventListener('click', (e) =>{
                e.preventDefault();
                localStorage.removeItem('token') // clear token as user is logged out
                document.getElementById('todo-container').style.display = 'none'; // hide todo -> show signin since user in logged out
                document.getElementById('singin-container').style.display = 'block';
                document.getElementById('response-message').innerText = '';
             });
      }else{
        document.getElementById('response-message').innerText = result.message || 'Signin failed , lil bro!';
      }
    }catch(error){
        document.getElementById('response-message').innerText = "Error during sigin, Try Try But don't cry ";
    }
});


// Adding Todo on Form Submission
document.getElementById('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if(isAddingTodo) return ; 
    isAddingTodo = true;

    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value.trim(); // removes spaces and prevents empty todos
     if (!todoText) {
       isAddingTodo = false;
       return;
     }
     
     const token = localStorage.getItem('token');

     try {
       const response = await fetch("http://localhost:3000/todo", {
         method: "POST",
         headers: {
           "Content-type": "application/json",
           Authorization: `Bearer ${token}`, //Backend middleware checks this token
         },
         body: JSON.stringify({ title: todoText }), //Sends todo title to backend
       });
       const result = await response.json();
       isAddingTodo = false;

       if (response.ok) {
         todoInput.value = " ";
         loadTodos(); //clears input and reloads todo list.
       } else {
         console.error(result.msg);
       }
     } catch (error) {
       isAddingTodo = false;
       console.error("Error adding todo:", error);
     }
});

//fetch todo from BE
async function loadTodos(){
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/todo',{
            headers: {
                 'Authorization': `Bearer ${token}`,
            },
        });
        const { todos } = await response.json();
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = ' '; // clears old list & prevents duplication
         
     // Loop through all todos
     todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title; //Shows todo text
       
        if(todo.completed){
            li.style.textDecoration = 'line-through'; //Completed todos are crossed out
        }
 
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.onclick = () =>{
            completeTodo(todo._id, !todo.completed); //!todo.completed → opposite value
        };

        if(!todo.completed){
            li.appendChild(completeButton);
        }

        todoList.appendChild(li);
     }); 
    } catch (error) {
        console.error("Error loading todos:",error);
    }
}

//complete todo 
async function completeTodo(id, completed){
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/todo/${id}`, {
        method: "PUT", //update existing data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });
      loadTodos(); //Refresh UI after update
    } catch (error) {
        console.error("Error completing todo:", error);
    }
}

//Toggole btw signup and singin
document.getElementById('show-signin').addEventListener('click', (e) =>{
    e.preventDefault();
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('signin-container').style.display = 'block';
});

document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signin-container').style.display = 'none';
    document.getElementById('signup-container').style.display = 'block';
});
