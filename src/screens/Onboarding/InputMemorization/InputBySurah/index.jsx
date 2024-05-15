import { useState } from 'react'
import {StyleSheet, View, Image, Text, SafeAreaView, Alert, BackHandler, Dimensions } from 'react-native'
import AccentPattern from 'assets/accent-pattern.png'
import TextButton from 'components/Buttons/TextButton'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import CheckableListInput from 'components/CheckableListInput'
import SurahInputListItem from 'components/SurahInputListItem'
import { SurahItems } from 'utils/constants'
import { useUserData } from 'context/UserDataContext'
import { useOnBoardingState } from 'context/OnBoardingContext'
import { useEffect } from 'react'
import _ from 'lodash'

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        backgroundColor: '#FFFFFF',
        paddingTop: 25,
        paddingLeft: 40,
        paddingRight: 40,
        position: 'relative',
        height: '100%',
        flexGrow: 1,
    }
})

const InputBySurah = ({ navigation }) => {
    const [activeSurah, setActiveSurah] = useState(null)
    const { height } = Dimensions.get('window')

    const { userDataState } = useUserData()
    const { onBoardingState, dispatch } = useOnBoardingState()
    
    const renderSurahItem = (surah) => {
        return (
            <SurahInputListItem
                surah={surah}
                showAyat={activeSurah === surah.item.no}
                setShowAyat={setActiveSurah}
            />
        )
    }

    const handleBack = () => {
        Alert.alert(
            'Apakah anda yakin untuk kembali?',
            'Progress yang sudah ada tandai pada halaman ini belum disimpan.',
            [
                {
                    text: 'Batal',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Ya',
                    onPress: () => navigation.goBack()
                }
            ]
        )
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBack
        );
        return () => backHandler.remove();
    },[])
    
    useEffect(() => {
        const populateOnBoardingData = () => {
            const initialUsage = _.isEmpty(userDataState)
            if (!initialUsage && !_.isEmpty(userDataState?.memorized?.surah)) {
                const memorizedSurah = Object.keys(userDataState.memorized.surah)
                .map((surahKey) => {
                    return userDataState.memorized.surah[surahKey].map((ayah) => {
                        return `${surahKey}:${ayah}`
                    })
                })
                .reduce((acc,cur) => {
                    return [...acc, ...cur]
                },[])
                dispatch({
                    action: 'SET_MULTIPLE_SURAH_AND_AYAH',
                    payload: memorizedSurah
                })
            }
        }
        populateOnBoardingData()
    }, [])

    return (
        <View
            style={{
                backgroundColor: '#FFFFFF'
            }}
        >
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={{ position: 'relative', zIndex: 3, elevation: 3, width: '100%'}}>
                        <Text style={{ marginBottom: 24, fontSize: 32, fontWeight: 'bold'}}>Pilih surat dan ayat yang sudah kamu hafalkan</Text>
                        <CheckableListInput
                            style={{
                                height: height > 800 ? 450 : 300,
                                marginBottom: 24,
                            }}
                            items={SurahItems}
                            renderItem={renderSurahItem}
                        />
                        <PrimaryButton title="Selanjutnya"  onPress={() => navigation.navigate('PersonalizationConfig') }/>
                        <TextButton title="Sebelumnya" style={{ paddingTop: 20 }} onPress={handleBack}/>
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1, elevation: 1 }}>
                        <Image source={AccentPattern} />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default InputBySurah;