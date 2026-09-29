import { portfolio as p } from "@/data/portfolio";
import type { SectionKey } from "@/data/types";
import { Database, FolderCheck, MessagesSquare, Scale, Search } from "lucide-react";
import { AvailabilityBadge, EmptyState, LabelBadge, NumberedItem, SectionHeader } from "./casebook-primitives";
import { Credentials } from "./credentials";
import { MetricCard } from "./metric-card";
import { Casebook } from "./casebook";
import { WorkSamples } from "./work-samples";
import { existingDocument } from "@/lib/documents";
import { WorkflowTimeline } from "./workflow-timeline";

export function CasebookSection({ id, section, legacy, children }: { id: string; section: SectionKey; legacy?: string; children: React.ReactNode }) {
  return <><div className="shell"><div className="divider" /></div><section id={id} className="section shell" aria-label={p.sections[section].title}>{legacy && <span id={legacy} className="legacy-anchor" />}<SectionHeader copy={p.sections[section]} labels={p.labels} />{children}</section></>;
}
export function ProfessionalProfile() {
  return <CasebookSection id="profile" section="profile" legacy="about"><div className="about-grid"><article className="numbered-item profile-card"><LabelBadge label={p.profile.label} labels={p.labels} /><h3>{p.profile.name}</h3><p>{p.profile.title}</p><p>{p.profile.bio}</p><dl className="facts"><div><dt>{p.ui.location}</dt><dd>{p.profile.location || "—"}</dd></div><div><dt>{p.ui.experience}</dt><dd>{p.profile.yearsExperience}</dd></div><div><dt>{p.ui.jurisdictionInterest} · {p.ui.provinceState}</dt><dd>{p.jurisdictionStatus.filter(item => item.visible).map(item => item.region.name).join(" · ")}</dd></div><div><dt>{p.ui.specialties}</dt><dd>{p.profile.specialties.join(" · ")}</dd></div><div><dt>{p.ui.availability}</dt><dd><AvailabilityBadge status={p.availability.status} /></dd></div></dl>{p.profile.email && <a className="arrow-link" href={`mailto:${p.profile.email}`}>{p.profile.email}</a>}<div className="background-block"><h3>{p.ui.background}</h3><LabelBadge label="REAL_EXPERIENCE" labels={p.labels} /><p>{p.profile.background}</p></div></article><aside><p className="eyebrow">{p.ui.currentFocus}</p><ul className="focus-list">{p.focusAreas.filter(item => item.enabled).map((item, i) => <li key={item.title}><span className="fine-print">{String(i + 1).padStart(2, "0")}</span><strong>{item.title}</strong><LabelBadge label={item.label} labels={p.labels} /></li>)}</ul></aside></div></CasebookSection>;
}
export function ClaimsCapabilities() {
  const icons = { Search, Scale, FolderCheck, MessagesSquare, Database };
  return <CasebookSection id="capabilities" section="capabilities" legacy="services"><div className="services-grid">{p.capabilities.filter(item => item.enabled).map((item, index) => { const Icon = icons[item.icon]; return <div key={item.category}><NumberedItem number={String(index + 1).padStart(2, "0")} title={item.title} description={item.description} bullets={item.items}><div className="capability-caption"><Icon size={20} aria-hidden="true" /><strong>{item.category}</strong></div><LabelBadge label={item.label} labels={p.labels} /></NumberedItem></div>; })}</div></CasebookSection>;
}
export function LicensesCertifications() { return <CasebookSection id="credentials" section="credentials"><Credentials credentials={p.credentials} jurisdictions={p.jurisdictionStatus} ui={p.ui} labels={p.labels} /></CasebookSection>; }
export function Performance() {
  const real = p.metrics.filter(item => item.label === "REAL_EXPERIENCE" && item.value !== null && item.value !== "" && item.value !== "—" && (typeof item.value !== "number" || Number.isFinite(item.value)) && !String(item.value).includes("["));
  const shown = process.env.NODE_ENV === "development" ? p.metrics.map(item => real.includes(item) ? item : { ...item, value: null }) : real;
  return <CasebookSection id="performance" section="metrics">{shown.length ? <div className="stats-grid metrics-grid">{shown.map(item => <MetricCard key={item.title} metric={item} labels={p.labels} addMetric={p.ui.addMetric} />)}</div> : <EmptyState title={p.ui.metricEmpty} body={p.ui.metricEmptyBody} />}{real.length > 0 && <p className="fine-print">{p.ui.metricDisclaimer}</p>}</CasebookSection>;
}
export function CasebookLibrary() { return <CasebookSection id="casebook" section="casebook"><Casebook cases={p.caseStudies} ui={p.ui} labels={p.labels} title={p.sections.casebook.title} /></CasebookSection>; }
export function SampleLibrary() { return <CasebookSection id="work-samples" section="samples"><WorkSamples samples={p.workSamples.map(sample => ({ ...sample, file: existingDocument(sample.file ?? "") }))} ui={p.ui} labels={p.labels} title={p.sections.samples.title} /></CasebookSection>; }
export function ClaimsWorkflow() { return <CasebookSection id="workflow" section="workflow" legacy="process"><WorkflowTimeline stages={p.workflow} ui={p.ui} labels={p.labels} title={p.sections.workflow.title} /></CasebookSection>; }
