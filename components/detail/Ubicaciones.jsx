import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react-native";
import useEncounters from "../../hooks/useEncounters.js";
import { translateVersion } from "../../constants/versionNames.js";
import { colors, spacing } from "../../constants/theme.js";

const MAX_ZONAS_MOSTRADAS = 30;

const formatearNombreZona = (slug) =>
  slug
    .split("-")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");

export default function Ubicaciones({ pokemonId }) {
  const [abierto, setAbierto] = useState(false);
  const { encuentros, isLoading, cargar } = useEncounters(pokemonId);

  const alternar = () => {
    const siguiente = !abierto;
    setAbierto(siguiente);
    if (siguiente) cargar();
  };

  return (
    <View>
      <Pressable onPress={alternar} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold", color: colors.text }}>Ver localizaciones</Text>
        {abierto ? <ChevronUp size={20} color={colors.textMuted} /> : <ChevronDown size={20} color={colors.textMuted} />}
      </Pressable>

      {abierto ? (
        <View style={{ marginTop: spacing.sm, gap: spacing.sm }}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : !encuentros || encuentros.length === 0 ? (
            <Text style={{ color: colors.textMuted }}>No se encontraron ubicaciones para este Pokémon en los juegos.</Text>
          ) : (
            <>
              {encuentros.slice(0, MAX_ZONAS_MOSTRADAS).map((encuentro) => {
                const juegos = [...new Set(encuentro.version_details.map((v) => translateVersion(v.version.name)))];
                return (
                  <View
                    key={encuentro.location_area.name}
                    style={{ paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                      <MapPin size={14} color={colors.primary} />
                      <Text style={{ fontWeight: "bold", color: colors.text }}>
                        {formatearNombreZona(encuentro.location_area.name)}
                      </Text>
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 13 }}>{juegos.join(", ")}</Text>
                  </View>
                );
              })}
              {encuentros.length > MAX_ZONAS_MOSTRADAS ? (
                <Text style={{ color: colors.textMuted, fontStyle: "italic" }}>
                  y {encuentros.length - MAX_ZONAS_MOSTRADAS} zonas más...
                </Text>
              ) : null}
            </>
          )}
        </View>
      ) : null}
    </View>
  );
}
