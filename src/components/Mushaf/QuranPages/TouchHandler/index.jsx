import { View } from 'react-native'
import VerseButton from "components/Buttons/VerseButton"

const TouchHandler = ({
    activeAyah = null,
    ayahPositions = [],
    versePress = () => {},
    verseLongPress = () => {},
    highlightedAyah = null
}) => {
    return (
        <View
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                elevation: 3,
                zIndex: 3,
            }}
        >
            {
                ayahPositions.length > 0
                && ayahPositions.map((item,idx) => {
                    const ayah = `${item.key.split(':')[0]}:${item.key.split(':')[1]}`
                    return (
                        <VerseButton
                            index={idx}
                            key={item.key}
                            height={item.height}
                            width={item.width}
                            top={item.top}
                            right={item.right}
                            onPress={versePress}
                            onLongPress={verseLongPress}
                            ayah={ayah}
                            active={activeAyah === ayah}
                            highlightedAyah={highlightedAyah}
                        />
                    )
                })
            }
        </View>
    )
}

export default TouchHandler;