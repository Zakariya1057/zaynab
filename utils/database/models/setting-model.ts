import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class SettingsModel extends Model {
    static table = 'settings';

    @field('key') key;
    @field('value') value;
}
