import {
  getContatos,
  criarContato,
  atualizarContato,
  deletarContato
} from "./contatos.js"

const form = document.getElementById("formContato")
const listaContatos = document.getElementById("listaContatos")

async function carregarContatos() {

  try {
    const contatos = await getContatos()
    listaContatos.textContent = ""
    contatos.forEach(contato => {

      const card = document.createElement("article")
      card.classList.add("card-contato")

      const foto = document.createElement("img")
      foto.src = contato.foto
      foto.alt = contato.nome

      const info = document.createElement("section")
      info.classList.add("info")

      const id = document.createElement("p")
      id.textContent = `ID: ${contato.id}`

      const nome = document.createElement("p")
      nome.textContent = `Nome: ${contato.nome}`

      const celular = document.createElement("p")
      celular.textContent = `Celular: ${contato.celular}`

      const email = document.createElement("p")
      email.textContent = `Email: ${contato.email}`

      const endereco = document.createElement("p")
      endereco.textContent = `Endereço: ${contato.endereco}`

      const cidade = document.createElement("p")
      cidade.textContent = `Cidade: ${contato.cidade}`

      info.appendChild(id)
      info.appendChild(nome)
      info.appendChild(celular)
      info.appendChild(email)
      info.appendChild(endereco)
      info.appendChild(cidade)

      const botoes = document.createElement("section")
      botoes.classList.add("botoes")
      const btnEditar = document.createElement("button")
      btnEditar.textContent = "Editar"
      btnEditar.classList.add("btn-editar")
      btnEditar.addEventListener("click", () => {

        document.getElementById("id").value = contato.id
        document.getElementById("nome").value = contato.nome
        document.getElementById("celular").value = contato.celular
        document.getElementById("foto").value = contato.foto
        document.getElementById("email").value = contato.email
        document.getElementById("endereco").value = contato.endereco
        document.getElementById("cidade").value = contato.cidade
      })

      const btnExcluir = document.createElement("button")
      btnExcluir.textContent = "Excluir"
      btnExcluir.classList.add("btn-excluir")
      btnExcluir.addEventListener("click", async () => {
        await deletarContato(contato.id)
        carregarContatos()
      })

      botoes.appendChild(btnEditar)
      botoes.appendChild(btnExcluir)
      card.appendChild(foto)
      card.appendChild(info)
      card.appendChild(botoes)
      listaContatos.appendChild(card)
    })

  } catch (error) {
    console.log(error)
  }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault()
  const id = document.getElementById("id").value
  const contato = {
    nome: document.getElementById("nome").value,
    celular: document.getElementById("celular").value,
    foto: document.getElementById("foto").value,
    email: document.getElementById("email").value,
    endereco: document.getElementById("endereco").value,
    cidade: document.getElementById("cidade").value
  }

  try {
    if (id) {
      await atualizarContato(id, contato)
    } else {
      await criarContato(contato)
    }
    
    form.reset()
    document.getElementById("id").value = ""
    carregarContatos()
  } catch (error) {
    console.log(error)
  }
})

carregarContatos()

function converterBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(arquivo)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}