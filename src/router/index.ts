import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainView from '../views/MainView.vue'
import HistoryView from '../views/HistoryView.vue'
import NewPrescription from '../views/NewPrescription.vue'
import Prescription from '../views/Prescription.vue'
import Treatment from '../views/Treatment.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView
    },
    {
      path: '/main',
      name: 'main',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MainView
    },
    {
      path: '/history',
      name: 'history',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HistoryView
    },
    {
    path: '/new/:id?',
    name: 'new',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: NewPrescription
    }
    ,
    {
       path: '/print/:id',
       name: 'print',
       component: Prescription
    }
    ,
    {
       path: '/treatment',
       name: 'treatment',
       component: Treatment
    }
  ]
})

export default router
