"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { Portfolio, WorkflowStage } from "@/data/types";
import { LabelBadge } from "./casebook-primitives";
export function WorkflowTimeline({
  stages,
  ui,
  labels,
  title,
}: {
  stages: WorkflowStage[];
  ui: Portfolio["ui"];
  labels: Portfolio["labels"];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const stage = stages[selected];
  if (!stage) return null;
  return (
    <>
      <div className="workflow-timeline" role="group" aria-label={title}>
        {stages.map((item, index) => (
          <button
            key={item.step}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            className={`workflow-stage ${selected === index ? "selected" : ""}`}
            type="button"
            aria-pressed={selected === index}
            aria-controls="workflow-detail"
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next = index;
              if (["ArrowRight", "ArrowDown"].includes(event.key))
                next = (index + 1) % stages.length;
              else if (["ArrowLeft", "ArrowUp"].includes(event.key))
                next = (index - 1 + stages.length) % stages.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = stages.length - 1;
              else return;
              event.preventDefault();
              setSelected(next);
              buttons.current[next]?.focus();
            }}
          >
            <span>{item.step}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
      <motion.div
        id="workflow-detail"
        key={stage.step}
        className="workflow-detail numbered-item"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-live="polite"
      >
        <LabelBadge label={stage.label} labels={labels} />
        <h3>
          {stage.step} / {stage.title}
        </h3>
        <p>{stage.objective}</p>
        <div className="workflow-fields">
          {ui.workflowFields.map((field) => (
            <div key={field.key}>
              <h4>{field.title}</h4>
              <ul>
                {stage[field.key].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
