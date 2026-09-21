import React from "react";
import { View, Text, Pressable } from "react-native";
import { colors, spacing } from "../constants/theme.js";

const SinResultados = ({ onClearSearch }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
      <Text style={{ fontSize: 18, color: colors.textMuted, marginBottom: spacing.md, textAlign: "center" }}>
        No se encontraron resultados.
      </Text>
      <Pressable onPress={onClearSearch}>
        <Text style={{ fontSize: 16, color: colors.primary, fontWeight: "bold" }}>Limpiar búsqueda</Text>
      </Pressable>
    </View>
  );
};

export default SinResultados;
