import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Wand2, Loader2, Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Link2, Image, Video, Upload, Table, Sparkles, ImagePlus, FileText, Film, Images, X, Eye, Heart, MessageCircle, Share2, User
} from "lucide-react";
import { SocialPreview } from "./SocialPreview";

export interface EditorField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'upload-image' | 'upload-video' | 'tags';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  maxSize?: number;
}

interface UniversalAIEditorProps {
  fields: EditorField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  contentFieldName?: string;
  onAIGenerate?: () => void;
  storageFolder?: string;
}

type GenerationOption = 'text_only' | 'with_image' | 'with_video' | 'with_video_image' | 'with_multiple_images';

export const UniversalAIEditor = ({
  fields,
  values,
  onChange,
  contentFieldName = 'content',
  storageFolder = 'news-media'
}: UniversalAIEditorProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const generationOptions: { value: GenerationOption; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'text_only', label: 'Texte uniquement', icon: <FileText className="h-8 w-8" />, description: 'Publication textuelle professionnelle sans média' },
    { value: 'with_image', label: 'Avec image IA', icon: <ImagePlus className="h-8 w-8" />, description: 'Image unique ultra-réaliste générée par l\'IA' },
    { value: 'with_multiple_images', label: 'Galerie d\'images IA', icon: <Images className="h-8 w-8" />, description: 'Carrousel d\'images thématiques cohérentes' },
    { value: 'with_video', label: 'Avec vidéo IA', icon: <Film className="h-8 w-8" />, description: 'Vidéo courte dynamique générée par l\'IA' },
    { value: 'with_video_image', label: 'Vidéo + Image IA', icon: <Video className="h-8 w-8" />, description: 'Image de couverture + vidéo complémentaire' },
  ];

  const handleGenerateClick = () => {
    const content = values[contentFieldName];
    if (!content || content.trim().length < 1) {
      toast({ title: "Contenu requis", description: "Écrivez au moins un mot ou une idée pour générer avec l'IA", variant: "destructive" });
      return;
    }
    setShowPopup(true);
  };

  const generateContent = async (option: GenerationOption) => {
    setShowPopup(false);
    setGenerating(true);
    const content = values[contentFieldName] || '';
    
    try {
      const { data, error } = await supabase.functions.invoke('miprojet-assistant', {
        body: {
          action: 'generate_universal_content',
          content,
          content_type: 'article',
          fields: fields.map(f => ({ name: f.name, type: f.type, options: f.options }))
        }
      });

      if (error) throw error;

      if (data) {
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined && data[key] !== null) {
            onChange(key, data[key]);
          }
        });
        toast({ title: "✨ Contenu généré avec succès", description: "Tous les champs ont été remplis automatiquement" });
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      generateLocally();
    } finally {
      setGenerating(false);
    }

    if (option === 'with_image' || option === 'with_multiple_images' || option === 'with_video_image') {
      await generateAIImage(content);
    }
  };

  const generateAIImage = async (topic: string) => {
    setGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('miprojet-assistant', {
        body: { action: 'generate_image', topic, content: topic }
      });
      
      if (!error && data?.image_url) {
        const imageField = fields.find(f => f.type === 'upload-image');
        if (imageField) {
          onChange(imageField.name, data.image_url);
        } else if (fields.find(f => f.name === 'image_url')) {
          onChange('image_url', data.image_url);
        }
        toast({ title: "🖼️ Image IA générée", description: "Image professionnelle ajoutée" });
      }
    } catch (e) {
      console.error("Image generation error:", e);
      toast({ title: "Info", description: "Image non générée, uploadez manuellement", variant: "default" });
    } finally {
      setGeneratingImage(false);
    }
  };

  const generateLocally = () => {
    const content = values[contentFieldName] || '';
    const lines = content.split('\n').filter((l: string) => l.trim());
    const generatedTitle = lines[0]?.substring(0, 80).toUpperCase() || "CONTENU MIPROJET";
    const generatedExcerpt = content.substring(0, 200) + (content.length > 200 ? "..." : "");
    
    const contentLower = content.toLowerCase();
    let detectedCategory = "general";
    if (contentLower.includes("formation") || contentLower.includes("atelier")) detectedCategory = "training";
    else if (contentLower.includes("financement") || contentLower.includes("investissement")) detectedCategory = "funding";
    else if (contentLower.includes("partenariat")) detectedCategory = "partnerships";
    else if (contentLower.includes("opportunité") || contentLower.includes("appel")) detectedCategory = "opportunities";
    else if (contentLower.includes("projet")) detectedCategory = "projects";
    else if (contentLower.includes("événement")) detectedCategory = "events";

    const hashtags = ["#MIPROJET", "#Entrepreneuriat", "#Afrique"];
    const paragraphs = content.split('\n\n').filter((p: string) => p.trim());
    let formattedContent = `🚀 ${generatedTitle}\n\n`;
    paragraphs.forEach((p: string, i: number) => {
      if (i === 0) formattedContent += `${p}\n\n`;
      else if (p.includes(':') || p.length < 50) formattedContent += `📌 ${p.toUpperCase()}\n\n`;
      else formattedContent += `${p}\n\n`;
    });
    formattedContent += `\n📧 CONTACT\nMIPROJET | infos@ivoireprojet.com | +225 07 16 79 21\n\n${hashtags.join(' ')}`;
    
    if (fields.find(f => f.name === 'title')) onChange('title', generatedTitle);
    if (fields.find(f => f.name === 'excerpt')) onChange('excerpt', generatedExcerpt);
    if (fields.find(f => f.name === 'category')) onChange('category', detectedCategory);
    onChange(contentFieldName, formattedContent);
    toast({ title: "✅ Contenu structuré", description: "Génération locale réussie" });
  };

  const handleFileUpload = async (fieldName: string, file: File, maxSize: number, type: 'image' | 'video') => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: `Maximum ${maxSize} Mo`, variant: "destructive" });
      return;
    }
    setUploading(fieldName);
    try {
      const fileName = `${storageFolder}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { error } = await supabase.storage.from(storageFolder).upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(storageFolder).getPublicUrl(fileName);
      onChange(fieldName, urlData.publicUrl);
      toast({ title: "✅ Upload réussi" });
    } catch (error: any) {
      toast({ title: "Erreur d'upload", description: "Réessayez", variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const insertFormat = (before: string, after: string = "") => {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = values[contentFieldName] || '';
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    onChange(contentFieldName, newContent);
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + before.length, end + before.length); }, 10);
  };

  const renderField = (field: EditorField) => {
    const value = values[field.name] || '';
    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label} {field.required && '*'}</Label>
            <Input id={field.name} value={value} onChange={(e) => onChange(field.name, e.target.value)} placeholder={field.placeholder} required={field.required} />
          </div>
        );
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Select value={value} onValueChange={(v) => onChange(field.name, v)}>
              <SelectTrigger><SelectValue placeholder={field.placeholder || "Sélectionnez..."} /></SelectTrigger>
              <SelectContent>
                {field.options?.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'upload-image':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="flex items-center gap-2"><Image className="h-4 w-4" />{field.label} (max {field.maxSize || 20} Mo)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input type="file" accept="image/*" disabled={uploading === field.name}
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(field.name, file, field.maxSize || 20, 'image'); }}
                  className="flex-1" />
                <Button type="button" variant="outline" size="sm" onClick={() => generateAIImage(values[contentFieldName] || values['title'] || 'business')} disabled={generatingImage}>
                  {generatingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
              {value && <img src={value} alt="Aperçu" className="h-24 w-auto object-cover rounded border" />}
              {uploading === field.name && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Téléchargement...</div>}
            </div>
          </div>
        );
      case 'upload-video':
        return (
          <div key={field.name} className="space-y-2">
            <Label className="flex items-center gap-2"><Video className="h-4 w-4" />{field.label} (max {field.maxSize || 500} Mo)</Label>
            <Input type="file" accept="video/*" disabled={uploading === field.name}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(field.name, file, field.maxSize || 500, 'video'); }} />
            {value && <video src={value} className="h-24 w-auto rounded border" controls />}
          </div>
        );
      case 'tags':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Input value={value} onChange={(e) => onChange(field.name, e.target.value)} placeholder="#tag1 #tag2 #tag3" />
          </div>
        );
      default:
        return null;
    }
  };

  const contentField = fields.find(f => f.name === contentFieldName);
  const otherFields = fields.filter(f => f.name !== contentFieldName && f.type !== 'textarea');
  const excerptField = fields.find(f => f.name === 'excerpt');

  // Render content as rich preview (no HTML/markdown visible)
  const renderRichPreview = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={i} />;
      // Detect hashtags
      const parts = trimmed.split(/(#\w+)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('#')) return <span key={j} className="text-primary font-semibold">{part}</span>;
        // Detect bold **text**
        const boldParts = part.split(/\*\*(.*?)\*\*/g);
        if (boldParts.length > 1) {
          return boldParts.map((bp, k) => k % 2 === 1 ? <strong key={k}>{bp}</strong> : <span key={k}>{bp}</span>);
        }
        return part;
      });
      // Emoji headers
      if (/^[🚀📌🎯✅💡📊💰🌍📧🔹▸]/.test(trimmed)) {
        return <p key={i} className="font-bold text-foreground mt-3 mb-1">{rendered}</p>;
      }
      return <p key={i} className="text-foreground/90 leading-relaxed">{rendered}</p>;
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Generation Popup */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Format de publication
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {generationOptions.map((option) => (
              <button key={option.value} onClick={() => generateContent(option.value)}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group">
                <div className="p-3 rounded-lg bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors">
                  {option.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Social Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Aperçu publication</DialogTitle>
          </DialogHeader>
          <SocialPreview
            title={values['title'] || ''}
            content={values[contentFieldName] || ''}
            imageUrl={values['image_url'] || ''}
            videoUrl={values['video_url'] || ''}
          />
        </DialogContent>
      </Dialog>

      {/* AI Generation Bar */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">🤖 Éditeur IA Avancé</p>
                <p className="text-sm text-muted-foreground">Un mot, une idée — l'IA génère tout automatiquement</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                <Eye className="h-4 w-4 mr-1" />Aperçu
              </Button>
              <Button type="button" onClick={handleGenerateClick} disabled={generating || generatingImage} size="lg" className="min-w-[160px]">
                {generating ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Génération...</>
                  : generatingImage ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Image IA...</>
                  : <><Wand2 className="h-5 w-5 mr-2" />Générer</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fields grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {otherFields.map(field => renderField(field))}
      </div>

      {/* Excerpt */}
      {excerptField && (
        <div className="space-y-2">
          <Label>{excerptField.label}</Label>
          <Textarea value={values[excerptField.name] || ''} onChange={(e) => onChange(excerptField.name, e.target.value)} rows={2} placeholder="Sera généré automatiquement..." />
        </div>
      )}

      {/* Content Editor with WYSIWYG toolbar */}
      {contentField && (
        <div className="space-y-2">
          <Label className="text-lg font-semibold">{contentField.label} *</Label>
          <div className="flex flex-wrap gap-1 p-3 bg-muted/50 rounded-t-lg border border-b-0">
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat("**", "**")} title="Gras"><Bold className="h-4 w-4" /></Toggle>
              <Toggle size="sm" onClick={() => insertFormat("_", "_")} title="Italique"><Italic className="h-4 w-4" /></Toggle>
            </div>
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat("\n\n📌 ", "\n")} title="Titre"><Heading1 className="h-4 w-4" /></Toggle>
              <Toggle size="sm" onClick={() => insertFormat("\n\n🔹 ", "\n")} title="Sous-titre"><Heading2 className="h-4 w-4" /></Toggle>
              <Toggle size="sm" onClick={() => insertFormat("\n\n▸ ", "")} title="Titre 3"><Heading3 className="h-4 w-4" /></Toggle>
            </div>
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat("\n• ", "")} title="Liste"><List className="h-4 w-4" /></Toggle>
              <Toggle size="sm" onClick={() => insertFormat("\n1. ", "")} title="Liste numérotée"><ListOrdered className="h-4 w-4" /></Toggle>
            </div>
            <div className="flex gap-1 border-r pr-2 mr-2">
              <Toggle size="sm" onClick={() => insertFormat('\n\n"', '"\n')} title="Citation"><Quote className="h-4 w-4" /></Toggle>
              <Toggle size="sm" onClick={() => insertFormat("[", "](lien)")} title="Lien"><Link2 className="h-4 w-4" /></Toggle>
            </div>
            <div className="flex gap-1">
              <Toggle size="sm" onClick={() => insertFormat("\n\n| Col 1 | Col 2 |\n|-------|-------|\n| ", " |  |\n")} title="Tableau"><Table className="h-4 w-4" /></Toggle>
            </div>
          </div>
          <Textarea
            ref={contentRef}
            value={values[contentFieldName] || ''}
            onChange={(e) => onChange(contentFieldName, e.target.value)}
            rows={16}
            required={contentField.required}
            placeholder="✍️ Écrivez un mot, une idée, un texte complet... L'IA génère tout ! 🪄"
            className="rounded-t-none font-sans text-sm leading-relaxed min-h-[400px]"
          />
          <p className="text-xs text-muted-foreground">💡 Même un seul mot suffit ! L'IA génère un contenu professionnel complet.</p>
        </div>
      )}

      {/* Rich Preview */}
      {values[contentFieldName] && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Aperçu du rendu</span>
            </div>
            <div className="prose prose-sm max-w-none space-y-1">
              {renderRichPreview(values[contentFieldName])}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
