import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { usePokemonDetail } from "../hooks/usePokeApi.jsx";
import useEvolutionChain from "../hooks/useEvolutionChain.js";
import useTypeEffectiveness from "../hooks/useTypeEffectiveness.js";
import useFavorites from "../hooks/useFavorites.js";
import { ScrollView, View, Text, Image, ActivityIndicator, Pressable } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Heart, Play, Sparkles } from "lucide-react-native";
import TypeBadge from "../components/ui/TypeBadge.jsx";
import Card from "../components/ui/Card.jsx";
import SectionLabel from "../components/ui/SectionLabel.jsx";
import StatBars from "../components/detail/StatBars.jsx";
import EvolutionChain from "../components/detail/EvolutionChain.jsx";
import TypeEffectiveness from "../components/detail/TypeEffectiveness.jsx";
import Ubicaciones from "../components/detail/Ubicaciones.jsx";
import { BackButton, HomeLogoButton } from "../components/HeaderNav.jsx";
import { colors, spacing, radius, typography, cardShadow } from "../constants/theme.js";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HeaderTitle = ({ name }) => (
    <Text
        style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
        }}
    >
        {name ? name.toUpperCase() : ""}
    </Text>
);

export default function PokeInfo({ details }) {
    const { fetchPokemonById } = usePokemonDetail();
    const [pokemon, setPokemon] = useState(null);
    const [mostrarShiny, setMostrarShiny] = useState(false);
    const pokemonId = Number(details);

    const { esFavorito, toggleFavorito, equipoLleno } = useFavorites();
    const { etapas: etapasEvolucion } = useEvolutionChain(pokemon?.evolutionChainUrl);
    const { debilidades, resistencias, inmunidades, efectivoContra } = useTypeEffectiveness(pokemon?.types);
    const player = useAudioPlayer(pokemon?.cryUrl ?? null);
    const estadoAudio = useAudioPlayerStatus(player);

    const reproducirGrito = async () => {
        await player.seekTo(0);
        player.play();
    };

    const fetchPokemon = async () => {
        try {
            const pokemonData = await fetchPokemonById(pokemonId);
            setPokemon(pokemonData);
        } catch (error) {
            console.error("Error al cargar el Pokemón.",error)
        }
    }

    useEffect(() => {
        setMostrarShiny(false);
        fetchPokemon();
    }, [pokemonId]);

    if (!pokemon) {
        return (
            <>
                <Stack.Screen
                    options={{
                        headerLeft: () => <BackButton />,
                        headerRight: () => <HomeLogoButton />,
                        headerTitleAlign: "center",
                        headerTitle: () => <HeaderTitle name={null} />,
                    }}
                />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </>
        );
    }

    const { image, shinyImage, name, species, description, height, weight, types, stats, cryUrl } = pokemon;
    const esFav = esFavorito(pokemon.id);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ padding: spacing.lg, alignItems: "center", gap: spacing.md }}
        >
            <Stack.Screen
                options={{
                    headerLeft: () => <BackButton />,
                    headerRight: () => <HomeLogoButton />,
                    headerTitleAlign: "center",
                    headerTitle: () => <HeaderTitle name={name} />,
                }}
            />

            <View
                style={{
                    ...cardShadow,
                    borderColor: colors.primary,
                    borderRadius: radius.full,
                    borderWidth: 4,
                    padding: spacing.md,
                    backgroundColor: colors.surface,
                }}
            >
                <Image
                    source={{ uri: mostrarShiny ? shinyImage : image }}
                    style={{ width: 200, height: 200, borderRadius: 100 }}
                />
            </View>

            <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Pressable
                    onPress={() => setMostrarShiny((prev) => !prev)}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.md,
                        borderRadius: radius.full,
                        borderWidth: 1.5,
                        borderColor: mostrarShiny ? colors.primary : colors.border,
                        backgroundColor: mostrarShiny ? colors.primary : colors.background,
                    }}
                >
                    <Sparkles size={18} color={mostrarShiny ? colors.background : colors.text} />
                    <Text style={{ fontWeight: "bold", color: mostrarShiny ? colors.background : colors.text }}>Shiny</Text>
                </Pressable>

                {cryUrl ? (
                    <AnimatedPressable
                        onPress={reproducirGrito}
                        layout={LinearTransition.duration(200)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.xs,
                            paddingVertical: spacing.xs,
                            paddingHorizontal: spacing.md,
                            borderRadius: radius.full,
                            borderWidth: 1.5,
                            borderColor: estadoAudio.playing ? colors.primary : colors.border,
                            backgroundColor: estadoAudio.playing ? colors.primary : colors.background,
                        }}
                    >
                        <Play size={18} color={estadoAudio.playing ? colors.background : colors.text} />
                        <Text style={{ fontWeight: "bold", color: estadoAudio.playing ? colors.background : colors.text }}>
                            {estadoAudio.playing ? "Sonando..." : "Grito"}
                        </Text>
                    </AnimatedPressable>
                ) : null}

                <Pressable
                    onPress={() => toggleFavorito(pokemon)}
                    disabled={!esFav && equipoLleno}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        paddingVertical: spacing.xs,
                        paddingHorizontal: spacing.md,
                        borderRadius: radius.full,
                        borderWidth: 1.5,
                        borderColor: esFav ? colors.danger : colors.border,
                        opacity: !esFav && equipoLleno ? 0.4 : 1,
                    }}
                >
                    <Heart size={18} color={esFav ? colors.danger : colors.text} fill={esFav ? colors.danger : "transparent"} />
                    <Text style={{ fontWeight: "bold", color: esFav ? colors.danger : colors.text }}>Equipo</Text>
                </Pressable>
            </View>

            <Card style={{ gap: spacing.sm }}>
                <SectionLabel>Tipo</SectionLabel>
                <View style={{ flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" }}>
                    {types.map((typeItem) => (
                        <TypeBadge key={typeItem} type={typeItem} />
                    ))}
                </View>
            </Card>

            <Card style={{ gap: spacing.sm }}>
                <SectionLabel>Especie</SectionLabel>
                <Text style={typography.value}>{species}</Text>
            </Card>

            <Card style={{ gap: spacing.sm }}>
                <SectionLabel>Descripción</SectionLabel>
                <Text style={{ fontSize: 16, fontStyle: "italic", color: colors.textMuted }}>{description}</Text>
            </Card>

            <Card>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <View style={{ alignItems: "center", gap: spacing.xs }}>
                        <SectionLabel>Altura</SectionLabel>
                        <Text style={typography.value}>{height * 10} cm</Text>
                    </View>
                    <View style={{ alignItems: "center", gap: spacing.xs }}>
                        <SectionLabel>Peso</SectionLabel>
                        <Text style={typography.value}>{weight * 10} g</Text>
                    </View>
                </View>
            </Card>

            <Card style={{ gap: spacing.sm }}>
                <SectionLabel>Stats</SectionLabel>
                <StatBars stats={stats} />
            </Card>

            <Card style={{ gap: spacing.sm, width: "100%" }}>
                <SectionLabel>Evolución</SectionLabel>
                <EvolutionChain etapas={etapasEvolucion} currentId={pokemon.id} />
            </Card>

            <Card style={{ gap: spacing.sm, width: "100%" }}>
                <SectionLabel>Debilidades y resistencias</SectionLabel>
                <TypeEffectiveness
                    debilidades={debilidades}
                    resistencias={resistencias}
                    inmunidades={inmunidades}
                    efectivoContra={efectivoContra}
                />
            </Card>

            <Card style={{ gap: spacing.sm, width: "100%" }}>
                <SectionLabel>Dónde encontrarlo</SectionLabel>
                <Ubicaciones pokemonId={pokemon.id} />
            </Card>
        </ScrollView>
    );
}
