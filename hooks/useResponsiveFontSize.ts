import { useWindowDimensions } from "react-native";
import { useResponsiveSize } from "./useResponsiveSize";

export function useResponsiveFontSize() {
  const { responsiveSize } = useResponsiveSize();
  const { fontScale } = useWindowDimensions();

  const responsiveFontSize = (size: number) => responsiveSize(size) / fontScale;

  return { responsiveFontSize };
}
