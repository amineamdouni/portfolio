import { getTranslations } from "next-intl/server";
import type { DiagramColumn } from "@content/projects/types";

const COL_W = 190;
const GAP = 56;
const PAD = 24;
const TITLE_H = 30;
const NODE_H = 44;
const NODE_GAP = 10;
const GROUP_PAD = 14;

/**
 * Simple SVG architecture diagram (full-stack pages only). It never scales
 * text down: the SVG keeps its natural size and the frame scrolls instead.
 */
export async function ArchitectureDiagram({ columns }: { columns: DiagramColumn[] }) {
  const t = await getTranslations("diagram");
  const maxNodes = Math.max(...columns.map((c) => c.nodes.length));
  const groupH = GROUP_PAD * 2 + TITLE_H + maxNodes * NODE_H + (maxNodes - 1) * NODE_GAP;
  const width = PAD * 2 + columns.length * COL_W + (columns.length - 1) * GAP;
  const height = PAD * 2 + groupH;
  const midY = PAD + groupH / 2;

  return (
    <figure className="m-0 mt-8">
      <div
        tabIndex={0}
        role="group"
        aria-label={t("label")}
        className="overflow-x-auto rounded-md border bg-surface"
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={columns.map((c) => `${c.title}: ${c.nodes.map((n) => n.name).join(", ")}`).join(" → ")}
          className="block"
        >
          <defs>
            <marker id="arrow-accent" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" className="fill-accent" />
            </marker>
            <marker id="arrow-plain" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" className="fill-border-strong" />
            </marker>
          </defs>
          {columns.map((col, ci) => {
            const x = PAD + ci * (COL_W + GAP);
            const kind = col.kind ?? "plain";
            return (
              <g key={ci}>
                <rect
                  x={x + 0.5}
                  y={PAD + 0.5}
                  width={COL_W - 1}
                  height={groupH - 1}
                  rx={8}
                  strokeDasharray="4 3"
                  className={
                    kind === "accent"
                      ? "fill-accent-subtle stroke-accent"
                      : kind === "external"
                        ? "fill-transparent stroke-border"
                        : "fill-transparent stroke-border-strong"
                  }
                />
                <text
                  x={x + GROUP_PAD}
                  y={PAD + GROUP_PAD + 14}
                  className={`font-mono text-[11px] tracking-[0.06em] uppercase ${kind === "accent" ? "fill-accent" : "fill-text-muted"}`}
                >
                  {col.title}
                </text>
                {col.nodes.map((node, ni) => {
                  const ny = PAD + GROUP_PAD + TITLE_H + ni * (NODE_H + NODE_GAP);
                  return (
                    <g key={ni}>
                      <rect
                        x={x + GROUP_PAD + 0.5}
                        y={ny + 0.5}
                        width={COL_W - GROUP_PAD * 2 - 1}
                        height={NODE_H - 1}
                        rx={4}
                        strokeDasharray={kind === "external" ? "4 3" : undefined}
                        className={
                          kind === "accent"
                            ? "fill-surface stroke-accent-subtle-border"
                            : kind === "external"
                              ? "fill-surface stroke-border-strong"
                              : "fill-surface-sunken stroke-border"
                        }
                      />
                      <text
                        x={x + GROUP_PAD + 12}
                        y={ny + (node.note ? 19 : 27)}
                        className={`text-[15px] ${kind === "external" ? "fill-text-secondary" : "fill-text-primary font-medium"}`}
                      >
                        {node.name}
                      </text>
                      {node.note && (
                        <text x={x + GROUP_PAD + 12} y={ny + 35} className="fill-text-muted font-mono text-[11px]">
                          {node.note}
                        </text>
                      )}
                    </g>
                  );
                })}
                {col.arrow && ci < columns.length - 1 && (
                  <line
                    x1={x + COL_W + 6}
                    y1={midY}
                    x2={x + COL_W + GAP - 6}
                    y2={midY}
                    strokeWidth={col.arrow === "accent" ? 1.5 : 1}
                    markerEnd={`url(#arrow-${col.arrow})`}
                    className={col.arrow === "accent" ? "stroke-accent" : "stroke-border-strong"}
                  />
                )}
              </g>
            );
          })}
        </svg>
        <div className="mx-6 mb-6 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 font-mono text-xs text-text-muted">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-0 w-5 border-t-[1.5px] border-accent" />
            {t("legendAccent")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-0 w-5 border-t border-border-strong" />
            {t("legendPlain")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-0 w-5 border-t border-dashed border-border-strong" />
            {t("legendExternal")}
          </span>
        </div>
      </div>
      <figcaption className="mt-3 max-w-(--measure) text-sm text-text-muted">{t("caption")}</figcaption>
    </figure>
  );
}
