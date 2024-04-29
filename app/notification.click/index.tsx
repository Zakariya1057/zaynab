import Episode from '@/components/Episode/Episode'
import {useActiveTrack} from "react-native-track-player";
import {Spinner} from "tamagui";
import {Router} from "@tamagui/lucide-icons";
import {router} from "expo-router";
import {useEffect} from "react";

export default function () {
    const track = useActiveTrack()
    const [ podcastId, episodeId ] = (track?.description?.split('|') ?? [])

    useEffect(() => {
        console.log(track)
    }, [track]);

    return track ?  <Episode podcastId={podcastId} episodeId={episodeId} /> : <Spinner />
}
