import {Track, TrackType} from "react-native-track-player";
import {Episode} from "@/interfaces/episode";
import {Podcast} from "@/interfaces/podcast";
import {EpisodeModel} from "@/utils/database/models/episode-model";
import {getFileExtension} from "@/utils/url/get-file-extension";
import {DownloadModel} from "@/utils/database/models/download-model";

export const generateTrackFromEpisode = (episode: Episode|EpisodeModel, podcast: Podcast, download: DownloadModel): Track => {
    // const url = download[ep.id] || ep.stream
    // const fileExtension = getFileExtension(url)
    // const type = fileExtension === 'mp3' ? TrackType.Default : TrackType.HLS
    //
    // return {
    //     id,
    //     url,
    //     type,
    //     title: `${ep.number}. ${ep.description}`,
    //     description: `${podcast.id}|${ep.id}`,
    //     artist: podcast.name,
    //     artwork: ep.remoteImage ?? podcast.remoteImage,
    // }
}
