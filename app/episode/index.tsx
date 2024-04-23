import React, {useEffect} from "react";
import FullScreenAudioPlayer from "../../components/Media/AudioPlayer/FullScreenAudioPlayer/FullScreenAudioPlayer";
import {useLocalSearchParams} from "expo-router";
import {Episode} from "@/interfaces/episode";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {getEpisodeById} from "@/utils/data/getEpisodeById";
import { getEpisodeById as getRecordedEpisodeById } from "@/utils/database/episode/get-episode-by-id";

import TrackPlayer, {State, Track, useActiveTrack} from "react-native-track-player";

export default function () {
    const { podcastId, episodeId } = useLocalSearchParams<{podcastId: string, episodeId: string}>()
    const podcast = getPodcastById(podcastId)
    const episode = getEpisodeById(podcast, episodeId)

    useEffect(() => {
        async function setupPlayer() {
            try {
                await TrackPlayer.setupPlayer();
                await TrackPlayer.reset()

                console.log('Player Setup')
            } catch {
            }

            const track = await TrackPlayer.getActiveTrack()

            if (track && track.url === episode.url) {
                return
            }

            const existingTracks = await TrackPlayer.getQueue();
            const existingTrackIndex = existingTracks.findIndex((track) => track.id === episode.id)

            const recordedEpisode = await getRecordedEpisodeById(episodeId)
            console.log('Recorded Episopde', recordedEpisode, recordedEpisode?.position)

            const completed = (Math.floor(recordedEpisode?.duration) - Math.floor(recordedEpisode?.position)) < 4

            if (existingTrackIndex && existingTrackIndex > -1) {

                // if the tracks are skipping - then just overwrite the fricking thing
                console.log('Setting From Existing Tracks')
                await TrackPlayer.skip(existingTrackIndex, completed ? 0 : recordedEpisode?.position ?? 0);
                await TrackPlayer.play();

                console.log('Set From Existing Tracks')
                return
            }

            const tracks = Object.values(podcast.episodes).map( (episode: Episode): Track => {
                return {
                    id: episode.id,
                    url: episode.url,
                    title: `${episode.number}. ${episode.description}`,
                    description: `${podcast.id}|${episode.id}`,
                    artist: podcast.name
                }
            })

            await TrackPlayer.setQueue([{
                id: episode.id,
                url: episode.url,
                title: `${episode.number}. ${episode.description}`,
                description: `${podcast.id}|${episode.id}`,
                artist: podcast.name
            }]);

            await TrackPlayer.add(tracks.filter((track) => track.id !== episode.id))

            await TrackPlayer.move(0, episode.number-1)

            await TrackPlayer.play()

            if (completed) {
                await TrackPlayer.seekTo(0)
            } else {
                await TrackPlayer.seekTo(recordedEpisode?.position ?? 0)
            }
        }

        setupPlayer();
    }, []);


    return <FullScreenAudioPlayer podcast={podcast} episode={episode}/>
}