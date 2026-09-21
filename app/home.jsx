import { Stack, useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Search, Filter, Heart, GitCompare, Sparkles, Volume2, TrendingUp, GitBranch, Shield, MapPin } from "lucide-react-native";
import useSpeciesCount from "../hooks/useSpeciesCount.js";
import Card from "../components/ui/Card.jsx";
import { colors, spacing, radius } from "../constants/theme.js";

const FEATURES = [
  { icon: Search, texto: "Buscá por nombre, con resultados a medida que escribís" },
  { icon: Filter, texto: "Filtrá la lista por tipo de pokémon" },
  { icon: TrendingUp, texto: "Mirá las estadísticas base en barras" },
  { icon: GitBranch, texto: "Recorré la cadena evolutiva de cada pokémon" },
  { icon: Shield, texto: "Consultá debilidades, resistencias y contra qué tipos es eficaz" },
  { icon: Sparkles, texto: "Descubrí su versión shiny" },
  { icon: Volume2, texto: "Escuchá su grito" },
  { icon: MapPin, texto: "Fijate en qué juegos y zonas del mapa aparece" },
  { icon: Heart, texto: "Armá tu equipo de hasta 6 favoritos" },
  { icon: GitCompare, texto: "Comparalos de a dos, stat por stat" },
];

export default function Home() {
  const router = useRouter();
  const totalEspecies = useSpeciesCount();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, alignItems: "center", gap: spacing.md }}
    >
      <Stack.Screen options={{ headerTitle: "Pokedex", headerTitleAlign: "center", headerRight: () => null }} />

      <Text style={{ color: colors.textMuted, textAlign: "center", fontSize: 16 }}>
        Explorá, compará y armá tu equipo con {totalEspecies ? `los ${totalEspecies}` : "todos los"} pokémon existentes, con
        datos en vivo de la PokeAPI.
      </Text>

      <Pressable
        onPress={() => router.push("/pokedex")}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.full,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.background }}>Explorar Pokédex</Text>
      </Pressable>

      <Card style={{ width: "100%", gap: spacing.sm }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.text, marginBottom: spacing.xs }}>Qué podés hacer</Text>
        {FEATURES.map(({ icon: Icon, texto }, index) => (
          <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <Icon size={20} color={colors.primary} />
            <Text style={{ color: colors.text, flex: 1 }}>{texto}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}
