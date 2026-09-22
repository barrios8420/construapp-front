"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CapturaSelfie from "@/components/ui/CapturaSelfie";
import { supabase } from "@/lib/supabase";
import { OFICIOS } from "@/components/ui/FiltrosBusqueda";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OFICIOS_SELECCIONABLES = OFICIOS.filter((o) => o !== "Todos los oficios");

export default function CompletarPerfilTrabajadorPage() {
  const router = useRouter();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [oficio, setOficio] = useState("");
  const [selfie, setSelfie] = useState<File | null>(null);

  const [errores, setErrores] = useState<{
    nombre?: string;
    cedula?: string;
    celular?: string;
    oficio?: string;
    selfie?: string;
  }>({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  function validarCedula(valor: string) {
    return /^[0-9]{6,10}$/.test(valor);
  }

  function validarCelular(valor: string) {
    return /^[0-9]{10}$/.test(valor);
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
    if (!validarCelular(celular)) {
      nuevosErrores.celular = "El celular debe tener exactamente 10 dígitos";
    }
    if (!oficio) {
      nuevosErrores.oficio = "Selecciona tu oficio principal";
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
      .upsert({
        id: userData.user.id,
        email: userData.user.email,
        nombre_completo: nombreCompleto,
        cedula_hash: cedula,
        celular: celular,
        oficio_principal: oficio,
      });

    setEnviando(false);

    if (updateError) {
      setMensajeError(`No pudimos guardar tus datos: ${updateError.message}`);
      return;
    }

    // TODO: subir la selfie al bucket de Supabase Storage (pendiente definir con Joy)

    router.push("/portafolio");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
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
              {errores.celular && <p className="text-sm text-red-600">{errores.celular}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="oficio">Oficio principal</Label>
              <Select value={oficio} onValueChange={(v) => v && setOficio(v)}>
                <SelectTrigger id="oficio" className="w-full">
                  <SelectValue placeholder="Selecciona tu oficio" />
                </SelectTrigger>
                <SelectContent>
                  {OFICIOS_SELECCIONABLES.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errores.oficio && <p className="text-sm text-red-600">{errores.oficio}</p>}
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