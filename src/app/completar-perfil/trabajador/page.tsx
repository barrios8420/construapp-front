"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CapturaSelfie from "@/components/ui/CapturaSelfie";
import { supabase } from "@/lib/supabase";

export default function CompletarPerfilTrabajadorPage() {
  const router = useRouter();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [cedula, setCedula] = useState("");
  const [selfie, setSelfie] = useState<File | null>(null);
  const [errores, setErrores] = useState<{ nombre?: string; cedula?: string; selfie?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  function validarCedula(valor: string) {
    return /^[0-9]{6,10}$/.test(valor);
  }

  async function guardarPerfil(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores: typeof errores = {};

    if (nombreCompleto.trim().length < 2) {
      nuevosErrores.nombre = "Ingresa tu nombre completo";
    }
    if (!validarCedula(cedula)) {
      nuevosErrores.cedula = "Ingresa una cédula válida";
    }
    if (!selfie) {
      nuevosErrores.selfie = "Necesitamos tu selfie de verificación";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setMensajeError("");

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setMensajeError("Tu sesión expiró. Vuelve a iniciar el registro.");
      setEnviando(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("trabajadores")
      .update({
        nombre_completo: nombreCompleto,
        cedula_plana: cedula,
      })
      .eq("id", userData.user.id);

    setEnviando(false);

    if (updateError) {
      setMensajeError(`No pudimos guardar tus datos: ${updateError.message}`);
      return;
    }

    // TODO: subir la selfie al bucket de Supabase Storage (S2-FE-01)

    router.push("/portafolio");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Completa tu perfil</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ya confirmamos tu correo. Solo faltan estos datos.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={guardarPerfil} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan Pérez"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
              />
              {errores.nombre && <p className="text-sm text-red-600">{errores.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">Número de cédula</Label>
              <Input
                id="cedula"
                type="text"
                inputMode="numeric"
                placeholder="1234567890"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
              />
              {errores.cedula && <p className="text-sm text-red-600">{errores.cedula}</p>}
            </div>

            <CapturaSelfie
              onCapture={({ file }) => {
                setSelfie(file);
                setErrores((prev) => ({ ...prev, selfie: undefined }));
              }}
            />
            {errores.selfie && <p className="text-sm text-red-600">{errores.selfie}</p>}

            {mensajeError && <p className="text-sm text-red-600">{mensajeError}</p>}

            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? "Guardando..." : "Completar registro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}