"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowDownRight, Minus } from "lucide-react";
import type { CaseStudy, Portfolio } from "@/data/types";
import { LabelBadge, StatusBadge } from "./casebook-primitives";
import { Filters } from "./filters";
export function CaseStudyDetail({
  item,
  steps,
}: {
  item: CaseStudy;
  steps: Portfolio["ui"]["caseSteps"];
}) {
  return (
    <div className="case-steps">
      {steps.map((step) => (
        <div key={step.key}>
          <h4>{step.title}</h4>
          <p>{item.steps[step.key]}</p>
        </div>
      ))}
    </div>
  );
}
export function CaseStudyCard({
  item,
  ui,
  labels,
}: {
  item: CaseStudy;
  ui: Portfolio["ui"];
  labels: Portfolio["labels"];
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return (
    <article className="numbered-item case-card">
      <div className="case-top">
        <span className="eyebrow">{item.id}</span>
        <StatusBadge>{item.status}</StatusBadge>
      </div>
      <LabelBadge label={item.label} labels={labels} />
      {item.label === "DEMONSTRATION" && (
        <p className="demo-caption">{ui.demoCase}</p>
      )}
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <dl className="facts">
        <div>
          <dt>{item.claimType}</dt>
          <dd>
            {ui.provinceState}: {item.region.name}
          </dd>
        </div>
        <div>
          <dt>{ui.complexity}</dt>
          <dd>{item.complexity}</dd>
        </div>
      </dl>
      <button
        className="case-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={`${item.id}-detail`}
        onClick={() => setOpen(!open)}
      >
        {open ? ui.collapse : ui.expand}
        {open ? (
          <Minus size={20} aria-hidden="true" />
        ) : (
          <ArrowDownRight size={20} aria-hidden="true" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${item.id}-detail`}
            initial={{ opacity: 0, height: reduced ? "auto" : 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: reduced ? "auto" : 0 }}
            transition={{
              duration: reduced ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="case-detail"
          >
            <CaseStudyDetail item={item} steps={ui.caseSteps} />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
export function Casebook({
  cases,
  ui,
  labels,
  title,
}: {
  cases: CaseStudy[];
  ui: Portfolio["ui"];
  labels: Portfolio["labels"];
  title: string;
}) {
  const [filter, setFilter] = useState(ui.all);
  return (
    <>
      <Filters
        title={title}
        options={[ui.all, ...new Set(cases.map((item) => item.claimType))]}
        value={filter}
        onChange={setFilter}
      />
      <div className="case-grid" aria-live="polite">
        {cases
          .filter((item) => filter === ui.all || item.claimType === filter)
          .map((item) => (
            <CaseStudyCard key={item.id} item={item} ui={ui} labels={labels} />
          ))}
      </div>
    </>
  );
}
