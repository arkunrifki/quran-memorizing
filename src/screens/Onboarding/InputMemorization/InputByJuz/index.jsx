import { View, StyleSheet, Image, Text, TouchableOpacity, BackHandler, Alert, SafeAreaView, Dimensions } from 'react-native'
import TextButton from 'components/Buttons/TextButton'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import AccentPattern from 'assets/accent-pattern.png'
import CheckableListInput from 'components/CheckableListInput'
import { useUserData } from 'context/UserDataContext'
import Checkbox from 'expo-checkbox'

import { JuzItems } from 'utils/constants'
import JuzInputListItem from 'components/JuzInputListItem';

import { useOnBoardingState } from 'context/OnBoardingContext'

import { useEffect, useMemo } from 'react'
import _ from 'lodash'

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: '100%',
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: '#FFFFFF',
        paddingBottom: 50,
        paddingLeft: 40,
        paddingRight: 40,
        position: 'relative',
    }
})


const InputByJuz = ({ navigation }) => {
    const { onBoardingState, dispatch } = useOnBoardingState()
    const { userDataState } = useUserData()
    const { memorized: { juz: memorizedJuz }} = onBoardingState
    const { height } = Dimensions.get('window')

    const memorizedAll = useMemo(() => {
        return memorizedJuz?.length === 30
    },[memorizedJuz])

    const renderJuzItem = (juz) => {
        return (
            <JuzInputListItem
                juz={juz}
                checked={onBoardingState?.memorized?.juz?.includes(juz.item.id)}
                onPress={() => {
                    const memorized = onBoardingState?.memorized?.juz?.includes(juz.item.id)
                    switch(memorized) {
                        case true:
                            dispatch({
                                action: 'REMOVE_JUZ',
                                payload: juz.item.id
                            })
                            break;
                        case false:
                            dispatch({
                                action: 'ADD_JUZ',
                                payload: juz.item.id
                            })
                        default:
                            break;
                    }
                }}
            />
        )
    }

    const handleCheckAll = () => {
        if (memorizedAll) {
            dispatch({
                action: 'REMOVE_ALL_JUZ'
            })
        } else {
            dispatch({
                action: 'ADD_ALL_JUZ'
            })
        }
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
        const populateOnBoardingData = () => {
            const initialUsage = _.isEmpty(userDataState)
            if (!initialUsage) {
                const memorizedJuz = Object.keys(userDataState?.memorized?.juz).map((juz) => {
                    if (
                        userDataState?.memorized?.juz[juz] ===
                        JuzItems[String(Number(juz) - 1)]?.numberOfAyah
                    ) return juz
                    return null
                }).filter((juz) => !!juz)
                .map((item) => `juz${item}`)
                
                dispatch({
                    action: 'ADD_BULK_JUZ',
                    payload: memorizedJuz
                })
            }
        }

        populateOnBoardingData()
    },[])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBack)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBack)
        }
    },[])

    return (
        <View
            style={{
                backgroundColor: '#FFFFFF',
            }}
        >
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={{ width: '100%', position: 'relative', zIndex: 3, elevation: 3 }}>
                        <Text style={{ fontSize: 32, fontWeight: 'bold'}}>Pilih Juz yang sudah kamu hafalkan</Text>
                        <TouchableOpacity
                            style={{
                                marginVertical: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={handleCheckAll}
                        >
                            <Checkbox
                                style={{
                                    width: 16,
                                    height: 16,
                                    borderColor: '#AEAEAE',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    marginRight: 12,
                                }}
                                value={memorizedAll}
                                color={memorizedAll ? '#1DC25D' : null}
                                onValueChange={handleCheckAll}
                            />
                            <Text>
                                Tandai Sudah Hafal Semua
                            </Text>
                        </TouchableOpacity>
                        <CheckableListInput
                            style={{
                                height: height > 800 ? 310 : 250,
                                marginBottom: 24
                            }}
                            renderItem={renderJuzItem}
                            items={JuzItems}
                        />
                        <PrimaryButton title="Selanjutnya" onPress={() => navigation.navigate('PersonalizationConfig') }/>
                        <TextButton title="Sebelumnya" style={{ paddingTop: 20 }} onPress={handleBack}/>
                    </View>
                    <View style={{ position: 'absolute', zIndex: 1, elevation: 1, right: 0, bottom: 0 }}>
                        <Image source={AccentPattern} />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default InputByJuz;