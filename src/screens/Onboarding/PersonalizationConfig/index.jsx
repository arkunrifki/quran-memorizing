import { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import AccentPattern from 'assets/accent-pattern.png'
import TextButton from 'components/Buttons/TextButton'
import PrimaryButton from 'components/Buttons/PrimaryButton'

import firstWord from 'assets/visibilityMode/firstWord.png'
import hideAll from 'assets/visibilityMode/hideAll.png'
import summary from 'assets/visibilityMode/summary.png'

import {
    TikrarDuration,
    TikrarMethod,
    TikrarCount,
    AyahVisibilityMode,
} from 'utils/constants'

import DropDownPicker from 'react-native-dropdown-picker'
import { useOnBoardingState } from 'context/OnBoardingContext'
import { JuzItems, JUZ_TO_SURAH } from 'utils/constants'

// Storage
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserData } from 'context/UserDataContext'
import { findJuzFromAyah } from 'utils/helpers'

/**
 * Todo
 * Create custom theme for dropdown
 * https://github.com/hossein-zare/react-native-dropdown-picker/blob/5.x/src/themes/light/index.js
 */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingBottom: 50,
        paddingLeft: 40,
        paddingRight: 40,
        position: 'relative',
    }
})

const PersonalizationConfig = ({ route, navigation }) => {
    const { onBoardingState, dispatch } = useOnBoardingState()
    const [activeOption, setActiveOption] = useState('tikrarDuration')
    const { saveMemorizationProgress = true } = route.params || {}
    
    const { userDataState, dispatch: userDataDispatch } = useUserData()

    const [ayahVisibilityOptionsOpen, setAyahVisbilityOptionsOpen] = useState(false)
    const [ayahVisibilityValue, setAyahVisibilityValue] = useState(onBoardingState.personalization.ayahVisibility)

    const [tikrarModeOptionsOpen, setTikrarModeOptionsOpen] = useState(false)
    const [tikrarModeValue, setTikrarModeValue] = useState(onBoardingState.personalization.tikrarMethod)

    const [tikrarCountOptionsOpen, setTikrarCountOptionsOpen] = useState(false)
    const [tikrarCountValue, setTikrarCountValue] = useState(onBoardingState.personalization.tikrarMethodImplementation)

    const [tikrarDurationOptionsOpen, setTikrarDurationOptionsOpen] = useState(false)
    const [tikrarDurationValue, setTikrarDurationValue] = useState(onBoardingState.personalization.tikrarMethodImplementation)

    useEffect(() => {
        if (ayahVisibilityOptionsOpen) setActiveOption('ayahVisibility')
        if (tikrarModeOptionsOpen) setActiveOption('tikrarMode')
        if (tikrarCountOptionsOpen) setActiveOption('tikrarCount')
        if (tikrarDurationOptionsOpen) setActiveOption('tikrarDuration')
    },[
        ayahVisibilityOptionsOpen,
        tikrarModeOptionsOpen,
        tikrarCountOptionsOpen,
        tikrarDurationOptionsOpen
    ])

    const submitMemorizingConfiguration = async () => {
        try {
            const {initialUsage, ...resProps} = onBoardingState

            let memorizedSurah = {}
            let memorizedJuz = {}

            if (resProps.memorized.juz.length > 0) {
                memorizedJuz = resProps.memorized.juz.reduce((acc, curr) => {
                    acc[String(curr.replace(/^juz/,''))] = JuzItems.find((juz) => juz.id === curr).numberOfAyah
                    return acc
                },{})
                memorizedSurah = Object.keys(memorizedJuz)
                    .map((juzId) => {
                        return juzId.replace(/^juz/, '')
                    })
                    .reduce((acc,curr) => {
                        return [
                            ...acc,
                            ...JUZ_TO_SURAH[String(curr)]
                        ]
                    },[])
                    .reduce((acc,curr) => {
                        const [surah,ayah] = curr.split(':')
                        if (!acc[String(surah)]) {
                            acc[String(surah)] = [Number(ayah)]
                        } else {
                            acc[String(surah)].push(Number(ayah))
                        }
                        return acc
                    },{})
            }

            if (resProps.memorized.surah.length > 0) {
                memorizedSurah = resProps.memorized.surah
                    .reduce((acc, curr) => {
                        const [surah,ayah] = curr.split(':')
                        if (!acc[String(surah)]) {
                            acc[String(surah)] = [Number(ayah)]
                        } else {
                            acc[String(surah)].push(Number(ayah))
                        }
                        return acc
                    },{})
                memorizedJuz = resProps.memorized.surah
                    .reduce((acc, curr) => {
                        const [surah,ayah] = curr.split(':')
                        const juz = findJuzFromAyah(Number(surah),Number(ayah))
                        if (!acc[String(juz)]) {
                            acc[String(juz)] = 1
                        } else {
                            acc[String(juz)] += 1
                        }
                        return acc
                    },{})
            }

            if (resProps.memorized.surah.length === 0 && resProps.memorized.juz.length === 0) {
                console.log('remove memorization history')
            }

            await AsyncStorage.setItem(
                'userPreferences',
                JSON.stringify({
                    personalization: resProps['personalization'],
                    memorized: {
                        surah: saveMemorizationProgress ? memorizedSurah : userDataState.memorized.surah,
                        juz: saveMemorizationProgress ? memorizedJuz : userDataState.memorized.juz,
                    },
                    memorizationHistory: [],
                    notes: {},
                })
            )
            dispatch({
                action: 'SET_ONBOARDING_STATUS',
                payload: false,
            })
            dispatch({
                action: 'RESET_ONBOARDING_DATA',
            })
            userDataDispatch({
                action: 'SET_USER_DATA',
                payload: {
                    personalization: resProps['personalization'],
                    memorized: {
                        surah: saveMemorizationProgress ? memorizedSurah : userDataState.memorized.surah,
                        juz: saveMemorizationProgress ? memorizedJuz : userDataState.memorized.juz,
                    },
                    memorizationHistory: [],
                    notes: {},
                }
            })
            navigation.navigate('Homepage')
        } catch (error) {
            console.log(error)
        }
    }

    const dispatchPersonalizationValue = (value, field) => {
        dispatch({
            action: 'SET_PERSONALIZATION',
            payload: {
                field,
                value,
            }
        })
        if (field === 'tikrarMethod') {
            if (value === 'duration') setTikrarDurationValue('1min')
            if (value === 'count') setTikrarCountValue(10)
            dispatch({
                action: 'SET_PERSONALIZATION',
                payload: {
                    field: 'tikrarMethodImplementation',
                    value: value === 'duration' ? '1min' : 10
                }
            })
        }
    }

    return (
        <View
            style={{
                backgroundColor: '#fff',
                flex: 1,
            }}
        >
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ width: '100%', marginBottom: 40 }}>
                            <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>Konfiguras Gaya Menghafal</Text>
                            <Text style={{ fontSize: 14, color: '#A7A7A7' }}>Kamu dapat mengubahnya nanti di pengaturan.</Text>
                        </View>
                        <View style={{ position: 'relative', width: '100%', elevation: 3, zIndex: 3}}>
                            <View style={{ marginBottom: 24 }}>
                                <Image
                                    source={(() => {
                                        switch (ayahVisibilityValue) {
                                            case 'firstWord':
                                                return firstWord
                                            case 'invisible':
                                                return hideAll
                                            case 'summary':
                                                return summary
                                        }
                                    })()}
                                    style={{ width: 311, height: 135 }}
                                />
                            </View>
                            <View
                                style={{
                                    marginBottom: 24,
                                    position: 'relative',
                                    zIndex: activeOption === 'ayahVisibility' ? 4 : 3,
                                    elevation: activeOption === 'ayahVisibility' ? 4 : 3,
                                }}
                            >
                                <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '600'}}>Mode Tutup Ayat</Text>
                                <DropDownPicker
                                    open={ayahVisibilityOptionsOpen}
                                    value={ayahVisibilityValue}
                                    items={AyahVisibilityMode}
                                    setOpen={setAyahVisbilityOptionsOpen}
                                    setValue={setAyahVisibilityValue}
                                    onChangeValue={val => dispatchPersonalizationValue(val, 'ayahVisibility')}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#D6D6D6',
                                        borderRadius: 8,
                                        backgroundColor: '#FBFBFB',
                                    }}
                                    textStyle={{
                                        fontWeight: '600'
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    marginBottom: 24,
                                    position: 'relative',
                                    zIndex: activeOption === 'tikrarMode' ? 4 : 3,
                                    elevation: activeOption === 'tikrarMode' ? 4 : 3,
                                }}>
                                <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '600'}}>Metode Tikrar</Text>
                                <DropDownPicker
                                    open={tikrarModeOptionsOpen}
                                    value={tikrarModeValue}
                                    items={TikrarMethod}
                                    setOpen={setTikrarModeOptionsOpen}
                                    setValue={setTikrarModeValue}
                                    onChangeValue={val => dispatchPersonalizationValue(val,'tikrarMethod')}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#D6D6D6',
                                        borderRadius: 8,
                                        backgroundColor: '#FBFBFB',
                                    }}
                                    textStyle={{
                                        fontWeight: '600'
                                    }}
                                />
                            </View>
                            {
                                tikrarModeValue === 'duration' && (
                                    <View
                                        style={{
                                            marginBottom: 24,
                                            position: 'relative',
                                            zIndex: activeOption === 'tikrarDuration' ? 4 : 3,
                                            elevation: activeOption === 'tikrarDuration' ? 4 : 3,
                                        }}
                                    >
                                        <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '600'}}>Durasi Tikrar</Text>
                                        <DropDownPicker
                                            open={tikrarDurationOptionsOpen}
                                            value={tikrarDurationValue}
                                            items={TikrarDuration}
                                            setOpen={setTikrarDurationOptionsOpen}
                                            setValue={setTikrarDurationValue}
                                            onChangeValue={val => dispatchPersonalizationValue(val,'tikrarMethodImplementation')}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#D6D6D6',
                                                borderRadius: 8,
                                                backgroundColor: '#FBFBFB',
                                            }}
                                            textStyle={{
                                                fontWeight: '600'
                                            }}
                                        />
                                    </View>
                                )
                            }
                            {
                                tikrarModeValue === 'count' && (
                                    <View
                                        style={{
                                            marginBottom: 24,
                                            position: 'relative',
                                            zIndex: activeOption === 'tikrarCount' ? 4 : 3,
                                            elevation: activeOption === 'tikrarCount' ? 4 : 3,
                                            
                                        }}
                                    >
                                        <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '600'}}>Jumlah Tikrar</Text>
                                        <DropDownPicker
                                            open={tikrarCountOptionsOpen}
                                            value={tikrarCountValue}
                                            items={TikrarCount}
                                            setOpen={setTikrarCountOptionsOpen}
                                            setValue={setTikrarCountValue}
                                            onChangeValue={val => dispatchPersonalizationValue(val,'tikrarMethodImplementation')}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: '#D6D6D6',
                                                borderRadius: 8,
                                                backgroundColor: '#FBFBFB',
                                            }}
                                            textStyle={{
                                                fontWeight: '600'
                                            }}
                                        />
                                    </View>
                                )
                            }
                            <View style={{ flexDirection: 'row'}}>
                                {/* <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#FFFFFF',borderWidth: 1, borderColor: '#e0e0e0', justifyContent: 'center', paddingHorizontal: 16, marginRight: 8, borderRadius: 12}}>
                                    <Entypo name="help-with-circle" size={16} color="#757575" />
                                </TouchableOpacity> */}
                                <PrimaryButton
                                    title="Selesai"
                                    onPress={submitMemorizingConfiguration}
                                    style={{
                                        width: 'auto',
                                        flexGrow: 1,
                                    }}
                                />
                            </View>
                            <TextButton title="Sebelumnya" style={{ paddingTop: 20 }} onPress={() => navigation.goBack()}/>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                elevation: 1,
                                zIndex: 1,
                                right: 0,
                                bottom: 0
                            }}
                        >
                            <Image source={AccentPattern} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default PersonalizationConfig;