import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";

/**
 * Fetches downloads for a given podcast and returns them as a record of episode IDs to URIs.
 *
 * @param {string} podcastId - The ID of the podcast to fetch downloads for.
 * @returns {Promise<Record<string, string>>} A record mapping episode IDs to their download URIs.
 */
export const getEpisodeDownloadsById = async (podcastId: string): Promise<Record<string, string>> => {
    const downloads = await getDownloadsByPodcastId(podcastId);
    return downloads.reduce((acc: Record<string, string>, download) => {
        acc[download.episodeId] = download.uri;
        return acc;
    }, {});
}
