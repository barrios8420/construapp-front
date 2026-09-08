"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

// 🔧 MODO PRUEBA: simula el envío/verificación de OTP sin necesitar las keys reales de Supabase.
// Cuando Joy te pase las keys, cámbialo a `false` y todo se conecta al backend real.
const MODO_PRUEBA = true;
const OTP_DE_PRUEBA = "123456";

export default function RegistroContratistaPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [codigoOtp, setCodigoOtp] = useState("");

  const [paso, setPaso] = useState<"datos" | "otp">("datos");
  const [errores, setErrores] = useState<{ correo?: string; nombre?: string; celular?: string; otp?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeInfo, setMensajeInfo] = useState("");

  function validarCorreo(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function validarCelular(valor: string) {
    if (valor.trim() === "") return true; // el celular es opcional
    return /^[0-9]{10}$/.test(valor);
  }

  async function enviarOtp(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores: typeof errores = {};

    if (!validarCorreo(correo)) {
      nuevosErrores.correo = "Ingresa un correo válido";
    }
    if (nombre.trim().length < 2) {
      nuevosErrores.nombre = "Ingresa tu nombre completo";
    }
    if (!validarCelular(celular)) {
      nuevosErrores.celular = "El celular debe tener exactamente 10 dígitos";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    setMensajeInfo("");

    if (MODO_PRUEBA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEnviando(false);
      setPaso("otp");
      setMensajeInfo(`[MODO PRUEBA] Usa el código ${OTP_DE_PRUEBA} para continuar`);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: correo,
    });

    setEnviando(false);

    if (error) {
      setMensajeInfo(`No pudimos enviar el código: ${error.message}`);
      return;
    }

    setPaso("otp");
    setMensajeInfo(`Te enviamos un código a ${correo}`);
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

      router.push("/mapa");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email: correo,
      token: codigoOtp,
      type: "email",
    });

    setEnviando(false);

    if (error) {
      setErrores({ otp: "Código incorrecto o expirado. Inténtalo de nuevo." });
      return;
    }

    // TODO: aquí se guarda el contratista en la tabla correspondiente (nombre, correo, celular)

    router.push("/mapa");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {paso === "datos" ? "Regístrate como contratista" : "Verifica tu correo"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {paso === "datos"
              ? "Es gratis. Empieza a buscar trabajadores verificados en Cali."
              : mensajeInfo || `Ingresa el código enviado a tu correo.`}
          </p>
        </CardHeader>
        <CardContent>
          {paso === "datos" && (
            <form onSubmit={enviarOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tucorreo@gmail.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                {errores.correo && <p className="text-sm text-red-600">{errores.correo}</p>}
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
                {errores.nombre && <p className="text-sm text-red-600">{errores.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">
                  Celular <span className="text-muted-foreground">(opcional)</span>
                </Label>
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

              {mensajeInfo && <p className="text-sm text-red-600">{mensajeInfo}</p>}

              <Button type="submit" className="w-full" disabled={enviando}>
                {enviando ? "Enviando código..." : "Continuar"}
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