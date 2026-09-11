"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";

const CALI_CENTRO = { lat: 3.4516, lng: -76.532 };

const contenedorEstilo = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

export interface TrabajadorMapa {
  id: string;
  nombre: string;
  oficio: string;
  lat: number;
  lng: number;
}

interface MapaCaliProps {
  trabajadores: TrabajadorMapa[];
  onSelectTrabajador?: (id: string) => void;
}

export default function MapaCali({ trabajadores, onSelectTrabajador }: MapaCaliProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [seleccionado, setSeleccionado] = useState<TrabajadorMapa | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    // Espacio para guardar la referencia del mapa si se necesita después
  }, []);

  if (loadError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-red-200 bg-red-50 text-sm text-red-600">
        No pudimos cargar el mapa. Revisa la API key de Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-muted-foreground">
        Cargando mapa...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={contenedorEstilo}
      center={CALI_CENTRO}
      zoom={12}
      onLoad={onLoad}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {trabajadores.map((t) => (
        <MarkerF
          key={t.id}
          position={{ lat: t.lat, lng: t.lng }}
          onClick={() => setSeleccionado(t)}
        />
      ))}

      {seleccionado && (
        <InfoWindowF
          position={{ lat: seleccionado.lat, lng: seleccionado.lng }}
          onCloseClick={() => setSeleccionado(null)}
        >
          <div
            className="cursor-pointer p-1"
            onClick={() => onSelectTrabajador?.(seleccionado.id)}
          >
            <p className="font-semibold">{seleccionado.nombre}</p>
            <p className="text-sm text-neutral-600">{seleccionado.oficio}</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}