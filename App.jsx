import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [listaPokemon, setListaPokemon] = useState([]);

  const detallesFetch = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      const data = await response.json();
      const pokemons = data.results;

      const listaDetallada = await Promise.all(
        pokemons.map(async (pokemon) => {
          const pokemonRes = await fetch(pokemon.url); // Cambiado aquí

          if (!pokemonRes.ok) { // Cambiado para verificar pokemonRes
            throw new Error(`Error HTTP ${pokemonRes.status}`);
          }
          const detallesPokemon = await pokemonRes.json();
          
          const speciesRes = await fetch(detallesPokemon.species.url); // Cambiado para usar detallesPokemon

          if (!speciesRes.ok) {
            throw new Error(`Error HTTP ${speciesRes.status}`);
          }

          const especiesPokemon = await speciesRes.json();

          return {
            name: detallesPokemon.name,
            image: detallesPokemon.sprites.front_default,
            species: especiesPokemon.genera.length > 5 ? especiesPokemon.genera[5].genus : 'Desconocido',
            description: especiesPokemon.flavor_text_entries.find((s) => s.language.name === 'es')?.flavor_text.replace(/\n/g, ' ') || 'No hay descripción disponible.'
          };
        })
      );
    } catch (error) {
      console.error(`Error en el Fetch a detalles pokemon`, error);
    }
  };

  useEffect(() => {
    detallesFetch();
  }, []);

  console.log(listaPokemon);

  return (
    <View style={styles.container}>
      <Text>SALUTE</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
