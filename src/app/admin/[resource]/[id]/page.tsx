import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getResource } from "@/lib/resources";
import { getResourceItem } from "@/lib/resource-data";
import { updateResourceAction, type ActionResult } from "@/actions/resource";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const item = await getResourceItem(key, id);
  if (!item) notFound();

  async function action(prev: ActionResult, formData: FormData) {
    "use server";
    return updateResourceAction(key, id, prev, formData);
  }

  return (
    <div>
      <Link
        href={`/admin/${key}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Back to {resource.label}
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8">Edit {resource.singular}</h1>

      <ResourceForm
        fields={resource.fields}
        action={action}
        initial={item}
        backHref={`/admin/${key}`}
        submitLabel="Save Changes"
      />
    </div>
  );
}
