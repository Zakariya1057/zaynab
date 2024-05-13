import * as Notifications from 'expo-notifications';

export const scheduleReminder = async () => {
    // Clear all existing scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Set the notification time for one week from now
    const currentDate = new Date();
    const oneWeekLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Schedule a succinct and impactful notification
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Zaynab Invites You to Learn and Grow",
            body: "“Seeking knowledge is an obligation upon every Muslim.” (Ibn Majah) Discover enlightening talks today.",
            data: { screen: 'Home' },  // Direct users to the main screen for immediate engagement
        },
        trigger: {
            date: oneWeekLater,
        },
    });
};
