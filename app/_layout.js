import { Stack } from "expo-router";
import { View, Image, Pressable, TextInput, TouchableOpacity} from "react-native";
import logo from "../assets/pokebola.png"
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState, useEffect } from 'react'


export default function Layout() {

  const [searchVisible, setSearchVisible] = useState(false)
  const [search, setSearch] = useState("")

  const handleSearch = () =>{
    setSearchVisible(!searchVisible)
    setSearch("")
    console.log(searchVisible)
  }

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
              <View style={{display: "flex", flexDirection:"row", alignItems:"center"}}>
                {!searchVisible ? (
                <TouchableOpacity 
                onPress={handleSearch}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{margin: 0}}
                >
                  <AntDesign name="search1" size={30} color="black" style={{marginRight: 5}}/>
                </TouchableOpacity>
          
              ):( 
                <>
                <TouchableOpacity 
                onPress={handleSearch}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{margin: 0}}>
                  <AntDesign name="close" size={30} color="black" style={{marginRight: 5}}/>
                </TouchableOpacity>
                <TextInput
                placeholder="Buscar Pokémon"
                value={search}
                onChangeText={setSearch}
                style={{
                   
                  borderBottomWidth: 1, borderBottomColor: "#000", marginBottom: 0 }}
              />
                </>
              )}
              </View>
      )}}
      />
    </View>
  );
}