import { useState, useRef, useEffect } from "react";
import { Image, TextInput, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import Animated, { LinearTransition } from "react-native-reanimated";
import logo from "../assets/pokebola.png";
import { Search, X, Heart, GitCompare, Home as HomeIcon } from "lucide-react-native";
import { SearchContext } from "../hooks/searchContext.js";
import { CompareContext } from "../hooks/compareContext.js";
import PhoneFrame from "../components/PhoneFrame.jsx";
import { colors, spacing, radius } from "../constants/theme.js";

export default function Layout() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();

  const handleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearch("");
  };

  const handleCompareToggle = () => {
    setCompareMode((prev) => !prev);
    setSeleccionados([]);
  };

  const toggleSeleccionado = (pokemon) => {
    setSeleccionados((prev) => {
      const yaEsta = prev.some((p) => p.id === pokemon.id);
      if (yaEsta) return prev.filter((p) => p.id !== pokemon.id);
      if (prev.length >= 2) return prev;
      return [...prev, pokemon];
    });
  };

  // Al completar 2 selecciones, navega al comparador con ambos ids y sale del modo selección.
  useEffect(() => {
    if (seleccionados.length === 2) {
      router.push(`/comparar?a=${seleccionados[0].id}&b=${seleccionados[1].id}`);
      setCompareMode(false);
      setSeleccionados([]);
    }
  }, [seleccionados]);

  useEffect(() => {
    if (!searchVisible) return;
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [searchVisible]);

  return (
    <PhoneFrame>
    <SearchContext.Provider value={{ search, setSearch }}>
      <CompareContext.Provider value={{ compareMode, seleccionados, toggleSeleccionado }}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "black",
            headerTitle: "Pokedex",
            headerTitleStyle: { fontWeight: "bold" },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/")} hitSlop={10}>
                <Image source={logo} style={{ width: 50, height: 50 }} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <Animated.View
                layout={LinearTransition.duration(220)}
                style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: spacing.md }}
              >
                {!searchVisible ? (
                  <>
                    <TouchableOpacity
                      onPress={handleCompareToggle}
                      hitSlop={10}
                      style={{
                        backgroundColor: compareMode ? colors.primary : "transparent",
                        borderRadius: radius.full,
                        padding: 4,
                      }}
                    >
                      <GitCompare size={22} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/favoritos")} hitSlop={10}>
                      <Heart size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/")} hitSlop={10}>
                      <HomeIcon size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSearch} hitSlop={10} style={{ marginRight: 5 }}>
                      <Search size={24} color="black" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleSearch}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{ margin: 0 }}
                    >
                      <X size={25} color="black" style={{ marginRight: 5 }} />
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
              </Animated.View>
            ),
          }}
        />
      </CompareContext.Provider>
    </SearchContext.Provider>
    </PhoneFrame>
  );
}
