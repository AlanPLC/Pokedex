import React, { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolateColor, withRepeat } from "react-native-reanimated";

export default function RainbowName({ name }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Configura el loop indefinido de la animación
    progress.value = withRepeat(
      withTiming(1, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1, // -1 indica un bucle infinito
      false // `false` para que la animación no se invierta al reiniciarse
    );
  }, []);

  // Estilo animado con interpolación de color
  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      ["#FFD700", "#FFA500", "#FF8C00", "#FF8C00", "#FFA500", "#FFD700"]
    );

    return {
      color,
    };
  });

  return (
    <Animated.Text 
        style={[{ 
            fontSize: 30, 
            fontWeight: "bold", 
            textTransform: "uppercase", 
            borderBottomWidth: 2,
            borderBottomColor: '#ffbc03',
            paddingBottom: 4,
            letterSpacing: 2,
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
            marginBottom: 15}, animatedStyle]}>
      {name}
    </Animated.Text>
  );
}