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
          message: `Issue #${data.number} créée avec succès`
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
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Space Conquest</h1>
              <p className="text-sm text-muted-foreground">ToDO System</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Signalez des bugs, proposez des améliorations ou soumettez de nouvelles fonctionnalités pour le projet Space Conquest.
          </p>
        </header>

        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                className="grid grid-cols-3 gap-3"
              >
                <label htmlFor="bug" className="cursor-pointer">
                  <div className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    formData.type === 'bug'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}>
                    <RadioGroupItem value="bug" id="bug" />
                    <div>
                      <div className="font-medium">Bug</div>
                      <div className="text-xs text-muted-foreground">Signaler un problème</div>
                    </div>
                  </div>
                </label>

                <label htmlFor="feature" className="cursor-pointer">
                  <div className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    formData.type === 'feature'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}>
                    <RadioGroupItem value="feature" id="feature" />
                    <div>
                      <div className="font-medium">Feature</div>
                      <div className="text-xs text-muted-foreground">Nouvelle fonctionnalité</div>
                    </div>
                  </div>
                </label>

                <label htmlFor="improvement" className="cursor-pointer">
                  <div className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    formData.type === 'improvement'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}>
                    <RadioGroupItem value="improvement" id="improvement" />
                    <div>
                      <div className="font-medium">Amélioration</div>
                      <div className="text-xs text-muted-foreground">Optimisation</div>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Résumé concis du problème ou de la suggestion"
                required
                className="h-11"
              />
            </div>

            {/* Description with Markdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <span className="text-xs text-muted-foreground">Markdown supporté</span>
              </div>
              
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">Écrire</TabsTrigger>
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                </TabsList>
                
                <TabsContent value="write" className="mt-2">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez en détail...\n\nVous pouvez utiliser Markdown :\n- **gras** et *italique*\n- Listes à puces\n- `code`\n- [liens](url)\n- etc."
                    className="min-h-[240px] font-mono text-sm"
                    required
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-2">
                  <div className="min-h-[240px] rounded-md border border-input bg-background px-3 py-2 overflow-auto">
                    {formData.description ? (
                      <div className="markdown-preview">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.description}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Rien à prévisualiser</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (optionnel)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="votre@email.com"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Pour recevoir des notifications. Votre email ne sera pas publié.
              </p>
            </div>

            {/* Status */}
            {status.message && (
              <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-11"
            >
              {isLoading ? 'Envoi en cours...' : 'Soumettre'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Propulsé par GitHub Issues • Toutes les soumissions sont publiques</p>
        </footer>
      </div>
    </div>
  );
}
