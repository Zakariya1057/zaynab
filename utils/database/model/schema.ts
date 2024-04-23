// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'episodes',
            columns: [
                { name: 'podcastId', type: 'string', isIndexed: true },
                { name: 'episodeId', type: 'string', isIndexed: true },
                { name: 'url', type: 'string' },
                { name: 'artist', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'duration', type: 'number' },
                { name: 'position', type: 'number' },
                { name: 'complete', type: 'boolean' },
                { name: 'updated_at', type: 'number' },
                { name: 'created_at', type: 'number' },
            ]
        }),
    ]
})