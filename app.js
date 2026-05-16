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

const loginTela = document.getElementById("loginTela")
const sistema = document.getElementById("sistema")
const btnLogin = document.getElementById("btnLogin")

sistema.style.display = "none"

function preencherFormulario(contato) {

  document.getElementById("id").value = contato.id
  document.getElementById("nome").value = contato.nome
  document.getElementById("celular").value = contato.celular
  document.getElementById("email").value = contato.email
  document.getElementById("endereco").value = contato.endereco
  document.getElementById("cidade").value = contato.cidade

  previewImg.src = contato.foto || "./img/upload-icon.svg"

}

function criarParagrafo(texto) {

  const p = document.createElement("p")

  p.textContent = texto

  return p

}

async function carregarContatos() {

  try {

    const contatos = await getContatos()

    listaContatos.replaceChildren()

    contatos.forEach(contato => {

      const card = document.createElement("article")
      const foto = document.createElement("img")
      const info = document.createElement("section")
      const botoes = document.createElement("section")

      card.className = "card-contato"
      info.className = "info"
      botoes.className = "botoes"

      foto.src = contato.foto || "./img/upload-icon.svg"
      foto.alt = contato.nome

      info.append(
        criarParagrafo(`ID: ${contato.id}`),
        criarParagrafo(`Nome: ${contato.nome}`),
        criarParagrafo(`Celular: ${contato.celular}`),
        criarParagrafo(`Email: ${contato.email}`),
        criarParagrafo(`Endereço: ${contato.endereco}`),
        criarParagrafo(`Cidade: ${contato.cidade}`)
      )

      const btnEditar = document.createElement("button")

      btnEditar.textContent = "Editar"
      btnEditar.className = "btn-editar"

      btnEditar.addEventListener("click", () => {
        preencherFormulario(contato)
      })

      const btnExcluir = document.createElement("button")

      btnExcluir.textContent = "Excluir"
      btnExcluir.className = "btn-excluir"

      btnExcluir.addEventListener("click", async () => {

        await deletarContato(contato.id)

        alert("Contato excluído com sucesso!")

        carregarContatos()

      })

      botoes.append(btnEditar, btnExcluir)

      card.append(foto, info, botoes)

      listaContatos.appendChild(card)

    })

  } catch (error) {

    console.log(error)

  }

}

// PREVIEW IMAGEM
inputFoto.addEventListener("change", event => {

  const file = event.target.files[0]

  if (file) {

    previewImg.src = URL.createObjectURL(file)

  }

})

// LOGIN
function abrirSistema() {

  loginTela.style.display = "none"

  sistema.style.display = "block"

}

btnLogin.addEventListener("click", abrirSistema)

// SALVAR CONTATO
form.addEventListener("submit", async event => {

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
      foto

    }

    if (id) {

      await atualizarContato(id, contato)

      alert("Contato atualizado com sucesso!")

    } else {

      await criarContato(contato)

      alert("Contato cadastrado com sucesso!")

    }

    form.reset()

    previewImg.src = "./img/upload-icon.svg"

    document.getElementById("id").value = ""

    carregarContatos()

  } catch (error) {

    console.log(error)

    alert("Erro ao salvar contato")

  }

})

carregarContatos()