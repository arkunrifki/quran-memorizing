import { View, Text, TouchableOpacity } from 'react-native'

const AyahItem = ({
    surahNumber,
    number,
    text,
    handleOpenModal = () => {}
}) => {
    return (
        <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => handleOpenModal(`${surahNumber}:${number}`)}
        >
            <View style={{ padding: 4, borderWidth: 1, borderColor: '#E8E8EE', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderRadius: 4, marginRight: 8 }}>
                <Text>{number}</Text>
            </View>
            <View style={{ height: 40, width: '85%', justifyContent: 'center'}}>
                <Text numberOfLines={1}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default AyahItem;