import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class EpisodeModel extends Model {
    static table = 'episodes';

    @field('podcastId') podcastId;
    @field('episodeId') episodeId;

    @field('number') number;
    @field('remoteImage') remoteImage;

    @field('stream') stream;
    @field('download') download;


    @field('artist') artist;
    @field('description') description;
    @field('title') title;
    @field('duration') duration;
    @field('position') position;
    @field('complete') complete;

    @field('bookmarked') bookmarked;

    @field('episodeUpdatedAt') episodeUpdatedAt;
    @field('episodeCreatedAt') episodeCreatedAt;
}
