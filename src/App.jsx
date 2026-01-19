import { useState, useEffect } from 'react';
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

  // Generate random stars
  useEffect(() => {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.width = `${Math.random() * 3}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }

    return () => starsContainer.remove();
  }, []);

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
          message: `Issue #${data.number} créée avec succès !`
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
    <div className="min-h-screen relative bg-black">
      {/* Animated grid background */}
      <div className="fixed inset-0 grid-bg opacity-30 z-0" />

      {/* Glowing orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-block">
              <div className="text-8xl animate-bounce" style={{ animationDuration: '3s' }}>🚀</div>
            </div>
            
            <h1 className="text-7xl font-black mb-4 tracking-tight">
              <span className="neon-primary" style={{ color: 'hsl(var(--color-primary))' }}>SPACE</span>
              {' '}
              <span className="neon-accent" style={{ color: 'hsl(var(--color-accent))' }}>CONQUEST</span>
            </h1>
            
            <div className="inline-block px-6 py-2 border-2 border-secondary rounded-full mb-6">
              <h2 className="text-2xl font-bold neon-secondary" style={{ color: 'hsl(var(--color-secondary))' }}>
                ToDO System
              </h2>
            </div>

            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Système de gestion des missions spatiales.<br/>
              Signalez bugs, proposez des améliorations ou de nouvelles fonctionnalités.
            </p>
          </div>

          {/* Form Card */}
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl blur-xl opacity-50 animate-pulse" />
            
            <div className="relative bg-card border-2 border-primary/50 rounded-2xl p-10 glow-box">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Type Selection */}
                <div className="space-y-4">
                  <Label className="text-xl font-bold uppercase tracking-wider" style={{ color: 'hsl(var(--color-accent))' }}>
                    ⚡ Type de Mission
                  </Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <label htmlFor="bug" className="cursor-pointer group">
                      <div className={`relative border-2 rounded-xl p-6 transition-all duration-300 ${
                        formData.type === 'bug' 
                          ? 'border-destructive bg-destructive/20 shadow-[0_0_30px_rgba(255,0,100,0.5)]' 
                          : 'border-border hover:border-destructive bg-card/50'
                      }`}>
                        <RadioGroupItem value="bug" id="bug" className="sr-only" />
                        <div className="text-center">
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🐛</div>
                          <div className="font-bold text-xl mb-1">BUG</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Anomalie Détectée</div>
                        </div>
                      </div>
                    </label>

                    <label htmlFor="feature" className="cursor-pointer group">
                      <div className={`relative border-2 rounded-xl p-6 transition-all duration-300 ${
                        formData.type === 'feature' 
                          ? 'border-accent bg-accent/20 shadow-[0_0_30px_rgba(0,255,255,0.5)]' 
                          : 'border-border hover:border-accent bg-card/50'
                      }`}>
                        <RadioGroupItem value="feature" id="feature" className="sr-only" />
                        <div className="text-center">
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                          <div className="font-bold text-xl mb-1">FEATURE</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Nouvelle Tech</div>
                        </div>
                      </div>
                    </label>

                    <label htmlFor="improvement" className="cursor-pointer group">
                      <div className={`relative border-2 rounded-xl p-6 transition-all duration-300 ${
                        formData.type === 'improvement' 
                          ? 'border-primary bg-primary/20 shadow-[0_0_30px_rgba(200,0,255,0.5)]' 
                          : 'border-border hover:border-primary bg-card/50'
                      }`}>
                        <RadioGroupItem value="improvement" id="improvement" className="sr-only" />
                        <div className="text-center">
                          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🚀</div>
                          <div className="font-bold text-xl mb-1">UPGRADE</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Optimisation</div>
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-xl font-bold uppercase tracking-wider" style={{ color: 'hsl(var(--color-primary))' }}>
                    📡 Titre de la Mission *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Correction du système de navigation"
                    required
                    className="h-14 text-lg bg-input border-2 border-border focus:border-primary focus:shadow-[0_0_20px_rgba(200,0,255,0.3)] transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-xl font-bold uppercase tracking-wider" style={{ color: 'hsl(var(--color-accent))' }}>
                    📝 Rapport Détaillé *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez en détail votre observation, les étapes de reproduction, ou votre suggestion..."
                    className="min-h-[240px] text-lg bg-input border-2 border-border focus:border-accent focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all resize-none"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-xl font-bold uppercase tracking-wider" style={{ color: 'hsl(var(--color-secondary))' }}>
                    📬 Contact (Optionnel)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.space"
                    className="h-14 text-lg bg-input border-2 border-border focus:border-secondary focus:shadow-[0_0_20px_rgba(255,0,150,0.3)] transition-all"
                  />
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                    <span className="text-lg">🔒</span>
                    <span>Votre email reste privé et ne sera jamais publié</span>
                  </p>
                </div>

                {/* Status */}
                {status.message && (
                  <Alert 
                    variant={status.type === 'error' ? 'destructive' : 'default'}
                    className={`border-2 text-lg ${
                      status.type === 'error' 
                        ? 'bg-destructive/20 border-destructive shadow-[0_0_20px_rgba(255,0,100,0.4)]' 
                        : 'bg-accent/20 border-accent shadow-[0_0_20px_rgba(0,255,255,0.4)]'
                    }`}
                  >
                    <AlertDescription className="font-semibold">{status.message}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-16 text-xl font-black uppercase tracking-widest bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-[0_0_40px_rgba(200,0,255,0.8)] transition-all duration-300 transform hover:scale-[1.02] border-2 border-primary/50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <span className="animate-spin text-2xl">⚙️</span>
                      <span>TRANSMISSION...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">🛸</span>
                      <span>LANCER LA MISSION</span>
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 space-y-4">
            <div className="inline-flex items-center gap-4 px-6 py-3 border border-primary/30 rounded-full bg-card/30">
              <span className="text-sm text-muted-foreground">Propulsé par</span>
              <span className="font-bold" style={{ color: 'hsl(var(--color-primary))' }}>GitHub Issues</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Transmissions publiques</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
