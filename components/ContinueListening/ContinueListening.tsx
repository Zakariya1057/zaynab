import React, {useEffect, useState} from 'react';
import {FlatList, Modal, RefreshControl, SectionList, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {Q} from '@nozbe/watermelondb';
import {database} from "@/utils/database/setup";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import DemoCard from "@/components/Card/Card";

// Main component to display the list of downloads
const ContinueListening: React.FC<{ episodes: EpisodeModel[] }> = ({episodes}) => {
    return (
        <FlatList
            horizontal={true}
            data={episodes}
            renderItem={({item}) => (
                <DemoCard
                    title={item.title}
                    position={item.position}
                    duration={item.duration}
                    episodeId={item.episodeId}
                    podcastId={item.podcastId}
                />
            )}

            keyExtractor={item => item.episodeId}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: 20, paddingLeft: 10}}
        />
    )
};

// This function specifies which observables the component subscribes to and watches column changes
const enhance = withObservables(['episodes'], () => ({
    episodes: database.collections.get<EpisodeModel>('episodes')
        .query(
            Q.sortBy('episodeUpdatedAt', Q.desc),
        )
        .observeWithColumns(['episodeUpdatedAt'])

}));


// Wrap the component with the database and observables
export default withDatabase(enhance(ContinueListening));
