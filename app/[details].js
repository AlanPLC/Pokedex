import { useLocalSearchParams } from "expo-router";
import PokeInfo from "./pokeInfo.jsx";
import { View } from "react-native";

export default function Details() {
    const { details } = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
        <PokeInfo details={details} />
    </View>
    );
}
