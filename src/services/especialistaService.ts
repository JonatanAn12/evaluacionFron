import axios from 'axios'

const API_URL = 'http://localhost:8080/api/especialistas'

export async function obtenerEspecialistas() {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('Error al obtener el formulario:', error)
    throw error
  }
}

export async function enviarFormularioEspecialistas(datos: any) {
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

// Nuevos métodos para los endpoints faltantes

export async function obtenerEspecialistasInactivos() {
  try {
    const response = await axios.get(`${API_URL}/inactive`)
    return response.data
  } catch (error) {
    console.error('Error al obtener especialistas inactivos:', error)
    throw error
  }
}

export async function restaurarEspecialista(id: Number) {
  try {
    const response = await axios.put(`${API_URL}/${id}/restore`)
    return response.data
  } catch (error) {
    console.error('Error al restaurar especialista:', error)
    throw error
  }
}

export async function eliminarEspecialistaPermanentemente(id: Number) {
  try {
    await axios.delete(`${API_URL}/${id}/permanent`)
  } catch (error) {
    console.error('Error al eliminar especialista permanentemente:', error)
    throw error
  }
}

export async function obtenerEspecialistasOrdenadosPorNombre() {
  try {
    const response = await axios.get(`${API_URL}/ordered/name`)
    return response.data
  } catch (error) {
    console.error('Error al obtener especialistas ordenados por nombre:', error)
    throw error
  }
}

export async function obtenerEspecialistasOrdenadosPorEspecialidad() {
  try {
    const response = await axios.get(`${API_URL}/ordered/specialty`)
    return response.data
  } catch (error) {
    console.error('Error al obtener especialistas ordenados por especialidad:', error)
    throw error
  }
}

export async function obtenerEspecialistasPorEspecialidad(especialidad: string) {
  try {
    const response = await axios.get(`${API_URL}/specialty/${especialidad}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener especialistas por especialidad:', error)
    throw error
  }
}

export async function buscarEspecialistasPorNombre(nombre: string) {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: { nombre } })
    return response.data
  } catch (error) {
    console.error('Error al buscar especialistas por nombre:', error)
    throw error
  }
}
