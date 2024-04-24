import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class DownloadModel extends Model {
    static table = 'downloads';

    @field('episodeId') episodeId;

    @field('podcastId') podcastId;

    @field('url') url;

    @field('uri') uri;

    @field('totalBytesWritten') totalBytesWritten;

    @field('totalBytesExpectedToWrite') totalBytesExpectedToWrite;

    @field('downloaded') downloaded;

    @field('downloadStartedAt') downloadStartedAt;
    @field('downloadUpdatedAt') downloadUpdatedAt;
    @field('downloadCompletedAt') downloadCompletedAt;
}
