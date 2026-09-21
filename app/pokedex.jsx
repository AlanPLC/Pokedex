import useFetchPokemons, { usePokemonSearch } from "../hooks/usePokeApi.jsx";
import useTypeFilter from "../hooks/useTypeFilter.js";
import useDebouncedValue from "../hooks/useDebouncedValue.js";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, FlatList, Text, ScrollView } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SearchContext } from "../hooks/searchContext.js";
import { CompareContext } from "../hooks/compareContext.js";
import { useContext, useEffect, useState } from "react";
import PokemonItem from "../components/pokemonItem.jsx";
import SinResultados from "../components/sinResultados.jsx";
import TypeBadge from "../components/ui/TypeBadge.jsx";
import typeImages from "../components/pokemonTypes.jsx";
import { colors, spacing } from "../constants/theme.js";

const TODOS_LOS_TIPOS = Object.keys(typeImages);

export default function Pokedex() {
  const { listaPokemon, error, isFetchingMore, hasMore, handleLoadMore } = useFetchPokemons();
  const { search, setSearch } = useContext(SearchContext);
  const { compareMode, seleccionados } = useContext(CompareContext);
  const debouncedSearch = useDebouncedValue(search, 600);
  const {
    resultados: resultadosBusqueda,
    isSearching,
    isLoadingMore: isLoadingMoreBusqueda,
    hasMoreResultados: hasMoreBusqueda,
    buscar,
    cargarMasResultados: cargarMasBusqueda,
  } = usePokemonSearch();
  const {
    resultados: resultadosTipo,
    isLoading: isLoadingTipo,
    isLoadingMore: isLoadingMoreTipo,
    hasMoreResultados: hasMoreTipo,
    filtrarPorTipo,
    cargarMasResultados: cargarMasTipo,
  } = useTypeFilter();

  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  const buscando = search.trim().length > 0;
  const filtrandoPorTipo = Boolean(tipoSeleccionado) && !buscando;
  const enCooldown = search.trim().toLowerCase() !== debouncedSearch.trim().toLowerCase();

  // Al frenar de escribir (cooldown), busca por coincidencia parcial contra el catálogo completo.
  useEffect(() => {
    buscar(debouncedSearch);
  }, [debouncedSearch]);

  // Búsqueda por nombre y filtro por tipo son excluyentes: escribir en el buscador limpia el tipo activo.
  useEffect(() => {
    if (buscando && tipoSeleccionado) {
      setTipoSeleccionado(null);
      filtrarPorTipo(null);
    }
  }, [buscando]);

  const seleccionarTipo = (type) => {
    const siguiente = tipoSeleccionado === type ? null : type;
    setTipoSeleccionado(siguiente);
    setSearch("");
    filtrarPorTipo(siguiente);
  };

  const limpiarFiltros = () => {
    setSearch("");
    setTipoSeleccionado(null);
    filtrarPorTipo(null);
  };

  const pokemonsAMostrar = buscando ? resultadosBusqueda : filtrandoPorTipo ? resultadosTipo : listaPokemon;
  const hasMoreActual = buscando ? hasMoreBusqueda : filtrandoPorTipo ? hasMoreTipo : hasMore;
  const isLoadingMoreActual = buscando ? isLoadingMoreBusqueda : filtrandoPorTipo ? isLoadingMoreTipo : isFetchingMore;
  const cargarMasActual = buscando ? cargarMasBusqueda : filtrandoPorTipo ? cargarMasTipo : handleLoadMore;

  // "fase" agrupa los distintos estados visuales; solo cambia (y dispara el fade) al pasar de uno a otro,
  // no en cada pokemon nuevo que se suma dentro del mismo estado (scroll infinito, más resultados, etc).
  const fase = buscando
    ? enCooldown || isSearching
      ? "buscando"
      : pokemonsAMostrar.length > 0
      ? "resultados"
      : "sin-resultados"
    : filtrandoPorTipo
    ? isLoadingTipo
      ? "buscando"
      : pokemonsAMostrar.length > 0
      ? "resultados"
      : "sin-resultados"
    : "listado";

  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 250 });
  }, [fase]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {compareMode ? (
        <View
          style={{
            backgroundColor: colors.text,
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Elegí {2 - seleccionados.length} pokémon más para comparar ({seleccionados.length}/2)
          </Text>
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, padding: spacing.md }}
        style={{ flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        {TODOS_LOS_TIPOS.map((type) => (
          <TypeBadge key={type} type={type} selected={tipoSeleccionado === type} onPress={() => seleccionarTipo(type)} size={18} />
        ))}
      </ScrollView>

      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {fase === "buscando" ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="small" color={colors.textMuted} />
          </View>
        ) : fase === "sin-resultados" ? (
          <SinResultados onClearSearch={limpiarFiltros} />
        ) : (
          <FlatList
            data={pokemonsAMostrar}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => <PokemonItem item={item} />}
            initialNumToRender={20}
            maxToRenderPerBatch={10}
            windowSize={5}
            onEndReached={hasMoreActual ? cargarMasActual : null}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isLoadingMoreActual ? (
                <View style={{ paddingVertical: spacing.xl * 1.5, alignItems: "center" }}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : null
            }
          />
        )}
      </Animated.View>
      <StatusBar style="auto" />
    </View>
  );
}
