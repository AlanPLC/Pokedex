import { useRef, useState } from "react";
import { extractIdFromUrl, fetchPokemonSummary } from "./pokeApiHelpers.js";

const RESULTADOS_POR_PAGINA = 20;
const cachePorTipo = {};

const getPokemonsDelTipo = (typeName) => {
  if (!cachePorTipo[typeName]) {
    cachePorTipo[typeName] = fetch(`https://pokeapi.co/api/v2/type/${typeName}/`)
      .then((res) => res.json())
      .then((data) =>
        data.pokemon
          .map(({ pokemon }) => ({
            id: extractIdFromUrl(pokemon.url),
            name: pokemon.name,
          }))
          // Formas especiales/alternativas (Arceus, Rotom, Gigamax, etc.) usan ids >= 10000 y no tienen
          // una ficha de especie propia en la API, así que se descartan del listado por tipo.
          .filter((pokemon) => pokemon.id < 10000)
      );
  }
  return cachePorTipo[typeName];
};

export default function useTypeFilter() {
  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreResultados, setHasMoreResultados] = useState(false);
  const coincidenciasRef = useRef([]);
  const cargadosRef = useRef(0);
  const tipoRef = useRef(null);

  const filtrarPorTipo = async (typeName) => {
    tipoRef.current = typeName;

    if (!typeName) {
      coincidenciasRef.current = [];
      cargadosRef.current = 0;
      setResultados([]);
      setHasMoreResultados(false);
      return;
    }

    setIsLoading(true);
    const pokemons = await getPokemonsDelTipo(typeName);
    if (tipoRef.current !== typeName) return;

    const primerLote = pokemons.slice(0, RESULTADOS_POR_PAGINA);
    const detalles = (await Promise.all(primerLote.map(fetchPokemonSummary))).filter(Boolean);
    if (tipoRef.current !== typeName) return;

    coincidenciasRef.current = pokemons;
    cargadosRef.current = primerLote.length;
    setResultados(detalles);
    setHasMoreResultados(pokemons.length > primerLote.length);
    setIsLoading(false);
  };

  const cargarMasResultados = async () => {
    if (isLoadingMore || !hasMoreResultados) return;
    setIsLoadingMore(true);
    const typeName = tipoRef.current;
    const siguienteLote = coincidenciasRef.current.slice(cargadosRef.current, cargadosRef.current + RESULTADOS_POR_PAGINA);
    const detalles = (await Promise.all(siguienteLote.map(fetchPokemonSummary))).filter(Boolean);

    if (tipoRef.current === typeName) {
      cargadosRef.current += siguienteLote.length;
      setResultados((prev) => [...prev, ...detalles]);
      setHasMoreResultados(cargadosRef.current < coincidenciasRef.current.length);
    }
    setIsLoadingMore(false);
  };

  return { resultados, isLoading, isLoadingMore, hasMoreResultados, filtrarPorTipo, cargarMasResultados };
}
