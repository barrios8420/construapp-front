"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CapturaSelfie from "@/components/ui/CapturaSelfie";
import { supabase } from "@/lib/supabase";

// 🔧 MODO PRUEBA: simula el envío/verificación de OTP sin necesitar las keys reales de Supabase.
// Cuando Joy te pase las keys, cámbialo a `false` y todo se conecta al backend real.
const MODO_PRUEBA = true;
const OTP_DE_PRUEBA = "123456";

export default function RegistroTrabajadorPage() {
  const router = useRouter();

  const [celular, setCelular] = useState("");
  const [cedula, setCedula] = useState("");
  const [selfie, setSelfie] = useState<File | null>(null);
  const [codigoOtp, setCodigoOtp] = useState("");

  const [paso, setPaso] = useState<"datos" | "otp">("datos");
  const [errores, setErrores] = useState<{ celular?: string; cedula?: string; selfie?: string; otp?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeInfo, setMensajeInfo] = useState("");

  function validarCelular(valor: string) {
    return /^[0-9]{10}$/.test(valor);
  }

  function validarCedula(valor: string) {
    return /^[0-9]{6,10}$/.test(valor);
  }

  async function enviarOtp(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores: typeof errores = {};

    if (!validarCelular(celular)) {
      nuevosErrores.celular = "El celular debe tener exactamente 10 dígitos";
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
    setMensajeInfo("");

    if (MODO_PRUEBA) {
      await new Promise((resolve) => setTimeout(resolve, 600)); // simula latencia de red
      setEnviando(false);
      setPaso("otp");
      setMensajeInfo(`[MODO PRUEBA] Usa el código ${OTP_DE_PRUEBA} para continuar`);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+57${celular}`,
    });

    setEnviando(false);

    if (error) {
      setMensajeInfo(`No pudimos enviar el código: ${error.message}`);
      return;
    }

    setPaso("otp");
    setMensajeInfo(`Te enviamos un código al +57 ${celular}`);
  }

  async function verificarOtp(e: React.FormEvent) {
    e.preventDefault();

    if (codigoOtp.trim().length !== 6) {
      setErrores({ otp: "El código debe tener 6 dígitos" });
      return;
    }

    setEnviando(true);
    setErrores({});

    if (MODO_PRUEBA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEnviando(false);

      if (codigoOtp !== OTP_DE_PRUEBA) {
        setErrores({ otp: `Código incorrecto. En modo prueba usa: ${OTP_DE_PRUEBA}` });
        return;
      }

      router.push("/portafolio");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      phone: `+57${celular}`,
      token: codigoOtp,
      type: "sms",
    });

    setEnviando(false);

    if (error) {
      setErrores({ otp: "Código incorrecto o expirado. Inténtalo de nuevo." });
      return;
    }

    // TODO: aquí se sube la selfie y la cédula al backend (bucket + tabla trabajadores)
    // TODO: aquí se valida el hash SHA-256 de la cédula contra la blacklist (S1-BE-05)

    router.push("/portafolio");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {paso === "datos" ? "Regístrate como trabajador" : "Verifica tu celular"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {paso === "datos"
              ? "Con tu celular y cédula empezamos a construir tu perfil verificado."
              : mensajeInfo || `Ingresa el código enviado a tu celular.`}
          </p>
        </CardHeader>
        <CardContent>
          {paso === "datos" && (
            <form onSubmit={enviarOtp} className="space-y-4">
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

              {mensajeInfo && <p className="text-sm text-red-600">{mensajeInfo}</p>}

              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? "Enviando código..." : "Continuar y recibir código OTP"}
              </Button>
            </form>
          )}

          {paso === "otp" && (
            <form onSubmit={verificarOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Código de verificación</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={codigoOtp}
                  onChange={(e) => setCodigoOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                />
                {errores.otp && <p className="text-sm text-red-600">{errores.otp}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? "Verificando..." : "Verificar y crear cuenta"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setPaso("datos")}
              >
                Volver
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}