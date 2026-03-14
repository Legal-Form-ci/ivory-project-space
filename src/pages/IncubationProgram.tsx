import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Target, Users, TrendingUp, Shield, BookOpen, DollarSign,
  CheckCircle2, ArrowRight, Building2, Briefcase, Globe,
  BarChart3, Heart, Lightbulb, Phone, Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const IncubationProgram = () => {
  useEffect(() => {
    document.title = "Programme d'Incubation | MIPROJET";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 text-sm px-4 py-1" variant="secondary">Entrepreneuriat Jeune</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-foreground">
            Programme d'Incubation<br />
            <span className="text-primary">de Projets Entrepreneuriaux</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Modèle Hybride : Coopérative & SARL — Financement • Formation • Accompagnement
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-3 text-primary font-bold text-lg">
            <DollarSign className="h-5 w-5" />
            78% des fonds directement aux porteurs de projets
          </div>
        </div>
      </section>

      {/* Contexte */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-destructive">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Target className="h-5 w-5 text-destructive" />Contexte</h3>
                <p className="text-muted-foreground text-sm">De nombreux porteurs de projets prometteurs n'accèdent pas aux financements disponibles par manque de structuration, de garanties ou de compétences en montage de dossiers.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" />Objectif</h3>
                <p className="text-muted-foreground text-sm">Créer un pont entre les subventions disponibles et les porteurs de projets en leur offrant formation, structuration et financement dans un modèle transparent et éthique.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-success">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Shield className="h-5 w-5 text-success" />Solution</h3>
                <p className="text-muted-foreground text-sm">Modèle hybride : MIPROJET COOP capte les subventions et sélectionne les bénéficiaires, MIPROJET SARL facture ses services d'accompagnement professionnel.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fonctionnement */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Fonctionnement</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { step: "1", text: "MIPROJET négocie des subventions auprès de bailleurs", icon: Building2 },
              { step: "2", text: "Lancement d'appels à projets pour recruter des groupements (3+ personnes)", icon: Users },
              { step: "3", text: "Formation intensive de 10 semaines + structuration complète", icon: BookOpen },
              { step: "4", text: "Financement direct par tranches + accompagnement sur 12-24 mois", icon: DollarSign },
              { step: "5", text: "Suivi, mentorat et reporting transparent aux bailleurs", icon: BarChart3 },
            ].map(({ step, text, icon: Icon }) => (
              <div key={step} className="flex items-start gap-4 bg-card rounded-lg p-4 border">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{step}</div>
                <div className="flex items-center gap-3 flex-1">
                  <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Architecture Stratégique</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-primary/30">
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-1 text-primary">MIPROJET COOP</h3>
                <p className="text-sm text-muted-foreground mb-4">Structure porteuse du programme</p>
                <ul className="space-y-2">
                  {["Réception subvention", "Sélection bénéficiaires", "Décaissement fonds", "Reporting bailleurs"].map(m => (
                    <li key={m} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" />{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent/30">
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-1 text-accent-foreground">MIPROJET SARL</h3>
                <p className="text-sm text-muted-foreground mb-4">Prestataire technique officiel</p>
                <ul className="space-y-2">
                  {["Formation intensive", "Suivi et mentorat", "Structuration projets", "Reporting technique"].map(m => (
                    <li key={m} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" />{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Programmes d'Incubation</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Jeunes Entrepreneurs", subtitle: "Climat & Agriculture | Digital & Numérique", target: "Jeunes porteurs de projets agricoles, climatiques et numériques", icon: Globe, color: "text-success" },
              { title: "Femmes & Autonomisation", subtitle: "Entrepreneuriat féminin", target: "Groupements de femmes entrepreneures", icon: Heart, color: "text-destructive" },
              { title: "Incubateur Associations & OSC", subtitle: "Société civile", target: "Associations et OSC", icon: Briefcase, color: "text-primary" },
            ].map(p => (
              <Card key={p.title} className="text-center">
                <CardContent className="pt-6 space-y-3">
                  <p.icon className={`h-10 w-10 mx-auto ${p.color}`} />
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                  <Badge variant="outline">{p.target}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Budget */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Structure Budgétaire</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="bg-primary/5 border-primary/20 text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-primary">78%</p>
                  <p className="text-sm text-muted-foreground mt-1">Financement direct projets</p>
                </CardContent>
              </Card>
              <Card className="bg-accent/5 border-accent/20 text-center">
                <CardContent className="pt-6">
                  <p className="text-4xl font-bold text-foreground">22%</p>
                  <p className="text-sm text-muted-foreground mt-1">Prestations MIPROJET</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Répartition détaillée (exemple sur 100 000 000 FCFA)</h3>
                <div className="space-y-3">
                  {[
                    { poste: "Frais de gestion", pct: "4,5%", montant: "4 500 000" },
                    { poste: "Budget formation", pct: "9%", montant: "9 000 000" },
                    { poste: "Budget suivi-évaluation", pct: "6%", montant: "6 000 000" },
                    { poste: "Budget coordination", pct: "1,5%", montant: "1 500 000" },
                    { poste: "Budget audit", pct: "1%", montant: "1 000 000" },
                  ].map(r => (
                    <div key={r.poste} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm">{r.poste}</span>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{r.pct}</Badge>
                        <span className="text-sm font-medium w-28 text-right">{r.montant} FCFA</span>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-bold">
                    <span>Total prestations MIPROJET</span>
                    <span className="text-primary">22 000 000 FCFA (22%)</span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span>Financement direct projets</span>
                    <span className="text-success">78 000 000 FCFA (78%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Avantages du Modèle</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Juridiques", items: ["COOP éligible subventions", "SARL facture légalement", "Rôles clairement séparés", "Conformité totale"], icon: Shield },
              { title: "Financiers", items: ["Transparence budgétaire", "Traçabilité des fonds", "Facturation professionnelle", "Rentabilité via prestations"], icon: DollarSign },
              { title: "Opérationnels", items: ["Expertise concentrée SARL", "Gouvernance simplifiée", "Modèle réplicable", "Professionnalisation"], icon: TrendingUp },
              { title: "Stratégiques", items: ["Crédibilité bailleurs", "Diversification revenus", "Positionnement unique", "Impact mesurable"], icon: Target },
            ].map(a => (
              <Card key={a.title}>
                <CardContent className="pt-6">
                  <a.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold mb-3">{a.title}</h3>
                  <ul className="space-y-1.5">
                    {a.items.map(i => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />{i}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Bénéfices pour tous</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Porteurs de projets", items: ["Accès financement sans garanties", "Formation gratuite complète", "Accompagnement professionnel"] },
              { title: "Bailleurs de fonds", items: ["Impact maximisé", "Transparence totale", "Projets viables et durables"] },
              { title: "Société", items: ["Création d'emplois", "Développement économique local", "Réduction de la pauvreté"] },
              { title: "MIPROJET", items: ["Positionnement unique", "Diversification revenus", "Mission sociale renforcée"] },
            ].map(b => (
              <Card key={b.title} className="bg-primary/5 border-primary/10">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-primary mb-3">✓ {b.title}</h3>
                  <ul className="space-y-1.5">
                    {b.items.map(i => <li key={i} className="text-sm text-muted-foreground">{i}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prochaines étapes */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Prochaines Étapes</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { phase: "Court terme", period: "1-3 mois", actions: "Validation modèle • Formalisation COOP • Convention cadre" },
              { phase: "Moyen terme", period: "3-6 mois", actions: "Dépôt candidatures • Structuration équipe • Modules formation" },
              { phase: "Long terme", period: "6-12 mois", actions: "Lancement pilote • Accompagnement cohorte • Ajustements" },
            ].map(e => (
              <Card key={e.phase}>
                <CardContent className="pt-6 text-center">
                  <Badge className="mb-2">{e.period}</Badge>
                  <h3 className="font-bold text-lg mb-2">{e.phase}</h3>
                  <p className="text-sm text-muted-foreground">{e.actions}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8 space-y-4">
              <h2 className="text-2xl font-bold">Rejoignez le programme</h2>
              <p className="text-muted-foreground">Un modèle qui combine mission sociale et expertise technique, garantissant transparence, traçabilité et impact maximum.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" variant="hero">
                  <Link to="/submit-project"><ArrowRight className="h-4 w-4 mr-2" />Soumettre un projet</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="https://wa.me/2250707167921" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4 mr-2" />+225 07 07 16 79 21
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Mail className="h-3 w-3" />contact@miprojet.com
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IncubationProgram;
