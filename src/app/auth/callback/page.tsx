"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [estado, setEstado] = useState<"verificando" | "error">("verificando");

  useEffect(() => {
    async function confirmarSesion() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setEstado("error");
        return;
      }

      const role = searchParams.get("role");
      const userId = data.session.user.id;

      if (role === "trabajador") {
        const { data: perfil } = await supabase
          .from("trabajadores")
          .select("nombre_completo, cedula_hash")
          .eq("id", userId)
          .single();

        const yaCompleto = perfil?.nombre_completo && perfil?.cedula_hash;

        router.replace(yaCompleto ? "/portafolio" : "/completar-perfil/trabajador");
      } else if (role === "contratista") {
        router.replace("/completar-perfil/contratista");
      } else {
        router.replace("/");
      }
    }

    confirmarSesion();
  }, [router, searchParams]);

  if (estado === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold">No pudimos confirmar tu enlace</p>
          <p className="mt-2 text-sm text-muted-foreground">
            El enlace puede haber expirado o ya fue usado. Vuelve a intentar el registro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <p className="text-sm text-muted-foreground">Confirmando tu acceso...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Cargando...</p>}>
      <CallbackContent />
    </Suspense>
  );
}