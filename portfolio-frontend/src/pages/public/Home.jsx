import { useEffect, useState } from 'react'
import { PublicLayout } from '@/layouts/PublicLayout'
import { HeroSection } from '@/components/public/HeroSection'
import { ProjectsSection } from '@/components/public/ProjectsSection'
import { SkillsSection } from '@/components/public/SkillsSection'
import { ContactSection } from '@/components/public/ContactSection'
import { profileAPI, projectsAPI, skillsAPI } from '@/api'

/**
 * Page d'accueil publique du portfolio
 * Affiche : profil, projets, compétences, contact
 */
export function Home() {
  // États pour les données
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [skillsGrouped, setSkillsGrouped] = useState([])
  
  // États de chargement
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingSkills, setLoadingSkills] = useState(true)

  // ID utilisateur (à récupérer depuis l'URL ou config)
  // Pour l'instant, on utilise un ID hardcodé
  // TODO: Récupérer dynamiquement depuis l'URL ou les paramètres
  const userId = 'YOUR_USER_ID' // À remplacer par l'ID réel

  /**
   * Charger le profil public
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true)
        const data = await profileAPI.getPublicProfile(userId)
        setProfile(data)
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
      } finally {
        setLoadingProfile(false)
      }
    }

    // Pour le moment, on simule des données
    // Une fois que tu auras créé un profil via l'admin, remplace par:
    // fetchProfile()
    
    // Données de simulation
    setProfile({
      user_full_name: 'John Doe',
      professional_title: 'Développeur Full-Stack',
      tagline: 'Passionné par le développement web et les technologies modernes',
      bio: 'Développeur Full-Stack avec 3 ans d\'expérience dans la création d\'applications web performantes et évolutives. Spécialisé en React, Node.js et Django.',
      location: 'Paris, France',
      show_location: true,
      show_email: true,
      display_email: 'john.doe@example.com',
      show_phone: false,
      availability: 'disponible_emploi',
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com',
      website_url: 'https://example.com',
      photo: null,
    })
    setLoadingProfile(false)
  }, [userId])

  /**
   * Charger les projets publics
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true)
        const data = await projectsAPI.getPublic(userId)
        setProjects(data)
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error)
      } finally {
        setLoadingProjects(false)
      }
    }

    // Simulation de données
    setProjects([
      {
        id: '1',
        title: 'Portfolio Dynamique',
        short_description: 'Application web complète pour gérer et afficher un portfolio professionnel',
        cover_image: null,
        technologies_list: ['React', 'Django', 'PostgreSQL', 'Tailwind CSS'],
        duration_display: '2024-01 - En cours',
        is_featured: true,
        github_url: 'https://github.com',
        demo_url: 'https://example.com',
      },
      {
        id: '2',
        title: 'Application E-commerce',
        short_description: 'Plateforme de vente en ligne avec gestion de stock et paiement sécurisé',
        cover_image: null,
        technologies_list: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe'],
        duration_display: '2023-06 - 2023-12',
        is_featured: true,
        github_url: 'https://github.com',
      },
      {
        id: '3',
        title: 'Dashboard Analytics',
        short_description: 'Tableau de bord pour visualiser et analyser des données en temps réel',
        cover_image: null,
        technologies_list: ['React', 'Chart.js', 'Express', 'Socket.io'],
        duration_display: '2023-01 - 2023-05',
        is_featured: false,
      },
    ])
    setLoadingProjects(false)
  }, [userId])

  /**
   * Charger les compétences groupées
   */
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true)
        const data = await skillsAPI.getGrouped(userId)
        setSkillsGrouped(data)
      } catch (error) {
        console.error('Erreur lors du chargement des compétences:', error)
      } finally {
        setLoadingSkills(false)
      }
    }

    // Simulation de données
    setSkillsGrouped([
      {
        category: 'Langage',
        category_display: 'Langages de programmation',
        count: 4,
        skills: [
          { id: '1', name: 'JavaScript', level: 'Expert', years_of_experience: 3 },
          { id: '2', name: 'Python', level: 'Avance', years_of_experience: 2 },
          { id: '3', name: 'TypeScript', level: 'Avance', years_of_experience: 1.5 },
          { id: '4', name: 'SQL', level: 'Intermediaire', years_of_experience: 2 },
        ],
      },
      {
        category: 'Framework',
        category_display: 'Frameworks',
        count: 3,
        skills: [
          { id: '5', name: 'React', level: 'Expert', years_of_experience: 2.5 },
          { id: '6', name: 'Django', level: 'Avance', years_of_experience: 1.5 },
          { id: '7', name: 'Node.js', level: 'Avance', years_of_experience: 2 },
        ],
      },
      {
        category: 'Outil',
        category_display: 'Outils',
        count: 4,
        skills: [
          { id: '8', name: 'Git', level: 'Expert', years_of_experience: 3 },
          { id: '9', name: 'Docker', level: 'Intermediaire', years_of_experience: 1 },
          { id: '10', name: 'PostgreSQL', level: 'Avance', years_of_experience: 2 },
          { id: '11', name: 'Tailwind CSS', level: 'Expert', years_of_experience: 1.5 },
        ],
      },
    ])
    setLoadingSkills(false)
  }, [userId])

  return (
    <PublicLayout>
      {/* Hero avec profil */}
      <HeroSection profile={profile} isLoading={loadingProfile} />

      {/* Projets */}
      <ProjectsSection projects={projects} isLoading={loadingProjects} />

      {/* Compétences */}
      <SkillsSection skillsGrouped={skillsGrouped} isLoading={loadingSkills} />

      {/* Contact */}
      <ContactSection profile={profile} />
    </PublicLayout>
  )
}