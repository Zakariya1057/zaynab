import {getDownloadsByPodcastId} from "@/utils/database/download/get-downloads-by-podcast-id";
import {Episode} from "@/interfaces/episode";
import {Track, TrackType} from "react-native-track-player";
import {Podcast} from "@/interfaces/podcast";
import {getFileExtension} from "@/utils/url/get-file-extension";

export const getTracksWithDownloads = async (podcast: Podcast): Promise<Track[]> => {
    const downloads = await getDownloadsByPodcastId(podcast.id)
    const downloadsById: Record<string, string> = downloads.reduce((acc: Record<string, string>, download) => {
        acc[download.episodeId] = download.uri;
        return acc;
    }, {});

    return Object.values(podcast.episodes).map((episode: Episode): Track => {
        const { id } = episode
        const url = downloadsById[episode.id] || episode.stream

        return {
            id,
            url,
            title: `${episode.number}. ${episode.description}`,
            description: `${podcast.id}|${episode.id}`,
            artist: podcast.name,
            artwork: episode.remoteImage ?? podcast.remoteImage,
            type: getFileExtension(url) === 'mp3' ? TrackType.Default : TrackType.HLS
        }
    })
}