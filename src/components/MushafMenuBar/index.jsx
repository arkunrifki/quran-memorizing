import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Animated  } from 'react-native'
import { FontAwesome5, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMushafState } from 'context/MushafContext';

import { Audio } from 'expo-av'
import { usePlayerProvider } from 'context/PlayerContext';

const MushafMenuBar = ({
    bottom = 13,
    handleDisplayTranslation = () => {},
    handleDisplayAudioConfig = () => {},
}) => {
    const { dispatch, mushafState } = useMushafState()
    const { visibilityMode } = mushafState

    const { playerState, dispatch: playerDispatch } = usePlayerProvider()
    const { status, playlist, currentIndex, loop, delay } = playerState

    const [audio,setAudio] = useState(null)

    const increaseCounter = () => {
        dispatch({
            action: 'ADD_COUNT',
        })
    }

    const toggleTimerState = () => {
        dispatch({
            action: 'TOGGLE_TIMER_STATE',
        })
    }

    const handleToggleViewMode = () => {
        dispatch({
            action: 'TOGGLE_VIEW_MODE',
        })
    }

    const handleViewTranslation = () => {
        handleDisplayTranslation()
    }

    const handlePlayerControl = async () => {
        if (status === 'playing') {
            await playerDispatch({
                type: 'PAUSE_AUDIO',
            })
        } else {
            await playerDispatch({
                type: 'PLAY_AUDIO',
            })
        }
    }

    const _onPlaybackStatusUpdate = async (playbackStatus) => {
        if (!playbackStatus.isLoaded) {
            if (playbackStatus.error) {
                console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`)
            }
        } else {
            if (playbackStatus.isPlaying) {
                //playing
                // await playerDispatch({
                //     type: 'PLAY_AUDIO',
                // })
            } else {
                //paused
                // await playerDispatch({
                //     type: 'PAUSE_AUDIO',
                // })
            }
            if (playbackStatus.didJustFinish) {
                if (loop > 0) {
                    if (
                        // Reached to end of playlist
                        currentIndex === playlist.length - 1
                    ) {
                        if (
                            // Loopable
                            (loop - 1) > 0
                        ) {
                            setAudio(null)
                            playerDispatch({
                                type: 'DECREMENT_LOOP',
                            })
                            if (playlist.length === 1) {
                                playerDispatch({
                                    type: 'PLAY_NEXT',
                                    payload: {
                                        index: 1,
                                    }
                                })
                                setTimeout(() => {
                                    playerDispatch({
                                        type: 'PLAY_NEXT',
                                        payload: {
                                            index: 0,
                                        }
                                    }) 
                                }, delay)
                            } else {
                                setTimeout(() => {
                                    playerDispatch({
                                        type: 'PLAY_NEXT',
                                        payload: {
                                            index: 0,
                                        }
                                    })    
                                }, delay)
                            }
                        } else {
                            setAudio(null)
                            playerDispatch({
                                type: 'DECREMENT_LOOP',
                            })
                            setTimeout(() => {
                                playerDispatch({
                                    type: 'PLAY_NEXT',
                                    payload: {
                                        index: currentIndex + 1,
                                    }
                                })
                            }, delay)
                        }
                    } else {
                        setAudio(null)
                        setTimeout(() => {
                            playerDispatch({
                                type: 'PLAY_NEXT',
                                payload: {
                                    index: currentIndex + 1,
                                }
                            })
                        }, delay)
                    }
                } else {
                    console.log('should stop')
                    playerDispatch({
                        type: 'STOP_AUDIO',
                    })
                }
            }
        }
    }

    useEffect(() => {
        const playerControl = async () => {
            if (status === 'playing') {
                if (!audio) {
                    if (currentIndex === playlist.length) {
                        if (playlist.length > 1){
                            playerDispatch({
                                type: 'STOP_AUDIO',
                            })
                            return
                        } else {
                            if (loop > 0) {
                                return
                            } else {
                                playerDispatch({
                                    type: 'STOP_AUDIO',
                                })
                                return
                            }
                        }
                    }
                    const { sound: playbackObject } = await Audio.Sound.createAsync(
                        { uri: playlist[currentIndex] },
                    )
                    setAudio(playbackObject)
                    playbackObject.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate)
                    playbackObject.playAsync()
                } else {
                    console.log('resuming audio')
                    await audio.playAsync()
                }
            }
            if (status === 'paused' && audio) {
                console.log('pause function')
                await audio.pauseAsync()
            }
            if (status === 'stopped') {
                if (audio) {
                    console.log('stop function')
                    await audio.stopAsync()
                    setAudio(null)
                } else {
                    console.log('unhandled')
                }
            }
            return () => {
                if (audio) {
                    audio.unloadAsync()
                }
            }
        }
        playerControl()
    },[status, currentIndex])


    return (
        <Animated.View
            style={{
                width: '100%',
                height: 85,
                backgroundColor: '#FFFFFF',
                position: 'absolute',
                bottom: bottom,
                paddingHorizontal: 20,
                borderTopWidth: 1,
                borderTopColor: '#E0E0E0',
                paddingTop: 4,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1}}>
                    <TouchableOpacity
                        style={{
                            marginLeft: 0,
                            alignItems: 'center',
                            paddingVertical: 8,
                            paddingHorizontal: 20,
                            width: 60,
                        }}
                        onPress={handlePlayerControl}
                    >
                        {
                            (status === 'stopped' || status === 'paused') &&
                            <FontAwesome name="play" size={24} color="#A0A0A0" />
                        }
                        {
                            status === 'playing' &&
                            <FontAwesome name="pause" size={24} color="#A0A0A0" />
                        }
                    </TouchableOpacity>
                    {
                        status === 'stopped' && (
                            <TouchableOpacity
                                style={{
                                    marginLeft: 0,
                                    alignItems: 'center',
                                    paddingVertical: 8,
                                    paddingHorizontal: 20,
                                    width: 64,
                                }}
                                onPress={handleDisplayAudioConfig}
                            >
                                <MaterialCommunityIcons name="cog-play" size={24} color="#A0A0A0" />
                            </TouchableOpacity>
                        )
                    }
                    {
                        (status === 'playing' || status === 'paused') && (
                            <TouchableOpacity
                                style={{
                                    marginLeft: 0,
                                    alignItems: 'center',
                                    paddingVertical: 8,
                                    paddingHorizontal: 20,
                                    width: 64,
                                }}
                                onPress={() => {
                                    playerDispatch({
                                        type: 'STOP_AUDIO',
                                    })
                                }}
                            >
                                <FontAwesome name="stop" size={24} color="#A0A0A0" />
                            </TouchableOpacity>
                        )
                    }
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#1DC25D',
                        width: 58,
                        height: 58,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 999,
                        marginHorizontal: 16
                    }}
                    onPress={mushafState.tikrarMethod === 'count' ? increaseCounter : toggleTimerState}
                >
                    {mushafState.tikrarMethod === 'count' ? (
                        <FontAwesome5 name="angle-double-up" size={32} color="#FFFFFF" style={{ marginBottom: 0 }} />
                    ): mushafState.timerState === 'iddle' ? (
                        <FontAwesome5 name="stopwatch" size={32} color="#FFFFFF" />
                    ): (
                        <FontAwesome name="pause" size={32} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1}}>
                    <TouchableOpacity
                        style={{ marginLeft: 0, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20 }}
                        onPress={handleViewTranslation}
                    >
                        <FontAwesome5 name="globe-asia" size={24} color="#A0A0A0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginLeft: 0, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20}}
                        onPress={handleToggleViewMode}
                    >
                        <FontAwesome name="eye" size={24} color={visibilityMode === 'all' ? '#A0A0A0' : '#16a34a'} />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    )
}

export default MushafMenuBar;