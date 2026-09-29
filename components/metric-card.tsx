import type { Metric, Portfolio } from "@/data/types";
import { LabelBadge } from "./casebook-primitives";
export function MetricCard({ metric, labels, addMetric }: { metric: Metric; labels: Portfolio["labels"]; addMetric: string }) { return <article className="stat metric-card"><strong>{metric.value ?? "—"}{metric.value !== null && metric.unit}</strong><h3>{metric.title}</h3>{metric.note && <p className="fine-print">{metric.note}</p>}{metric.value === null ? <span className="fine-print">{addMetric}</span> : <LabelBadge label={metric.label} labels={labels} />}</article>; }
