import { useState } from "react";

const cache = {};

// Trae las zonas donde aparece el pokemon en los juegos, de forma perezosa (recién al abrir el desplegable).
export default function useEncounters(pokemonId) {
  const [encuentros, setEncuentros] = useState(cache[pokemonId] ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const cargar = async () => {
    if (cache[pokemonId]) {
      setEncuentros(cache[pokemonId]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`);
      const data = await res.json();
      cache[pokemonId] = data;
      setEncuentros(data);
    } catch (error) {
      console.error("Error al obtener ubicaciones", error);
      setEncuentros([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { encuentros, isLoading, cargar };
}
