import { useEffect, useState } from 'react';
import TrackPlayer, { Event } from 'react-native-track-player';
import { getTrackHistoryAtIndex } from '@/utils/track/get-track-history-at-index';

export const trackChangeAndSeekPosition = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

    useEffect(() => {
        const trackChangeHandler = async () => {
            const newPosition = await TrackPlayer.getActiveTrackIndex() ?? 0;

            if (newPosition !== currentTrackIndex) {
                setCurrentTrackIndex(newPosition);

                const { duration, position } = await getTrackHistoryAtIndex(newPosition) ?? {};
                let newTrackPosition = position

                if (position) {
                    if ((duration - position) < 5) {
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