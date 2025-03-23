import useFetchPokemons from "../hooks/usePokeApi.jsx";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, FlatList, Text, Pressable } from "react-native";
import { SearchContext } from "../hooks/searchContext.js";
import { useContext } from "react";
import PokemonItem from "../components/pokemonItem.jsx"; 

export default function Pokedex() {
  const { listaPokemon, error, isFetchingMore, hasMore, handleLoadMore } = useFetchPokemons();
  const { search, setSearch } = useContext(SearchContext);

  const filteredPokemons = listaPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );
  const shouldHasMore = !search && hasMore;

  if (filteredPokemons.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>No se encontraron resultados.</Text>
        <Pressable onPress={() => setSearch("")}>
          <Text style={{ fontSize: 16, color: "#ffbc03" }}>Limpiar búsqueda</Text>
        </Pressable>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <FlatList
        data={filteredPokemons}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <PokemonItem item={item} />} 
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={5}
        onEndReached={shouldHasMore ? handleLoadMore : null}
        onEndReachedThreshold={0.1}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="gray" /> : null}
      />
      <StatusBar style="auto" />
    </View>
  );
}