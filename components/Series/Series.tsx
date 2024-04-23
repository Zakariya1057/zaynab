import React from "react";
import {FlatList} from "react-native";
import {router} from "expo-router";
import SeriesEpisode from "./SeriesEpisode";
import SeriesHeader from "./SeriesHeader";
import {Podcast} from "@/interfaces/podcast";
import {Episode} from "@/interfaces/episode";

export default function ({ podcast, play, playingEpisodeId }: { podcast: Podcast, playingEpisodeId?: string, play: () => void }) {
    const ListHeader = () => (
        <SeriesHeader
            title={podcast.name}
            description={podcast.description}
            image={podcast.image}
            play={play}
        />
    );

    const openEpisode = (episode: Episode) => router.push({ pathname: "/episode/", params: { podcastId: podcast.id, episodeId: episode.id } })

    const renderEpisodeItem = ({item}: { item: Episode}) => (
        <SeriesEpisode
            key={item.id}
            title={`Episode ${ item.number }`}
            description={item.description}
            openEpisode={() => openEpisode(item)}
            playing={playingEpisodeId === item.id}
        />
    );

    return (
        <FlatList
            ListHeaderComponent={ListHeader}
            data={Object.values(podcast.episodes)}
            renderItem={renderEpisodeItem}
            keyExtractor={item => item.id}
        />
    );
};