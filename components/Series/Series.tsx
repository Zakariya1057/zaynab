import React from "react";
import {FlatList} from "react-native";
import {router} from "expo-router";
import SeriesEpisode from "./SeriesEpisode";
import SeriesHeader from "./SeriesHeader";
import {Podcast} from "@/interfaces/podcast";
import {Episode} from "@/interfaces/episode";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {getPercentage} from "@/utils/percentage/get-percentage";

export default function ({ podcast, play, playingEpisodeId,episodes }: { podcast: Podcast, episodes: EpisodeModel, playingEpisodeId?: string, play: () => void }) {

    console.log('Series Page')

    const ListHeader = () => (
        <SeriesHeader
            title={podcast.name}
            description={podcast.description}
            image={podcast.image}
            play={play}
        />
    );

    const openEpisode = (episode: Episode) => router.push({ pathname: "/episode/", params: { podcastId: podcast.id, episodeId: episode.id } })

    const renderEpisodeItem = ({item}: { item: Episode}) => {
        return <SeriesEpisode
            key={item.id}
            title={`Episode ${ item.number }`}
            description={item.description}
            openEpisode={() => openEpisode(item)}
            playing={playingEpisodeId === item.id}
            percentage={getPercentage(item?.position, item?.duration)}
        />
    }

    return (
        <FlatList
            ListHeaderComponent={ListHeader}
            data={Object.values(podcast.episodes)}
            renderItem={ renderEpisodeItem}
            keyExtractor={item => item.id}
        />
    );
};