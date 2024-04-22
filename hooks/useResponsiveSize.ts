import { useContentDimensions } from "./useContentDimensions";

export function useResponsiveSize() {
  const { ratio } = useContentDimensions();

  const responsiveSize = (size: number) => size * ratio;

  return { responsiveSize };
}
