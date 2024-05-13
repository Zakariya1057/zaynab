import * as Notifications from 'expo-notifications';
import {registerAndroidPushNotifications} from "./register-android-push-notifications";
import {Platform} from 'react-native';

export const setupLocalNotifications = async (): Promise<void> => {
    // Request permissions for iOS; Android permissions are granted by default
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Permission not granted to show notifications');
        return;
    }

    // Register notification channels if on Android - necessary for Android 8.0 and above
    if (Platform.OS === 'android') {
        await registerAndroidPushNotifications();
    }
};