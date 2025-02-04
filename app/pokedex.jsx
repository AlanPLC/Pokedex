import useFetchPokemons from "../hooks/usePokeApi.jsx";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, FlatList, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Pokedex() {
  const { listaPokemon, error, isFetchingMore, handleLoadMore } = useFetchPokemons();

  if (listaPokemon.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="black" />
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

  const renderItem = ({ item }) => {
    const { image, id, name, description } = item;
    return (
      <Link href={`/${id}`} asChild>
        <Pressable>
          <View
            style={{
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#e2e8f0",
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View style={{
              borderWidth: 1.5,
              borderColor: "#ffbc03",
              borderRadius: 4,
              backgroundColor: "#f5f5f5",
              padding:2
            }}>
              <Image source={{ uri: image }} style={{ width: 80, height: 80 }} />
              <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center"}}>#{id}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 8, gap:5}}>
              <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: "uppercase" }}>{name}</Text>
              <Text style={{fontSize:14}}>{description}</Text>
              <Text style={{color:"#ffbc03", fontWeight:"bold"}}>Ver más...</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <View style={{backgroundColor:"#fff"}}>
      <FlatList
        data={listaPokemon}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={5}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1} // Este valor controla cuándo cargar más (0.1 = 10% antes del final)
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="gray" /> : null}
      />
      <StatusBar style="auto" />
    </View>
  );
}