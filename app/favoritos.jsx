import { Stack } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { Heart } from "lucide-react-native";
import useFavorites from "../hooks/useFavorites.js";
import PokemonItem from "../components/pokemonItem.jsx";
import { colors, spacing } from "../constants/theme.js";

export default function Favoritos() {
  const { favoritos, cargado, maxEquipo } = useFavorites();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerTitle: `Mi equipo (${favoritos.length}/${maxEquipo})`,
          headerTitleAlign: "center",
          headerRight: () => null,
        }}
      />
      {cargado && favoritos.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl, gap: spacing.sm }}>
          <Heart size={40} color={colors.border} />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text, textAlign: "center" }}>
            Todavía no armaste tu equipo.
          </Text>
          <Text style={{ color: colors.textMuted, textAlign: "center" }}>
            Tocá el corazón en la lista o en el detalle de un pokémon para sumarlo acá (hasta {maxEquipo}).
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => <PokemonItem item={item} />}
        />
      )}
    </View>
  );
}
