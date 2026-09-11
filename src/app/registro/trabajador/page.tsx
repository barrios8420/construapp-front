"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function RegistroTrabajadorPage() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  function validarCorreo(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  async function enviarMagicLink(e: React.FormEvent) {
    e.preventDefault();

    if (!validarCorreo(correo)) {
      setError("Ingresa un correo válido");
      return;
    }

    setError("");
    setEnviando(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: correo,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=trabajador`,
      },
    });

    setEnviando(false);

    if (error) {
      setError(`No pudimos enviar el enlace: ${error.message}`);
      return;
    }

    setEnviado(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Regístrate como trabajador</CardTitle>
          <p className="text-sm text-muted-foreground">
            {enviado
              ? "Revisa tu correo y haz click en el enlace para continuar."
              : "Empieza con tu correo. Te enviaremos un enlace para confirmar."}
          </p>
        </CardHeader>
        <CardContent>
          {!enviado ? (
            <form onSubmit={enviarMagicLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tucorreo@gmail.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? "Enviando enlace..." : "Enviar enlace de acceso"}
              </Button>
            </form>
          ) : (
            <div className="rounded-md border border-dashed border-neutral-300 p-4 text-center text-sm text-muted-foreground">
              📧 Te enviamos un enlace a <strong>{correo}</strong>. Ábrelo desde este mismo
              navegador para continuar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}