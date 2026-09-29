import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { portfolio as p } from "@/data/portfolio";
import { warnPlaceholders } from "@/lib/placeholders";
import { existingDocument } from "@/lib/documents";
import { Header } from "./header";
import { Footer } from "./footer";
import { Reveal } from "./reveal";
import { Button, LabelBadge, StatusBadge } from "./casebook-primitives";
import { AvailabilityDeployment, CasebookLibrary, ClaimsCapabilities, ClaimsWorkflow, ContactSection, FieldReadiness, LicensesCertifications, Performance, ProfessionalDocuments, ProfessionalProfile, QualityAccuracy, SampleLibrary, TechnologySection } from "./casebook-sections";
export default function Portfolio() {
  warnPlaceholders(p);
  const resume = existingDocument(p.profile.resumeFile);
  return <><a className="skip-link button button-primary" href="#main-content">{p.ui.skip}</a><Header navigation={p.navigation} profile={p.profile} ui={p.ui} /><main id="main-content"><div id="top" /><section id="overview" className="hero shell" aria-labelledby="hero-title"><div className="hero-main"><div className="hero-content"><Reveal><p className="hero-kicker">{p.hero.status}</p></Reveal><h1 id="hero-title">{p.hero.headline.map((line, i) => <Reveal key={line} delay={i * .08}><span className={i ? "gradient-line" : ""}>{line}</span></Reveal>)}</h1></div><Reveal delay={.12} className="hero-image-wrap"><div className="hero-workflow"><LabelBadge label={p.hero.label} labels={p.labels} /><p className="workflow-caption">{p.hero.visualTitle}</p><ol className="hero-stages">{p.hero.stages.map((stage, i) => <li key={stage}><span>{String(i + 1).padStart(2, "0")}</span><strong>{stage}</strong><ArrowDownRight size={16} aria-hidden="true" /></li>)}</ol><p className="hero-flow">{p.hero.flow.join(" → ")}</p><p className="fine-print">{p.hero.notice}</p></div></Reveal></div><div className="hero-lower"><Reveal><div className="hero-pitch"><p className="pitch-lead">{p.hero.subtext}</p></div></Reveal><Reveal delay={.08}><div className="hero-copy"><div className="actions"><Button href="#profile">{p.hero.profileCta}<ArrowUpRight size={16} /></Button><a className="arrow-link" href="#casebook">{p.hero.casebookCta}<ArrowDownRight size={19} /></a>{resume && <a className="arrow-link" href={resume} download>{p.ui.resume}</a>}</div></div></Reveal></div><div className="hero-value"><StatusBadge>{p.hero.valueLine}</StatusBadge></div></section>
  <ProfessionalProfile />
  <ClaimsCapabilities />
  <LicensesCertifications />
  <Performance />
  <CasebookLibrary />
  <SampleLibrary />
  <ClaimsWorkflow />
  <QualityAccuracy />
  <TechnologySection />
  <AvailabilityDeployment />
  <ProfessionalDocuments />
  <FieldReadiness />
  <ContactSection />
  </main><Footer /></>;
}
