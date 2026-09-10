"use client";

import FotoConUbicacion, { FotoConUbicacionResultado } from "@/components/ui/FotoConUbicacion";

export default function PreviewGeolocalizacionPage() {
  function manejarFotoLista(resultado: FotoConUbicacionResultado) {
    console.log("Foto capturada:", resultado.file.name, resultado.file.size, "bytes");
    console.log("Coordenadas:", resultado.coordenadas);
  }

  return (
    <div className="mx-auto max-w-md space-y-4 bg-neutral-50 p-6">
      <h1 className="text-xl font-semibold">Vista previa: foto + ubicación</h1>
      <FotoConUbicacion onFotoLista={manejarFotoLista} />
    </div>
  );
}