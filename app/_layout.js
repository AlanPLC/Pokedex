import { Stack } from "expo-router";
import { View, Image, Pressable } from "react-native";
import logo from "../assets/pokebola.png"
import AntDesign from '@expo/vector-icons/AntDesign';


export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
            headerStyle: { backgroundColor: "#ffbc03" },
            headerTintColor: "black",
            headerTitle: "Pokedex",
            headerTitleStyle: { fontWeight: "bold" },
            headerLeft: ()=> (
                <Image 
                source={logo}
                style={{ width: 50, height: 50 }}
                />
            ),
            headerRight: () => (
                <Pressable style={({ pressed }) => [
                    { marginRight: 5, opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] }
                    ]}>
                    <AntDesign name="search1" size={24} color="black" style={{marginRight: 5}}/>
                </Pressable>
      )}}
      />
    </View>
  );
}