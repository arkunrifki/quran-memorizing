import { Text, TouchableOpacity, View } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useUserData } from 'context/UserDataContext'
import AyahItem from "../AyahItem";

const SurahItem = ({
    surah,
    onClick,
    active = false,
    count,
    handleClickSurah,
    handleOpenModal = () => {}
}) => {
    const { userDataState } = useUserData()
    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: '#E8E8E8',
                marginBottom: 8,
                borderRadius: 8,
            }}
        >
            <TouchableOpacity
                onPress={() => handleClickSurah(surah.no)}
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        
                    <View style={{ width: 20, height: 16, transform: [{ rotate: active ? '90deg' : '0deg'}], alignItems: 'center', justifyContent: 'center' }}>
                        <AntDesign name="caretright" size={12} color="black" />
                    </View>
                    <Text style={{ fontWeight: '600' }}>{surah.name}</Text>
                </View>
                <Text style={{ color: '#818181'}}>{`${count} Catatan`}</Text>
            </TouchableOpacity>
                {
                    active && (
                        <View style={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 8, borderTopWidth: 1, borderTopColor: '#E8E8E8'}}>
                            {
                                Object.keys(userDataState.notes[surah.no])
                                .map(ayahNumber => {
                                    return(
                                        <AyahItem
                                            key={ayahNumber}
                                            surahNumber={surah.no}
                                            number={ayahNumber}
                                            text={userDataState.notes[surah.no][ayahNumber]}
                                            handleOpenModal={handleOpenModal}
                                        />
                                    )
                                })
                            }
                        </View>
                    )
                }
        </View>
    )
}

export default SurahItem;