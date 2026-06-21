"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { profileFields } from "@/lib/resources";
import type { ActionResult } from "@/actions/resource";

function buildData(formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of profileFields) {
    const v = formData.get(field.name);
    data[field.name] = v === null ? "" : v;
  }
  return data;
}

export async function updateProfileAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const parsed = profileSchema.safeParse(buildData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Validation failed." };
  }

  try {
    const existing = await prisma.profile.findFirst();
    if (existing) {
      await prisma.profile.update({ where: { id: existing.id }, data: parsed.data });
    } else {
      await prisma.profile.create({ data: parsed.data });
    }
  } catch (error) {
    console.error("[profile] update failed:", error);
    return { error: "Could not save profile." };
  }

  revalidatePath("/");
  revalidatePath("/admin/about");
  return { success: true };
}
