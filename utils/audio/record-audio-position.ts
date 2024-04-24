import { useEffect } from "react";
import TrackPlayer, { useActiveTrack, useProgress } from "react-native-track-player";
import { upsertEpisode } from "@/utils/database/episode/upsert-episode";

export const recordAudioPosition = () => {
    const { position, duration } = useProgress();

    useEffect(() => {
        const updateEpisodeProgress = async () => {
            let track

            try {
                track = await TrackPlayer.getActiveTrack()
            } catch {

            }

            if (track) {
                try {
                    const [ podcastId, episodeId ] = (track.description?.split('|') ?? [])

                    if (!podcastId || !episodeId) return null

                    await upsertEpisode({
                        ...track,
                        position: position,
                        duration: duration,
                        complete: (position === duration).toString(),
                        podcastId,
                        episodeId,
                    });

                    // console.log('Progress updated for:', track.title, position, duration);
                } catch (error) {
                    console.error('Error updating episode progress:', error);
                }
            }
        };

        updateEpisodeProgress();
    }, [position, duration]);
}
