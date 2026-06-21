import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getResource } from "@/lib/resources";
import { listResource } from "@/lib/resource-data";
import ResourceTable from "@/components/admin/ResourceTable";

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const rows = await listResource(key);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{resource.label}</h1>
          <p className="text-muted-foreground">
            {rows.length} {rows.length === 1 ? "item" : "items"}
          </p>
        </div>
        <Button asChild>
          <Link href={`/admin/${key}/new`}>
            <Plus size={16} /> New {resource.singular}
          </Link>
        </Button>
      </div>

      <ResourceTable resourceKey={key} columns={resource.listColumns} rows={rows} />
    </div>
  );
}
