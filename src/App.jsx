import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function App() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'bug',
    email: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/.netlify/functions/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: `✨ Issue créée avec succès ! Numéro: #${data.number}`
        });
        setFormData({ title: '', description: '', type: 'bug', email: '' });
      } else {
        throw new Error(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="text-6xl mb-2">🚀</div>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Space Conquest
            </h1>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Mission Control
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transmettez vos rapports de mission : bugs, suggestions d'amélioration ou nouvelles fonctionnalités pour conquérir l'espace !
            </p>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-card/50 border border-border rounded-2xl p-8 shadow-2xl glow-primary">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-foreground">Type de transmission</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  className="grid grid-cols-3 gap-4"
                >
                  <label htmlFor="bug" className="cursor-pointer">
                    <div className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                      formData.type === 'bug' 
                        ? 'border-destructive bg-destructive/10 shadow-lg shadow-destructive/20' 
                        : 'border-border hover:border-destructive/50 bg-card/30'
                    }`}>
                      <RadioGroupItem value="bug" id="bug" className="sr-only" />
                      <div className="text-center">
                        <div className="text-3xl mb-2">🐛</div>
                        <div className="font-semibold text-foreground">Bug</div>
                        <div className="text-xs text-muted-foreground mt-1">Anomalie détectée</div>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="feature" className="cursor-pointer">
                    <div className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                      formData.type === 'feature' 
                        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20' 
                        : 'border-border hover:border-accent/50 bg-card/30'
                    }`}>
                      <RadioGroupItem value="feature" id="feature" className="sr-only" />
                      <div className="text-center">
                        <div className="text-3xl mb-2">✨</div>
                        <div className="font-semibold text-foreground">Feature</div>
                        <div className="text-xs text-muted-foreground mt-1">Nouvelle technologie</div>
                      </div>
                    </div>
                  </label>

                  <label htmlFor="improvement" className="cursor-pointer">
                    <div className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                      formData.type === 'improvement' 
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                        : 'border-border hover:border-primary/50 bg-card/30'
                    }`}>
                      <RadioGroupItem value="improvement" id="improvement" className="sr-only" />
                      <div className="text-center">
                        <div className="text-3xl mb-2">🚀</div>
                        <div className="font-semibold text-foreground">Amélioration</div>
                        <div className="text-xs text-muted-foreground mt-1">Optimisation système</div>
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold text-foreground">Code de mission *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Résumé concis de votre transmission..."
                  required
                  className="bg-card/50 border-border focus:border-primary transition-all duration-300"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold text-foreground">Rapport détaillé *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez en détail votre observation : contexte, étapes de reproduction, comportement attendu vs réel, ou votre suggestion d'amélioration..."
                  className="min-h-[200px] bg-card/50 border-border focus:border-primary transition-all duration-300"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold text-foreground">Canal de communication</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com (optionnel)"
                  className="bg-card/50 border-border focus:border-accent transition-all duration-300"
                />
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>🔒</span>
                  <span>Votre email reste privé et ne sera jamais publié sur GitHub</span>
                </p>
              </div>

              {/* Status Message */}
              {status.message && (
                <Alert 
                  variant={status.type === 'error' ? 'destructive' : 'default'}
                  className={`border-2 ${
                    status.type === 'error' 
                      ? 'bg-destructive/10 border-destructive' 
                      : 'bg-accent/10 border-accent'
                  }`}
                >
                  <AlertDescription className="text-base">{status.message}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <span className="animate-spin">⚙️</span>
                    <span>Transmission en cours...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <span>📡</span>
                    <span>Envoyer la transmission</span>
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-muted-foreground">
            <p className="text-sm">
              Propulsé par <span className="text-primary font-semibold">GitHub Issues</span> • 
              Toutes les transmissions sont publiques sur le repository
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
