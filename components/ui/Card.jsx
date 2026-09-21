import { View } from "react-native";
import { colors, radius, spacing, cardShadow } from "../../constants/theme.js";

export default function Card({ children, style }) {
  return (
    <View
      style={[
        {
          width: "100%",
          backgroundColor: colors.background,
          borderRadius: radius.md,
          padding: spacing.lg,
          ...cardShadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
