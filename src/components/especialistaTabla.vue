<template>
  <v-container>
    <v-card>
      <v-card-title>Formularios</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="guardarFormulario">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="form.nombre" label="Nombre" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="form.especialidad" label="Especialidad" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="form.registroProfesional"
                label="Registro Profesional"
                required
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="form.fechaDisponibilidad"
                label="Fecha Disponibilidad"
                type="date"
                required
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="form.horaInicio" label="Hora Inicio" type="time" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="form.horaFin" label="Hora Fin" type="time" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="form.activo" label="Estado" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-btn color="primary" type="submit">
                {{ editando ? 'Actualizar' : 'Agregar' }}
              </v-btn>
              <v-btn v-if="editando" color="grey" @click="cancelarEdicion" class="ml-2">
                Cancelar
              </v-btn>
            </v-col>
            <v-text-field
              v-model="especialidadFiltro"
              label="Filtrar por especialidad"
              append-icon="mdi-filter"
              @input="filtrarPorEspecialidad"
              clearable
              class="mb-4"
              style="max-width: 500px; margin: 0 auto"
            />
          </v-row>
        </v-form>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="formularios"
        :items-per-page="5"
        class="elevation-1"
        height="600px"
        style="width: 80vw; margin: 0 auto"
      >
        <template #item.acciones="{ item }">
          <v-btn icon color="primary" @click="editarFormulario(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="eliminar(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  obtenerEspecialistas,
  enviarFormularioEspecialistas,
  actualizarFormulario,
  obtenerEspecialistasInactivos,
  restaurarEspecialista,
  eliminarEspecialistaPermanentemente,
  obtenerEspecialistasOrdenadosPorNombre,
  obtenerEspecialistasOrdenadosPorEspecialidad,
  obtenerEspecialistasPorEspecialidad,
  buscarEspecialistasPorNombre,
  eliminarFormulario,
} from '@/services/especialistaService'

const especialidadFiltro = ref('')

const filtrarPorEspecialidad = async () => {
  if (especialidadFiltro.value.trim() === '') {
    await cargarFormularios()
  } else {
    const resultados = await cargarPorEspecialidad(especialidadFiltro.value)
    formularios.value = resultados || []
  }
}

interface Formulario {
  id?: number
  nombre: string
  especialidad: string
  registroProfesional: string
  fechaDisponibilidad: string
  horaInicio: string
  horaFin: string
  activo?: boolean
}

interface Header {
  text: string
  value: string
  sortable?: boolean
}

const headers: Header[] = [
  { text: 'ID', value: 'id' },
  { text: 'Nombre', value: 'nombre' },
  { text: 'Especialidad', value: 'especialidad' },
  { text: 'Registro Profesional', value: 'registroProfesional' },
  { text: 'Fecha Disponibilidad', value: 'fechaDisponibilidad' },
  { text: 'Hora Inicio', value: 'horaInicio' },
  { text: 'Hora Fin', value: 'horaFin' },
  { text: 'Activo', value: 'activo' },
  { text: 'Acciones', value: 'acciones', sortable: false },
]

const formularios = ref<Formulario[]>([])
const form = ref<Formulario>({
  nombre: '',
  especialidad: '',
  registroProfesional: '',
  fechaDisponibilidad: '',
  horaInicio: '',
  horaFin: '',
  activo: true,
})
const editando = ref(false)
const editId = ref<number | null>(null)

const cargarFormularios = async () => {
  formularios.value = await obtenerEspecialistas()
}

onMounted(cargarFormularios)

const guardarFormulario = async () => {
  if (editando.value && editId.value !== null) {
    await actualizarFormulario(editId.value, form.value)
  } else {
    await enviarFormularioEspecialistas(form.value)
  }
  form.value = {
    nombre: '',
    especialidad: '',
    registroProfesional: '',
    fechaDisponibilidad: '',
    horaInicio: '',
    horaFin: '',
    activo: true,
  }
  editando.value = false
  editId.value = null
  cargarFormularios()
}

const editarFormulario = (item: Formulario) => {
  form.value = { ...item }
  editando.value = true
  editId.value = item.id ?? null
}

const cancelarEdicion = () => {
  form.value = {
    nombre: '',
    especialidad: '',
    registroProfesional: '',
    fechaDisponibilidad: '',
    horaInicio: '',
    horaFin: '',
    activo: true,
  }
  editando.value = false
  editId.value = null
}

const eliminar = async (id?: number) => {
  if (!id) return
  await eliminarFormulario(id)
  cargarFormularios()
}

const cargarEspecialistasInactivos = async () => {
  formularios.value = await obtenerEspecialistasInactivos()
}

const restaurar = async (id: number) => {
  await restaurarEspecialista(id)
  cargarFormularios()
}

const eliminarPermanentemente = async (id: number) => {
  await eliminarEspecialistaPermanentemente(id)
  cargarFormularios()
}

const cargarOrdenadosPorNombre = async () => {
  formularios.value = await obtenerEspecialistasOrdenadosPorNombre()
}

const cargarOrdenadosPorEspecialidad = async () => {
  formularios.value = await obtenerEspecialistasOrdenadosPorEspecialidad()
}

const cargarPorEspecialidad = async (especialidad: string) => {
  return await obtenerEspecialistasPorEspecialidad(especialidad)
}

const buscarPorNombre = async (nombre: string) => {
  formularios.value = await buscarEspecialistasPorNombre(nombre)
}
</script>
