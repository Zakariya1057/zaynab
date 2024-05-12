import {setNotificationHandler} from "@/utils/notification/set-notification-handler";
import {registerNotificationListener} from "@/utils/notification/register-notification-listener";
import {useRef} from "react";
import {setupLocalNotifications} from "@/utils/notification/setup-local-notifications";
import {router} from "expo-router";

export const setupNotifications = async () => {
    const responseListener = useRef(null);

    setNotificationHandler()

    await setupLocalNotifications()

    const openEpisode = (podcastId: string, episodeId: string) => router.push({pathname: "/notification.click/", params: {podcastId, episodeId}});

    registerNotificationListener(responseListener, (payload) => {
        const  { podcastId, episodeId } = payload
        openEpisode(podcastId, episodeId)

        console.log(payload)
    })
}