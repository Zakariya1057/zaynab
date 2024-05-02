import TrackPlayer from "react-native-track-player";
import {getEpisodeById} from "@/utils/database/episode/get-episode-by-id";

export const getTrackHistoryAtIndex = async (index: number) => {
    const queue = await TrackPlayer.getQueue();
    const nextItem = queue[index];
    if (nextItem) {
        const episodeId = nextItem.description?.split('|')[1];
        return getEpisodeById(episodeId ?? '');
    }
}