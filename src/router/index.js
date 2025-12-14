import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import IndividualPostView from '../views/IndividualPostView.vue'
import ResumeView from '../views/ResumeView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import IndividualProjectView from '../views/IndividualProjectView.vue'
import ShiftCalendarView from '../views/ShiftCalendarView.vue'

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
        {
            path: '/projects',
            name: 'projects',
            component: ProjectsView
        },
        {
            path: '/project/:id',
            name: 'project',
            component: IndividualProjectView
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: ShiftCalendarView
        },
        // Hidden redirect routes - handled by 404.html for direct access
        // These routes are intentionally not defined here to keep them hidden
        // Catch-all route for 404 Not Found
        {
            path: '/:catchAll(.*)',
            name: '404',
            component: NotFoundView
        }
    ]
})

export default router
