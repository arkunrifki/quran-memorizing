import { useState, useEffect } from 'react'
import { View, Platform, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { useMushafState } from "context/MushafContext"
import { FontAwesome } from '@expo/vector-icons';
import PrimaryButton from 'components/Buttons/PrimaryButton'
import ContentMapper from "assets/mushaf/ContentMapper"
import { findJuzFromAyah } from 'utils/helpers'
import { useUserData } from 'context/UserDataContext'
import _ from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { OS: os } = Platform

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    }
})

const AddNoteModalContent = ({
    forwardedRef,
    ...props
}) => {
    const { target } = props
    const [targetContent, setTargetContent] = useState({})
    const [text, setText] = useState('')
    const { userDataState, dispatch } = useUserData()

    const handleTextChange = (text) => {
        setText(text)
    }

    const handleSaveNote = async () => {
        const newUserDataState = {
            ...userDataState,
            notes: {
                ...userDataState.notes,
            }
        }
        if (!newUserDataState.notes[targetContent.surahNumber]) {
            newUserDataState.notes[targetContent.surahNumber] = {
                [targetContent.ayahNumber]: text
            }
            if (text === '') {
                delete newUserDataState.notes[targetContent.surahNumber][targetContent.ayahNumber]
            }
        } else {
            newUserDataState.notes[targetContent.surahNumber][targetContent.ayahNumber] = text
            if (text === '') {
                delete newUserDataState.notes[targetContent.surahNumber][targetContent.ayahNumber]
            }
        }
        if (_.isEmpty(newUserDataState.notes[targetContent.surahNumber])) {
            delete newUserDataState.notes[targetContent.surahNumber]
        }
        dispatch({
            action: 'SET_USER_DATA',
            payload: newUserDataState
        })
        await AsyncStorage.setItem('userPreferences', JSON.stringify(newUserDataState))
        setText('')
        setTargetContent({})
        forwardedRef.current.close()
    }

    useEffect(() => {
        if (target) {
            const [surah,ayah] = target.split(":")
            const juz = findJuzFromAyah(
                Number(surah),
                Number(ayah)
            )
            const surahTarget = ContentMapper()[juz]
                .metadata
                .find((item) => {
                    return item.number === Number(surah)
                })
            const ayahTarget = surahTarget
                .ayah
                .find((item) => {
                    return item.number === Number(ayah)
                })
            setTargetContent({
                id: ayahTarget.id,
                surahName: surahTarget.name.id,
                surahNumber: surahTarget.number,
                ayahNumber: ayahTarget.number,
            })
        }
    },[target])

    useEffect(() => {
        if (targetContent) {
            if (
                userDataState.notes[targetContent.surahNumber]
                && userDataState.notes[targetContent.surahNumber][targetContent.ayahNumber]
            ) setText(userDataState.notes[targetContent.surahNumber][targetContent.ayahNumber])
        }
    },[targetContent])

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
                    <Text style={{ fontSize: 18, fontWeight: "700"}}>{`Catatan ${targetContent.surahName} : ${targetContent.ayahNumber}`}</Text>
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
            <View style={{ height: '60%'}}>
                <TextInput
                    style={{
                        backgroundColor: '#f5f5f5',
                        padding: 8,
                        paddingTop: 8,
                        borderRadius: 4,
                        height: '100%',
                        width: '100%',
                        textAlignVertical: 'top',
                    }}
                    multiline={true}
                    onChangeText={handleTextChange}
                    value={text}
                    placeholder="Tulis catatanmu disini"
                />
                <PrimaryButton
                    title="Simpan Catatan"
                    style={{ marginTop: 12 }}
                    onPress={handleSaveNote}
                />
                <TouchableOpacity
                    style={{
                        marginTop: 8,
                        padding: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        
                    }}
                    onPress={() => {
                        forwardedRef.current.close()
                    }}
                >
                    <Text>Batal</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddNoteModalContent