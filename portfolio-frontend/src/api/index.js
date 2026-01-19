/**
 * Export centralisé de tous les endpoints API
 * 
 * Usage:
 * import { authAPI, projectsAPI, skillsAPI } from '@/api'
 */

export { authAPI } from './endpoints/auth'
export { profileAPI } from './endpoints/profile'
export { projectsAPI } from './endpoints/projects'
export { skillsAPI } from './endpoints/skills'
export { diplomasAPI, certificationsAPI } from './endpoints/education'
export { experiencesAPI, trainingsAPI } from './endpoints/professional'
export { proofsAPI } from './endpoints/proofs'
export { recruiterAPI } from './endpoints/recruiter'

export { default as apiClient, saveTokens, clearTokens, isAuthenticated } from './client'