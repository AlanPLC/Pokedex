import { useEffect, useState } from 'react';

const getSpanishDescription = (entries) =>
  entries.find((entry) => entry.language.name === 'es')?.flavor_text.replace(/\n/g, ' ') || 'No hay descripción disponible.';

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

      const listaDetallada = await Promise.all(
        pokemons.map(async (pokemon, index) => {
          const id = index + (page - 1) * limite + 1;

          const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
          if (!speciesRes.ok) {
            throw new Error(`Error HTTP ${speciesRes.status}`);
          }
          const especiesPokemon = await speciesRes.json();

          return {

            id,
            name: pokemon.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            description: getSpanishDescription(especiesPokemon.flavor_text_entries),

          };
        })
      );
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

  return { listaPokemon, error, limite, isFetchingMore, hasMore, handleLoadMore};
}

// Carga los detalles completos de un único pokemon por su ID, sin depender del listado paginado.
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

      return {
        id,
        name: pokemon.name,
        type: detallesPokemon.types.map((type) => type.type.name).join(' '),
        height: detallesPokemon.height,
        weight: detallesPokemon.weight,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        species: pokemon.genera.length > 5 ? pokemon.genera[5].genus : 'Desconocido',
        description: getSpanishDescription(pokemon.flavor_text_entries),
      };
    } catch (error) {
      console.error("Error al obtener detalles del Pokémon", error);
      throw error;
    }
  };

  return { fetchPokemonById };
}
