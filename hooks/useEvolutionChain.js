import { useEffect, useState } from "react";
import { extractIdFromUrl } from "./pokeApiHelpers.js";

// Aplana el árbol de evolución en "etapas": cada etapa es una lista de opciones (soporta ramas, ej. Eevee).
const aplanarCadena = (nodo, etapas = [], profundidad = 0) => {
  if (!nodo) return etapas;

  if (!etapas[profundidad]) etapas[profundidad] = [];
  etapas[profundidad].push({
    id: extractIdFromUrl(nodo.species.url),
    name: nodo.species.name,
  });

  nodo.evolves_to.forEach((siguiente) => aplanarCadena(siguiente, etapas, profundidad + 1));
  return etapas;
};

export default function useEvolutionChain(evolutionChainUrl) {
  const [etapas, setEtapas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!evolutionChainUrl) {
      setEtapas([]);
      return;
    }

    let cancelado = false;
    setIsLoading(true);

    fetch(evolutionChainUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelado) setEtapas(aplanarCadena(data.chain));
      })
      .catch((error) => console.error("Error al obtener la cadena evolutiva", error))
      .finally(() => {
        if (!cancelado) setIsLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [evolutionChainUrl]);

  return { etapas, isLoading };
}
