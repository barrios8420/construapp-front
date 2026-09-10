"use client";

import { useState, useCallback } from "react";

export interface Coordenadas {
  lat: number;
  lng: number;
  precision: number; // metros
}

interface UseGeolocationResult {
  coordenadas: Coordenadas | null;
  cargando: boolean;
  error: string | null;
  obtenerUbicacion: () => Promise<Coordenadas | null>;
}

export function useGeolocation(): UseGeolocationResult {
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerUbicacion = useCallback((): Promise<Coordenadas | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("Tu navegador no soporta geolocalización.");
        resolve(null);
        return;
      }

      setCargando(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordenadas = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            precision: position.coords.accuracy,
          };
          setCoordenadas(coords);
          setCargando(false);
          resolve(coords);
        },
        (err) => {
          let mensaje = "No pudimos obtener tu ubicación.";
          if (err.code === err.PERMISSION_DENIED) {
            mensaje = "Necesitamos permiso de ubicación para continuar. Revisa los permisos del navegador.";
          } else if (err.code === err.TIMEOUT) {
            mensaje = "La búsqueda de ubicación tardó demasiado. Inténtalo de nuevo.";
          }
          setError(mensaje);
          setCargando(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { coordenadas, cargando, error, obtenerUbicacion };
}