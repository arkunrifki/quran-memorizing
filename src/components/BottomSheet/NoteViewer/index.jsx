import { useEffect, useState } from 'react'
import { View, StyleSheet, Platform, Text, TextInput, TouchableOpacity, BackHandler } from "react-native"
import { FontAwesome } from '@expo/vector-icons';
import ContentMapper from 'assets/mushaf/ContentMapper'
import { findJuzFromAyah } from 'utils/helpers'
import { useUserData } from 'context/UserDataContext'
import PrimaryButton from 'components/Buttons/PrimaryButton'
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash'

const { OS: os } = Platform

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    }
})

const NoteViewerModalContent = ({
    forwardedRef,
    ...props
}) => {
    const { ayahTarget } = props
    const [content,setContent] = useState(null)
    const [surahNumber, ayahNumber] = ayahTarget?.split(':') ?? [null,null]
    const [text,setText] = useState('')
    const { userDataState, dispatch } = useUserData()
    
    useEffect(() => {
        if (ayahTarget) {
            const newContent =
                ContentMapper()[
                    findJuzFromAyah(Number(surahNumber),Number(ayahNumber))
                ].metadata.find((surah) => surah.number === Number(surahNumber))
            setContent(newContent)
        }
    }, [ayahTarget])

    useEffect(() => {
        if (surahNumber && ayahNumber) {
            const newText = userDataState.notes[surahNumber]?.[ayahNumber] ?? ''
            setText(newText)
        }
    },[surahNumber, ayahNumber])

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
        if (!newUserDataState.notes[surahNumber]) {
            newUserDataState.notes[surahNumber] = {
                [ayahNumber]: text
            }
            if (text === '') {
                delete newUserDataState.notes[surahNumber][ayahNumber]
            }
        } else {
            newUserDataState.notes[surahNumber][ayahNumber] = text
            if (text === '') {
                delete newUserDataState.notes[surahNumber][ayahNumber]
            }
        }
        if (_.isEmpty(newUserDataState.notes[surahNumber])) {
            delete newUserDataState.notes[surahNumber]
        }
        dispatch({
            action: 'SET_USER_DATA',
            payload: newUserDataState
        })
        await AsyncStorage.setItem('userPreferences', JSON.stringify(newUserDataState))
        setText('')
        forwardedRef.current.close()
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
                <Text style={{ fontSize: 18, fontWeight: "700"}}>{`Catatan Surah ${content?.name?.id}`}</Text>
                <Text style={{ marginTop: 8 }}>{`Ayat ${ayahNumber}`}</Text>
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
            <View style={{ height: '75%'}}>
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

export default NoteViewerModalContent;