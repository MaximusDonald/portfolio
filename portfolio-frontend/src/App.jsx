import { ThemeProvider } from './theme/ThemeProvider'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Input,
  Badge,
  ThemeToggle,
  ThemeSwitch
} from './components/ui'

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header avec toggle */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Design System
        </h1>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <ThemeSwitch />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Section Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Boutons</CardTitle>
            <CardDescription>Différents variants et tailles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button isLoading>Chargement...</Button>
              <Button disabled>Désactivé</Button>
            </div>
          </CardContent>
        </Card>

        {/* Section Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Labels colorés pour statuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Par défaut</Badge>
              <Badge variant="success">Succès</Badge>
              <Badge variant="warning">Avertissement</Badge>
              <Badge variant="error">Erreur</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Section Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Champs de formulaire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Nom complet"
              placeholder="John Doe"
              helperText="Entrez votre nom complet"
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              error="Le mot de passe doit contenir au moins 8 caractères"
            />
            <Input
              label="Champ désactivé"
              disabled
              value="Non modifiable"
            />
          </CardContent>
        </Card>

        {/* Section Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Palette de couleurs</CardTitle>
            <CardDescription>Couleurs primaires et sémantiques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                <div key={shade} className="text-center">
                  <div 
                    className={`h-16 rounded-lg mb-2 bg-primary-${shade}`}
                    style={{ backgroundColor: `var(--color-primary-${shade})` }}
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">{shade}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App