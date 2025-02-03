import { useLocalSearchParams, Stack } from "expo-router";
import PokeInfo from "../components/pokeInfo.jsx";
import { View } from "react-native";

export default function Details() {
    const { details } = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
        <Stack.Screen
            options={{
                headerLeft: () => null,
                headerRight: () => null,
                headerTintColor: "black",
                headerTitleStyle: { fontWeight: "bold" },
                headerTitle: "Detalles",
            }}
        />
        <PokeInfo details={details} />
    </View>
    );
}