// import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {registerAndroidPushNotifications} from "./register-android-push-notifications";
import Constants from 'expo-constants';

export const registerForPushNotifications = async (): Promise<string | null> => {
    let token: string | null = null;

    // if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus === 'granted') {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;

            console.log('Project ID', projectId)

            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(pushTokenString);
                return pushTokenString;
            } catch (e: unknown) {
                console.log('Error getting expo push token', e);
            }
        } else {
            // alert('Failed to get push token for push notification!');
        }
    // } else {
        // console.log('Must use physical device for Push Notifications');
    // }

    await registerAndroidPushNotifications()

    return token;
}

