import { useEffect, useState } from "react";

let cachedCount = null;

// Trae una sola vez el total de especies que expone la PokeAPI, para mostrarlo en el Home.
export default function useSpeciesCount() {
  const [count, setCount] = useState(cachedCount);

  useEffect(() => {
    if (cachedCount) return;
    fetch("https://pokeapi.co/api/v2/pokemon-species?limit=1")
      .then((res) => res.json())
      .then((data) => {
        cachedCount = data.count;
        setCount(data.count);
      })
      .catch((error) => console.error("Error al obtener el conteo de especies", error));
  }, []);

  return count;
}
