"use client";
import { useState } from "react";
import type { Credential, Portfolio } from "@/data/types";
import { EmptyState, LabelBadge, StatusBadge } from "./casebook-primitives";
import { Filters } from "./filters";
export function CredentialCard({
  credential,
  ui,
  labels,
}: {
  credential: Credential;
  ui: Portfolio["ui"];
  labels: Portfolio["labels"];
}) {
  return (
    <article className="numbered-item">
      <LabelBadge label={credential.label} labels={labels} />
      <h3>{credential.name}</h3>
      <p>
        <StatusBadge>{credential.status.replaceAll("_", " ")}</StatusBadge>
      </p>
      <dl className="facts">
        {(["issuer", "number", "issued", "expires", "category"] as const).map(
          (key) => (
            <div key={key}>
              <dt>{ui.credentialFields[key]}</dt>
              <dd>{credential[key] || "—"}</dd>
            </div>
          ),
        )}
        {credential.jurisdiction && (
          <div>
            <dt>{ui.provinceState}</dt>
            <dd>{credential.jurisdiction.name}</dd>
          </div>
        )}
      </dl>
      {credential.verifyUrl && (
        <a
          className="arrow-link"
          href={credential.verifyUrl}
          target="_blank"
          rel="noreferrer"
        >
          {ui.verify}
        </a>
      )}
    </article>
  );
}
export function Credentials({
  credentials,
  jurisdictions,
  ui,
  labels,
}: {
  credentials: Portfolio["credentials"];
  jurisdictions: Portfolio["jurisdictionStatus"];
  ui: Portfolio["ui"];
  labels: Portfolio["labels"];
}) {
  const [filter, setFilter] = useState(ui.all);
  const supplied = credentials.filter((item) => item.status !== "PLACEHOLDER");
  const filtered = supplied.filter(
    (item) => filter === ui.all || item.category === filter,
  );
  return (
    <>
      <Filters
        title={ui.credentialFields.category}
        options={[ui.all, ...ui.credentialFilters]}
        value={filter}
        onChange={setFilter}
      />
      <div aria-live="polite">
        {filtered.length ? (
          <div className="services-grid">
            {filtered.map((item) => (
              <CredentialCard
                key={item.id}
                credential={item}
                ui={ui}
                labels={labels}
              />
            ))}
          </div>
        ) : (
          <EmptyState title={ui.credentialEmpty} body={ui.credentialEmptyBody}>
            <div className="actions empty-actions">
              <StatusBadge>
                {credentials.find((item) => item.status === "PLACEHOLDER")
                  ?.status ?? "PLACEHOLDER"}
              </StatusBadge>
              <LabelBadge
                label={
                  credentials.find((item) => item.status === "PLACEHOLDER")
                    ?.label ?? "DEMONSTRATION"
                }
                labels={labels}
              />
            </div>
          </EmptyState>
        )}
      </div>
      <div className="jurisdiction-grid">
        {jurisdictions
          .filter((item) => item.visible)
          .map((item) => (
            <div
              className="jurisdiction-row"
              key={`${item.region.country}-${item.region.code}`}
            >
              <div>
                <p className="fine-print">{ui.provinceState}</p>
                <h3>{item.region.name}</h3>
              </div>
              <StatusBadge>{item.status.replaceAll("_", " ")}</StatusBadge>
            </div>
          ))}
      </div>
      <p className="fine-print">{ui.credentialNotice}</p>
    </>
  );
}
