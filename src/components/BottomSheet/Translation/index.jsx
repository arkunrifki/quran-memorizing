import { useState, useEffect } from 'react'
import { View, Platform, StyleSheet, Text, TouchableOpacity, ScrollView, BackHandler } from "react-native"
import { useMushafState } from "context/MushafContext"
import { FontAwesome } from '@expo/vector-icons';
import ContentMapper from "assets/mushaf/ContentMapper"

const { OS: os } = Platform

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    }
})

const TranslationModalContent = ({
    forwardedRef,
    ...props
}) => {
    const {
        mushafState
    } = useMushafState()
    const { content: activeContent } = mushafState
    const { juz, verses } = activeContent

    const [content,setContent] = useState(null)

    useEffect(() => {
        if (juz) {
        const availableSurah = Object.keys(verses).map((key) => Number(key))
        setContent(
            ContentMapper()[juz].metadata
            .filter((item) => {
                return availableSurah.includes(item.number)
            })
            .reduce((acc,cur) => {
                acc[cur.number] = cur
                return acc
            },{})
        )
        
        }
    },[juz])

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
                    <Text style={{ fontSize: 18, fontWeight: "700"}}>Terjemah</Text>
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
            <View style={{ height: '80%'}}>
                <ScrollView>
                    {
                        content && Object.keys(content).map((key) => {
                            return (
                                <View
                                    key={key}
                                    style={{
                                        marginBottom: 0,
                                    }}
                                >
                                    <View
                                        style={{
                                            padding: 12,
                                            borderWidth: 1,
                                            borderColor: '#e2e8f0',
                                            flexDirection: "row",
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: '#f8fafc',
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', fontWeight: '600', marginHorizontal: 8 }}>{content[key].name.id}</Text>
                                        <Text style={{ textAlign: 'center', marginHorizontal: 8, fontSize: 12 }}>{content[key].name.translation}</Text>
                                    </View>
                                    <View style={{ padding: 8}}>
                                        {
                                            verses[key] && verses[key].map((item) => {
                                                const ayah = content[key].ayah.find((ayah) => String(ayah.number) === String(item))
                                                return (
                                                    <View style={{ flexDirection: 'row', marginBottom: 8 }} key={ayah.id}>
                                                        <Text style={{ marginRight: 8, fontWeight: '600'}}>{ayah.number}.</Text>
                                                        <Text>
                                                            {ayah.translation}
                                                        </Text>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default TranslationModalContent