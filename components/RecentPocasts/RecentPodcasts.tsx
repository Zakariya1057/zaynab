import React from 'react';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { database } from "@/utils/database/setup";
import { EpisodeModel } from "@/utils/database/models/episode-model";
import {getPodcastById} from "@/utils/data/getPodcastById";
import {PodcastElement} from "@/components/Podcast/PodcastElement";
import { FlashList } from "@shopify/flash-list";

const getUniquePodcastIds = (episodes: EpisodeModel[]) => {
    const podcastIds = episodes.reduce((acc, episode) => {
        acc.add(episode.podcastId);
        return acc;
    }, new Set<string>());

    return Array.from(podcastIds);
};

// Main component to display the list of downloads
const RecentPodcasts: React.FC<{ episodes: EpisodeModel[] }> = ({ episodes }) => {
    const uniquePodcastIds = getUniquePodcastIds(episodes);
    const podcasts = uniquePodcastIds.map( (id) => {
        return getPodcastById(id)
    })

    return (
        <FlashList
            estimatedItemSize={20}
            horizontal={true}
            data={podcasts}
            renderItem={({ item }) => (
                <PodcastElement podcast={item} />
            )}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 100 }}
        />
    );
};

// This function specifies which observables the component subscribes to and watches column changes
const enhance = withObservables(['episodes'], () => ({
    episodes: database.collections.get<EpisodeModel>('episodes')
        .query(
            Q.sortBy('episodeUpdatedAt', Q.desc)
        )
        .observeWithColumns(['episodeUpdatedAt'])
}));

// Wrap the component with the database and observables
export default withDatabase(enhance(RecentPodcasts));
