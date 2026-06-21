import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getResource } from "@/lib/resources";
import { createResourceAction, type ActionResult } from "@/actions/resource";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  // Bind the resource key into the server action.
  async function action(prev: ActionResult, formData: FormData) {
    "use server";
    return createResourceAction(key, prev, formData);
  }

  return (
    <div>
      <Link
        href={`/admin/${key}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} /> Back to {resource.label}
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-8">New {resource.singular}</h1>

      <ResourceForm
        fields={resource.fields}
        action={action}
        backHref={`/admin/${key}`}
        submitLabel={`Create ${resource.singular}`}
      />
    </div>
  );
}
