import Toast from "react-native-toast-message";

export const showToast = (type: "error" | "success" | "info", title: string, message: string) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        text2Style: {
            fontSize: 11
        },
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 40,
    });
}
