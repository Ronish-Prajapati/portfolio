import { prisma } from "@/lib/prisma";
import MessageCard from "@/components/admin/MessageCard";

async function getMessages() {
  try {
    return await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">Contact Messages</h1>
      <p className="text-muted-foreground mb-8">
        {messages.length} {messages.length === 1 ? "message" : "messages"} from your contact form.
      </p>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <MessageCard
              key={m.id}
              id={m.id}
              name={m.name}
              email={m.email}
              message={m.message}
              read={m.read}
              createdAt={new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(m.createdAt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
