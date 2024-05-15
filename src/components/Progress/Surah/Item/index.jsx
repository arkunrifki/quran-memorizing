import { Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useMemo } from 'react';
import { SurahItems } from 'utils/constants'
import { useUserData } from 'context/UserDataContext';
import { showMessage } from 'react-native-flash-message';
import Content from 'assets/mushaf/juz30'


const ProgressSurahItem = ({surah, activeSurah = false, setActiveSurah, navigation }) => {
    const memorized = surah.item.memorized ?? 0
    const { userDataState } = useUserData()

    const active = useMemo(() => {
        if (Number(activeSurah) === Number(surah.item.no)) return true
        return false
    },[activeSurah])

    const surahContent = useMemo(() => {
        // if (!activeSurah) return {}
        return SurahItems[String(Number(surah?.item?.no) - 1)]
    },[activeSurah])

    const memorizedAyahs = useMemo(() => {
        if (!active) return []
        else return userDataState?.memorized?.surah[surah?.item?.no]
    },[active])

    const navigateToSurah = (targetType = 'surah', ayahNumber = null) => {
        if (!surahContent?.hasOwnProperty('page')) return showMessage({
            message: "Halaman yang diminta belum tersedia saat ini.",
            type: 'warning',
            color: '#472a00'
        })
        const content = Content()['metadata'].find(item => String(item.number) === String(surahContent.no))
        const pageTarget = targetType === 'surah' ? surahContent?.page : content['ayah'][ayahNumber - 1]['pageIndex']
        return navigation.navigate('Mushaf', {
            pageIndex: Number(pageTarget),
            activeAyah: targetType === 'surah' ? null : `${surahContent.no}:${ayahNumber}`,
        })
    }

    return (
        <View
            style={{
                marginBottom: 8,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#F0F0F0',
                borderRadius: 8,
            }}
        >
            <TouchableOpacity
                style={{
                    padding: 12,
                    paddingBottom: 4,
                }}
                onPress={() => navigateToSurah()}
            >
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            marginRight: 2,
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#3F4043',
                        }}
                    >
                        {surah.item.no}.
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#3F4043'
                        }}
                    >
                        {surah.item.name}
                    </Text>
                </View>
                <View
                style={{
                    height: 8,
                    width: '100%',
                    backgroundColor: '#EAEAEA',
                    borderRadius: 999,
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: '#EEEEEE'
                }}
            >
                <View
                    style={{ height: '100%', width: `${(memorized/surah.item.numberOfAyah)*100}%`, borderRadius: 999}}
                >
                    <LinearGradient
                        colors={['#26E065', '#13A355']}
                        style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 999
                        }}
                        end={{
                            x: 1,
                            y: 1,
                        }}
                    />
                </View>
            </View>
            <View style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        {memorized}
                    </Text>
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                        ayat dari
                    </Text>
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                        {surah.item.numberOfAyah}
                    </Text>
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                        ayat
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 16, color: '#3F4043', fontWeight: 'bold'}}>
                        {Math.floor((memorized/surah.item.numberOfAyah) * 100)}%
                    </Text>
                </View>
            </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: '#f2f2f2',
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                onPress={() => {
                    if (!active) return setActiveSurah(surah.item.no)
                    return setActiveSurah(null)
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: '#454545'
                    }}
                >{active ? 'Sembunyikan' : 'Lihat'} Ayat</Text>
                {
                    !active ? (
                        <AntDesign name="caretdown" size={12} color="#969696" />
                    ) : (
                        <AntDesign name="caretup" size={12} color="#969696" />
                    )
                }
            </TouchableOpacity>
            {active && (
                <View
                    style={{
                        paddingTop: 8,
                        paddingBottom: 4,
                        backgroundColor: '#fafafa',
                        borderBottomRightRadius: 8,
                        borderBottomLeftRadius:8,
                    }}
                >
                    {Array.from({ length: Number(surahContent?.numberOfAyah) }, (_, i) => i + 1)
                    .map((ayahItem) => {
                        const isMemorized = memorizedAyahs?.includes(ayahItem)
                        return (
                            <TouchableOpacity
                                key={ayahItem}
                                style={{
                                    marginHorizontal: 8,
                                    backgroundColor: '#FFFFFF',
                                    marginBottom: 4,
                                    padding: 7,
                                    borderRadius: 2,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                                onPress={() => navigateToSurah('ayah', ayahItem)}
                            >
                                <Text style={{ fontSize: 12 }}>Ayat {ayahItem}</Text>
                                <View>
                                    {isMemorized ? (
                                        <View>
                                            <Text style={{ fontSize: 12, color: 'green'}}>
                                                Sudah Hafal
                                            </Text>
                                        </View> 
                                    ) : (
                                        <View>
                                            <Text style={{ fontSize: 12, color: 'gray'}}>
                                                Belum Hafal
                                            </Text>
                                        </View> 
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

export default ProgressSurahItem;