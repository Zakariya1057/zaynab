import { useEffect } from "react";
import TrackPlayer, { State, Event } from "react-native-track-player";
import { upsertEpisode } from "@/utils/database/episode/upsert-episode";
import { getEpisodeNumberFromTitle } from "@/utils/episode/get-episode-number-from-title";
import { updateEpisode } from "@/utils/cache/episode-cache";
import {throttleDebounce} from "@/utils/debounce/throttle-debounce";

const update = throttleDebounce(async (track, position, duration, podcastId, episodeId, episodeNumber) => {
    await upsertEpisode({
        ...track,
        position: position,
        duration: position > duration ? position : duration,
        complete: (position === duration).toString(),
        podcastId,
        episodeId,
        number: episodeNumber,
        remoteImage: track.artwork
    });

    // console.log('Progress updated for:', track.title, position, duration);
}, 1000, 5000);

export const recordAudioPosition = () => {
    useEffect(() => {
        const updateEpisodeProgress = async () => {
            const { position, duration } = await TrackPlayer.getProgress();
            try {
                let track = await TrackPlayer.getActiveTrack();
                let { state } = await TrackPlayer.getPlaybackState();

                if (state === State.Loading) {
                    return;
                }

                if (position <= 0 || duration === 0) {
                    return;
                }

                if (track) {
                    try {
                        const [podcastId, episodeId] = (track.description?.split('|') ?? []);

                        if (!podcastId || !episodeId) return;

                        const episodeNumber = getEpisodeNumberFromTitle(track.title);

                        if (position >= 1) {
                            updateEpisode(track.description ?? '', { position, duration });
                        }

                        update(track, position, duration, podcastId, episodeId, episodeNumber);
                    } catch (error) {
                        console.error('Error updating episode progress:', error);
                    }
                }
            } catch (error) {
                console.error('Error getting track info:', error);
            }
        };

        const subscriptions = [
            TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, updateEpisodeProgress),
        ];

        return () => {
            subscriptions.forEach((subscription) => subscription.remove());
        };
    }, []);
};
