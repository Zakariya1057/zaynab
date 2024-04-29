import React, {useEffect} from "react";
import {Stack, router, useLocalSearchParams} from "expo-router";
import Episode from '@/components/Episode/Episode'

export default function () {
    const {podcastId, episodeId} = useLocalSearchParams<{ podcastId: string, episodeId: string }>()
    return <Episode podcastId={podcastId} episodeId={episodeId} />
}