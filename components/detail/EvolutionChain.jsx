import { ScrollView, View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { buildSpriteUrl } from "../../hooks/pokeApiHelpers.js";
import { colors, spacing, radius } from "../../constants/theme.js";

export default function EvolutionChain({ etapas, currentId }) {
  if (!etapas || etapas.length <= 1) {
    return <Text style={{ color: colors.textMuted, width: "100%", textAlign: "center" }}>Este Pokémon no evoluciona.</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        {etapas.map((etapa, index) => (
          <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              {etapa.map((pokemon) => (
                <Link key={pokemon.id} href={`/${pokemon.id}`} asChild>
                  <Pressable style={{ alignItems: "center" }}>
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: radius.full,
                        backgroundColor: colors.surface,
                        borderWidth: pokemon.id === currentId ? 2 : 1,
                        borderColor: pokemon.id === currentId ? colors.primary : colors.border,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image source={{ uri: buildSpriteUrl(pokemon.id) }} style={{ width: 52, height: 52 }} />
                    </View>
                    <Text style={{ textTransform: "capitalize", fontSize: 12, marginTop: 2 }}>{pokemon.name}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
            {index < etapas.length - 1 ? <ChevronRight size={20} color={colors.textMuted} /> : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
