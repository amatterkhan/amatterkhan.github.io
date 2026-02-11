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
            component: HomeView,
            meta: { title: 'Asad Atterkhan' }
        },
        // Removed about route; about content is pinned in Blog (post 0)
        {
            path: '/blog',
            name: 'blog',
            component: BlogView,
            meta: { title: 'Blog — Asad Atterkhan' }
        },
        {
            path: '/post/:id',
            name: 'post',
            component: IndividualPostView,
            meta: { title: 'Blog Post — Asad Atterkhan' }
        },
        {
            path: '/resume',
            name: 'resume',
            component: ResumeView,
            meta: { title: 'Resume — Asad Atterkhan' }
        },
        {
            path: '/projects',
            name: 'projects',
            component: ProjectsView,
            meta: { title: 'Projects — Asad Atterkhan' }
        },
        {
            path: '/project/:id',
            name: 'project',
            component: IndividualProjectView,
            meta: { title: 'Project — Asad Atterkhan' }
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: ShiftCalendarView,
            meta: { title: 'Calendar — Asad Atterkhan' }
        },
        // Hidden redirect routes - handled by 404.html for direct access
        // These routes are intentionally not defined here to keep them hidden
        // Catch-all route for 404 Not Found
        {
            path: '/:catchAll(.*)',
            name: '404',
            component: NotFoundView,
            meta: { title: 'Not Found — Asad Atterkhan' }
        }
    ]
})

router.afterEach((to) => {
    document.title = to.meta?.title || 'Asad Atterkhan'
})

export default router
