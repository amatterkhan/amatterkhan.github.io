import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import IndividualPostView from '../views/IndividualPostView.vue'
import ResumeView from '../views/ResumeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        // Removed about route; about content is pinned in Blog (post 0)
        {
            path: '/blog',
            name: 'blog',
            component: BlogView
        },
        {
            path: '/post/:id',
            name: 'post',
            component: IndividualPostView
        },
        {
            path: '/resume',
            name: 'resume',
            component: ResumeView
        },
        // Hidden redirect routes
        {
            path: '/nightschool',
            beforeEnter: (to, from, next) => {
                window.location.href = 'https://mega.nz/folder/PcsiDKiJ#pwVpmb226xsYBaQen3G4kA'
            }
        },
        {
            path: '/islamicbooks',
            beforeEnter: (to, from, next) => {
                window.location.href = 'https://mega.nz/folder/qMkB2DhJ#5it0mHfwbYEnogUwjiWRwA'
            }
        },
        // Catch-all route for 404 Not Found
        {
            path: '/:catchAll(.*)',
            name: '404',
            component: NotFoundView
        }
    ]
})

export default router
