import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import {withObservables} from '@nozbe/watermelondb/react';
import {Q} from '@nozbe/watermelondb';
import {database} from "@/utils/database/setup";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import DemoCard from "@/components/Card/Card";
import {FlashList} from "@shopify/flash-list";
import {View} from "tamagui";

// Main component to display the list of downloads
const ContinueListening: React.FC<{ episodes: EpisodeModel[] }> = ({episodes}) => {
    return (
        <FlashList
            horizontal={true}
            data={episodes}
            estimatedItemSize={100}
            renderItem={({item}) => (
                <View mr={'$4'}>
                    <DemoCard
                        title={item.title}
                        position={item.position}
                        duration={item.duration}
                        episodeId={item.episodeId}
                        podcastId={item.podcastId}
                    />
                </View>
            )}

            showsHorizontalScrollIndicator={false}
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
