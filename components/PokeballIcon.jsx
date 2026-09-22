import Svg, { Circle, Path, Rect } from "react-native-svg";

// Reemplaza el PNG de baja resolución del logo: al ser vectorial se ve nítido en cualquier tamaño.
export default function PokeballIcon({ size = 32 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill="#fff" stroke="#1a1a1a" strokeWidth="6" />
      <Path d="M4,50 A46,46 0 0,1 96,50 Z" fill="#ee1515" stroke="#1a1a1a" strokeWidth="6" strokeLinejoin="round" />
      <Rect x="4" y="46" width="92" height="8" fill="#1a1a1a" />
      <Circle cx="50" cy="50" r="15" fill="#1a1a1a" />
      <Circle cx="50" cy="50" r="11" fill="#fff" />
      <Circle cx="50" cy="50" r="11" fill="none" stroke="#1a1a1a" strokeWidth="3" />
    </Svg>
  );
}
