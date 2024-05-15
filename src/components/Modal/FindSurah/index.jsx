import {
    View,
    Modal,
    Text,
    Pressable,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { SurahItems } from 'utils/constants';
import { AntDesign } from '@expo/vector-icons';
import { useState, useMemo } from 'react'

const FindSurah = ({
    visible = true,
    setVisibility = () => {},
    navigateToSurah = () => {}
}) => {
    const [query, setQuery] = useState(null)

    const surahData = useMemo(() => {
        if (!query) return SurahItems
        else return SurahItems.map((surah) => {
            const surahName = String(surah.name).toLowerCase()
            const aliases = [
                surahName,
                surahName.replace('-',''),
                surahName.replace('-', ' '),
                surahName.replace(/'/g, ''),
            ]
            if (aliases.some(alias => alias.includes(query.toLowerCase()))) return surah 
            else return null
        }).filter((surah) => !!surah)
    },[query])

    if (visible) {
        return (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => {
                        setVisibility(false)
                    }}
                    style={{
                        position: 'relative'
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20,
                            position: 'relative',
                            zIndex: 999,
                            elevation: 999
                        }}
                    >
                        <View
                            style={{
                                margin: 12,
                                backgroundColor: "white",
                                borderRadius: 4,
                                padding: 12,
                                alignItems: "center",
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                                width: '90%',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 12,
                                    width: '100%'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: '700'
                                    }}
                                >
                                    Pencarian Surat
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        paddingLeft: 8,
                                    }}
                                    onPress={() => setVisibility(false)}
                                >
                                    <AntDesign name="closecircle" size={16} color="#6e6e6e" />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                <TextInput
                                    style={{
                                        flexGrow: 1,
                                        borderWidth: 1,
                                        borderColor: '#D1D1D1',
                                        borderRadius: 4,
                                        padding: 8,
                                    }}
                                    placeholderTextColor="#787878"
                                    placeholder="Ketik surat"
                                    value={query}
                                    onChangeText={(e) => setQuery(e)}
                                />
                            </View>
                            <View
                                style={{
                                    maxHeight: 300,
                                    width: '100%',
                                    marginTop: 8,
                                }}
                            >
                                <FlatList
                                    data={surahData.slice().reverse()}
                                    renderItem={({item}) => {
                                        return (
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 8,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: "#e6e6e6",
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    ...(Number(item.no) < 78 && {
                                                        backgroundColor: '#f0f0f0',
                                                    })
                                                }}
                                                onPress={() => {
                                                    if (Number(item.no) >= 78) {
                                                        navigateToSurah(item)
                                                        setVisibility(false)
                                                    } else return null
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: 32,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            ...(Number(item.no) < 78 && {
                                                                color: '#b3b3b3',
                                                            })
                                                        }}
                                                    >
                                                        {item.no}
                                                    </Text>
                                                </View>
                                                <View style={{ marginLeft: 8 }}>
                                                    <Text
                                                        style={{
                                                            fontWeight: '600',
                                                            ...(Number(item.no) < 78 && {
                                                                color: '#b3b3b3',
                                                            })
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: "#616161",
                                                            ...(Number(item.no) < 78 && {
                                                                color: '#b3b3b3',
                                                            })
                                                        }}
                                                    >
                                                        {item.meaning} | {item.category} ({item.numberOfAyah})
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    // keyExtractor={(item) => item.id}
                                />
                            </View>
                        </View>
                    </View>
                    <Pressable
                        style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            position: 'absolute',
                            zIndex: 100,
                            elevation: 100,
                        }}
                        onPress={() => {
                            setVisibility(false)
                        }}
                    >
                    </Pressable>
                </Modal>
        )
    } else return <></>
}

export default FindSurah