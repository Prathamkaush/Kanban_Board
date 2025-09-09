const API_URL = "http://localhost:5000/tasks"

async function fetchTasks() {
  const res = await fetch(API_URL)
  const tasks = await res.json()
  document.getElementById("todo").innerHTML = ""
  document.getElementById("inprogress").innerHTML = ""
  document.getElementById("done").innerHTML = ""
  tasks.forEach(t => renderTask(t))
}

function renderTask(task) {
  const div = document.createElement("div")
  div.className = "task"
  div.draggable = true
  div.dataset.id = task.id
  div.innerHTML = `
    <div><b>${task.title}</b><br>${task.description}</div>
    <button class="edit">edit</button>
    <button class="del">del</button>
  `

  div.addEventListener("dragstart", e => {
    e.dataTransfer.setData("id", task.id)
  })

  div.querySelector(".del").addEventListener("click", async () => {
    await fetch(API_URL + "/" + task.id, { method: "DELETE" })
    fetchTasks()
  })

  div.querySelector(".edit").addEventListener("click", async () => {
    let newTitle = prompt("title?", task.title)
    let newDesc = prompt("desc?", task.description)
    if (newTitle != null) {
      await fetch(API_URL + "/" + task.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc || "",
          status: task.status
        })
      })
      fetchTasks()
    }
  })

  document.getElementById(task.status).appendChild(div)
}

async function addTask() {
  const title = document.getElementById("taskTitle").value
  const desc = document.getElementById("taskDesc").value
  if (!title) return alert("enter title")
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description: desc })
  })
  document.getElementById("taskTitle").value = ""
  document.getElementById("taskDesc").value = ""
  fetchTasks()
}

document.querySelectorAll(".task-list").forEach(list => {
  list.addEventListener("dragover", e => e.preventDefault())
  list.addEventListener("drop", async e => {
    e.preventDefault()
    const id = e.dataTransfer.getData("id")
    const res = await fetch(API_URL)
    const tasks = await res.json()
    const task = tasks.find(t => t.id == id)
    if (!task) return
    let newStatus = list.parentElement.dataset.status
    await fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        status: newStatus
      })
    })
    fetchTasks()
  })
})

fetchTasks()
