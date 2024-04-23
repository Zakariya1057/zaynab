import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class EpisodeModel extends Model {
    static table = 'episodes';

    @field('artist') artist;
    @field('description') description;
    @field('title') title;
    @field('url') url;
    @field('duration') duration;
    @field('position') position;
    @field('complete') complete;
    @field('podcastId') podcastId;
    @field('episodeId') episodeId;
}
