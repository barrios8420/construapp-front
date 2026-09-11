"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useGeolocation } from "@/hooks/useGeolocation";

interface FotoPendiente {
  id: string;
  file: File;
  previewUrl: string;
  lat?: number;
  lng?: number;
  estado: "pendiente" | "subiendo" | "subida" | "error";
}

export default function SubirPortafolioPage() {
  const [fotos, setFotos] = useState<FotoPendiente[]>([]);
  const [subiendoTodo, setSubiendoTodo] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const { obtenerUbicacion } = useGeolocation();

  async function manejarSeleccion(e: React.ChangeEvent<HTMLInputElement>) {
    const archivos = e.target.files;
    if (!archivos || archivos.length === 0) return;

    const coords = await obtenerUbicacion();

    const nuevasFotos: FotoPendiente[] = Array.from(archivos).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      lat: coords?.lat,
      lng: coords?.lng,
      estado: "pendiente",
    }));

    setFotos((prev) => [...prev, ...nuevasFotos]);
    e.target.value = "";
  }

  function eliminarFoto(id: string) {
    setFotos((prev) => prev.filter((f) => f.id !== id));
  }

  async function subirTodas() {
    setSubiendoTodo(true);
    setMensaje("");

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setMensaje("Tu sesión expiró. Vuelve a iniciar sesión.");
      setSubiendoTodo(false);
      return;
    }

    const userId = userData.user.id;

    for (const foto of fotos) {
      if (foto.estado === "subida") continue;

      setFotos((prev) =>
        prev.map((f) => (f.id === foto.id ? { ...f, estado: "subiendo" } : f))
      );

      const extension = foto.file.name.split(".").pop() || "jpg";
      const nombreArchivo = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("portafolio-fotos")
        .upload(nombreArchivo, foto.file);

      setFotos((prev) =>
        prev.map((f) =>
          f.id === foto.id ? { ...f, estado: uploadError ? "error" : "subida" } : f
        )
      );

      // TODO: guardar en una tabla (fotos_portafolio o similar) la ruta,
      // el user_id, y las coordenadas (foto.lat, foto.lng) — pendiente de definir con Joy.
    }

    setSubiendoTodo(false);
    setMensaje("Listo, revisa el estado de cada foto abajo.");
  }

  const hayFotosPendientes = fotos.some((f) => f.estado === "pendiente" || f.estado === "error");

  return (
    <div className="mx-auto max-w-md space-y-4 bg-neutral-50 p-6">
      <h1 className="text-xl font-semibold">Subir fotos del portafolio</h1>
      <p className="text-sm text-muted-foreground">
        Selecciona una o varias fotos de trabajos que hayas hecho.
      </p>

      <div>
        <input
          id="input-fotos"
          type="file"
          accept="image/*"
          multiple
          onChange={manejarSeleccion}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById("input-fotos")?.click()}
        >
          Seleccionar fotos
        </Button>
      </div>

      {fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative">
              <img
                src={foto.previewUrl}
                alt="Miniatura"
                className="aspect-square w-full rounded-md border border-neutral-300 object-cover"
              />

              {foto.estado === "pendiente" && (
                <button
                  type="button"
                  onClick={() => eliminarFoto(foto.id)}
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-neutral-900 p-1 text-white"
                  aria-label="Eliminar foto"
                >
                  <X size={12} />
                </button>
              )}

              {foto.estado === "subiendo" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                  <Loader2 size={18} className="animate-spin text-white" />
                </div>
              )}

              {foto.estado === "subida" && (
                <div className="absolute bottom-1 right-1 rounded-full bg-green-600 px-1.5 py-0.5 text-[10px] text-white">
                  ✓
                </div>
              )}

              {foto.estado === "error" && (
                <div className="absolute bottom-1 right-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] text-white">
                  Error
                </div>
              )}

              {foto.lat && foto.lng && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin size={10} />
                  <span>Con ubicación</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {fotos.length > 0 && (
        <Button
          type="button"
          className="w-full"
          disabled={subiendoTodo || !hayFotosPendientes}
          onClick={subirTodas}
        >
          {subiendoTodo ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              Subir {fotos.filter((f) => f.estado !== "subida").length} foto(s)
            </>
          )}
        </Button>
      )}

      {mensaje && <p className="text-center text-sm text-muted-foreground">{mensaje}</p>}
    </div>
  );
}