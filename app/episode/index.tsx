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

            console.log('Existing Track Index', existingTrackIndex)
            if (existingTrackIndex && existingTrackIndex > -1) {

                // if the tracks are skipping - then just overwrite the fricking thing
                console.log('Setting From Existing Tracks')
                await TrackPlayer.skip(existingTrackIndex, recordedEpisode?.position ?? 0);
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

            await TrackPlayer.seekTo(recordedEpisode?.position ?? 0)

            // for (const track of tracks) {
            //     const index = tracks.indexOf(track);
            //     if (track.url !== episode.url) {
            //         await TrackPlayer.add(track, index)
            //     }
            // }
            //
            // console.log(await TrackPlayer.getQueue())

            // console.log('Setting Queue')
            // await TrackPlayer.setQueue(tracks);
            // console.log('Queue Set. Skipping')
            // await TrackPlayer.skip(trackIndex);
            // console.log('Skipped')

            //
            //
            // if (!track || track.url !== episode.url) {
            //     console.log('Replacing Tracks')
            //     await TrackPlayer.setQueue(tracks);
            // }
            //
            // await TrackPlayer.skip(trackIndex);

            // if the selected episode exists in the existing track then skip to that otherwise replace the stack



            //
            // const track = await TrackPlayer.getActiveTrack()
            // const {state} = await TrackPlayer.getPlaybackState()
            //
            // if (!track || track.url !== episode.url) {
            //     await TrackPlayer.setQueue([{
            //         id: 'trackId',
            //         url: episode.url,
            //         title: episode.description,
            //         description: `${podcast.id}|${episode.id}`,
            //         artist: podcast.name
            //     }]);
            // }
            //
            // if (state === State.Playing) {
            //     setIsPlaying(true)
            // }
        }

        setupPlayer();
    }, []);


    return <FullScreenAudioPlayer podcast={podcast} episode={episode}/>
}