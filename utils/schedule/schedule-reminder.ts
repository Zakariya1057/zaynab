import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const scheduleReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const lastActive = await AsyncStorage.getItem('last_active_date');
    if (lastActive) {
        const lastActiveDate = new Date(lastActive);
        const weekLater = new Date(lastActiveDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Continue Your Journey with Zaynab",
                body: "Reconnect with your faith! Dive back into enlightening talks and be inspired by the beauty of Islam.",
                data: { screen: 'Home' }, // This could be adjusted depending on where you want users to land
            },
            trigger: {
                date: weekLater,
            },
        });
    }
}
