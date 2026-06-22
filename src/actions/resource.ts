"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getResource, type FieldConfig, type ResourceConfig } from "@/lib/resources";
import { getDelegate } from "@/lib/resource-data";
import { sanitizeHtml } from "@/lib/validations";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

/** Build a plain object from FormData based on the resource field config. */
function buildData(fields: FieldConfig[], formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "boolean") {
      const v = formData.get(field.name);
      data[field.name] = v === "on" || v === "true";
    } else {
      // text / textarea / richtext / number / list / image / url → raw string,
      // Zod handles coercion + array splitting.
      const v = formData.get(field.name);
      data[field.name] = v === null ? "" : v;
    }
  }
  return data;
}

/** Sanitize any rich-text (`editor`) fields in the parsed data before storage. */
function sanitizeEditorFields(resource: ResourceConfig, data: Record<string, unknown>) {
  for (const field of resource.fields) {
    if (field.type === "editor" && typeof data[field.name] === "string") {
      data[field.name] = sanitizeHtml(data[field.name] as string);
    }
  }
  return data;
}

function revalidate(paths: string[]) {
  for (const p of paths) revalidatePath(p);
  revalidatePath("/admin", "layout");
}

export type ActionResult = { error?: string; success?: boolean };

export async function createResourceAction(
  key: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const resource = getResource(key);
  const delegate = getDelegate(key);
  if (!resource || !delegate) return { error: "Unknown resource." };

  const parsed = resource.schema.safeParse(buildData(resource.fields, formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed." };
  }

  try {
    await delegate.create({ data: sanitizeEditorFields(resource, parsed.data as Record<string, unknown>) });
  } catch (error) {
    console.error(`[${key}] create failed:`, error);
    return { error: "Could not save. A unique field (e.g. slug) may already exist." };
  }

  revalidate(resource.revalidate);
  redirect(`/admin/${key}`);
}

export async function updateResourceAction(
  key: string,
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const resource = getResource(key);
  const delegate = getDelegate(key);
  if (!resource || !delegate) return { error: "Unknown resource." };

  const parsed = resource.schema.safeParse(buildData(resource.fields, formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed." };
  }

  try {
    await delegate.update({
      where: { id },
      data: sanitizeEditorFields(resource, parsed.data as Record<string, unknown>),
    });
  } catch (error) {
    console.error(`[${key}] update failed:`, error);
    return { error: "Could not save. A unique field (e.g. slug) may already exist." };
  }

  revalidate(resource.revalidate);
  redirect(`/admin/${key}`);
}

export async function deleteResourceAction(key: string, id: string): Promise<ActionResult> {
  await requireAuth();
  const resource = getResource(key);
  const delegate = getDelegate(key);
  if (!resource || !delegate) return { error: "Unknown resource." };

  try {
    await delegate.delete({ where: { id } });
  } catch (error) {
    console.error(`[${key}] delete failed:`, error);
    return { error: "Could not delete." };
  }

  revalidate(resource.revalidate);
  return {};
}
