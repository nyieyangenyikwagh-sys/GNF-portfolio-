"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import type { Portfolio, WorkSample } from "@/data/types";
import { LabelBadge } from "./casebook-primitives";

export default function DocumentViewer({ sample, ui, labels, onClose }: { sample: WorkSample; ui: Portfolio["ui"]; labels: Portfolio["labels"]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null), closeRef = useRef<HTMLButtonElement>(null);
  const [page, setPage] = useState(1), [zoom, setZoom] = useState(100);
  const total = sample.file ? Math.max(1, sample.pages) : Math.max(1, sample.placeholderPages.length);
  const current = sample.placeholderPages[page - 1];
  useEffect(() => {
    const dialog = dialogRef.current, previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal(); document.body.style.overflow = "hidden"; closeRef.current?.focus();
    return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  function downloadSample() {
    const text = [ui.sampleWatermark, labels[sample.label], sample.title, ...sample.placeholderPages.flatMap(item => [item.heading, ...item.fields.map(field => `${field.title}: ${field.value}`), ...item.paragraphs])].join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${sample.id}-SAMPLE.txt`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <dialog ref={dialogRef} className="document-dialog" aria-modal="true" aria-labelledby="document-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}><div className="viewer-header"><div><LabelBadge label={sample.label} labels={labels} /><h2 id="document-title">{sample.title}</h2><p className="fine-print">{sample.category} · {ui.page} {page} {ui.of} {total}</p></div><button ref={closeRef} className="icon-button" aria-label={ui.close} onClick={onClose}><X /></button></div><div className="viewer-toolbar"><div className="toolbar-group"><button className="icon-button" aria-label={ui.zoomOut} disabled={zoom <= 50} onClick={() => setZoom(value => Math.max(50, value - 25))}><Minus size={18} /></button><output aria-live="polite">{zoom}%</output><button className="icon-button" aria-label={ui.zoomIn} disabled={zoom >= 200} onClick={() => setZoom(value => Math.min(200, value + 25))}><Plus size={18} /></button><button className="icon-button" aria-label={ui.zoomReset} onClick={() => setZoom(100)}><RotateCcw size={18} /></button></div><div className="toolbar-group"><button className="icon-button" aria-label={ui.previous} disabled={page <= 1} onClick={() => setPage(value => value - 1)}><ChevronLeft size={18} /></button><output aria-live="polite">{page} / {total}</output><button className="icon-button" aria-label={ui.next} disabled={page >= total} onClick={() => setPage(value => value + 1)}><ChevronRight size={18} /></button></div>{sample.file ? <a className="button button-primary" href={sample.file} download>{ui.download}</a> : <button className="button button-primary" onClick={downloadSample}>{ui.download}</button>}</div><div className="document-stage">{sample.file ? <iframe className="pdf-frame" title={sample.title} src={`${sample.file}#page=${page}&zoom=${zoom}`} /> : <article className="sample-paper" style={{ width: `${zoom}%`, fontSize: `${zoom}%` }}><div className="sample-watermark" aria-hidden="true">{ui.sampleWatermark}</div><p className="eyebrow">{sample.id} / {ui.sampleWatermark}</p><h3>{current?.heading ?? sample.title}</h3><dl className="facts">{current?.fields.map(field => <div key={field.title}><dt>{field.title}</dt><dd>{field.value}</dd></div>)}</dl><div className="redaction-bars" aria-label={ui.redacted}><span /><span /><span /></div>{current?.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="paper-footer">{ui.sampleWatermark} · {ui.page} {page} {ui.of} {total}</p></article>}</div>{sample.file && <p className="fine-print pdf-notice">{ui.pdfNotice}</p>}</dialog>;
}
