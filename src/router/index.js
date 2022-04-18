import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import ViewProduct from '../components/ViewProduct.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    alias: '/login',
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/viewProduct/:id',
    name: 'ViewProduct',
    component: ViewProduct,
    meta: {
      requiresAuth: true
    } 
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
})


router.beforeEach((to,from,next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const token = localStorage.getItem('token');
  
  if (requiresAuth && token) {
    next();
  } else if (requiresAuth && !token) {
    next('/login');
  } else if (!requiresAuth && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router