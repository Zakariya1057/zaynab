import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";
import {Episode} from "@/interfaces/episode";
import {Track} from "react-native-track-player";
import {Podcast} from "@/interfaces/podcast";

export const getTracksWithDownloads = async (podcast: Podcast): Promise<Track[]> => {
    const downloads = await getDownloadsByPodcastId(podcast.id)
    const downloadsById: Record<string, string> = downloads.reduce((acc: Record<string, string>, download) => {
        acc[download.episodeId] = download.uri;
        return acc;
    }, {});

    return Object.values(podcast.episodes).map((episode: Episode): Track => {
        return {
            id: episode.id,
            url: downloadsById[episode.id] || episode.url,
            title: `${episode.number}. ${episode.description}`,
            description: `${podcast.id}|${episode.id}`,
            artist: podcast.name,
            artwork: episode.remoteImage ?? podcast.remoteImage,
        }
    })
}