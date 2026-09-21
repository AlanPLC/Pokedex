import { View, Text } from "react-native";
import { STAT_MAX, statColor, colors, spacing, radius } from "../../constants/theme.js";

const STAT_LABELS = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "At. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidad",
};

const Bar = ({ value, color }) => (
  <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden" }}>
    <View
      style={{
        width: `${Math.min(100, (value / STAT_MAX) * 100)}%`,
        height: "100%",
        backgroundColor: color,
        borderRadius: 4,
      }}
    />
  </View>
);

const Leyenda = ({ color, nombre }) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
    <View style={{ width: 10, height: 10, borderRadius: radius.full, backgroundColor: color }} />
    <Text style={{ fontWeight: "bold", color: colors.text, textTransform: "capitalize" }}>{nombre}</Text>
  </View>
);

// Si se pasa compareStats, dibuja dos barras por stat (usado en el comparador) coloreadas por pokemon (no por magnitud,
// para no confundir "stat alto" con "cuál es cuál"); si no, una sola barra coloreada por magnitud (detalle normal).
export default function StatBars({ stats, compareStats, labelA, labelB }) {
  const esComparacion = Boolean(compareStats);

  return (
    <View style={{ gap: spacing.sm, width: "100%" }}>
      {esComparacion ? (
        <View style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.xs }}>
          <Leyenda color={colors.compareA} nombre={labelA ?? "Pokémon A"} />
          <Leyenda color={colors.compareB} nombre={labelB ?? "Pokémon B"} />
        </View>
      ) : null}
      {stats.map((stat) => {
        const otro = compareStats?.find((s) => s.name === stat.name);
        return (
          <View key={stat.name} style={{ gap: 3 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold", color: colors.text }}>{STAT_LABELS[stat.name] ?? stat.name}</Text>
              <Text style={{ color: colors.textMuted }}>
                {esComparacion ? `${stat.base} · ${otro?.base ?? "-"}` : stat.base}
              </Text>
            </View>
            <Bar value={stat.base} color={esComparacion ? colors.compareA : statColor(stat.base)} />
            {esComparacion ? <Bar value={otro?.base ?? 0} color={colors.compareB} /> : null}
          </View>
        );
      })}
    </View>
  );
}
