"use client";
export function Filters({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <div className="filters" role="group" aria-label={title}>{options.map(option => <button key={option} type="button" className={`button ${value === option ? "button-primary" : "filter-button"}`} aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}</div>;
}
