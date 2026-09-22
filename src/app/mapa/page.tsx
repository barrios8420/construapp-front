"use client";

import { useEffect, useState } from "react";
import MapaCali, { TrabajadorMapa } from "@/components/ui/MapaCali";
import { supabase } from "@/lib/supabase";

// TODO: cuando la tabla `trabajadores` tenga columnas de oficio y ubicación (lat/lng),
// reemplazar el array de abajo por esta consulta real:
//
// const { data } = await supabase
//   .from("trabajadores")
//   .select("id, nombre_completo, oficio, lat, lng")
//   .not("lat", "is", null);
//
// const trabajadores: TrabajadorMapa[] = (data ?? []).map((t) => ({
//   id: t.id,
//   nombre: t.nombre_completo,
//   oficio: t.oficio,
//   lat: t.lat,
//   lng: t.lng,
// }));

const trabajadoresDePrueba: TrabajadorMapa[] = [
  { id: "1", nombre: "Carlos Ramírez", oficio: "Albañil", lat: 3.4516, lng: -76.532 },
  { id: "2", nombre: "Luz Marina Gómez", oficio: "Electricista", lat: 3.44, lng: -76.52 },
  { id: "3", nombre: "Andrés Torres", oficio: "Plomero", lat: 3.46, lng: -76.54 },
];

export default function MapaPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">Trabajadores cerca de ti</h1>
      <MapaCali
        trabajadores={trabajadoresDePrueba}
        onSelectTrabajador={(id) => console.log("Trabajador seleccionado:", id)}
      />
    </div>
  );
}