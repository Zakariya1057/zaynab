import TrackPlayer from 'react-native-track-player';
import 'expo-router/entry';
import { vexo } from 'vexo-analytics';

TrackPlayer.registerPlaybackService(() => require('./service'));

if (!__DEV__) { vexo('f0ac01ab-2324-49cb-8dfc-058c288e8579'); }
