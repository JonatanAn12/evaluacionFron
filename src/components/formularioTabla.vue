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
              <v-text-field v-model="form.ciudad" label="Ciudad" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="form.telefono" label="Teléfono" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="form.email" label="Email" required />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-btn color="primary" type="submit">
                {{ editando ? 'Actualizar' : 'Agregar' }}
              </v-btn>
              <v-btn v-if="editando" color="grey" @click="cancelarEdicion" class="ml-2">
                Cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-data-table :headers="headers" :items="formularios" :items-per-page="5" class="elevation-1">
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
  obtenerFormulario,
  enviarFormulario,
  actualizarFormulario,
  eliminarFormulario,
} from '@/services/formularioService'

interface Formulario {
  id?: number
  nombre: string
  ciudad: string
  telefono: string
  email: string
}

interface Header {
  text: string
  value: string
  sortable?: boolean
}

const headers: Header[] = [
  { text: 'ID', value: 'id' },
  { text: 'Nombre', value: 'nombre' },
  { text: 'Ciudad', value: 'ciudad' },
  { text: 'Teléfono', value: 'telefono' },
  { text: 'Email', value: 'email' },
  { text: 'Acciones', value: 'acciones', sortable: false },
]

const formularios = ref<Formulario[]>([])
const form = ref<Formulario>({ nombre: '', ciudad: '', telefono: '', email: '' })
const editando = ref(false)
const editId = ref<number | null>(null)

const cargarFormularios = async () => {
  formularios.value = await obtenerFormulario()
}

onMounted(cargarFormularios)

const guardarFormulario = async () => {
  if (editando.value && editId.value !== null) {
    await actualizarFormulario(editId.value, form.value)
  } else {
    await enviarFormulario(form.value)
  }
  form.value = { nombre: '', ciudad: '', telefono: '', email: '' }
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
  form.value = { nombre: '', ciudad: '', telefono: '', email: '' }
  editando.value = false
  editId.value = null
}

const eliminar = async (id?: number) => {
  if (!id) return
  await eliminarFormulario(id)
  cargarFormularios()
}
</script>
