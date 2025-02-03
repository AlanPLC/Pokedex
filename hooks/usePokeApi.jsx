import { useEffect, useState } from 'react';

export default function useFetchPokemons() {
  const [listaPokemon, setListaPokemon] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
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
            description: especiesPokemon.flavor_text_entries.find((s) => s.language.name === 'es')?.flavor_text.replace(/\n/g, ' ') || 'No hay descripción disponible.',

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

  // Carga un pokemon especifico por su ID
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

      const abilities = await Promise.all(
        detallesPokemon.abilities.map(async (ability) => {
            const abilityRes = await fetch(ability.ability.url);
            if (!abilityRes.ok) {
                throw new Error(`Error HTTP ${abilityRes.status}`);
            }
            const abilityDetails = await abilityRes.json();
            
            // Filtrar la descripción en español
            const effectEntry = abilityDetails.flavor_text_entries.find(
                (entry) => entry.language.name === "es"
            );
            
            return {
                name: ability.ability.name,
                description: effectEntry
            };
        })
    );

      return {
        id,
        name: pokemon.name,
        type: detallesPokemon.types.map((type) => type.type.name).join(' '), 
        height: detallesPokemon.height,
        weight: detallesPokemon.weight,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        species: pokemon.genera.length > 5 ? pokemon.genera[5].genus : 'Desconocido',
        description: pokemon.flavor_text_entries.find((s) => s.language.name === 'es')?.flavor_text.replace(/\n/g, ' ') || 'No hay descripción disponible.',
        abilities
      };
    } catch (error) {
      console.error("Error al obtener detalles del Pokémon", error);
      throw error;
    }
  };

  return { listaPokemon, error, limite, isFetchingMore, fetchPokemonById ,handleLoadMore};
}