import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import movie from '@/components/movie'
import layout from '@/components/layout'
import tv from '@/components/tv'
import person from '@/components/person'
import searchResults from '@/components/searchResults'
import favorites from '@/components/favorites'


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/layout',
      name: 'layout',
      component: layout,
      meta: {
        keepAlive: true
      },
      children:[
        {
          path: 'movie/:id',
          name: 'movie',
          component: movie,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'tv/:id',
          name: 'tv',
          component: tv,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'person/:id',
          name: 'person',
          component: person,
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'searchResults/:keyword',
          name: 'searchResults',
          component: searchResults,
          meta: {
            keepAlive: true
          }

        }
      ]
    },
    {
      path:"/favorites",
      name:'favorites',
      component:favorites,
      meta:{
        keepAlive: false
      }
    }

  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

