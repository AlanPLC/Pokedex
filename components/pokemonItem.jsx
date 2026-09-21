import React, { memo, useContext } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { Heart } from "lucide-react-native";
import useFavorites from "../hooks/useFavorites.js";
import TypeBadge from "./ui/TypeBadge.jsx";
import { CompareContext } from "../hooks/compareContext.js";
import { colors, spacing, radius, typography } from "../constants/theme.js";

const PokemonItem = memo(({ item }) => {
  const { image, id, name, types, species } = item;
  const { esFavorito, toggleFavorito, equipoLleno } = useFavorites();
  const { compareMode, seleccionados, toggleSeleccionado } = useContext(CompareContext);
  const esFav = esFavorito(id);

  const indiceSeleccion = seleccionados.findIndex((p) => p.id === id);
  const estaSeleccionado = indiceSeleccion !== -1;
  const colorSeleccion = indiceSeleccion === 0 ? colors.compareA : colors.compareB;

  const contenido = (
    <View
      style={{
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: estaSeleccionado ? `${colorSeleccion}22` : "transparent",
        flexDirection: "row",
        flex: 1,
      }}
    >
      <View
        style={{
          borderWidth: 1.5,
          borderColor: colors.primary,
          borderRadius: radius.sm,
          backgroundColor: colors.surface,
          padding: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={{ uri: image }} style={{ width: 80, height: 80 }} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.sm, gap: 5 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs, flex: 1 }}>
            {compareMode ? (
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: radius.full,
                  backgroundColor: estaSeleccionado ? colorSeleccion : "transparent",
                  borderWidth: 1.5,
                  borderColor: estaSeleccionado ? colorSeleccion : colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {estaSeleccionado ? (
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>{indiceSeleccion === 0 ? "A" : "B"}</Text>
                ) : null}
              </View>
            ) : null}
            <Text style={{ fontSize: 18, fontWeight: "bold", textTransform: "uppercase" }}>{name}</Text>
          </View>
          <Pressable
            hitSlop={10}
            onPress={(event) => {
              event.preventDefault?.();
              event.stopPropagation?.();
              toggleFavorito(item);
            }}
            disabled={!esFav && equipoLleno}
          >
            <Heart size={20} color={esFav ? colors.danger : colors.textMuted} fill={esFav ? colors.danger : "transparent"} />
          </Pressable>
        </View>
        {types?.length ? (
          <View style={{ flexDirection: "row", gap: spacing.xs, flexWrap: "wrap" }}>
            {types.map((type) => (
              <TypeBadge key={type} type={type} size={16} />
            ))}
          </View>
        ) : null}
        <Text style={{ ...typography.value, fontSize: 14 }}>{species}</Text>
      </View>
    </View>
  );

  if (compareMode) {
    return <Pressable onPress={() => toggleSeleccionado(item)}>{contenido}</Pressable>;
  }

  return (
    <Link href={`/${id}`} asChild>
      <Pressable>{contenido}</Pressable>
    </Link>
  );
});

export default PokemonItem;
