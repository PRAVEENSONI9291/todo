var form = document.getElementById('form');
var todos = document.getElementById('todos');
var completeTodos = document.getElementById('completeTodos');


form.addEventListener('submit', addToLocalStorageAndPrint);

window.addEventListener("DOMContentLoaded", fetchData);
var fetchedData;


function fetchData() {

    fetchedData = axios.get("https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo")
        .then((resp) => {


            for (let key in resp.data) {

                var newele = document.createElement('li');
                newele.className = 'list-group-item';
                var newele2 = document.createElement('span');
                newele2.appendChild(document.createTextNode(`${resp.data[key].task} - ${resp.data[key].description}`));
                var newele3 = document.createElement('button');
                newele3.id = resp.data[key].task;

                newele3.className = 'btn btn-danger btn-sm float-end delete me-1';
                newele3.appendChild(document.createTextNode('X'));

                var newele4 = document.createElement('button');

                newele4.className = 'btn btn-success btn-sm float-end edit me-1';
                newele4.appendChild(document.createTextNode('✅︎'));

                newele.appendChild(newele2);
                newele.appendChild(newele3);
                newele.appendChild(newele4);

                if (resp.data[key].status == "pending")
                    todos.appendChild(newele);
                else {
                    completeTodos.appendChild(newele);

                }
            }

            return resp;
        })
        .catch((err) => {
            console.log("error");
        })
}

function addToLocalStorageAndPrint(e) {
    e.preventDefault();

    var task = document.getElementById('task').value;
    var description = document.getElementById('description').value;


    var taskdata = task;


    var myobj = {
        "task": task,
        "description": description,
        "status": "pending"
    }
    console.log(myobj);

    var newele = document.createElement('li');
    newele.className = 'list-group-item';
    var newele2 = document.createElement('span');
    newele2.appendChild(document.createTextNode(`${task} - ${description}`));
    var newele3 = document.createElement('button');
    newele3.id = task;

    newele3.className = 'btn btn-danger btn-sm float-end delete me-1';
    newele3.appendChild(document.createTextNode('X'));

    var newele4 = document.createElement('button');


    newele4.className = 'btn btn-success btn-sm float-end edit me-1';
    newele4.appendChild(document.createTextNode('✅︎'));

    newele.appendChild(newele2);
    newele.appendChild(newele3);
    newele.appendChild(newele4);







    todos.appendChild(newele);
    axios.post("https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo", myobj)
        .then((resp) => {
            console.log("posted");
        })
        .catch((err) => {
            console.log("error");
        })







    document.getElementById('task').value = "";
    document.getElementById('description').value = "";


}

todos.addEventListener('click', removeList);
todos.addEventListener('click', makeItComplete);
completeTodos.addEventListener('click', removeCompleteList);

function removeList(e) {


    if (e.target.classList.contains('delete')) {
        var list = e.target.parentElement;

        todos.removeChild(list);

        axios.get("https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo")
            .then((resp) => {
                for (let i = 0; i < resp.data.length; i++) {
                    if (e.target.id == resp.data[i].task) {
                        var ide = resp.data[i]._id;
                        i = resp.data.length;

                        axios.delete(`https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo/${ide}`)
                            .then((resp) => {
                                console.log("deleted");
                            })
                            .catch((err) => {
                                console.log("error");
                            })
                    }
                }
            })
    }
}

function makeItComplete(e) {

    if (e.target.classList.contains('edit')) {
        var list = e.target.parentElement;


        axios.get("https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo")
            .then((resp) => {

                for (let i = 0; i < resp.data.length; i++) {
                    if (e.target.previousElementSibling.id == resp.data[i].task) {
                        var ide = resp.data[i]._id;
                        console.log("id is", e.target.previousElementSibling.id);





                        axios.put(`https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo/${ide}`, { task: resp.data[i].task, description: resp.data[i].description, status: "completed" })
                            .then((resp) => {
                                console.log("updated");
                            })
                            .catch((err) => {
                                console.log("error");
                            })
                    }
                }

                todos.removeChild(list);
                list.removeChild(list.lastElementChild)
                completeTodos.appendChild(list)
            })



    }
}

function removeCompleteList(e) {


    if (e.target.classList.contains('delete')) {
        var list = e.target.parentElement;

        completeTodos.removeChild(list);

        axios.get("https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo")
            .then((resp) => {
                for (let i = 0; i < resp.data.length; i++) {
                    if (e.target.id == resp.data[i].task) {
                        var ide = resp.data[i]._id;
                        i = resp.data.length;

                        axios.delete(`https://crudcrud.com/api/2b211209040a4eb9a586f369748a5cc5/todo/${ide}`)
                            .then((resp) => {
                                console.log("deleted");
                            })
                            .catch((err) => {
                                console.log("error");
                            })
                    }
                }
            })
    }
}