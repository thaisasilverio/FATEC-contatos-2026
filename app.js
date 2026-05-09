import {
  getContatos,
  criarContato,
  atualizarContato,
  deletarContato
} from "./contatos.js"

const form = document.getElementById("formContato")
const listaContatos = document.getElementById("listaContatos")

const inputFoto = document.getElementById("preview-input")
const previewImg = document.getElementById("preview-image")

async function carregarContatos() {
  try {
    const contatos = await getContatos()

    listaContatos.textContent = ""

    contatos.forEach(contato => {
      const card = document.createElement("article")
      card.classList.add("card-contato")

      const foto = document.createElement("img")
      foto.src = contato.foto || "./img/upload-icon.svg"
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

      // BOTÃO EDITAR REMOVIDO

      const btnExcluir = document.createElement("button")
      btnExcluir.textContent = "Excluir"
      btnExcluir.classList.add("btn-excluir")

      btnExcluir.addEventListener("click", async () => {
        await deletarContato(contato.id)
        carregarContatos()
      })

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

function converterBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(arquivo)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })
}

inputFoto.addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (!file) return
  previewImg.src = URL.createObjectURL(file)
})

form.addEventListener("submit", async (event) => {
  event.preventDefault()

  const id = document.getElementById("id").value
  const file = inputFoto.files[0]
  let fotoBase64 = ""

  if (file) {
    fotoBase64 = await converterBase64(file)
  }

  const contato = {
    nome: document.getElementById("nome").value,
    celular: document.getElementById("celular").value,
    foto: fotoBase64,
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
    previewImg.src = "./img/upload-icon.svg"
    carregarContatos()

  } catch (error) {
    console.log(error)
  }
})

carregarContatos()