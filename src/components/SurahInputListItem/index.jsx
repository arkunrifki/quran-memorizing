import Checkbox from "expo-checkbox"
import { View, StyleSheet, Text, TouchableOpacity, Animated } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useOnBoardingState } from '../../context/OnBoardingContext';

import InputSuratItemPercentage from 'components/Percentage/InputSuratItemPercentage';

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        width: '100%',
        borderRadius: 8,
        marginBottom: 8,
    },
    detail_container: {
        padding: 12,
    },
    detail_container_surah: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    number_wrapper: {
        width: 32,
        height: 32,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    }
})

const AyatInSurah = ({ surahNumber = null, numberOfAyat = 0 }) => {
    if (numberOfAyat <= 0 || !surahNumber) return false
    const { onBoardingState, dispatch } = useOnBoardingState()
    const memorizedAyah = onBoardingState.memorized.surah
        .filter((item) => item.includes(`${surahNumber}:`))
        .map((item) => item.split(':')[1])
        .map((item) => Number(item))

    const memorizeThisAyah = (numberOfThisAyat) => {
        dispatch({
            action: 'ADD_ONE_AYAH_IN_SURAH',
            payload: {
                numberOfSurah: surahNumber,
                numberOfAyah: numberOfThisAyat
            }
        })
    }

    const unmemorizeThisAyah = (numberOfThisAyat) => {
        dispatch({
            action: 'REMOVE_ONE_AYAH_IN_SURAH',
            payload: {
                numberOfSurah: surahNumber,
                numberOfAyah: numberOfThisAyat
            }
        })
    }

    const thisAyahIsMemorized = (
        numberOfAyah,
        _memorizedAyah
    ) => {
        return _memorizedAyah.includes(numberOfAyah)
    }
    return (
        <View>
            {Array.from({ length: numberOfAyat }, (_, i) => i + 1)
                .map((ayat) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (!thisAyahIsMemorized(ayat,memorizedAyah)) {
                                    memorizeThisAyah(ayat)
                                } else {
                                    unmemorizeThisAyah(ayat)
                                }
                            }}
                            key={`${surahNumber}-${ayat}`}
                        >
                            <View
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                    backgroundColor: thisAyahIsMemorized(ayat, memorizedAyah) ? '#dcfce7' : '#FFFFFF',
                                    borderTopWidth: 1,
                                    borderTopColor: '#F7F7F7',
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ fontWeight: '500', color: thisAyahIsMemorized(ayat, memorizedAyah) ? "#166534" : '#111827' }}>
                                    Ayat {ayat}
                                </Text>
                                <Checkbox
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        borderColor: '#AEAEAE'
                                    }}
                                    color={thisAyahIsMemorized(ayat,memorizedAyah) ? '#1DC25D' : null}
                                    value={thisAyahIsMemorized(ayat,memorizedAyah)}
                                    onValueChange={() => {
                                        if (!thisAyahIsMemorized(ayat,memorizedAyah)) {
                                            memorizeThisAyah(ayat)
                                        } else {
                                            unmemorizeThisAyah(ayat)
                                        }
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const SurahInputListItem = ({ surah, showAyat, setShowAyat }) => {
    const { onBoardingState, dispatch } = useOnBoardingState()
    const memorizedAyah = onBoardingState.memorized.surah.filter((item) => {
        const [surahNumber, _] = item.split(':')
        return surahNumber === surah.item.no
    })
    const checked = memorizedAyah.length === Number(surah.item.numberOfAyah)

    const memorizeAllAyahInThisSurah = () => {
        dispatch({
            action: 'ADD_ALL_AYAH_IN_SURAH',
            payload: {
                numberOfSurah: surah.item.no,
                numberOfAyah: surah.item.numberOfAyah
            }
        })
    }

    const unmemorizeAllAyahInThisSurah = () => {
        return dispatch({
            action: 'REMOVE_ALL_AYAH_IN_SURAH',
            payload: {
                numberOfSurah: surah.item.no,
                numberOfAyah: surah.item.numberOfAyah
            }
        })
    }

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: checked ? '#f0fdf4' : '#FFFFFF',
                borderColor: checked ? '#86efac' : '#D1D5DB'
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    if (!checked) {
                        memorizeAllAyahInThisSurah()
                    } else {
                        unmemorizeAllAyahInThisSurah()
                    }
                }}
            >
                <View style={styles.detail_container}>
                    <View style={styles.detail_container_surah}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <View
                                style={{
                                    ...styles.number_wrapper,
                                    backgroundColor: checked ? '#dcfce7' : '#F7F7F7',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#000000'}}>
                                    {surah.item.no}
                                </Text>
                            </View>
                            <View style={{ marginLeft: 12}}>
                                <Text style={{ fontSize: 14, fontWeight: '600' }}>
                                    {surah.item.name}
                                </Text>
                            </View>
                        </View>
                            <Checkbox
                                style={{
                                    width: 16,
                                    height: 16,
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    borderColor: '#AEAEAE'
                                }}
                                color={checked ? '#1DC25D' : null}
                                value={checked}
                                onValueChange={() => {
                                    if (!checked) {
                                        memorizeAllAyahInThisSurah()
                                    } else {
                                        unmemorizeAllAyahInThisSurah()
                                    }
                                }}
                            />
                    </View>
                    <InputSuratItemPercentage total={Number(surah.item.numberOfAyah)} memorized={memorizedAyah.length}  />
                </View>
            </TouchableOpacity>
            {
                showAyat && (
                <View>
                    <AyatInSurah numberOfAyat={surah.item.numberOfAyah} surahNumber={surah.item.no} />
                </View>
                )
            }
            <View>
                <TouchableOpacity
                    style={{
                        padding: 12,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopWidth: 1,
                        borderTopColor: '#F7F7F7',
                    }}
                    onPress={() => {
                        if (!showAyat) return setShowAyat(surah.item.no)
                        else return setShowAyat(null)
                    }}
                >
                    <Text style={{ color: '#696969'}}>
                        Lihat Ayat
                    </Text>
                    <Animated.View style={{transform: [{rotate: showAyat ? '0deg' : '180deg'}], marginLeft: 4}}>
                        <AntDesign name="caretup" size={8} color="#696969" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SurahInputListItem;