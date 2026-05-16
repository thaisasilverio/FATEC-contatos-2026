'use strict'

const BASE_URL = "https://bakcend-fecaf-render.onrender.com/contatos"

// CLOUDINARY
const CLOUD_NAME = 'dnxxbe9nn'
const PRESET_NAME = 'fotos_contato'

// Upload da imagem
export async function uploadParaCloudinary(file) {

  try {

    const data = new FormData()

    data.append('file', file)
    data.append('upload_preset', PRESET_NAME)

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const options = {
      method: 'POST',
      body: data
    }

    const response = await fetch(url, options)

    if (!response.ok) {

      throw new Error('Erro ao enviar imagem')

    }

    const link = await response.json()

    return link.secure_url

  } catch (error) {

    console.log(error)

    return ""

  }

}

// BUSCAR CONTATOS
export async function getContatos() {

  try {

    const response = await fetch(BASE_URL)

    if (!response.ok) {

      throw new Error("Erro ao buscar contatos")

    }

    return await response.json()

  } catch (error) {

    console.log(error)

    return []

  }

}

// CRIAR CONTATO
export async function criarContato(contato) {

  try {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contato)
    }

    const response = await fetch(BASE_URL, options)

    if (!response.ok) {

      throw new Error("Erro ao criar contato")

    }

    return await response.json()

  } catch (error) {

    console.log(error)

    throw error

  }

}

// ATUALIZAR CONTATO
export async function atualizarContato(id, contato) {

  try {

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contato)
    }

    const response = await fetch(`${BASE_URL}/${id}`, options)

    if (!response.ok) {

      throw new Error("Erro ao atualizar contato")

    }

    return await response.json()

  } catch (error) {

    console.log(error)

    throw error

  }

}

// DELETAR CONTATO
export async function deletarContato(id) {

  try {

    const options = {
      method: "DELETE"
    }

    const response = await fetch(`${BASE_URL}/${id}`, options)

    if (!response.ok) {

      throw new Error("Erro ao deletar contato")

    }

    return true

  } catch (error) {

    console.log(error)

    return false

  }

}