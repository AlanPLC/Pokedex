import useFetchPokemons from "../hooks/usePokeApi.jsx";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, FlatList, Text } from "react-native";
import { SearchContext } from "../hooks/searchContext.js";
import { useContext, useEffect } from "react";
import PokemonItem from "../components/pokemonItem.jsx";
import SinResultados from "../components/sinResultados.jsx"; 

export default function Pokedex() {
  const { listaPokemon, error, isFetchingMore, hasMore, handleLoadMore, isFetching } = useFetchPokemons();
  const { search, setSearch } = useContext(SearchContext);

  const filteredPokemons = listaPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );
  const shouldHasMore = !search && hasMore;

  useEffect(() => {
    if (filteredPokemons.length === 0 && !isFetching) {
      handleLoadMore();
    }
  }, [filteredPokemons, isFetching]);

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      {filteredPokemons.length === 0 ? (
        <SinResultados onClearSearch={() => setSearch("")} />
      ) : (
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
      )}
      <StatusBar style="auto" />
    </View>
  );
}