'use strict'

import {
  getContatos,
  criarContato,
  atualizarContato,
  deletarContato,
  uploadParaCloudinary
} from "./contatos.js"

const form = document.getElementById("formContato")
const listaContatos = document.getElementById("listaContatos")

const inputFoto = document.getElementById("preview-input")
const previewImg = document.getElementById("preview-image")

async function carregarContatos() {

  try {

    const contatos = await getContatos()

    listaContatos.replaceChildren()

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

      info.append(
        id,
        nome,
        celular,
        email,
        endereco,
        cidade
      )

      const botoes = document.createElement("section")
      botoes.classList.add("botoes")

      // BOTÃO EDITAR
      const btnEditar = document.createElement("button")
      btnEditar.textContent = "Editar"
      btnEditar.classList.add("btn-editar")

      btnEditar.addEventListener("click", () => {

        document.getElementById("id").value = contato.id
        document.getElementById("nome").value = contato.nome
        document.getElementById("celular").value = contato.celular
        document.getElementById("email").value = contato.email
        document.getElementById("endereco").value = contato.endereco
        document.getElementById("cidade").value = contato.cidade

        previewImg.src = contato.foto || "./img/upload-icon.svg"

      })

      // BOTÃO EXCLUIR
      const btnExcluir = document.createElement("button")
      btnExcluir.textContent = "Excluir"
      btnExcluir.classList.add("btn-excluir")

      btnExcluir.addEventListener("click", async () => {

        try {

          await deletarContato(contato.id)

          carregarContatos()

        } catch (error) {

          console.log(error)

        }

      })

      botoes.append(btnEditar, btnExcluir)

      card.append(foto, info, botoes)

      listaContatos.appendChild(card)

    })

  } catch (error) {

    console.log(error)

  }

}

// PREVIEW DA IMAGEM
inputFoto.addEventListener("change", (event) => {

  const file = event.target.files[0]

  if (!file) return

  previewImg.src = URL.createObjectURL(file)

})

// SALVAR CONTATO
form.addEventListener("submit", async (event) => {

  event.preventDefault()

  try {

    const id = document.getElementById("id").value

    const file = inputFoto.files[0]

let foto = previewImg.src

if (file) {

  const imagemCloudinary = await uploadParaCloudinary(file)

  if (imagemCloudinary) {

    foto = imagemCloudinary

  }

    }

    const contato = {

      nome: document.getElementById("nome").value,
      celular: document.getElementById("celular").value,
      email: document.getElementById("email").value,
      endereco: document.getElementById("endereco").value,
      cidade: document.getElementById("cidade").value,
      foto: foto

    }

    // EDITAR
   if (id) {

  await atualizarContato(id, contato)

  alert("Contato atualizado com sucesso!")

} else {

  await criarContato(contato)

  alert("Contato cadastrado com sucesso!")

}
    // LIMPAR FORM
    form.reset()

    document.getElementById("id").value = ""

    previewImg.src = "./img/upload-icon.svg"

    carregarContatos()

  } catch (error) {

    console.log(error)

    alert("Erro ao salvar contato")

  }

})

carregarContatos()