import { View, Text, Image, Pressable } from "react-native";
import typeImages from "../pokemonTypes.jsx";
import { colors, radius, spacing } from "../../constants/theme.js";
import { translateType } from "../../constants/typeNames.js";

export default function TypeBadge({ type, label, selected, onPress, size = 24 }) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.full,
        borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primary : colors.background,
      }}
    >
      {typeImages[type] ? (
        <Image source={typeImages[type]} style={{ width: size, height: size }} />
      ) : null}
      <Text style={{ fontWeight: "bold", color: selected ? colors.background : colors.text }}>
        {translateType(type)}
      </Text>
      {label ? (
        <Text style={{ fontWeight: "bold", color: selected ? colors.background : colors.textMuted }}>{label}</Text>
      ) : null}
    </Wrapper>
  );
}
