import TrackPlayer, { Event } from 'react-native-track-player';

// service.js
module.exports = async function() {
    // Assuming a jump forward/backward amount of 15 seconds
    const jumpInterval = 15;

    TrackPlayer.addEventListener(Event.RemoteJumpForward, async (data) => {
        const currentPos = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(currentPos + (data.interval || jumpInterval));
    });

    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (data) => {
        const currentPos = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(Math.max(0, currentPos - (data.interval || jumpInterval))); // Avoid negative position
    });

    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteSeek, async (seekTo) => {
        await TrackPlayer.seekTo(seekTo.position);
    });
}
