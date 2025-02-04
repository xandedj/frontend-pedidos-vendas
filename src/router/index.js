import { createRouter, createWebHistory } from 'vue-router'
import Produtos from '../views/Produtos.vue'
import Clientes from '../views/Clientes.vue'
import Pedidos from '../views/Pedidos.vue'

const routes = [
  {
    path: '/produtos',
    name: 'Produtos',
    component: Produtos
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: Clientes
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: Pedidos
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router