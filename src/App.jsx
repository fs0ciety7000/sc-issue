import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
          message: `✅ Issue #${data.number} créée avec succès !`
        });
        setFormData({ title: '', description: '', type: 'bug', email: '' });
      } else {
        throw new Error(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: `❌ ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const typeConfig = {
    bug: { icon: '🐛', label: 'Bug', desc: 'Signaler un problème', color: 'text-red-600' },
    feature: { icon: '✨', label: 'Feature', desc: 'Nouvelle fonctionnalité', color: 'text-blue-600' },
    improvement: { icon: '🚀', label: 'Amélioration', desc: 'Optimisation', color: 'text-green-600' }
  };

  return (
    <div className="min-h-screen relative">
      {/* Decorative gradient orbs */}
      <div className="gradient-orb w-96 h-96 bg-green-400 top-20 -left-48" />
      <div className="gradient-orb w-80 h-80 bg-blue-400 bottom-20 -right-40" style={{ animationDelay: '5s' }} />
      <div className="gradient-orb w-72 h-72 bg-purple-400 top-1/2 left-1/2" style={{ animationDelay: '10s' }} />

      <div className="container max-w-5xl mx-auto py-16 px-4 relative z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform">
              <span className="text-3xl">🚀</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Space Conquest
          </h1>
          <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            ToDO System
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Contribuez à l'amélioration du projet en signalant des bugs, en proposant des fonctionnalités ou des optimisations.
          </p>
        </header>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-8 md:p-12 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Type Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Type de contribution</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {Object.entries(typeConfig).map(([type, config]) => (
                  <label key={type} htmlFor={type} className="cursor-pointer group">
                    <div className={`relative rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                      formData.type === type
                        ? 'border-primary bg-green-50 shadow-md'
                        : 'border-border bg-white hover:border-primary/50'
                    }`}>
                      <RadioGroupItem value={type} id={type} className="sr-only" />
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl ${config.color} group-hover:scale-110 transition-transform`}>
                          {config.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-base mb-1">{config.label}</div>
                          <div className="text-sm text-muted-foreground">{config.desc}</div>
                        </div>
                      </div>
                      {formData.type === type && (
                        <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold">
                Titre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Correction du calcul de trajectoire"
                required
                className="h-12 text-base"
              />
            </div>

            {/* Description with Markdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  📝 Markdown supporté
                </span>
              </div>
              
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-11">
                  <TabsTrigger value="write" className="text-sm">✏️ Écrire</TabsTrigger>
                  <TabsTrigger value="preview" className="text-sm">👁️ Aperçu</TabsTrigger>
                </TabsList>
                
                <TabsContent value="write" className="mt-3">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez en détail votre observation...\n\n**Markdown disponible:**\n- **gras** et *italique*\n- Listes à puces\n- `code inline`\n- ```code blocks```\n- [liens](url)\n- > citations\n- Tableaux\n- Et plus encore !"
                    className="min-h-[280px] font-mono text-sm leading-relaxed"
                    required
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-3">
                  <div className="min-h-[280px] rounded-lg border-2 border-dashed border-border bg-accent/30 px-4 py-3 overflow-auto">
                    {formData.description ? (
                      <div className="markdown-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.description}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">👁️ Rien à prévisualiser pour le moment</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-semibold">
                Email <span className="text-muted-foreground font-normal">(optionnel)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>🔒</span>
                <span>Votre email reste privé et ne sera jamais publié publiquement</span>
              </p>
            </div>

            {/* Status */}
            {status.message && (
              <Alert 
                variant={status.type === 'error' ? 'destructive' : 'default'}
                className={status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}
              >
                <AlertDescription className="text-base font-medium">{status.message}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⌛</span>
                  <span>Envoi en cours...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>🚀</span>
                  <span>Soumettre la contribution</span>
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-border/50">
            <span className="text-sm text-muted-foreground">Propulsé par</span>
            <span className="font-semibold text-foreground">GitHub Issues</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Open Source</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
