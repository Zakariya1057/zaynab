import { appSchema, tableSchema } from '@nozbe/watermelondb'
import {field} from "@nozbe/watermelondb/decorators";

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'episodes',
            columns: [
                { name: 'episodeId', type: 'string', isIndexed: true },
                { name: 'podcastId', type: 'string', isIndexed: true },

                { name: 'url', type: 'string' },

                { name: 'number', type: 'number' },
                { name: 'remoteImage', type: 'string' },
                { name: 'artist', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'duration', type: 'number' },
                { name: 'position', type: 'number' },
                { name: 'complete', type: 'boolean' },
                { name: 'bookmarked', type: 'boolean' },
                { name: 'episodeUpdatedAt', type: 'number' },
                { name: 'episodeCreatedAt', type: 'number' },
            ]
        }),
        tableSchema({
            name: 'downloads',
            columns: [
                { name: 'podcastId', type: 'string', isIndexed: true },
                { name: 'episodeId', type: 'string', isIndexed: true },
                { name: 'url', type: 'string' },
                { name: 'uri', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'totalBytesWritten', type: 'number' },
                { name: 'totalBytesExpectedToWrite', type: 'number' },
                { name: 'downloaded', type: 'boolean' },
                { name: 'error', type: 'string' },
                { name: 'downloadStartedAt', type: 'number' },
                { name: 'downloadUpdatedAt', type: 'number' },
                { name: 'downloadCompletedAt', type: 'number' },
            ]
        }),
    ]
})