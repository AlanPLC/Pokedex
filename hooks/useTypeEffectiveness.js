import { useEffect, useState } from "react";
import typeImages from "../components/pokemonTypes.jsx";

const ALL_TYPES = Object.keys(typeImages);

const cacheDamageRelations = {};

const getDamageRelations = (typeName) => {
  if (!cacheDamageRelations[typeName]) {
    cacheDamageRelations[typeName] = fetch(`https://pokeapi.co/api/v2/type/${typeName}/`)
      .then((res) => res.json())
      .then((data) => data.damage_relations);
  }
  return cacheDamageRelations[typeName];
};

const multiplicadorDesde = (damageRelations, attackingType) => {
  if (damageRelations.no_damage_from.some((t) => t.name === attackingType)) return 0;
  if (damageRelations.double_damage_from.some((t) => t.name === attackingType)) return 2;
  if (damageRelations.half_damage_from.some((t) => t.name === attackingType)) return 0.5;
  return 1;
};

// Combina las relaciones de daño de 1-2 tipos para dar el multiplicador real que recibe el pokemon de cada tipo atacante,
// y de paso arma la unión de tipos contra los que sus propios ataques son eficaces (double_damage_to de cualquiera de sus tipos).
export default function useTypeEffectiveness(types) {
  const [efectividad, setEfectividad] = useState({ debilidades: [], resistencias: [], inmunidades: [], efectivoContra: [] });
  const [isLoading, setIsLoading] = useState(false);
  const key = types?.join(',') ?? '';

  useEffect(() => {
    if (!types || types.length === 0) {
      setEfectividad({ debilidades: [], resistencias: [], inmunidades: [], efectivoContra: [] });
      return;
    }

    let cancelado = false;
    setIsLoading(true);

    Promise.all(types.map(getDamageRelations))
      .then((relacionesPorTipo) => {
        if (cancelado) return;

        const debilidades = [];
        const resistencias = [];
        const inmunidades = [];

        ALL_TYPES.forEach((attackingType) => {
          const multiplicador = relacionesPorTipo.reduce(
            (acc, relaciones) => acc * multiplicadorDesde(relaciones, attackingType),
            1
          );

          if (multiplicador === 0) inmunidades.push({ type: attackingType, multiplicador });
          else if (multiplicador > 1) debilidades.push({ type: attackingType, multiplicador });
          else if (multiplicador < 1) resistencias.push({ type: attackingType, multiplicador });
        });

        const efectivoContraSet = new Set();
        relacionesPorTipo.forEach((relaciones) => {
          relaciones.double_damage_to.forEach((t) => efectivoContraSet.add(t.name));
        });
        const efectivoContra = [...efectivoContraSet].map((type) => ({ type }));

        setEfectividad({ debilidades, resistencias, inmunidades, efectivoContra });
      })
      .catch((error) => console.error("Error al calcular debilidades/resistencias", error))
      .finally(() => {
        if (!cancelado) setIsLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [key]);

  return { ...efectividad, isLoading };
}
