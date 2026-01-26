const API_URL = "http://localhost:3000/tarefas";

const lista = document.getElementById("lista");
const form = document.getElementById("form");
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao")

async function carregarTarefas() {
    const requisicao = await fetch(API_URL);
    const tarefas = await requisicao.json();

    lista.innerHTML = "";


    tarefas.forEach(tarefa => {
        const tarefaConcluida = tarefa.status === "concluida" ? "concluida" : "";
        const li = document.createElement("li");
        li.dataset.id = tarefa.id;

        li.innerHTML = `
        <section class = "card">
            <div class = "tarefa ${tarefaConcluida}">
                <h2>${tarefa.titulo}</h2>
                <p>${tarefa.descricao}</p>
            </div>
            <label class = "checkbox">
                <input type="checkbox" ${tarefa.status === "concluida" ? "checked" : ""} onchange="alterarStatus(${tarefa.id}, this.checked)">
                <span class = "checkmark"></span>
            </label>
                <button onclick="editar(${tarefa.id}, '${tarefa.titulo}', '${tarefa.descricao}')">editar</button>
                <button onclick="deletar(${tarefa.id})">del</button>
        </section>
        `;
        lista.appendChild(li);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            titulo: tituloInput.value,
            descricao: descricaoInput.value,
            status: "pendente"
        })
    });

    tituloInput.value = "";
    descricaoInput.value = "";
    carregarTarefas();
});

async function deletar(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    carregarTarefas();
}

async function alterarStatus(id, checked){
    await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            status: checked ? "concluida" : "pendente"
        })
    });

    carregarTarefas();
}

function editar(id, titulo, descricao) {
  const li = document.querySelector(`li[data-id='${id}']`);

  li.innerHTML = `
    <section class="card">
      <div class="tarefa">
        <input type="text" id="edit-titulo-${id}" value="${titulo}">
        <textarea id="edit-descricao-${id}">${descricao}</textarea>
      </div>

      <button onclick="salvarEdicao(${id})">salvar</button>
      <button onclick="carregarTarefas()">cancelar</button>
    </section>
  `;
}

async function salvarEdicao(id) {
  const novoTitulo = document.getElementById(`edit-titulo-${id}`).value;
  const novaDescricao = document.getElementById(`edit-descricao-${id}`).value;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      titulo: novoTitulo,
      descricao: novaDescricao
    })
  });

  carregarTarefas();
}



carregarTarefas();