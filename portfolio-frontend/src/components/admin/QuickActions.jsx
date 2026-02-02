import { Link } from 'react-router-dom'
import { 
  Plus, 
  FolderKanban, 
  Award, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

/**
 * Widget d'actions rapides (CTA)
 */
export function QuickActions() {
  const actions = [
    {
      label: 'Nouveau Projet',
      href: '/admin/projects/new',
      icon: FolderKanban,
      color: 'blue',
    },
    {
      label: 'Ajouter Compétence',
      href: '/admin/skills/new',
      icon: Award,
      color: 'green',
    },
    {
      label: 'Ajouter Diplôme',
      href: '/admin/education/diplomas/new',
      icon: GraduationCap,
      color: 'purple',
    },
    {
      label: 'Ajouter Expérience',
      href: '/admin/professional/experiences/new',
      icon: Briefcase,
      color: 'orange',
    },
  ]

  const colorVariants = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            const bgColor = colorVariants[action.color] || colorVariants.blue

            return (
              <Link
                key={action.href}
                to={action.href}
                className={`flex items-center gap-3 px-4 py-3 ${bgColor} text-white rounded-lg transition-colors group`}
              >
                <div className="p-2 bg-white/20 rounded-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
                <Plus className="h-4 w-4 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}