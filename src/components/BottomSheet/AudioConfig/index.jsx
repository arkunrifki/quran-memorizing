import { useState, useEffect, useMemo } from 'react'
import { View, Platform, StyleSheet, TouchableOpacity, Text, BackHandler } from "react-native"
import { FontAwesome } from '@expo/vector-icons';
import { SurahItems } from 'utils/constants';
// import SelectDropdown from 'react-native-select-dropdown';
import SelectDropdown from 'lib/SelectDropdown'

import {
    AVAILABLE_QARI_NAMES,
    REPEAT_OPTIONS,
    DELAY_OPTIONS
} from 'utils/enums';
import PrimaryButton from '../../Buttons/PrimaryButton';
import { generatePlaylistItems } from 'utils/helpers';
import { usePlayerProvider } from 'context/PlayerContext';

const { OS: os } = Platform

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    }
})

const AudioConfig = ({
    forwardedRef,
    ...props
}) => {
    const { dispatch, playerState } = usePlayerProvider()
    const { rawData } = playerState
    const {
        surahStart = null,
        ayahStart = null,
        surahEnd = null,
        ayahEnd = null,
    } = rawData || {}
    const [optionsVisibility, setOptionsVisibility] = useState({
        startFromSurah: false,
        startFromAyah: false,
        untilSurah: false,
        untilAyah: false,
        qari: false,
        repeat: false,
        delay: false
    })

    const [startFrom, setStartFrom] = useState({
        surah: null,
        ayah: null,
    })

    const [until, setUntil] = useState({
        surah: null,
        ayah: null,
    })
    const [qariOptions, setQariOptions] = useState(
        Object.keys(AVAILABLE_QARI_NAMES)
        .map((key) => ({ value: AVAILABLE_QARI_NAMES[key].id, label: AVAILABLE_QARI_NAMES[key].label }))
        )
    const [qari,setQari] = useState(qariOptions[0].value)
    const [repeatOptions, setRepeatOptions] = useState(
        Object.keys(REPEAT_OPTIONS)
        .map((key) => ({ value: REPEAT_OPTIONS[key], label: key }))
    )
    const [repeat, setRepeat] = useState(repeatOptions[0].value)
    const [delayOptions, setDelayOptions] = useState(
        Object.keys(DELAY_OPTIONS)
        .map((key) => ({ value: DELAY_OPTIONS[key], label: `${key} dtk` }))
        .sort((a, b) => a.value - b.value)
    )
    const [delay, setDelay] = useState(delayOptions[0].value)

    const handleSetOpen = (targetKey) => {
        setOptionsVisibility((prev) => {
            return {
                [targetKey]: !prev[targetKey],
                ...(
                    Object
                    .keys(prev)
                    .filter((key) => key !== targetKey)
                    .reduce((acc,cur) => {
                        acc[cur] = false
                        return acc
                    },{})
                )
            }
        })
    }

    const startFromOptions = useMemo(() => {
        const surahIndex = startFrom.surah ? startFrom.surah - 1 : surahStart ? surahStart - 1 : 0
        const numberOfAyah = SurahItems[surahIndex].numberOfAyah
        return {
            surah: SurahItems.map((surah) => {
                return {
                    value: Number(surah.no), label: surah.name
                }
            }),
            ayah: (() => {
                const ayah = []
                for (let i = 1; i <= numberOfAyah; i++) {
                    ayah.push({ value: i, label: i })
                }
                return ayah
            })()
        }
    },[surahStart,ayahStart, startFrom.surah, startFrom.ayah])

    const defaultStartFrom = useMemo(() => {
        const surahNumber = startFrom.surah ? startFrom.surah : surahStart ? surahStart : 1
        const ayahNumber = startFrom.ayah ? startFrom.ayah : ayahStart ? ayahStart : 1
        return {
            surah: startFromOptions.surah.find((surah) => surah.value === Number(surahNumber)),
            ayah: startFromOptions.ayah.find((ayah) => ayah.value === Number(ayahNumber))
        }
    },[startFromOptions,surahStart, startFrom.surah, startFrom.ayah])

    const untilOptions = useMemo(() => {
        const surahNumber = until.surah ? until.surah : surahEnd
        return {
            surah: startFromOptions.surah.filter((surah) => {
                if (startFrom.surah) return surah.value >= startFrom.surah
                return surah.value >= defaultStartFrom.surah.value
            }),
            ayah: (() => {
                // If start from and until same
                if (
                    surahStart === surahEnd ||
                    defaultStartFrom?.surah?.value === until.surah
                ) {
                    return startFromOptions.ayah.filter((ayah) => {
                        if (startFrom.ayah) return ayah.value >= startFrom.ayah
                        return ayah.value >= defaultStartFrom.ayah.value
                    })
                }
                // else
                const ayah = []
                for (let i = 1; i <= SurahItems[surahNumber - 1].numberOfAyah; i++) {
                    ayah.push({ value: i, label: i })
                }
                return ayah
            })()
        }
    },[
        startFrom.surah,
        startFrom.ayah,
        startFromOptions,
        defaultStartFrom,
        until.surah,
        until.ayah,
    ])

    const defaultUntil = useMemo(() => {
        const surahNumber = until.surah ? until.surah : surahEnd ? surahEnd : 1
        const ayahNumber = until.ayah ? until.ayah : ayahEnd ? ayahEnd : 1
        return {
            surah: untilOptions.surah.find((surah) => surah.value === Number(surahNumber)),
            ayah: untilOptions.ayah.find((ayah) => ayah.value === Number(ayahNumber))
        }
    },[surahEnd, ayahEnd, until.surah, until.ayah, untilOptions])

    useEffect(() => {
        if (startFrom.surah) {
            setUntil((prev) => ({ ...prev, surah: startFrom.surah }))
            setStartFrom((prev) => ({ ...prev, ayah: 1 }))
        }
    },[startFrom.surah])

    useEffect(() => {
        if (until.surah) {
            setUntil((prev) => ({ ...prev, ayah: startFrom.ayah }))
        }
    },[startFrom.ayah])

    const handlePlay = () => {
        const playlistItems = generatePlaylistItems(
            startFrom.surah ?? defaultStartFrom.surah.value,
            startFrom.ayah ?? defaultStartFrom.ayah.value,
            until.surah ?? defaultUntil.surah.value,
            until.ayah ?? defaultUntil.ayah.value,
            qari,
        )
        dispatch({
            type: 'SET_RAW_DATA',
            payload: {
                surahStart: startFrom.surah ?? defaultStartFrom.surah.value,
                ayahStart: startFrom.ayah ?? defaultStartFrom.ayah.value,
                surahEnd: until.surah ?? defaultUntil.surah.value,
                ayahEnd: until.ayah ?? defaultUntil.ayah.value,
            }
        })
        dispatch({
            type: 'SET_ALL_PLAYER_DATA',
            payload: {
                playlist: playlistItems,
                delay,
                status: 'playing',
                loop: repeat,
                index: 0,
            }
        })
        forwardedRef.current.close()
    }

    const onSearchSurah = (q, data) => {
        return data.filter((surah) => {
            const surahName = String(surah.label).toLowerCase()
            const aliases = [
                surahName,
                surahName.replace('-',''),
                surahName.replace('-', ' '),
                surahName.replace(/'/g, ''),
            ]
            if (aliases.some(alias => alias.includes(q.toLowerCase()))) return surah 
            return false
        })
    }

    const onAyahSearch = (q, data) => {
        return data.filter((ayah) => {
            const ayahNumber = String(ayah.label).toLowerCase()
            if (ayahNumber.includes(q.toLowerCase())) return ayah
            return false
        })
    }

    useEffect(() => {
        const backAction = () => {
            forwardedRef.current.close()
            return true
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        )
        return () => backHandler.remove()
    },[])

    return (
        <View style={styles.container}>
             <View
                style={{
                    paddingVertical: 16,
                    paddingBottom: os === 'ios' ? 20 : 12,
                    flexDirection: "row",
                    alignItems: os === 'ios' ? 'center' : 'flex-start',
                    justifyContent: 'space-between',
                }}
            >
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "700"}}>Pemutar Audio</Text>
                </View>
                {
                    os === 'android' && (
                        <TouchableOpacity
                            onPress={() => {
                                forwardedRef.current.close()
                            }}
                            style={{padding: 8, marginRight: -8, marginTop: -8 }}
                        >
                            <FontAwesome name="times-circle" size={24} color="black" />
                        </TouchableOpacity>
                    )
                }
            </View>
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        position: 'relative',
                        zIndex: optionsVisibility.startFromSurah || optionsVisibility.startFromAyah ? 4 : 3,
                        elevation: optionsVisibility.startFromSurah || optionsVisibility.startFromAyah ? 4 : 3,
                    }}
                >
                    <View
                        style={{
                            flexGrow: 1,
                            maxWidth: '65%',
                            marginRight: 16,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ marginBottom: 8 }}>Putar dari surat</Text>
                        <SelectDropdown
                            data={startFromOptions.surah}
                            onSearch={onSearchSurah}
                            defaultValue={defaultStartFrom.surah}
                            rowTextForSelection={(item) => item.label}
                            onSelect={(selectedItem) => {
                                setStartFrom((prev) => ({...prev, surah: selectedItem.value}))
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                            search={true}
                            buttonStyle={{
                                backgroundColor: '#F7F7F7',
                                width: '100%',
                                borderRadius: 8,
                                height: 40,
                            }}
                            buttonTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            rowStyle={{
                                backgroundColor: '#F7F7F7',
                                height: 40,
                                borderBottomColor: '#e0e0e0',
                            }}
                            rowTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            defaultButtonText="Pilih Surat"
                        />
                    </View>
                    <View style={{ width: '30%'}}>
                        <Text style={{ marginBottom: 8 }}>Ayat</Text>
                        <SelectDropdown
                            data={startFromOptions.ayah}
                            onSearch={onAyahSearch}
                            defaultValue={defaultStartFrom.ayah}
                            rowTextForSelection={(item) => item.label}
                            onSelect={(selectedItem) => {
                                setStartFrom((prev) => ({...prev, ayah: selectedItem.value}))
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                            search={true}
                            buttonStyle={{
                                backgroundColor: '#F7F7F7',
                                width: '100%',
                                borderRadius: 8,
                                height: 40,
                            }}
                            buttonTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            rowStyle={{
                                backgroundColor: '#F7F7F7',
                                height: 40,
                                borderBottomColor: '#e0e0e0',
                            }}
                            rowTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            defaultButtonText="Pilih Ayat"
                        />
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        position: 'relative',
                        zIndex: optionsVisibility.untilSurah || optionsVisibility.untilAyah ? 4 : 3,
                        elevation: optionsVisibility.untilSurah || optionsVisibility.untilAyah ? 4 : 3,
                    }}
                >
                    <View style={{
                        flexGrow: 1,
                        maxWidth: '65%',
                        marginRight: 16,
                        marginBottom: 12,
                    }}>
                        <Text style={{ marginBottom: 8 }}>Sampai surat</Text>
                        <SelectDropdown
                            data={untilOptions.surah}
                            onSearch={onSearchSurah}
                            defaultValue={defaultUntil.surah}
                            rowTextForSelection={(item) => item.label}
                            onSelect={(selectedItem) => {
                                setUntil((prev) => ({...prev, surah: selectedItem.value}))
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                            search={true}
                            buttonStyle={{
                                backgroundColor: '#F7F7F7',
                                width: '100%',
                                borderRadius: 8,
                                height: 40,
                            }}
                            buttonTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            rowStyle={{
                                backgroundColor: '#F7F7F7',
                                height: 40,
                                borderBottomColor: '#e0e0e0',
                            }}
                            rowTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            defaultButtonText="Pilih Surat"
                        />
                    </View>
                    <View style={{ width: '30%'}}>
                        <Text style={{ marginBottom: 8 }}>Ayat</Text>
                        <SelectDropdown
                            data={untilOptions.ayah}
                            onSearch={onAyahSearch}
                            defaultValue={until.surah ? untilOptions.ayah[0] : defaultUntil.ayah}
                            rowTextForSelection={(item) => item.label}
                            onSelect={(selectedItem) => {
                                setUntil((prev) => ({...prev, ayah: selectedItem.value}))
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                            search={true}
                            buttonStyle={{
                                backgroundColor: '#F7F7F7',
                                width: '100%',
                                borderRadius: 8,
                                height: 40,
                            }}
                            buttonTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            rowStyle={{
                                backgroundColor: '#F7F7F7',
                                height: 40,
                                borderBottomColor: '#e0e0e0',
                            }}
                            rowTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            defaultButtonText="Pilih Ayat"
                        />
                    </View>
                </View>
                <View
                    style={{ 
                        marginBottom: 12,
                        position: 'relative',
                        zIndex: optionsVisibility.qari ? 4 : 3,
                        elevation: optionsVisibility.qari ? 4 : 3,
                    }}
                >
                    <Text style={{ marginBottom: 8 }}>Qari</Text>
                    <SelectDropdown
                        data={qariOptions}
                        defaultValue={qariOptions[0]}
                        rowTextForSelection={(item) => item.label}
                        onSelect={(selectedItem) => {
                            setQari(selectedItem.value)
                        }}
                        buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                        search={true}
                        buttonStyle={{
                            backgroundColor: '#F7F7F7',
                            width: '100%',
                            borderRadius: 8,
                            height: 40,
                        }}
                        buttonTextStyle={{
                            fontSize: 14,
                            textAlign: 'left'
                        }}
                        rowStyle={{
                            backgroundColor: '#F7F7F7',
                            height: 40,
                            borderBottomColor: '#e0e0e0',
                        }}
                        rowTextStyle={{
                            fontSize: 14,
                            textAlign: 'left'
                        }}
                        defaultButtonText="Pilih Qari"
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        position: 'relative',
                        zIndex: optionsVisibility.repeat ? 4 : 3,
                        elevation: optionsVisibility.repeat ? 4 : 3,
                    }}
                >
                    <View style={{ flexGrow: 1, maxWidth: '65%', marginRight: '5%' }}>
                        <Text style={{ marginBottom: 8 }}>Ulangi pemutaran sebanyak</Text>
                        <SelectDropdown
                            data={repeatOptions}
                            defaultValue={repeatOptions[0]}
                            rowTextForSelection={(item) => item.label}
                            onSelect={(selectedItem) => {
                                setRepeat(selectedItem.value)
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                            search={true}
                            buttonStyle={{
                                backgroundColor: '#F7F7F7',
                                width: '100%',
                                borderRadius: 8,
                                height: 40,
                            }}
                            buttonTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            rowStyle={{
                                backgroundColor: '#F7F7F7',
                                height: 40,
                                borderBottomColor: '#e0e0e0',
                            }}
                            rowTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            defaultButtonText="Pilih Jumlah Pemutaran"
                        />
                    </View>
                    <View style={{ flexGrow: 1, maxWidth: '30%' }}>
                        <Text style={{ marginBottom: 8 }}>Jeda tiap ayat</Text>
                        <SelectDropdown
                            data={delayOptions}
                            defaultValue={delayOptions[0]}
                            rowTextForSelection={(item) => item.label}
                            onSelect={(selectedItem) => {
                                setDelay(selectedItem.value)
                            }}
                            buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                            search={true}
                            buttonStyle={{
                                backgroundColor: '#F7F7F7',
                                width: '100%',
                                borderRadius: 8,
                                height: 40,
                            }}
                            buttonTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            rowStyle={{
                                backgroundColor: '#F7F7F7',
                                height: 40,
                                borderBottomColor: '#e0e0e0',
                            }}
                            rowTextStyle={{
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                            defaultButtonText="Jeda"
                        />
                    </View>
                </View>
                <View style={{ marginTop: 12 }}>
                    <PrimaryButton
                        title="Putar"
                        onPress={handlePlay}
                    />
                </View>
            </View>
        </View>
    )
}

export default AudioConfig;