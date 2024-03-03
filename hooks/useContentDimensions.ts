import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const TARGET_WIDTH = 1080;
const TARGET_HEIGHT = 2160;

export function useContentDimensions() {
  const saf = useSafeAreaFrame();
  const insets = useSafeAreaInsets() || {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  const windowWidth = saf.width;
  const windowHeight =
    insets.top || insets.bottom
      ? saf.height - (insets.top + insets.bottom)
      : saf.height;

  const contentWidth =
    windowHeight / windowWidth > TARGET_HEIGHT / TARGET_WIDTH
      ? windowWidth
      : (TARGET_WIDTH / TARGET_HEIGHT) * windowHeight;
  const contentHeight = (contentWidth * TARGET_HEIGHT) / TARGET_WIDTH;

  const ratio = contentWidth / TARGET_WIDTH;

  const remainingHorizontalSpace = windowWidth - contentWidth;
  const remainingVerticalSpace = windowHeight - contentHeight;

  return {
    contentWidth,
    contentHeight,
    ratio,
    insets,
    remainingHorizontalSpace,
    remainingVerticalSpace,
  };
}
