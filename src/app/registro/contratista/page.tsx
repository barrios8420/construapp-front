"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegistroContratistaPage() {
  const router = useRouter();
  const [celular, setCelular] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [errores, setErrores] = useState<{ celular?: string; nombre?: string; correo?: string }>({});
  const [enviando, setEnviando] = useState(false);

  function validarCelular(valor: string) {
    return /^[0-9]{10}$/.test(valor);
  }

  function validarCorreo(valor: string) {
    if (valor.trim() === "") return true; // el correo es opcional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores: { celular?: string; nombre?: string; correo?: string } = {};

    if (!validarCelular(celular)) {
      nuevosErrores.celular = "El celular debe tener exactamente 10 dígitos";
    }
    if (nombre.trim().length < 2) {
      nuevosErrores.nombre = "Ingresa tu nombre completo";
    }
    if (!validarCorreo(correo)) {
      nuevosErrores.correo = "Ingresa un correo válido";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);

    // TODO: aquí se conecta con Supabase Auth (S1-FE-05) y redirige al mapa (HU-03)
    console.log("Registrando contratista:", { celular, nombre, correo });

    setEnviando(false);

    // Redirige a la vista de publicación de obras (placeholder por ahora)
    router.push("/mapa");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Regístrate como contratista</CardTitle>
          <p className="text-sm text-muted-foreground">
            Es gratis. Empieza a buscar trabajadores verificados en Cali.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="celular">Número de celular</Label>
              <Input
                id="celular"
                type="tel"
                inputMode="numeric"
                placeholder="3001234567"
                value={celular}
                onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
              />
              {errores.celular && (
                <p className="text-sm text-red-600">{errores.celular}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errores.nombre && (
                <p className="text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">
                Correo <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="juan@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {errores.correo && (
                <p className="text-sm text-red-600">{errores.correo}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? "Registrando..." : "Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}