import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import PokemonPicker from "../components/compare/PokemonPicker.jsx";
import StatBars from "../components/detail/StatBars.jsx";
import TypeBadge from "../components/ui/TypeBadge.jsx";
import Card from "../components/ui/Card.jsx";
import { BackButton, HomeLogoButton } from "../components/HeaderNav.jsx";
import { usePokemonDetail } from "../hooks/usePokeApi.jsx";
import { colors, spacing } from "../constants/theme.js";

const Selector = ({ label, pokemon, isLoading, onPick }) => (
  <Card style={{ flex: 1, alignItems: "center", gap: spacing.sm, minHeight: 160, justifyContent: "center" }}>
    <Text style={{ fontWeight: "bold", color: colors.textMuted }}>{label}</Text>
    {isLoading ? (
      <ActivityIndicator color={colors.primary} />
    ) : pokemon ? (
      <>
        <Image source={{ uri: pokemon.image }} style={{ width: 80, height: 80 }} />
        <Text style={{ fontWeight: "bold", textTransform: "uppercase" }}>{pokemon.name}</Text>
        <View style={{ flexDirection: "row", gap: spacing.xs, flexWrap: "wrap", justifyContent: "center" }}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size={18} />
          ))}
        </View>
      </>
    ) : (
      <PokemonPicker onSelect={onPick} placeholder={`Elegí a ${label}`} />
    )}
  </Card>
);

export default function Comparar() {
  const { a, b } = useLocalSearchParams();
  const [pokemonA, setPokemonA] = useState(null);
  const [pokemonB, setPokemonB] = useState(null);
  const [cargandoA, setCargandoA] = useState(false);
  const [cargandoB, setCargandoB] = useState(false);
  const { fetchPokemonById } = usePokemonDetail();

  const elegir = async (resumen, setPokemon, setCargando) => {
    setCargando(true);
    const detalle = await fetchPokemonById(resumen.id);
    setPokemon(detalle);
    setCargando(false);
  };

  // Si se llega desde la selección de la lista, los ids ya vienen por parámetro: se cargan directo, sin pedir que se busquen a mano.
  useEffect(() => {
    if (a) elegir({ id: Number(a) }, setPokemonA, setCargandoA);
  }, [a]);

  useEffect(() => {
    if (b) elegir({ id: Number(b) }, setPokemonB, setCargandoB);
  }, [b]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Stack.Screen
        options={{
          headerTitle: "Comparador",
          headerTitleAlign: "center",
          headerLeft: () => <BackButton />,
          headerRight: () => <HomeLogoButton />,
        }}
      />

      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Selector label="Pokémon A" pokemon={pokemonA} isLoading={cargandoA} onPick={(p) => elegir(p, setPokemonA, setCargandoA)} />
        <Selector label="Pokémon B" pokemon={pokemonB} isLoading={cargandoB} onPick={(p) => elegir(p, setPokemonB, setCargandoB)} />
      </View>

      {pokemonA && pokemonB ? (
        <Card>
          <StatBars stats={pokemonA.stats} compareStats={pokemonB.stats} labelA={pokemonA.name} labelB={pokemonB.name} />
        </Card>
      ) : (
        <Text style={{ color: colors.textMuted, textAlign: "center" }}>Elegí dos pokémon para comparar sus stats.</Text>
      )}
    </ScrollView>
  );
}
