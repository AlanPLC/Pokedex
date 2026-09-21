import { View, Text } from "react-native";
import TypeBadge from "../ui/TypeBadge.jsx";
import { colors, spacing } from "../../constants/theme.js";

const formatMultiplicador = (value) => {
  if (value === 0) return "Inmune";
  if (value === 0.5) return "x½";
  if (value === 0.25) return "x¼";
  return `x${value}`;
};

const Fila = ({ titulo, items, vacioTexto }) => (
  <View style={{ marginBottom: spacing.md }}>
    <Text style={{ fontWeight: "bold", marginBottom: spacing.xs, color: colors.text }}>{titulo}</Text>
    {items.length === 0 ? (
      <Text style={{ color: colors.textMuted }}>{vacioTexto}</Text>
    ) : (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
        {items.map((item) => (
          <TypeBadge
            key={item.type}
            type={item.type}
            label={item.multiplicador !== undefined ? formatMultiplicador(item.multiplicador) : null}
          />
        ))}
      </View>
    )}
  </View>
);

export default function TypeEffectiveness({ debilidades, resistencias, inmunidades, efectivoContra }) {
  const resiste = [...resistencias, ...inmunidades];

  return (
    <View>
      <Fila titulo="Débil contra" items={debilidades} vacioTexto="Sin debilidades destacadas." />
      <Fila titulo="Resiste" items={resiste} vacioTexto="Sin resistencias destacadas." />
      <Fila titulo="Eficaz contra" items={efectivoContra ?? []} vacioTexto="Sin ventajas de ataque destacadas." />
    </View>
  );
}
