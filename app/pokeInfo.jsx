import { useEffect, useState } from "react";
import useFetchPokemons from "../hooks/usePokeApi.jsx";
import { View, Text, Image, ActivityIndicator } from "react-native";
import RainbowName from "../components/pokemonName.jsx";
import typeImages from "../components/pokemonTypes.jsx";

export default function PokeInfo({ details }) {
    const { fetchPokemonById } = useFetchPokemons();
    const [pokemon, setPokemon] = useState(null);
    const pokemonId = Number(details);

    const fetchPokemon = async () => {
        try {
            const pokemonData = await fetchPokemonById(pokemonId);
            setPokemon(pokemonData);
        } catch (error) {
            console.error("Error al cargar el Pokemón.",error)
        }
    }

    useEffect(() => {
        fetchPokemon();
    }, [pokemonId]);

    if (!pokemon) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="black" />
            </View>
        );
    }
    console.log(pokemon)
    const { image, id, name, species, description, height, weight, type, abilities} = pokemon;
    
    return (
        <View style={{ flex: 1, padding: 22, alignItems:"center", backgroundColor:"white", gap:5}}>
            {/* Imagen y Borde circular  */}
            <View style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 10,  // Para sombra en Android
                borderColor: "#ffbc03",
                borderRadius: 300,  // borde completamente redondeado
                borderWidth: 4,
                padding: 10,
                backgroundColor: "#f5f5f5",
            }}>
            <Image 
                source={{ uri: image }} 
                style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,  // imagen circular
                }} 
            />
            </View>
            {/* ID y Nombre */}
            <Text style={{ 
                fontSize: 25, 
                fontWeight: "bold", 
                color:"#ffbc03", 
                textShadowColor: 'rgba(0, 0, 0, 0.8)', 
                textShadowOffset: { width: 1, height: 1 }, 
                textShadowRadius: 3}}
                >ID: #{id}
            </Text>
            {/* <Text>LOL</Text> */}
            <RainbowName text={name}/>      

            {/* Tipos */}
            <View style={{display:"flex", flexDirection:"row", gap:10, width:"100%", alignItems:"center"}}>
                <Text style={{fontSize: 22, fontWeight:"bold"}}>TIPO</Text>
                {(typeof type === "string" ? type.split(" ") : type).map((typeItem, index) => (
                    typeImages[typeItem] ? (
                    <Image key={index} source={typeImages[typeItem]} style={{ width: 40, height: 40 }} />
                    ) : (
                    <Text key={index} style={{ color: "red" }}>Tipo no encontrado</Text>
                    )
                ))}
            </View>

            {/* ESPECIE */}
            <View style={{display:"flex", flexDirection:"row", gap:10, width:"100%", alignItems:"center",}}>
                <Text style={{fontSize: 22, fontWeight:"bold", }}>ESPECIE</Text>
                <Text 
                style={{
                    marginBottom:2,
                    fontSize: 22, 
                    color:"#ffbc03", 
                    fontWeight:"bold", 
                    textShadowColor: 'rgba(0, 0, 0, 1)', 
                    textShadowOffset: { width: 1, height: 1 }, 
                    textShadowRadius: 3}}>{species}</Text>
            </View>

            {/* DESCRIPCIÓN */}
            <View style={{display:"flex", flexDirection:"column", width:"100%"}}>
                <Text style={{fontSize: 22, fontWeight:"bold", marginBottom:3, marginTop:5}}>DESCRIPCIÓN</Text>
                <Text style={{fontSize: 18, fontStyle:"italic", color:"#707070"}}>{description}</Text>
            </View>

            {/* Altura y Peso */}
            <View style={{display:"flex", flexDirection:"row", width:"100%",}}>
                <Text style={{fontSize: 22, fontWeight:"bold"}}>ALTURA </Text>
                <Text 
                style={{
                    fontSize: 22, 
                    fontWeight:"bold", 
                    color:"#ffbc03", 
                    textShadowColor: 'rgba(0, 0, 0, 1)', 
                    textShadowOffset: { width: 1, height: 1 }, 
                    textShadowRadius: 3}}>{height*10} cm</Text>
                <Text style={{fontSize: 22, fontWeight:"bold", marginLeft:15}}>PESO </Text>
                <Text 
                style={{
                    fontSize: 22, 
                    color:"#ffbc03", 
                    fontWeight:"bold", 
                    textShadowColor: 'rgba(0, 0, 0, 1)', 
                    textShadowOffset: { width: 1, height: 1 }, 
                    textShadowRadius: 3}}>{weight*10}g</Text>
            </View>
        </View>
    );
}