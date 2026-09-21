export const getSpanishDescription = (entries) =>
  entries.find((entry) => entry.language.name === 'es')?.flavor_text.replace(/\n/g, ' ') || 'No hay descripción disponible.';

export const buildSpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const buildShinySpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

// Extrae el id numérico de una url tipo ".../pokemon-species/25/" o ".../pokemon/25/".
export const extractIdFromUrl = (url) => Number(url.split('/').filter(Boolean).pop());

// Devuelve null si alguno de los fetches falla (ej. un id de forma especial sin ficha de especie propia),
// para que quien llame pueda descartar esa entrada en vez de romper todo el lote.
export const fetchPokemonSummary = async ({ id, name }) => {
  try {
    const [speciesRes, detailsRes] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`),
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`),
    ]);
    if (!speciesRes.ok || !detailsRes.ok) return null;

    const [especiesPokemon, detallesPokemon] = await Promise.all([speciesRes.json(), detailsRes.json()]);
    return {
      id,
      name,
      image: buildSpriteUrl(id),
      types: detallesPokemon.types.map((entry) => entry.type.name),
      species: especiesPokemon.genera.find((genus) => genus.language.name === 'es')?.genus ?? 'Especie Desconocida',
    };
  } catch (error) {
    console.error(`Error al traer el resumen del pokemon ${id}`, error);
    return null;
  }
};
