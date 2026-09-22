import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import PokeballIcon from "./PokeballIcon.jsx";

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
      <PokeballIcon size={30} />
    </TouchableOpacity>
  );
};
