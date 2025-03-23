import { Stack } from "expo-router";
import { View, Image, TextInput, TouchableOpacity } from "react-native";
import logo from "../assets/pokebola.png"
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState, createContext } from 'react'
import { SearchContext } from "../hooks/searchContext.js";

export default function Layout() {
  const [searchVisible, setSearchVisible] = useState(false)
  const [search, setSearch] = useState("")

  const handleSearch = () =>{
    setSearchVisible(!searchVisible)
    setSearch("")
    console.log(searchVisible)
  }

  return (
    <SearchContext.Provider value={{search, setSearch}}>
      <Stack
        screenOptions={{
            headerStyle: { backgroundColor: "#ffbc03" },
            headerTintColor: "black",
            headerTitle: "Pokedex",
            headerTitleStyle: { fontWeight: "bold" },
            headerLeft: ()=> (
              
              <TouchableOpacity
                >
                <Image 
                source={logo}
                style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{display: "flex", flexDirection:"row", alignItems:"center"}}>
                {!searchVisible ? (
                <TouchableOpacity 
                onPressOut={handleSearch}
                style={{margin: 0, position: "fixed"}}
                >
                  <AntDesign name="search1" size={25} color="black" style={{marginRight: 5}}/>
                </TouchableOpacity>
          
              ):( 
                <>
                <TouchableOpacity 
                onPressOut={handleSearch}
                style={{margin: 0}}>
                <AntDesign name="close" size={25} color="black" style={{marginRight: 5}}/>
                </TouchableOpacity>
                <TextInput
                placeholder="Buscar Pokémon"
                value={search}
                onChangeText={setSearch}
                style={{
                   
                  borderBottomWidth: 1, borderBottomColor: "#000", marginBottom: 0, minWidth: 120}}
              />
                </>
              )}
              </View>
      )}}
      />
    </SearchContext.Provider>
  );
}