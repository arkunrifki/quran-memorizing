import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import AccentPattern from "assets/accent-pattern.png"

import HomepagePrimaryPercentage from 'components/Percentage/HomepagePrimaryPercentage';
import HomepageSecondaryPercentage from 'components/Percentage/HomepageSecondaryPercentage';

import LastMemorizedBanner from 'components/Homepage/LastMemorizedBanner';
import { useOnBoardingState } from 'context/OnBoardingContext';
import { useUserData } from 'context/UserDataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SurahItems, JuzItems } from 'utils/constants'
import { findJuzFromAyah } from 'utils/helpers';

import { useIsFocused } from '@react-navigation/native'
import _ from 'lodash'
import { showMessage, hideMessage } from "react-native-flash-message";

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    }
})

const UpperSection = ({ navigation }) => {
    const { onBoardingState, dispatch } = useOnBoardingState()
    const { userDataState, dispatch: userDispatch} = useUserData()
    const isFocused = useIsFocused()

    const [lastMemorizedData,setLastMemorizedData] = useState({
        surahName: 'An-Nas',
        memorizedAyah: 0,
        totalAyah: 6,
        juzName: 'Juz 30',
        memorizedAyahInJuz: 0,
        totalAyahInJuz: 564,
        totalMemorizedInQuran: 0,
        page: 0,
    })
    
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
        dispatch({
            type: 'SET_ONBOARDING_STATUS',
            payload: false
        })
        userDispatch({
            action: 'SET_USER_DATA',
            payload: newUserData
        })
    }

    useEffect(() => {
        if (
            !_.isEmpty(userDataState)
            && !_.isEmpty(userDataState.memorized.surah)
        ) {
            if (userDataState.memorizationHistory.length === 0) {
                const lastSurahMemorizedNo =
                    String(Math.max(...Object.keys(userDataState.memorized.surah).map((item) => Number(item))))
        
                const lastSurahMemorized = SurahItems.find((item) => item.no === lastSurahMemorizedNo)
                const lastAyahMemorized = userDataState.memorized.surah[lastSurahMemorizedNo][userDataState.memorized.surah[lastSurahMemorizedNo].length - 1]
                const lastJuzMemorizedId = `juz${findJuzFromAyah(lastSurahMemorizedNo,lastAyahMemorized)}`
                const lastJuzMemorized = JuzItems.find((item) => item.id === lastJuzMemorizedId)
                const totalMemorizedInQuran = Object.values(userDataState.memorized.juz).reduce((acc, curr) => acc + curr, 0)
        
                setLastMemorizedData({
                    surahName: lastSurahMemorized.name,
                    memorizedAyah: userDataState.memorized.surah[lastSurahMemorizedNo].length,
                    totalAyah: lastSurahMemorized.numberOfAyah,
                    juzName: lastJuzMemorized.label,
                    totalAyahInJuz: lastJuzMemorized.numberOfAyah,
                    memorizedAyahInJuz: userDataState.memorized.juz[findJuzFromAyah(lastSurahMemorizedNo,lastAyahMemorized)],
                    totalMemorizedInQuran: totalMemorizedInQuran,
                    page: lastSurahMemorized?.page
                })
            } else {
                const lastMemorized = userDataState.memorizationHistory[0]
                const lastSurahMemorized = SurahItems.find((item) => item.no === lastMemorized.surahNumber)
                const lastJuzMemorizedId = findJuzFromAyah(lastMemorized.surahNumber,lastMemorized.ayahNumber)
                const lastJuzMemorized = JuzItems.find((item) => item.id === `juz${lastJuzMemorizedId}`)
                const totalMemorizedInQuran = Object.values(userDataState.memorized.juz).reduce((acc, curr) => acc + curr, 0)
                
                setLastMemorizedData({
                    surahName: lastMemorized.surahName,
                    memorizedAyah: userDataState?.memorized?.surah[lastMemorized?.surahNumber]?.length,
                    totalAyah: lastSurahMemorized.numberOfAyah,
                    page: lastSurahMemorized?.page,
                    juzName: lastJuzMemorized.label,
                    totalAyahInJuz: lastJuzMemorized.numberOfAyah,
                    memorizedAyahInJuz: userDataState.memorized.juz[lastJuzMemorizedId],
                    totalMemorizedInQuran: totalMemorizedInQuran
                })
            }
        } else {
            setLastMemorizedData({
                surahName: 'An-Nas',
                memorizedAyah: 0,
                totalAyah: 6,
                juzName: 'Juz 30',
                memorizedAyahInJuz: 0,
                totalAyahInJuz: 564,
                totalMemorizedInQuran: 0,
                page: 0,
            })
        }
    },[isFocused])

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', top: 0, right: 0}}>
                <Image source={AccentPattern} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#939393'}}>Pencapaian Hafalan</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    {
                        !onBoardingState?.initialUsage && (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Setting')}
                            >
                                <Ionicons name="settings" size={20} color="#454545" />
                            </TouchableOpacity>
                        )
                    }
                    <TouchableOpacity
                        style={{ marginLeft: 24}}
                        onPress={() => navigation.navigate('Notes')}
                    >
                        <FontAwesome name="file-text" size={20} color="#454545" />
                    </TouchableOpacity>
                </View>
            </View>
            <HomepagePrimaryPercentage
                style={{ marginTop: 16 }}
                surah={lastMemorizedData.surahName}
                memorized={lastMemorizedData.memorizedAyah}
                total={lastMemorizedData.totalAyah}
                page={lastMemorizedData?.page}
                navigation={navigation}
            />
            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
                <HomepageSecondaryPercentage
                    memorized={lastMemorizedData.memorizedAyahInJuz}
                    total={lastMemorizedData.totalAyahInJuz}
                    juz={lastMemorizedData.juzName}
                    style={{ flexGrow: 1 }}
                    navigation={navigation}
                />
                <View style={{  paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: '#EEEDED', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '600'}}>
                        {String(Number(lastMemorizedData.totalMemorizedInQuran/6236).toPrecision(1) * 100).slice(0,4) + '%'}
                    </Text>
                    <Text style={{ fontWeight: '500', fontSize: 12, marginTop: 4 }}>
                        dari Alquran
                    </Text>
                </View>
            </View>
            {
                onBoardingState?.initialUsage && (
                    <View style={{
                        marginTop: 20,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: '#dbeafe',
                        backgroundColor: '#eff6ff',
                        borderRadius: 8
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome5 name="info-circle" size={16} color="#1e3a8a" />
                            <Text
                                style={{
                                    marginLeft: 4,
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#1e3a8a',
                                }}
                            >
                                Sudah Memiliki Hafalan?
                            </Text>
                        </View>
                        <Text style={{ marginTop: 4, fontSize: 14, color: '#1e40af', lineHeight: 20}}>
                            Kamu dapat memasukkan progress hafalanmu ke dalam aplikasi ini dan memilih gaya menghafal yang kamu suka
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between'}}>
                            <TouchableOpacity
                                style={{
                                    width: '49%',
                                    paddingHorizontal: 8,
                                    paddingVertical: 10,
                                    borderRadius: 6,
                                    backgroundColor: '#dbeafe'
                                }}
                                onPress={handleIgnoreOnboarding}
                            >
                                <Text style={{ textAlign: 'center', color: '#1e3a8a', fontWeight: '500'}}>Abaikan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: '49%',
                                    paddingHorizontal: 8,
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderRadius: 6,
                                    justifyContent: 'center',
                                    borderColor: '#1d4ed8',
                                    backgroundColor: '#1e40af'
                                }}
                                onPress={() => navigation.navigate('InputMemorization')}
                            >
                                <Text style={{textAlign: 'center', color: '#eff6ff', fontWeight: '500' }}>Masukkan Hafalan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
            <View style={{
                marginTop: 20,
                borderBottomWidth: 1,
                paddingBottom: 16,
                borderBottomColor: '#EEEDED'
            }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 12,
                        backgroundColor: '#2E2E2E',
                        borderRadius: 12,
                    }}
                    onPress={() => navigation.navigate('MemorizationProgress')}
                >
                    <Text
                        style={{
                            marginRight: 8,
                            color: '#FFFFFF',
                            fontWeight: '600',
                        }}
                    >
                        Lihat Seluruh Progress Menghafal
                    </Text>
                    {/* <FontAwesome name="angle-right" size={20} color="#FFFFFF" /> */}
                </TouchableOpacity>
            </View>
            <View>
                <LastMemorizedBanner navigation={navigation} />
            </View>
        </View>
    )
}

export default UpperSection;