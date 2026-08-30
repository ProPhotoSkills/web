import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { listMembers, setMemberAccess } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/pps-admin")({
  head: () => ({
    meta: [
      { title: "Verwaltung — ProPhotoSkills" },
      { name: "description", content: "Interne Verwaltung der ProPhotoSkills-Zugänge." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Verwaltung — ProPhotoSkills" },
      { property: "og:description", content: "Interne Verwaltung der ProPhotoSkills-Zugänge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const fetchMembers = useServerFn(listMembers);
  const updateAccess = useServerFn(setMemberAccess);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-members"],
    queryFn: () => fetchMembers({ data: undefined }),
  });

  const mutation = useMutation({
    mutationFn: (vars: { userId: string; hasAccess: boolean }) =>
      updateAccess({ data: vars }),
    onSuccess: () => {
      toast.success("Zugang aktualisiert");
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
    },
    onError: () => toast.error("Aktualisierung fehlgeschlagen"),
  });

  if (isLoading) {
    return (
      <div className="container-pps py-12">
        <p className="text-muted-foreground">Wird geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-pps py-12">
        <h1 className="text-2xl font-bold text-foreground">Kein Zugriff</h1>
        <p className="mt-2 text-muted-foreground">
          Dieser Bereich ist nur für Administratoren.
        </p>
      </div>
    );
  }

  return (
    <div className="container-pps py-12">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Verwaltung</h1>
      <p className="mt-1 text-muted-foreground">
        Zugänge der registrierten Nutzer freischalten oder sperren.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Nutzer ({data?.length ?? 0})</CardTitle>
          <CardDescription>Änderungen wirken sofort.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data ?? []).map((m) => (
            <div
              key={m.id}
              className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{m.email}</p>
                <p className="text-xs text-muted-foreground">
                  {m.confirmed ? "E-Mail bestätigt" : "E-Mail nicht bestätigt"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={m.hasAccess ? "default" : "secondary"}>
                  {m.hasAccess ? "Freigeschaltet" : "Gesperrt"}
                </Badge>
                <Button
                  size="sm"
                  variant={m.hasAccess ? "outline" : "default"}
                  disabled={mutation.isPending}
                  onClick={() =>
                    mutation.mutate({ userId: m.id, hasAccess: !m.hasAccess })
                  }
                >
                  {m.hasAccess ? "Sperren" : "Freischalten"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
