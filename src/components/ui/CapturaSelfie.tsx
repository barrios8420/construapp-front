"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CapturaSelfieProps {
  onCapture: (imagen: { base64: string; file: File }) => void;
}

export default function CapturaSelfie({ onCapture }: CapturaSelfieProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [estado, setEstado] = useState<"inicial" | "camara" | "preview" | "error">("inicial");
  const [foto, setFoto] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const iniciarCamara = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setEstado("camara");
    } catch (err) {
      setErrorMsg(
        "No pudimos acceder a tu cámara. Revisa los permisos del navegador e inténtalo de nuevo."
      );
      setEstado("error");
    }
  }, []);

  useEffect(() => {
    if (estado === "camara" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Error al reproducir el video:", err);
      });
    }
  }, [estado]);

  const detenerCamara = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const tomarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setFoto(dataUrl);
    detenerCamara();
    setEstado("preview");
  };

  const retomar = () => {
    setFoto(null);
    iniciarCamara();
  };

  const confirmarFoto = () => {
    if (!foto) return;

    const arr = foto.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], "selfie.jpg", { type: mime });

    onCapture({ base64: foto, file });
  };

  return (
    <div className="space-y-3">
      {estado === "inicial" && (
        <div className="rounded-md border border-dashed border-neutral-300 p-4 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            📸 Vamos a tomar tu selfie de verificación
          </p>
          <Button type="button" onClick={iniciarCamara} className="w-full">
            Activar cámara
          </Button>
        </div>
      )}

      {estado === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          {errorMsg}
          <Button
            type="button"
            variant="outline"
            onClick={iniciarCamara}
            className="mt-3 w-full"
          >
            Reintentar
          </Button>
        </div>
      )}

      {estado === "camara" && (
        <div className="space-y-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-md border border-neutral-300 [transform:scaleX(-1)]"
          />
          <Button type="button" onClick={tomarFoto} className="w-full">
            Tomar foto
          </Button>
        </div>
      )}

      {estado === "preview" && foto && (
        <div className="space-y-3">
          <img
            src={foto}
            alt="Vista previa de tu selfie"
            className="w-full rounded-md border border-neutral-300"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={retomar} className="flex-1">
              Retomar
            </Button>
            <Button type="button" onClick={confirmarFoto} className="flex-1">
              Usar esta foto
            </Button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}