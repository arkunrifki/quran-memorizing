import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useUserData } from 'context/UserDataContext'
import { SurahItems } from "utils/constants";
import { useRef, useState, useMemo, useCallback, forwardRef } from "react";

import SurahItem from "components/Notes/SurahItem";
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import NoteViewerModalContent from "components/BottomSheet/NoteViewer";
import _ from 'lodash'

const { OS: os } = Platform;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
    }
})

const ForwardNoteViewerModal = forwardRef((props, ref) => <NoteViewerModalContent { ...props } forwardedRef={ref} />)

const Notes = ({ navigation }) => {
    const { userDataState } = useUserData()
    const [activeSurah,setActiveSurah] = useState(null)
    
    // Viewer components
    const [noteViewerModalVisible, setNoteViewerModalVisible] = useState(false)
    const noteViewerRef = useRef(null)
    const snapPoints = useMemo(() => ['100%'],[])
    const [ayahTarget,setAyahTarget] = useState(null)
    
    const handleClickSurah = (surah) => {
        if (activeSurah === surah) return setActiveSurah(null)
        return setActiveSurah(surah)
    }

    const handleModalViewerSnapChange = (index) => {
        if (index === -1) {
            setAyahTarget(null)
            setNoteViewerModalVisible(false)
        }
    }

    const handleOpenModal = (target) => {
        setAyahTarget(target)
        setNoteViewerModalVisible(true)
    }

    const renderBottomSheetBackdrop = useCallback(
        prop => (
            <BottomSheetBackdrop
                {...prop}
                appearsOnIndex={0}
                disappearsOnIndex={1}
                pressBehavior="close"
            />
        )
    )

    return (
        <>
        <View style={{ backgroundColor: '#FFFFFF', width: '100%', height: 48}} />
        <SafeAreaView style={{ backgroundColor: '#FFFFFF'}}>
            <View style={{...styles.container }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4}} onPress={() => navigation.navigate('Homepage')}>
                    <Ionicons name="chevron-back-sharp" size={16} color="#969696" />
                    <Text style={{ fontSize: 16, marginLeft: 8, color: '#969696' }}>Halaman Utama</Text>
                </TouchableOpacity>
                <View style={{ flexGrow: 1, marginTop: 20 }}>
                    <ScrollView style={{ height: os === 'ios' ? '94%' : '93%' }}>
                        { !_.isEmpty(userDataState.notes) ?
                            Object.keys(userDataState.notes).map(key => {
                                return(
                                    <SurahItem
                                        key={key}
                                        surah={SurahItems[Number(key - 1)]}
                                        count={Object.values(userDataState.notes[key]).length}
                                        active={activeSurah === SurahItems[Number(key - 1)].no}
                                        handleClickSurah={handleClickSurah}
                                        handleOpenModal={handleOpenModal}
                                    />
                                )
                            })
                            : (
                                <Text>Kamu belum memiliki catatan</Text>
                            )
                        }
                    </ScrollView>
                </View>
            </View>
            {
                noteViewerModalVisible && (
                    <BottomSheet
                        ref={noteViewerRef}
                        index={0}
                        snapPoints={snapPoints}
                        backdropComponent={renderBottomSheetBackdrop}
                        {...(os === 'android' && { handleComponent: null })}
                        enablePanDownToClose
                        onChange={handleModalViewerSnapChange}
                    >
                        <ForwardNoteViewerModal
                            ref={noteViewerRef}
                            ayahTarget={ayahTarget}
                        />
                    </BottomSheet>
                )
            }
        </SafeAreaView>
    </>
    )
}

export default Notes;