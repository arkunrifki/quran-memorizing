import {
  View,
  Pressable,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import AyahCovers from "../Covers";
import TouchHandler from "../TouchHandler";

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  page: {
    aspectRatio: 0.506,
    ...(height / width < 1.5 && {
      height: "98%",
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center',
    }),
    // width: '98%',
    // width: width,
    backgroundColor: "#f8f5e9",
    // backgroundColor: 'red',
    position: "relative",
  },
});

const RenderPage = ({
  showMenu = {
    value: false,
    setValue: () => {},
  },
  source = null,
  activeAyah = null,
  ayahPositions = [],
  versePress = () => {},
  verseLongPress = () => {},
  covers = [],
  setActiveAyah = () => {},
  highlightedAyah = null,
  // Used to chech if current page is displayed on screen
  page = {},
  activePage = null,
  // START – DEVELOPMENT VARIABLES
  // firstWordCovers = [],
  // invisibleCovers = [],
  // END – DEVELOPMENT VARIABLES
}) => {
  return (
    <Pressable
      style={{
        width: width,
        ...(height / width < 1.5 && {
          alignItems: "center",
          // justifyContent: 'center',
        }),
      }}
      onPress={() => {
        setActiveAyah(null);
        showMenu.setValue(!showMenu.value);
      }}
    >
      <View style={styles.page}>
        <ImageBackground
          source={source}
          style={{
            position: "relative",
            aspectRatio: 0.506,
            // Remove below line to revert to original
            // height:'98%'
          }}
          resizeMode="contain"
        >
          {/* Touch Handler Layer */}
          <TouchHandler
            activeAyah={activeAyah}
            ayahPositions={ayahPositions}
            versePress={versePress}
            verseLongPress={verseLongPress}
            highlightedAyah={highlightedAyah}
          />
          {/* Covers Layer */}
          <AyahCovers
            covers={covers}
            // START – DEVELOPMENT VARIABLES
            // firstWords={firstWordCovers}
            // invisibles={invisibleCovers}
            // END – DEVELOPMENT VARIABLES
          />
        </ImageBackground>
      </View>
    </Pressable>
  );
};

export default RenderPage;
