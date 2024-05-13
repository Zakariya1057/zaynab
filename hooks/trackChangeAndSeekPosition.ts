import { useEffect, useState, useRef } from 'react';
import TrackPlayer, { Event } from 'react-native-track-player';
import { getEpisode } from "@/utils/cache/episode-cache";
import {getAutoPlay} from "@/utils/track/auto-play";

export const trackChangeAndSeekPosition = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);

    const trackChangeHandler = async () => {
        const newPosition = await TrackPlayer.getActiveTrackIndex();
        const activeTrack = await TrackPlayer.getActiveTrack();
        const lastTrack = (await TrackPlayer.getQueue())?.at(-1);
        const localAudio = !(activeTrack?.url.startsWith('http'));

        const shouldAutoPlay = getAutoPlay()

        // Only perform actions if it's a new track or if it's a local file.
        if (localAudio || newPosition !== currentTrackIndex) {
            setCurrentTrackIndex(newPosition ?? 0);

            // Retrieve saved episode details from cache.
            const episode = getEpisode(activeTrack?.description ?? '');
            if (episode) {
                const {duration, position} = episode;
                let newTrackPosition = position ?? 0;

                // Determine if near the end of the track and adjust.
                if (position && duration && (duration - position) < 5) {
                    newTrackPosition = Math.max(0, duration - 5);
                    if (lastTrack?.description === activeTrack?.description) {
                        await TrackPlayer.seekTo(newTrackPosition);
                        if (!shouldAutoPlay) {
                            await TrackPlayer.pause();
                        }
                        return;
                    }
                }

                // Seek to the last known position if it's different from current and decide to play.
                const {position: currentPosition} = await TrackPlayer.getProgress();
                if (currentPosition !== newTrackPosition) {
                    // console.log('Found history for episode. Changing time...', newTrackPosition);
                    await TrackPlayer.seekTo(newTrackPosition);
                }
            }

            if (shouldAutoPlay) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    };

    const setupListener = () => {
        // Setup listeners for track changes and queue ending.
        const subscriptions = [
            TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, trackChangeHandler),
            TrackPlayer.addEventListener(Event.PlaybackQueueEnded, trackChangeHandler)
        ];

        return () => {
            subscriptions.forEach(subscription => subscription.remove());
        };
    }

    // Public API: allow external components to control auto-play setting.
    return {
        setupListener,
        trackChangeHandler,
    };
};
