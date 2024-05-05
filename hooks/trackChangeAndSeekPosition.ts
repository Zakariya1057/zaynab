import { useEffect, useState } from 'react';
import TrackPlayer, { Event } from 'react-native-track-player';
import { getTrackHistoryAtIndex } from '@/utils/track/get-track-history-at-index';
import {getEpisodeById} from "@/utils/database/episode/get-episode-by-id";

export const trackChangeAndSeekPosition = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

    useEffect(() => {
        const trackChangeHandler = async () => {
            const newPosition = await TrackPlayer.getActiveTrackIndex();
            const activeTrack = await TrackPlayer.getActiveTrack();
            const lastTrack = (await TrackPlayer.getQueue())?.at(-1)

            const localAudio = !(activeTrack?.url.includes('http', 0))

            const episodeId = activeTrack?.description?.split('|')[1];

            if (localAudio || !newPosition || newPosition !== currentTrackIndex) {
                setCurrentTrackIndex(newPosition ?? 0);

                const { duration, position } = await getEpisodeById(episodeId ?? '') ?? {};

                let newTrackPosition = position

                if (position) {
                    if ((duration - position) < 5) {
                        if (lastTrack?.description === activeTrack?.description) {
                            await TrackPlayer.pause()
                            return
                        }

                        newTrackPosition -= 5
                    }

                    console.log('Found history for episode. Changing time...', position)
                    await TrackPlayer.seekTo(newTrackPosition);
                    await TrackPlayer.play()
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