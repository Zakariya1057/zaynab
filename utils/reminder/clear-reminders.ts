import * as Notifications from "expo-notifications";

export const clearReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
}