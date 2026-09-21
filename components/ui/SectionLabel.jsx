import { Text } from "react-native";
import { spacing, typography } from "../../constants/theme.js";

export default function SectionLabel({ children }) {
  return <Text style={{ ...typography.label, marginBottom: spacing.sm }}>{children}</Text>;
}
