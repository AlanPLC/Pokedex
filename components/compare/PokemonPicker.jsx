import { useState } from "react";
import { View, TextInput, Text, Pressable, Image } from "react-native";
import { usePokemonNameCatalog } from "../../hooks/usePokeApi.jsx";
import { buildSpriteUrl } from "../../hooks/pokeApiHelpers.js";
import { colors, spacing, radius } from "../../constants/theme.js";

export default function PokemonPicker({ onSelect, placeholder }) {
  const catalogo = usePokemonNameCatalog();
  const [texto, setTexto] = useState("");

  const coincidencias =
    texto.trim().length > 0
      ? catalogo.filter((pokemon) => pokemon.name.includes(texto.trim().toLowerCase())).slice(0, 6)
      : [];

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder={placeholder ?? "Nombre del pokémon"}
        style={{
          borderWidth: 1.5,
          borderColor: colors.border,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          width: "100%",
        }}
      />
      {coincidencias.length > 0 ? (
        <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, marginTop: spacing.xs, overflow: "hidden" }}>
          {coincidencias.map((pokemon) => (
            <Pressable
              key={pokemon.id}
              onPress={() => {
                setTexto("");
                onSelect(pokemon);
              }}
              style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.sm }}
            >
              <Image source={{ uri: buildSpriteUrl(pokemon.id) }} style={{ width: 28, height: 28 }} />
              <Text style={{ textTransform: "capitalize", color: colors.text }}>{pokemon.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
