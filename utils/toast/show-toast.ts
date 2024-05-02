import Toast from "react-native-toast-message";

export const showToast = (type: "error" | "success" | "info", title: string, message: string) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        position: 'bottom',
        visibilityTime: 4000,
        autoHide: true,
        bottomOffset: 40,
    });
}