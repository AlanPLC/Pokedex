import { useEffect, useRef, useState } from 'react';
import { getSpanishDescription, buildSpriteUrl, buildShinySpriteUrl, extractIdFromUrl, fetchPokemonSummary } from './pokeApiHelpers.js';

export default function useFetchPokemons() {
  const [listaPokemon, setListaPokemon] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limite = 20

  const detallesFetch = async () => {
    try {
      setIsFetchingMore(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${(page - 1) * limite}`);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      const data = await response.json();
      const pokemons = data.results;

      if(pokemons.length == 0){
        setHasMore(false);
        return;
      }

      const listaDetallada = (
        await Promise.all(
          pokemons.map(async (pokemon, index) => {
            const id = index + (page - 1) * limite + 1;
            return fetchPokemonSummary({ id, name: pokemon.name });
          })
        )
      ).filter(Boolean);
      setListaPokemon((prev)=> [...prev,...listaDetallada]);
      setIsFetchingMore(false);
    } catch (error) {
      console.error(`Error en el Fetch a detalles pokemon`, error);
      setError(error.message);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    detallesFetch();
  }, [page]);


  const handleLoadMore = () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { listaPokemon, error, limite, isFetchingMore, hasMore, handleLoadMore };
}

const RESULTADOS_POR_PAGINA = 20;
let catalogoNombresPromise = null;

// Trae una sola vez el catálogo liviano (solo nombre + id) de todos los pokemon, para poder filtrar por substring sin pedirle a la API una coincidencia exacta.
const getCatalogoNombres = () => {
  if (!catalogoNombresPromise) {
    catalogoNombresPromise = fetch('https://pokeapi.co/api/v2/pokemon-species?limit=100000')
      .then((res) => res.json())
      .then((data) =>
        data.results.map((especie) => ({
          id: extractIdFromUrl(especie.url),
          name: especie.name,
        }))
      );
  }
  return catalogoNombresPromise;
};

// Expone el catálogo liviano de nombres ya cacheado, para pickers que solo necesitan filtrar en el momento (sin red por tecla).
export function usePokemonNameCatalog() {
  const [catalogo, setCatalogo] = useState([]);

  useEffect(() => {
    let cancelado = false;
    getCatalogoNombres().then((data) => {
      if (!cancelado) setCatalogo(data);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  return catalogo;
}

// Busca por coincidencia parcial de nombre contra el catálogo completo, trayendo los detalles de a RESULTADOS_POR_PAGINA.
export function usePokemonSearch() {
  const [resultados, setResultados] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreResultados, setHasMoreResultados] = useState(false);
  const coincidenciasRef = useRef([]);
  const cargadosRef = useRef(0);
  const terminoRef = useRef('');

  const buscar = async (termino) => {
    const term = termino.trim().toLowerCase();
    terminoRef.current = term;

    if (!term) {
      coincidenciasRef.current = [];
      cargadosRef.current = 0;
      setResultados([]);
      setHasMoreResultados(false);
      return;
    }

    setIsSearching(true);
    const catalogo = await getCatalogoNombres();
    if (terminoRef.current !== term) return;

    const coincidencias = catalogo.filter((pokemon) => pokemon.name.includes(term));
    const primerLote = coincidencias.slice(0, RESULTADOS_POR_PAGINA);
    const detalles = (await Promise.all(primerLote.map(fetchPokemonSummary))).filter(Boolean);
    if (terminoRef.current !== term) return;

    coincidenciasRef.current = coincidencias;
    cargadosRef.current = primerLote.length;
    setResultados(detalles);
    setHasMoreResultados(coincidencias.length > primerLote.length);
    setIsSearching(false);
  };

  const cargarMasResultados = async () => {
    if (isLoadingMore || !hasMoreResultados) return;
    setIsLoadingMore(true);
    const term = terminoRef.current;
    const siguienteLote = coincidenciasRef.current.slice(cargadosRef.current, cargadosRef.current + RESULTADOS_POR_PAGINA);
    const detalles = (await Promise.all(siguienteLote.map(fetchPokemonSummary))).filter(Boolean);

    if (terminoRef.current === term) {
      cargadosRef.current += siguienteLote.length;
      setResultados((prev) => [...prev, ...detalles]);
      setHasMoreResultados(cargadosRef.current < coincidenciasRef.current.length);
    }
    setIsLoadingMore(false);
  };

  return { resultados, isSearching, isLoadingMore, hasMoreResultados, buscar, cargarMasResultados };
}

// Carga los detalles completos de un único pokemon por su ID (o nombre), sin depender del listado paginado.
export function usePokemonDetail() {
  const fetchPokemonById = async (id) => {
    try {
      const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
      if (!pokemonRes.ok) {
        throw new Error(`Error HTTP ${pokemonRes.status}`);
      }

      const pokemon = await pokemonRes.json();

      const detailsRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      if (!detailsRes.ok) {
        throw new Error(`Error HTTP ${detailsRes.status}`);
      }
      const detallesPokemon = await detailsRes.json();

      const stats = detallesPokemon.stats.map((entry) => ({
        name: entry.stat.name,
        base: entry.base_stat,
      }));

      return {
        id,
        name: pokemon.name,
        type: detallesPokemon.types.map((type) => type.type.name).join(' '),
        types: detallesPokemon.types.map((type) => type.type.name),
        height: detallesPokemon.height,
        weight: detallesPokemon.weight,
        image: buildSpriteUrl(id),
        shinyImage: buildShinySpriteUrl(id),
        cryUrl: detallesPokemon.cries?.latest ?? null,
        stats,
        evolutionChainUrl: pokemon.evolution_chain?.url ?? null,
        species: pokemon.genera.find((genus) => genus.language.name === 'es')?.genus ?? 'Especie Desconocida',
        description: getSpanishDescription(pokemon.flavor_text_entries),
      };
    } catch (error) {
      console.error("Error al obtener detalles del Pokémon", error);
      throw error;
    }
  };

  return { fetchPokemonById };
}
