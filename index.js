import TrackPlayer from 'react-native-track-player';
import 'expo-router/entry';
import { vexo } from 'vexo-analytics';

TrackPlayer.registerPlaybackService(() => require('./service'));

// You may want to wrap this with `if (!__DEV__) { ... }` to only run Vexo in production.
vexo('ee8850dc-b69f-4244-bedb-e77d15a6758c');