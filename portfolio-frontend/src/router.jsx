import { createBrowserRouter, Navigate, useRouteError } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'

// API
import {
  profileAPI,
  projectsAPI,
  skillsAPI,
  experiencesAPI,
  diplomasAPI,
  certificationsAPI,
  trainingsAPI
} from '@/api'

// Pages auth
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'

// Pages publiques
import { Home } from './pages/public/Home'
import { PublicPortfolio } from './pages/public/PublicPortfolio'
import { RecruiterPage } from './pages/public/RecruiterPage'

// Pages admin
import { Dashboard } from './pages/admin/Dashboard'
import { Profile } from './pages/admin/Profile'
import { ProjectsList } from './pages/admin/projects/ProjectsList'
import { ProjectEdit } from './pages/admin/projects/ProjectEdit'
import { SkillsList } from './pages/admin/skills/SkillsList'
import { SkillEdit } from './pages/admin/skills/SkillEdit'
import { EducationList } from './pages/admin/education/EducationList'
import { DiplomaEdit } from './pages/admin/education/DiplomaEdit'
import { CertificationEdit } from './pages/admin/education/CertificationEdit'
import { ProfessionalList } from './pages/admin/professional/ProfessionalList'
import { ExperienceEdit } from './pages/admin/professional/ExperienceEdit'
import { TrainingEdit } from './pages/admin/professional/TrainingEdit'
import { RecruiterLinksList } from './pages/admin/recruiter/RecruiterLinksList'
import { Settings } from './pages/admin/Settings'

function PublicPortfolioErrorElement() {
  const err = useRouteError()
  const status = err?.status

  if (status === 403) {
    return <div>Accès recruteur invalide ou expiré</div>
  }

  if (status === 404) {
    return <div>Portfolio non trouvé ou non public</div>
  }

  return <div>Erreur lors du chargement du portfolio</div>
}

/**
 * Configuration des routes de l'application
 */
export const router = createBrowserRouter([
  // ========== ROUTES PUBLIQUES ==========
  // 1. Accès recruteur (prioritaire sur le slug car token est plus spécifique)
  {
    path: "/recruiter-access/:token",
    element: <RecruiterPage />,
  },

  // 2. Public
  {
    path: "/:slug",
    element: <PublicPortfolio />,
    loader: async ({ params, request }) => {
      try {
        const url = new URL(request.url)
        const accessToken = url.searchParams.get('access')
        const accessParams = accessToken ? { access: accessToken } : {}

        // Charger le profil
        const profile = await profileAPI.getPublicBySlug(params.slug, accessParams)
        const userId = profile.user_id

        // Charger toutes les données publiques associées en parallèle
        const [projects, skills, experiences, diplomas, certifications, trainings] = await Promise.all([
          projectsAPI.getPublic?.(userId, accessParams).catch(() => []),
          skillsAPI.getGrouped?.(userId, accessParams).catch(() => []),
          experiencesAPI.getPublic?.(userId, accessParams).catch(() => []),
          diplomasAPI.getPublic?.(userId, accessParams).catch(() => []),
          certificationsAPI.getPublic?.(userId, accessParams).catch(() => []),
          trainingsAPI.getPublic?.(userId, accessParams).catch(() => []),
        ])

        return {
          profile,
          projects: projects || [],
          skills: skills || [],
          experiences: experiences || [],
          diplomas: diplomas || [],
          certifications: certifications || [],
          trainings: trainings || []
        }
      } catch (err) {
        console.error('Erreur chargement portfolio:', err)

        const httpStatus = err?.response?.status
        if (httpStatus === 403) {
          throw new Response('Accès recruteur invalide ou expiré', { status: 403 })
        }
        if (httpStatus === 404) {
          throw new Response('Portfolio non trouvé', { status: 404 })
        }

        throw new Response('Erreur lors du chargement du portfolio', { status: 500 })
      }
    },
    errorElement: <PublicPortfolioErrorElement />,
  },

  //3 Default
  {
    path: '/',
    element: <Home />
  },


  // ========== ROUTES D'AUTHENTIFICATION ==========
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },

  // ========== ROUTES PROTÉGÉES (ADMIN) ==========
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Navigate to="/admin/dashboard" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/projects',
    element: (
      <ProtectedRoute>
        <ProjectsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/projects/new',
    element: (
      <ProtectedRoute>
        <ProjectEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/projects/:id/edit',
    element: (
      <ProtectedRoute>
        <ProjectEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/skills',
    element: (
      <ProtectedRoute>
        <SkillsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/skills/new',
    element: (
      <ProtectedRoute>
        <SkillEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/skills/:id/edit',
    element: (
      <ProtectedRoute>
        <SkillEdit />
      </ProtectedRoute>
    ),
  },

  // ========== EDUCATION (Diplômes / Certifications) ==========
  {
    path: '/admin/education',
    element: (
      <ProtectedRoute>
        <EducationList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/education/diplomas/new',
    element: (
      <ProtectedRoute>
        <DiplomaEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/education/diplomas/:id/edit',
    element: (
      <ProtectedRoute>
        <DiplomaEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/education/certifications/new',
    element: (
      <ProtectedRoute>
        <CertificationEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/education/certifications/:id/edit',
    element: (
      <ProtectedRoute>
        <CertificationEdit />
      </ProtectedRoute>
    ),
  },

  // ========== PROFESSIONAL (Experiences / Formations) ==========
  {
    path: '/admin/professional',
    element: (
      <ProtectedRoute>
        <ProfessionalList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/professional/experiences/new',
    element: (
      <ProtectedRoute>
        <ExperienceEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/professional/experiences/:id/edit',
    element: (
      <ProtectedRoute>
        <ExperienceEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/professional/trainings/new',
    element: (
      <ProtectedRoute>
        <TrainingEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/professional/trainings/:id/edit',
    element: (
      <ProtectedRoute>
        <TrainingEdit />
      </ProtectedRoute>
    ),
  },

  // ========== RECRUITER ACCESS ==========
  {
    path: '/admin/recruiter-access',
    element: (
      <ProtectedRoute>
        <RecruiterLinksList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Page non trouvée</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    ),
  },
])