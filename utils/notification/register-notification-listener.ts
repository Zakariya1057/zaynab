import * as Notifications from 'expo-notifications';
import React from "react";

export const registerNotificationListener = (
    responseListener: React.MutableRefObject<Notifications.Subscription|null>,
    notificationPressed: (payload: Record<string, any>) => void
) => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        notificationPressed(response.notification.request.content.data)
    });
}