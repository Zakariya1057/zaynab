import React, {useEffect} from "react";
import FullScreenAudioPlayer from "../../components/Media/AudioPlayer/FullScreenAudioPlayer/FullScreenAudioPlayer";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import {getEpisodeById as getRecordedEpisodeById} from "@/utils/database/episode/get-episode-by-id";
import TrackPlayer from "react-native-track-player";
import {setupPlayer} from "@/utils/track/setup-player";
import {getEpisodeDownloadsById} from "@/utils/download/get-episodes-with-download-ids";
import {handleTrackLoading} from "@/utils/track/handle-track-loading";
import {updateExistingTracks} from "@/utils/track/update-existing-tracks";
import {setupNewQueue} from "@/utils/track/setup-new-queue";

export default function ({podcastId, episodeId}: { podcastId: string, episodeId: string }) {
    const podcast = getPodcastById(podcastId)
    const episode = getEpisodeById(podcast, episodeId)

    useEffect(() => {
        async function setup() {
            await setupPlayer();
            const track = await TrackPlayer.getActiveTrack();
            const downloadsById = await getEpisodeDownloadsById(podcastId);
            const recordedEpisode = await getRecordedEpisodeById(episodeId);
            const episode = podcast.episodes[episodeId];

            console.log(downloadsById[episodeId])

            if (await handleTrackLoading(track, downloadsById, episode, recordedEpisode)) {
                return;
            }

            const existingTracks = await TrackPlayer.getQueue();
            const completed = (Math.floor(recordedEpisode?.duration!) - Math.floor(recordedEpisode?.position!)) < 4;

            if (await updateExistingTracks(existingTracks, episode, recordedEpisode, downloadsById, completed)) {
                return;
            }

            await setupNewQueue(podcast, episode, downloadsById, recordedEpisode, completed);
        }

        setup();


    }, []);


    return (
        <>
            <FullScreenAudioPlayer podcast={podcast} episode={episode}/>
        </>
    )
}