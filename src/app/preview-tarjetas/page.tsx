"use client";

import { useState } from "react";
import TarjetaTrabajador, { Trabajador } from "@/components/ui/TarjetaTrabajador";
import FiltrosBusqueda, { FiltrosValores } from "@/components/ui/FiltrosBusqueda";

const trabajadoresDePrueba: Trabajador[] = [
  { id: "1", nombre: "Carlos Ramírez", oficio: "Albañil", rating: 4.8, distanciaKm: 1.2 },
  { id: "2", nombre: "Luz Marina Gómez", oficio: "Electricista", rating: 4.2, distanciaKm: 3.7 },
  { id: "3", nombre: "Andrés Torres", oficio: "Plomero", rating: 3.5, distanciaKm: 6.1 },
];

export default function PreviewTarjetasPage() {
  const [filtros, setFiltros] = useState<FiltrosValores>({
    oficio: "Todos los oficios",
    radioKm: 5,
  });

  const trabajadoresFiltrados = trabajadoresDePrueba.filter((t) => {
    const coincideOficio = filtros.oficio === "Todos los oficios" || t.oficio === filtros.oficio;
    const dentroDelRadio = t.distanciaKm <= filtros.radioKm;
    return coincideOficio && dentroDelRadio;
  });

  return (
    <div className="mx-auto max-w-md space-y-4 bg-neutral-50 p-6">
      <h1 className="text-xl font-semibold">Vista previa de tarjetas + filtros</h1>

      <FiltrosBusqueda onChange={setFiltros} />

      <div className="space-y-3">
        {trabajadoresFiltrados.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No hay trabajadores con esos filtros.
          </p>
        )}
        {trabajadoresFiltrados.map((t) => (
          <TarjetaTrabajador
            key={t.id}
            trabajador={t}
            onClick={(id) => console.log("Click en trabajador:", id)}
          />
        ))}
      </div>
    </div>
  );
}