import {YStack, Text, XStack} from 'tamagui';
import {Ionicons} from '@expo/vector-icons';
import {TouchableOpacity} from "react-native";
import {Download} from '@tamagui/lucide-icons'
import {withObservables} from "@nozbe/watermelondb/react";
import {database} from "@/utils/database/setup";
import {DownloadModel} from "@/utils/database/models/download-model";
import {catchError, map, of} from "rxjs";
import {Q} from "@nozbe/watermelondb";
import React from "react";

interface Props {
    download?: () => void;
    downloadModel?: DownloadModel | null;
}

const EpisodeDownload: React.FC<Props> = ({
                                              download,
                                              downloadModel
                                          }) => {

    const downloaded = downloadModel?.downloaded

    const currentlyDownloading = downloadModel?.downloadUpdatedAt &&
        (Date.now() - (downloadModel.downloadUpdatedAt * 1000) <= 3000)

    let downloadIcon;
    if (downloaded) {
        downloadIcon = <Ionicons name="cloud-done" size={30 + 6} color={'white'} strokeWidth={2}/>;
    } else if (currentlyDownloading) {
        downloadIcon = <Ionicons name="cloud-download-outline" size={30 + 4} color={'white'} strokeWidth={2}/>
    } else {
        downloadIcon = <Download size={30} color={'white'} strokeWidth={2}/>;
    }

    const downloadProgress = downloadModel ? (downloadModel.totalBytesWritten / downloadModel.totalBytesExpectedToWrite * 100) : 0

    return (
        <TouchableOpacity onPress={download}>
            <XStack alignItems="center" gap={'$3'}>
                {downloadIcon}

                {(currentlyDownloading && !downloaded && downloadProgress) ?
                    <Text mt={'$2'}>{Math.floor(downloadProgress)}%</Text> : undefined}
            </XStack>
        </TouchableOpacity>
    );
};

// Continue using the enhanced function as it was
const enhance = withObservables(['episodeId'], ({episodeId}) => ({
    downloadModel: episodeId ? database.get<DownloadModel>('downloads').query(
        Q.where('episodeId', episodeId)
    ).observeWithColumns(['totalBytesWritten', 'downloaded']).pipe(
        map(downloads => downloads.length > 0 ? downloads[0] : null),
        catchError(() => of(null))
    ) : of(null) // Return null immediately if episodeId is undefined
}));

export default enhance(EpisodeDownload);