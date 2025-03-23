import React, { memo } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";

const PokemonItem = memo(({ item }) => {
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
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#ffbc03",
              borderRadius: 4,
              backgroundColor: "#f5f5f5",
              padding: 2,
            }}
          >
            <Image source={{ uri: image }} style={{ width: 80, height: 80 }} />
            <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>#{id}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 8, gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: "uppercase" }}>{name}</Text>
            <Text style={{ fontSize: 14 }}>{description}</Text>
            <Text style={{ color: "#ffbc03", fontWeight: "bold" }}>Ver más...</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

export default PokemonItem;