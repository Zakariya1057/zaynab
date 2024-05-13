import {getCompletedEpisodes} from "@/utils/database/download/get-completed-episodes";
import {deleteDownloadsAndRefreshTracks} from "@/utils/download/delete-downloads-and-refresh-tracks";

export const deleteEpisodesAfterListening = async () => {
    console.log('Delete episodes after listening');
    const downloads =  await getCompletedEpisodes()
    await deleteDownloadsAndRefreshTracks(downloads)
}