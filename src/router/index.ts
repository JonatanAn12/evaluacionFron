import { createRouter, createWebHistory } from 'vue-router'
import FormularioView from '../views/formularioView.vue'
import EspecialistaVIew from '../views/especialistaView.vue'

// Puedes definir tus rutas en un array aparte para mayor claridad
const routes = [
  {
    path: '/',
    name: 'home',
    component: FormularioView,
  },
  {
    path: '/formulario',
    name: 'formulario',
    component: FormularioView,
  },
  {
    path: '/especialista',
    name: 'especialista',
    component: EspecialistaVIew,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  // Aquí puedes agregar más rutas fácilmente
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
