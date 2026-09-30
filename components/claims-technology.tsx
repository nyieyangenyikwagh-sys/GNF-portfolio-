import { ArrowDownRight, ArrowUpRight, Database } from "lucide-react";
import type { Portfolio, Technology } from "@/data/types";
import { LabelBadge, StatusBadge } from "./casebook-primitives";
export function TechnologyCard({
  item,
  labels,
}: {
  item: Technology;
  labels: Portfolio["labels"];
}) {
  return (
    <article className="numbered-item compact technology-card">
      <Database size={24} aria-hidden="true" />
      <h4>{item.name}</h4>
      <StatusBadge>{item.level}</StatusBadge>
      <LabelBadge label={item.label} labels={labels} />
    </article>
  );
}
export function PipelineDiagram({ steps }: { steps: string[] }) {
  return (
    <ol className="pipeline-diagram">
      {steps.map((step, index) => (
        <li key={step}>
          <span className="fine-print">
            {String(index + 1).padStart(2, "0")}
          </span>
          <strong>{step}</strong>
          <ArrowDownRight size={18} aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}
export function ClaimsDashboardMock({
  data,
  labels,
  queryTitle,
}: {
  data: Portfolio["automationCase"];
  labels: Portfolio["labels"];
  queryTitle: string;
}) {
  return (
    <div className="dashboard-mock">
      <div className="dashboard-heading">
        <LabelBadge label={data.label} labels={labels} />
        <p>{data.notice}</p>
      </div>
      <div className="dashboard-stats">
        {data.dashboard.map((item) => (
          <div className="stat" key={item.title}>
            <strong>{item.value}</strong>
            <h5>{item.title}</h5>
            <p className="fine-print">{item.note}</p>
          </div>
        ))}
      </div>
      <div className="query-panel">
        <h4>{queryTitle}</h4>
        <pre tabIndex={0} aria-label={queryTitle}>
          <code>{data.sampleQuery}</code>
        </pre>
      </div>
    </div>
  );
}
export function ClaimsTechnology({
  items,
  data,
  labels,
  ui,
}: {
  items: Technology[];
  data: Portfolio["automationCase"];
  labels: Portfolio["labels"];
  ui: Portfolio["ui"];
}) {
  const enabled = items.filter((item) => item.enabled);
  return (
    <>
      <div className="technology-groups">
        {[...new Set(enabled.map((item) => item.group))].map((group) => (
          <div key={group}>
            <h3>{group}</h3>
            <div className="services-grid">
              {enabled
                .filter((item) => item.group === group)
                .map((item) => (
                  <TechnologyCard key={item.name} item={item} labels={labels} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <p className="fine-print">{ui.technologyNotice}</p>
      <article className="automation-case">
        <div className="about-grid">
          <div>
            <p className="eyebrow">{data.title}</p>
            <h3>{data.title}</h3>
            <p className="automation-description">{data.description}</p>
            <LabelBadge label={data.label} labels={labels} />
          </div>
          <PipelineDiagram steps={data.pipeline} />
        </div>
        <ClaimsDashboardMock
          data={data}
          labels={labels}
          queryTitle={ui.queryTitle}
        />
        {data.relatedProject.url && data.relatedProject.title && (
          <div className="related-project">
            <h4>{data.relatedProject.title}</h4>
            <p>{data.relatedProject.description}</p>
            <a
              className="arrow-link"
              href={data.relatedProject.url}
              target="_blank"
              rel="noreferrer"
            >
              {data.relatedProject.title}
              <ArrowUpRight size={18} />
            </a>
          </div>
        )}
      </article>
    </>
  );
}
