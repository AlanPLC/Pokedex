import React from "react";
import { View, Text, Pressable } from "react-native";

const SinResultados = ({ onClearSearch }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>No se encontraron resultados.</Text>
      <Pressable onPress={onClearSearch}>
        <Text style={{ fontSize: 16, color: "#ffbc03" }}>Limpiar búsqueda</Text>
      </Pressable>
    </View>
  );
};

export default SinResultados;