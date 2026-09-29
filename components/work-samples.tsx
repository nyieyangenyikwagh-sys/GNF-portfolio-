"use client";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Portfolio, WorkSample } from "@/data/types";
import { EmptyState, LabelBadge, StatusBadge } from "./casebook-primitives";
import { Filters } from "./filters";
const DocumentViewer = dynamic(() => import("./document-viewer"), { ssr: false });
export function DocumentCard({ sample, ui, labels, onView }: { sample: WorkSample; ui: Portfolio["ui"]; labels: Portfolio["labels"]; onView: () => void }) { return <article className="numbered-item document-card"><div className="document-preview" aria-hidden="true"><FileText size={32} strokeWidth={1} /><span>{ui.sampleWatermark}</span><div className="redaction-bars"><span /><span /></div></div><LabelBadge label={sample.label} labels={labels} /><p className="fine-print">{sample.category}</p><h3>{sample.title}</h3><p>{sample.claimType}</p><p className="fine-print">{sample.pages} · {ui.page} / <time dateTime={sample.date}>{sample.date}</time></p><StatusBadge>{sample.status}</StatusBadge><button className="case-toggle" onClick={onView} aria-haspopup="dialog">{ui.viewSample}<ArrowUpRight size={18} /></button></article>; }
export function WorkSamples({ samples, ui, labels, title }: { samples: WorkSample[]; ui: Portfolio["ui"]; labels: Portfolio["labels"]; title: string }) {
  const [filter, setFilter] = useState(ui.all), [selected, setSelected] = useState<WorkSample | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const shown = samples.filter(item => filter === ui.all || item.category === filter);
  return <><p className="sample-notice">{ui.sampleNotice}</p><Filters title={title} options={[ui.all, ...ui.sampleCategories]} value={filter} onChange={setFilter} /><div className="services-grid" aria-live="polite">{shown.map(sample => <DocumentCard key={sample.id} sample={sample} ui={ui} labels={labels} onView={() => setSelected(sample)} />)}</div>{!shown.length && <EmptyState title={ui.sampleEmpty} />}{selected && <DocumentViewer key={selected.id} sample={selected} ui={ui} labels={labels} onClose={close} />}</>;
}
