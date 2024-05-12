import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Episode} from "@/interfaces/episode";

export const scheduleReminder = async (episode: Episode, podcastId: string) => {
    const { id: episodeId } = episode

    const lastListened = await AsyncStorage.getItem(`episode_start:${episodeId}`);
    if (lastListened) {
        const lastListenedDate = new Date(lastListened);
        const weekLater = new Date(lastListenedDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Come back and finish your episode!",
                body: "Your episode is waiting for you. Tap to resume listening.",
                data: { podcastId, episodeId }
            },
            trigger: { second: 10 },
        });

        // Store the notificationId with the episodeId
        await AsyncStorage.setItem(`notificationId:${episodeId}`, notificationId);
    }
}
