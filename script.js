const form = document.getElementById('form');
const todos = document.getElementById('todos');
const completeTodos = document.getElementById('completeTodos');

window.addEventListener("DOMContentLoaded", onLoadFetchData);
form.addEventListener('submit', addToCrudCrudAndPrint);
todos.addEventListener('click', deleteTask);
todos.addEventListener('click', makeItCompletedTask);
completeTodos.addEventListener('click', deleteTask);

var url = "https://crudcrud.com/api/d4b6530a7c8244229bded0ebe60a5d39/todo";




function makenewelement() {
    let newele = document.createElement('li');
    newele.className = 'list-group-item';

    let newele2 = document.createElement('span');

    let newele3 = document.createElement('button');
    newele3.className = 'btn btn-danger btn-sm float-end delete me-1';
    newele3.appendChild(document.createTextNode('X'));

    let newele4 = document.createElement('button');
    newele4.className = 'btn btn-success btn-sm float-end edit me-1';
    newele4.appendChild(document.createTextNode('✅︎'));

    newele.appendChild(newele2);
    newele.appendChild(newele3);
    newele.appendChild(newele4);

    return newele;
}

async function onLoadFetchData() {

    try {

        const resp = await axios.get(url)

        for (let key in resp.data) {

            let newele = makenewelement();

            newele.firstElementChild.appendChild(document.createTextNode(`${resp.data[key].task} - ${resp.data[key].description}`));
            newele.firstElementChild.nextElementSibling.id = resp.data[key].task;

            if (resp.data[key].status == "pending")
                todos.appendChild(newele);
            else {
                newele.removeChild(newele.lastElementChild);
                completeTodos.appendChild(newele);
            }
        }

    } catch (error) {
        alert("not working")
        console.log("error", error);
    }

}

async function addToCrudCrudAndPrint(e) {
    e.preventDefault();

    let task = document.getElementById('task').value;
    let description = document.getElementById('description').value;

    const myobj = {
        "task": task,
        "description": description,
        "status": "pending"
    }

    let newele = makenewelement();
    newele.firstElementChild.appendChild(document.createTextNode(`${task} - ${description}`));
    newele.firstElementChild.nextElementSibling.id = task;

    if (task != "" && description != "") {

        todos.appendChild(newele);
        await axios.post(url, myobj)
    }
    else {
        alert("please provide proper input")
    }

    document.getElementById('task').value = "";
    document.getElementById('description').value = "";
}


function deleteTask(e) {

    if (e.target.classList.contains('delete')) {
        var list = e.target.parentElement;

        axios.get(url)
            .then((resp) => {
                for (let i = 0; i < resp.data.length; i++) {
                    if (e.target.id == resp.data[i].task) {
                        var ide = resp.data[i]._id;


                        if (resp.data[i].status == "completed") {
                            completeTodos.removeChild(list);
                        }
                        else {
                            todos.removeChild(list)
                        }

                        i = resp.data.length;
                        axios.delete(`${url}/${ide}`)
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

function makeItCompletedTask(e) {

    if (e.target.classList.contains('edit')) {
        var list = e.target.parentElement;

        axios.get(url)
            .then((resp) => {

                for (let i = 0; i < resp.data.length; i++) {
                    if (e.target.previousElementSibling.id == resp.data[i].task) {
                        var ide = resp.data[i]._id;
                        console.log("id is", e.target.previousElementSibling.id);

                        axios.put(`${url}/${ide}`, { task: resp.data[i].task, description: resp.data[i].description, status: "completed" })
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

