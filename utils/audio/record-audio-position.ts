import { useEffect } from "react";
import TrackPlayer, {useActiveTrack, useProgress, State, Event} from "react-native-track-player";
import { upsertEpisode } from "@/utils/database/episode/upsert-episode";
import {getEpisodeNumberFromTitle} from "@/utils/episode/get-episode-number-from-title";
import {field} from "@nozbe/watermelondb/decorators";

export const recordAudioPosition = () => {
    useEffect(() => {
        const updateEpisodeProgress = async () => {

            const { position, duration } = await TrackPlayer.getProgress();

            try {
                let track = await TrackPlayer.getActiveTrack()
                let { state } = await TrackPlayer.getPlaybackState()

                if (state === State.Loading) {
                    return
                }

                if (position === 0 || duration === 0){
                    return
                }

                if (track) {
                    try {
                        const [ podcastId, episodeId ] = (track.description?.split('|') ?? [])

                        if (!podcastId || !episodeId) return null

                        const episodeNumber = getEpisodeNumberFromTitle(track.title)

                        await upsertEpisode({
                            ...track,
                            position: position,
                            duration: duration,
                            complete: (position === duration).toString(),
                            podcastId,
                            episodeId,
                            number: episodeNumber,
                            remoteImage: track.artwork
                        });

                        // console.log('Progress updated for:', track.title, position, duration);
                    } catch (error) {
                        console.error('Error updating episode progress:', error);
                    }
                }
            } catch {

            }
        };

        const subscriptions = [
            TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, updateEpisodeProgress),
        ]

        return () => {
            subscriptions.forEach((subscription) => subscription.remove())
        };
    }, []);
}
