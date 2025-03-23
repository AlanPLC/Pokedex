import { useState, useRef, useEffect } from "react";
import { View, Image, TextInput, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import logo from "../assets/pokebola.png";
import AntDesign from '@expo/vector-icons/AntDesign';
import { SearchContext } from "../hooks/searchContext.js";

export default function Layout() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const handleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearch("");
  };

  useEffect(() => {
    if (searchVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100); 
    }
  }, [searchVisible]);

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#ffbc03" },
          headerTintColor: "black",
          headerTitle: "Pokedex",
          headerTitleStyle: { fontWeight: "bold" },
          headerLeft: () => (
            <TouchableOpacity>
              <Image source={logo} style={{ width: 50, height: 50 }} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              {!searchVisible ? (
                <TouchableOpacity
                  onPressOut={handleSearch}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ margin: 0 }}
                >
                  <AntDesign name="search1" size={25} color="black" style={{ marginRight: 5 }} />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPressOut={handleSearch}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ margin: 0 }}
                  >
                    <AntDesign name="close" size={25} color="black" style={{ marginRight: 5 }} />
                  </TouchableOpacity>
                  <TextInput
                    ref={inputRef}
                    placeholder="Buscar Pokémon"
                    value={search}
                    onChangeText={setSearch}
                    style={{
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#ccc",
                      marginBottom: 0,
                      minWidth: 120,
                      paddingVertical: 8,
                    }}
                  />
                </>
              )}
            </View>
          ),
        }}
      />
    </SearchContext.Provider>
  );
}