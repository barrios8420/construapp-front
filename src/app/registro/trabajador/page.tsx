"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CapturaSelfie from "@/components/ui/CapturaSelfie";

export default function RegistroTrabajadorPage() {
  const [celular, setCelular] = useState("");
  const [cedula, setCedula] = useState("");
  const [errores, setErrores] = useState<{ celular?: string; cedula?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [selfie, setSelfie] = useState<File | null>(null);

  function validarCelular(valor: string) {
    return /^[0-9]{10}$/.test(valor);
  }

  function validarCedula(valor: string) {
    return /^[0-9]{6,10}$/.test(valor);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores: { celular?: string; cedula?: string } = {};

    if (!validarCelular(celular)) {
      nuevosErrores.celular = "El celular debe tener exactamente 10 dígitos";
    }
    if (!validarCedula(cedula)) {
      nuevosErrores.cedula = "Ingresa una cédula válida";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);

    // TODO: aquí se conecta con Supabase Auth (S1-FE-05) para disparar el OTP
    console.log("Enviando OTP a:", celular);

    setEnviando(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Regístrate como trabajador</CardTitle>
          <p className="text-sm text-muted-foreground">
            Con tu celular y cédula empezamos a construir tu perfil verificado.
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
              <Label htmlFor="cedula">Número de cédula</Label>
              <Input
                id="cedula"
                type="text"
                inputMode="numeric"
                placeholder="1234567890"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
              />
              {errores.cedula && (
                <p className="text-sm text-red-600">{errores.cedula}</p>
              )}
            </div>

            <CapturaSelfie
              onCapture={({ file }) => {
                setSelfie(file);
                console.log("Selfie lista para enviar:", file.name, file.size, "bytes");
              }}
            />

            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? "Enviando código..." : "Continuar y recibir código OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}