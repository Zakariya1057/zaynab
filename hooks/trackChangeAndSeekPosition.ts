import { useEffect, useState } from 'react';
import TrackPlayer, { Event } from 'react-native-track-player';
import {getEpisode} from "@/utils/cache/episode-cache";

export const trackChangeAndSeekPosition = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

    useEffect(() => {
        const trackChangeHandler = async () => {
            await TrackPlayer.pause()

            const newPosition = await TrackPlayer.getActiveTrackIndex();
            const activeTrack = await TrackPlayer.getActiveTrack();
            const lastTrack = (await TrackPlayer.getQueue())?.at(-1)

            const localAudio = !(activeTrack?.url.includes('http', 0))

            if (localAudio || !newPosition || newPosition !== currentTrackIndex) {
                setCurrentTrackIndex(newPosition ?? 0);

                const { duration, position } = getEpisode(activeTrack?.description ?? '') ?? {}

                let newTrackPosition = position ?? 0

                if (position && duration) {
                    if ((duration - position) < 5) {
                        if (lastTrack?.description === activeTrack?.description) {
                            await TrackPlayer.seekTo(newTrackPosition);
                            await TrackPlayer.pause()
                            return
                        }

                        newTrackPosition -= 5
                    }

                    const { position: currentPosition } = await TrackPlayer.getProgress()

                    if (currentPosition !== newTrackPosition) {
                        console.log('Found history for episode. Changing time...', position)
                        await TrackPlayer.seekTo(newTrackPosition);
                        await TrackPlayer.play()
                    }
                } else {
                    await TrackPlayer.play()
                }
            }
        };

        const subscriptions = [
            TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, trackChangeHandler),
            TrackPlayer.addEventListener(Event.PlaybackQueueEnded, trackChangeHandler)
        ]

        return () => {
            subscriptions.forEach((subscription) => subscription.remove())
        };
    }, [currentTrackIndex]);

    return null; // You can return any necessary data or component here
};