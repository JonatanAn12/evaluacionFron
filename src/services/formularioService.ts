import axios from 'axios'

const API_URL = 'http://localhost:8080/api/formulario'

export async function obtenerFormulario() {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('Error al obtener el formulario:', error)
    throw error
  }
}

export async function enviarFormulario(datos: any) {
  try {
    const response = await axios.post(API_URL, datos)
    return response.data
  } catch (error) {
    console.error('Error al enviar el formulario:', error)
    throw error
  }
}

export async function actualizarFormulario(id: Number, datos: any) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, datos)
    return response.data
  } catch (error) {
    console.error('no se actualizaron los datos correctamente')
  }
}

export async function eliminarFormulario(id: Number) {
  try {
    await axios.delete(`${API_URL}/${id}`)
  } catch (error) {
    console.error('no se eliminaron los datos correctamente')
  }
}
