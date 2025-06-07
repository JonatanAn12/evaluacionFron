<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h6">Especialistas</span>
      </v-card-title>
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
              <v-checkbox v-model="form.activo" label="Activo" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-btn color="primary" type="submit">{{ editando ? 'Actualizar' : 'Agregar' }}</v-btn>
              <v-btn v-if="editando" color="grey" @click="cancelarEdicion" class="ml-2"
                >Cancelar</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-data-table
        :headers="headers"
        :items="especialistas"
        :items-per-page="5"
        class="elevation-1"
        :loading="loading"
      >
        <template #item.acciones="{ item }">
          <v-btn icon color="primary" @click="editarEspecialista(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="eliminarEspecialista(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" top right>
        {{ snackbar.message }}
        <template #action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">Cerrar</v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  obtenerEspecialistas,
  enviarFormularioEspecialistas,
  actualizarFormulario,
  eliminarFormulario,
} from '../services/especialistaService'

interface Especialista {
  id?: number
  nombre: string
  especialidad: string
  registroProfesional: string
  fechaDisponibilidad: string
  horaInicio: string
  horaFin: string
  activo: boolean
}

const headers = [
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

const especialistas = ref<Especialista[]>([])
const form = ref<Especialista>({
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
const loading = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: '',
})

const mostrarAlerta = (mensaje: string, color: string = 'error') => {
  snackbar.value.message = mensaje
  snackbar.value.color = color
  snackbar.value.show = true
}

const cargarEspecialistas = async () => {
  loading.value = true
  try {
    especialistas.value = await obtenerEspecialistas()
  } catch (error) {
    mostrarAlerta('Error cargando especialistas.', 'error')
  } finally {
    loading.value = false
  }
}

const prepararDatosParaEnvio = (datos: Especialista) => {
  return {
    ...datos,
    fechaDisponibilidad: datos.fechaDisponibilidad
      ? new Date(datos.fechaDisponibilidad).toISOString().split('T')[0]
      : null,
    horaInicio: datos.horaInicio
      ? datos.horaInicio.length === 5
        ? datos.horaInicio + ':00'
        : datos.horaInicio
      : null,
    horaFin: datos.horaFin
      ? datos.horaFin.length === 5
        ? datos.horaFin + ':00'
        : datos.horaFin
      : null,
    activo: datos.activo === true,
  }
}

const guardarFormulario = async () => {
  // Validaciones básicas
  if (!form.value.nombre.trim()) {
    mostrarAlerta('El campo Nombre es obligatorio.', 'error')
    return
  }
  if (!form.value.especialidad.trim()) {
    mostrarAlerta('El campo Especialidad es obligatorio.', 'error')
    return
  }
  if (!form.value.registroProfesional.trim()) {
    mostrarAlerta('El campo Registro Profesional es obligatorio.', 'error')
    return
  }
  if (!form.value.fechaDisponibilidad) {
    mostrarAlerta('El campo Fecha Disponibilidad es obligatorio.', 'error')
    return
  }
  if (!form.value.horaInicio) {
    mostrarAlerta('El campo Hora Inicio es obligatorio.', 'error')
    return
  }
  if (!form.value.horaFin) {
    mostrarAlerta('El campo Hora Fin es obligatorio.', 'error')
    return
  }
  try {
    if (editando.value && editId.value !== null) {
      await actualizarFormulario(editId.value, prepararDatosParaEnvio(form.value))
      mostrarAlerta('Especialista actualizado correctamente.', 'success')
    } else {
      await enviarFormularioEspecialistas(prepararDatosParaEnvio(form.value))
      mostrarAlerta('Especialista creado correctamente.', 'success')
    }
    resetForm()
    await cargarEspecialistas()
  } catch (error) {
    mostrarAlerta('Ocurrió un error al guardar el especialista.', 'error')
  }
}

const editarEspecialista = (item: Especialista) => {
  form.value = { ...item }
  editando.value = true
  editId.value = item.id ?? null
}

const cancelarEdicion = () => {
  resetForm()
  editando.value = false
  editId.value = null
}

const resetForm = () => {
  form.value = {
    nombre: '',
    especialidad: '',
    registroProfesional: '',
    fechaDisponibilidad: '',
    horaInicio: '',
    horaFin: '',
    activo: true,
  }
}

const eliminarEspecialista = async (id?: number) => {
  if (!id) {
    mostrarAlerta('ID inválido para eliminar especialista.', 'error')
    return
  }
  if (!confirm('¿Estás seguro de eliminar este especialista? Esta acción no se puede deshacer.')) {
    return
  }
  try {
    await eliminarFormulario(id)
    mostrarAlerta('Especialista eliminado correctamente.', 'success')
    await cargarEspecialistas()
  } catch (error) {
    mostrarAlerta('Ocurrió un error al eliminar el especialista.', 'error')
  }
}

onMounted(() => {
  cargarEspecialistas()
})
</script>
