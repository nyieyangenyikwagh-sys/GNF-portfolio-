"use client";
import { useState } from "react";
import type { Portfolio } from "@/data/types";
import { LabelBadge } from "./casebook-primitives";
export function QualityChecklist({ items, ui, labels }: { items: Portfolio["qualityChecklist"]; ui: Portfolio["ui"]; labels: Portfolio["labels"] }) {
  const [checked, setChecked] = useState<string[]>([]);
  return <div className="quality-sheet"><div className="quality-heading"><p className="fine-print">{ui.qualityNotice}</p><button className="button filter-button" onClick={() => setChecked([])} disabled={!checked.length}>{ui.reset}</button></div><div className="quality-rows">{items.map((item, i) => <label key={item.title} className="quality-row"><input type="checkbox" checked={checked.includes(item.title)} onChange={event => setChecked(current => event.target.checked ? [...current, item.title] : current.filter(value => value !== item.title))} /><span className="fine-print" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span><strong>{item.title}</strong><span className="quality-description">{item.description}</span><LabelBadge label={item.label} labels={labels} /></span></label>)}</div></div>;
}
