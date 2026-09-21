import { Platform, View } from "react-native";

// Solo decorativo en web: simula un teléfono para no mostrar la app como una página web común.
// En nativo (Expo Go / build real) no hace nada, ya se está viendo en un teléfono de verdad.
export default function PhoneFrame({ children }) {
  if (Platform.OS !== "web") {
    return children;
  }

  return (
    <View style={styles.fondo}>
      <View style={styles.telefono}>
        <View style={styles.notch} />
        <View style={styles.pantalla}>{children}</View>
      </View>
    </View>
  );
}

const styles = {
  fondo: {
    flex: 1,
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#2b2b2b",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  telefono: {
    width: 390,
    height: 844,
    maxWidth: "100%",
    maxHeight: "95vh",
    backgroundColor: "#000",
    borderRadius: 44,
    padding: 12,
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },
  notch: {
    position: "absolute",
    top: 12,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 24,
    backgroundColor: "#000",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 10,
  },
  pantalla: {
    flex: 1,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
};
