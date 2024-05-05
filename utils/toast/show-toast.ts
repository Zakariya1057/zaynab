import Toast from "react-native-toast-message";
import { StatusBar } from 'react-native';

export const showToast = (type: "error" | "success" | "info", title: string, message: string, time: number = 3000) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        text2Style: {
            fontSize: 11
        },
        position: 'top',
        visibilityTime: time,
        autoHide: true,
        topOffset: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 80, // Adds 20 for additional spacing
    });
}
