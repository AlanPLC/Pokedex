import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "pokedex:equipo";
const MAX_EQUIPO = 6;

export default function useFavorites() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setFavoritos(JSON.parse(raw));
      })
      .catch((error) => console.error("Error al leer el equipo guardado", error))
      .finally(() => setCargado(true));
  }, []);

  const persistir = (siguiente) => {
    setFavoritos(siguiente);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(siguiente)).catch((error) =>
      console.error("Error al guardar el equipo", error)
    );
  };

  const esFavorito = (id) => favoritos.some((pokemon) => pokemon.id === id);

  const equipoLleno = favoritos.length >= MAX_EQUIPO;

  const toggleFavorito = (pokemon) => {
    if (esFavorito(pokemon.id)) {
      persistir(favoritos.filter((p) => p.id !== pokemon.id));
      return;
    }
    if (equipoLleno) return;
    persistir([
      ...favoritos,
      { id: pokemon.id, name: pokemon.name, image: pokemon.image, types: pokemon.types ?? [], species: pokemon.species ?? "" },
    ]);
  };

  return { favoritos, cargado, esFavorito, toggleFavorito, equipoLleno, maxEquipo: MAX_EQUIPO };
}
