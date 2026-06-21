import { prisma } from "@/lib/prisma";
import { profileFields } from "@/lib/resources";
import { updateProfileAction } from "@/actions/profile";
import ResourceForm from "@/components/admin/ResourceForm";

async function getProfileRecord() {
  try {
    return await prisma.profile.findFirst();
  } catch {
    return null;
  }
}

export default async function AboutAdminPage() {
  const profile = await getProfileRecord();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">About / Profile</h1>
      <p className="text-muted-foreground mb-8">
        This drives the Hero, About and Footer sections of your site.
      </p>

      <ResourceForm
        fields={profileFields}
        action={updateProfileAction}
        initial={profile as Record<string, unknown> | null}
        backHref="/admin"
        submitLabel="Save Profile"
      />
    </div>
  );
}
