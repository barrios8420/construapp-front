"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGeolocation, Coordenadas } from "@/hooks/useGeolocation";
import { MapPin, Loader2 } from "lucide-react";

export interface FotoConUbicacionResultado {
  file: File;
  previewUrl: string;
  coordenadas: Coordenadas | null;
}

interface FotoConUbicacionProps {
  onFotoLista: (resultado: FotoConUbicacionResultado) => void;
}

export default function FotoConUbicacion({ onFotoLista }: FotoConUbicacionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { coordenadas, cargando, error, obtenerUbicacion } = useGeolocation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function manejarSeleccionArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const coords = await obtenerUbicacion();

    onFotoLista({ file, previewUrl: url, coordenadas: coords });
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={manejarSeleccionArchivo}
        className="hidden"
      />

      {!previewUrl && (
        <Button type="button" onClick={() => inputRef.current?.click()} className="w-full">
          Agregar foto de trabajo
        </Button>
      )}

      {previewUrl && (
        <div className="space-y-2">
          <img
            src={previewUrl}
            alt="Foto del portafolio"
            className="w-full rounded-md border border-neutral-300"
          />

          {cargando && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" />
              Obteniendo ubicación...
            </div>
          )}

          {coordenadas && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              Ubicación registrada ({coordenadas.lat.toFixed(5)}, {coordenadas.lng.toFixed(5)}) — precisión ±{Math.round(coordenadas.precision)}m
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPreviewUrl(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="w-full"
          >
            Cambiar foto
          </Button>
        </div>
      )}
    </div>
  );
}