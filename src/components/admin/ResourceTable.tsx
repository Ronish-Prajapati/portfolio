import Link from "next/link";
import { Pencil, Check, X } from "lucide-react";
import type { ListColumn } from "@/lib/resources";
import DeleteButton from "@/components/admin/DeleteButton";

interface ResourceTableProps {
  resourceKey: string;
  columns: ListColumn[];
  rows: Record<string, unknown>[];
}

function renderCell(value: unknown, type?: string) {
  if (type === "boolean") {
    return value ? (
      <Check size={16} className="text-green-600" />
    ) : (
      <X size={16} className="text-muted-foreground" />
    );
  }
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }
  return String(value);
}

export default function ResourceTable({ resourceKey, columns, rows }: ResourceTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
        No items yet. Create your first one.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium text-foreground">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 font-medium text-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = String(row.id);
            return (
              <tr key={id} className="border-b border-border last:border-0 hover:bg-muted/30">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {renderCell(row[col.key], col.type)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/${resourceKey}/${id}`}
                      className="p-2 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton resourceKey={resourceKey} id={id} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
