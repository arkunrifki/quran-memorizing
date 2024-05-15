import { TouchableOpacity } from "react-native";
import { useUserData } from 'context/UserDataContext'

const VerseButton = ({
  index,
  top,
  right,
  width,
  height,
  active = false,
  onPress = () => {},
  onLongPress = () => {},
  ayah = "",
  highlightedAyah = null,
}) => {
  const highlighted = ayah === highlightedAyah;
  const [surahNumber, ayahNumber] = ayah.split(":");
  const { userDataState } = useUserData()
  const { notes = {} } = userDataState

  const hasNote = notes[surahNumber]?.[ayahNumber] !== undefined

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        top: `${top}%`,
        right: `${right}%`,
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: (active | highlighted) ? "rgba(249,205,29,0.3)" : hasNote ? 'rgba(252, 161, 3,0.2)' : "rgba(0,0,0,0)",
        // backgroundColor:
        //   index % 2 === 0 ? "rgba(255,0,0,0.3)" : "rgba(255,0,0,0.5)",
        position: "absolute",
      }}
      onPress={onPress}
      onLongPress={() => onLongPress(ayah)}
    >
      {/* <Text style={{ position: 'absolute' , bottom: 0}}>Test</Text> */}
    </TouchableOpacity>
  );
};

export default VerseButton;
