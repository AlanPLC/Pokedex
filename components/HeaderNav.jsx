import { TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import logo from "../assets/pokebola.png";

// Para pantallas "hijas" (detalle, favoritos, comparador): flecha para volver a la izquierda,
// y la pokebola pasa al lado derecho como acceso directo al Home (en vez de mostrarla a la izquierda como en la lista).
export const BackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
      <ArrowLeft size={24} color="black" />
    </TouchableOpacity>
  );
};

export const HomeLogoButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push("/")} hitSlop={10}>
      <Image source={logo} style={{ width: 36, height: 36 }} />
    </TouchableOpacity>
  );
};
