import {showToast} from "@/utils/toast/show-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkAndShowDownloadMessage = async () => {
    const hasShownMessage = await AsyncStorage.getItem('hasShownDownloadMessage');
    if (!hasShownMessage) {
        showToast('info', 'Quick Tip', 'Download for faster, smoother listening!', 5000);
        await AsyncStorage.setItem('hasShownDownloadMessage', 'true');
    }
};
