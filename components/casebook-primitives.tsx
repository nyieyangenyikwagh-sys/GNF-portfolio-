import type { ContentLabel, SectionCopy } from "@/data/types";
import { Reveal } from "./reveal";
export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <a href={href} className={`button button-${variant} ${className}`}>
      {children}
    </a>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function LabelBadge({
  label,
  labels,
}: {
  label: ContentLabel;
  labels: Record<ContentLabel, string>;
}) {
  return (
    <span className="label-badge" data-content-label={label}>
      {labels[label]}
    </span>
  );
}
export function StatusBadge({ children }: { children: React.ReactNode }) {
  return <span className="status-badge">{children}</span>;
}
export function AvailabilityBadge({ status }: { status: string }) {
  return <StatusBadge>{status}</StatusBadge>;
}
export function SectionHeader({
  copy,
  labels,
}: {
  copy: SectionCopy;
  labels: Record<ContentLabel, string>;
}) {
  return (
    <div className="section-intro">
      <Reveal>
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <LabelBadge label={copy.label} labels={labels} />
      </Reveal>
      <div>
        <Reveal delay={0.08}>
          <h2>{copy.title}</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p>{copy.body}</p>
        </Reveal>
      </div>
    </div>
  );
}
export function NumberedItem({
  number,
  title,
  description,
  bullets,
  compact = false,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  bullets?: string[];
  compact?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <article className={`numbered-item ${compact ? "compact" : ""}`}>
      <span className="number">{number}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {bullets && (
        <ul>
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {children}
    </article>
  );
}
export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="numbered-item empty-state">
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {children}
    </div>
  );
}
export function Brand({
  name,
  title,
  backToTop,
}: {
  name: string;
  title: string;
  backToTop: string;
}) {
  return (
    <a className="brand" href="#top" aria-label={`${name}, ${backToTop}`}>
      <span>{name}</span>
      <span>{title}</span>
    </a>
  );
}
