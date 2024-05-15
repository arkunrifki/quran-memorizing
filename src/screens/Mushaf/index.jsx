import { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from 'react'
import { View, SafeAreaView, StyleSheet, Animated, Platform, Text } from 'react-native'
import MushafMenuBar from 'components/MushafMenuBar'
import MushafTopMenu from 'components/MushafTopMenu'
import QuranPages from 'components/Mushaf/QuranPages'
import { MushafProvider } from 'context/MushafContext'

import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import AyahMenuContent from 'components/BottomSheet/AyahMenuContent'
import { useMushafState } from 'context/MushafContext'
import { useUserData } from 'context/UserDataContext'
import TranslationModalContent from 'components/BottomSheet/Translation'

import PlayerProvider from 'context/PlayerContext'
import AudioConfig from 'components/BottomSheet/AudioConfig'
import AddNoteModalContent from 'components/BottomSheet/AddNote'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useOnBoardingState } from 'context/OnBoardingContext';
import _ from 'lodash'

import { useKeepAwake } from 'expo-keep-awake'

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f8f5e9',
        width: '100%',
        height: '100%',
        position: 'relative',
    }
})

const { OS } = Platform

const ForwardAyahMenuContent = forwardRef((props, ref) => <AyahMenuContent {...props} forwardedRef={ref} />)
const ForwardTranslationMenuContent = forwardRef((props, ref) => <TranslationModalContent {...props} forwardedRef={ref} />)
const ForwardAudioConfig = forwardRef((props, ref) => <AudioConfig {...props} forwardedRef={ref} />)
const ForwardAddNote = forwardRef((props, ref) => <AddNoteModalContent {...props} forwardedRef={ref} />)

const Mushaf = ({ route, navigation }) => {
    useKeepAwake()
    const { pageIndex = 0, activeAyah = null } = route.params || {}
    const [showMenu, setShowMenu] = useState(true)
    const bottomMenuPosition = useRef(new Animated.Value(0)).current
    const topMenuPosition = useRef(new Animated.Value(0)).current

    const ayahMenuRef = useRef(null)
    const snapPoints = useMemo(() => ['40%', '50%','60%'],[])
    const [ayahMenuVisible,setAyahMenuVisible] = useState(false)

    // Translation
    const translationModalRef = useRef(null)
    const [translationModalVisible,setTranslationModalVisible] = useState(false)
    const translationModalSnapPoints = useMemo(() => ['50%', '70%'],[])

    // Audio Config
    const audioConfigRef = useRef(null)
    const audioConfigSnaps = useMemo(() => ['50%', '70%'],[])
    const [audioConfigVisible,setAudioConfigVisible] = useState(false)

    // Add Note
    const [addNoteVisible,setAddNoteVisible] = useState(false)
    const addNoteRef = useRef(null)
    const addNoteSnaps = useMemo(() => ['100%'],[])
    const [targetAyah,setTargetAyah] = useState('')

    const { mushafState, dispatch } = useMushafState()
    const { selectedAyah } = mushafState
    const { userDataState, dispatch: userDataDispatch } = useUserData()
    const { memorized } = userDataState

    // OnBoarding State
    const {onBoardingState, dispatch: onBoardingDispatch} = useOnBoardingState()

    const handleSnapChange = (index) => {
        if (index === -1) return setAyahMenuVisible(false)
    }

    const handleTranslationSnapChange = (index) => {
        if (index === -1) return setTranslationModalVisible(false)
    }

    const handleAudioConfigSnapChange = (index) => {
        if (index === -1) return setAudioConfigVisible(false)
    }

    const handleAddNoteSnapChange = (index) => {
        if (index === -1) return setAddNoteVisible(false)
    }

    const toggleMenu = (menuVisible) => {
        Animated.timing(bottomMenuPosition, {
            toValue: menuVisible ? -150 : OS === 'ios' ? 0 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start()
        Animated.timing(topMenuPosition, {
            toValue: menuVisible ? -100 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start()
    }

    const handleDisplayAyahMenu = (ayah) => {
        setAyahMenuVisible(true)
        dispatch({
            action: 'SET_SELECTED_AYAH',
            payload: ayah
        })
    }

    const handleDisplayTranslation = () => {
        setTranslationModalVisible(true)
    }

    const handleDisplayAudioConfig = () => {
        setAudioConfigVisible(true)
    }

    const handleDisplayAddNote = (target) => {
        setTargetAyah(target)
        setAddNoteVisible(true)
    }

    useEffect(() => {
        const handleIgnoreOnboarding = async () => {
            const { initialUsage, ...resProps } = onBoardingState
            const newUserData = {
                ...resProps,
                memorizationHistory: [],
                memorized: {
                    juz: {},
                    surah: {},
                },
                notes: {},
            }
            await AsyncStorage.setItem("userPreferences", JSON.stringify(newUserData))
            onBoardingDispatch({
                type: 'SET_ONBOARDING_STATUS',
                payload: false
            })
            userDataDispatch({
                action: 'SET_USER_DATA',
                payload: newUserData
            })
        }
        if (_.isEmpty(userDataState)) {
            handleIgnoreOnboarding()
        }
    },[userDataState])

    useEffect(() => {
        toggleMenu(!showMenu)
    },[showMenu])

    const renderBottomSheetBackdrop = useCallback(
        prop => (
            <BottomSheetBackdrop
                {...prop}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        )
    )

    return (
        <>
            <View style={{ backgroundColor: !showMenu ? '#f8f5e9' : '#FFFFFF'}} >
                <SafeAreaView>
                    <View style={styles.container}>
                        <MushafTopMenu top={topMenuPosition} navigation={navigation} />
                            <View style={{ flexGrow: 1, backgroundColor: '#f8f5e9' }}>
                                <QuranPages
                                    showMenu={showMenu}
                                    setShowMenu={setShowMenu}
                                    handleDisplayAyahMenu={handleDisplayAyahMenu}
                                    pageIndex={pageIndex}
                                    highlightedAyahValue={activeAyah}
                                />
                            </View>
                        <MushafMenuBar
                            bottom={bottomMenuPosition}
                            handleDisplayTranslation={handleDisplayTranslation}
                            handleDisplayAudioConfig={handleDisplayAudioConfig}
                        />
                    </View>
                    {
                        ayahMenuVisible && (
                            <BottomSheet
                                ref={ayahMenuRef}
                                index={2}
                                snapPoints={snapPoints}
                                backdropComponent={renderBottomSheetBackdrop}
                                {...(OS === 'android' && { handleComponent: null})}
                                enablePanDownToClose
                                onChange={handleSnapChange}
                            >
                                <ForwardAyahMenuContent
                                    memorized={(() => {
                                        if (selectedAyah) {
                                            const [surahIndex,ayahNumber] = selectedAyah.split(':')
                                            if (memorized.surah[surahIndex]) return memorized.surah[surahIndex].includes(Number(ayahNumber))
                                            else return false
                                        }
                                        return false
                                    })()}
                                    ref={ayahMenuRef}
                                    handleDisplayAddNote={handleDisplayAddNote}
                                />
                            </BottomSheet>
                        )
                    }
                    {
                        translationModalVisible && (
                            <BottomSheet
                                ref={translationModalRef}
                                index={1}
                                snapPoints={translationModalSnapPoints}
                                backdropComponent={renderBottomSheetBackdrop}
                                {...(OS === 'android' && { handleComponent: null})}
                                enablePanDownToClose
                                onChange={handleTranslationSnapChange}
                            >
                                <ForwardTranslationMenuContent ref={translationModalRef} />
                            </BottomSheet>
                        )
                    }
                    {
                        audioConfigVisible && (
                            <BottomSheet
                                ref={audioConfigRef}
                                index={1}
                                snapPoints={audioConfigSnaps}
                                backdropComponent={renderBottomSheetBackdrop}
                                {...(OS === 'android' && { handleComponent: null})}
                                enablePanDownToClose
                                onChange={handleAudioConfigSnapChange}
                            >
                                <ForwardAudioConfig ref={audioConfigRef} />
                            </BottomSheet>
                        )
                    }
                    {
                        addNoteVisible && (
                            <BottomSheet
                                ref={addNoteRef}
                                index={0}
                                snapPoints={addNoteSnaps}
                                backdropComponent={renderBottomSheetBackdrop}
                                {...(OS === 'android' && { handleComponent: null})}
                                enablePanDownToClose
                                onChange={handleAddNoteSnapChange}
                            >
                                <ForwardAddNote ref={addNoteRef} target={targetAyah} />
                            </BottomSheet>
                        )
                    }
                </SafeAreaView>
            </View>
        </>
    )
}

const MushafPage = ({ route, navigation }) => {
    return (
        <MushafProvider>
            <PlayerProvider>
                <Mushaf
                    route={route}
                    navigation={navigation}
                />
            </PlayerProvider>
        </MushafProvider>
    )
}


export default MushafPage;