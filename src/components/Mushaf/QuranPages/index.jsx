import { useRef, useState, useEffect } from "react";
import { SafeAreaView, Dimensions, FlatList, ScrollView } from "react-native";
import ContentMapper from "assets/mushaf/ContentMapper";
import { useMushafState } from "context/MushafContext";
import RenderPage from "./RenderPage";
import { usePlayerProvider } from "context/PlayerContext";
import { generatePlaylistItems } from "utils/helpers";

const { width } = Dimensions.get("window");

const QuranPages = ({
  showMenu,
  setShowMenu,
  pageIndex,
  highlightedAyahValue,
  handleDisplayAyahMenu = () => {},
}) => {
  // console.log('renderer', initialJuz, initialPage)
  const [activeJuz, setActiveJuz] = useState(30);
  const [highlightedAyah,setHighlightedAyah] = useState(highlightedAyahValue)

  const [pages, setPages] = useState([
    "23",
    "22",
    "21",
    "20",
    "19",
    "18",
    "17",
    "16",
    "15",
    "14",
    "13",
    "12",
    "11",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1",
  ]);
  const [activePage, setActivePage] = useState(null);
  const [content, setContent] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const flatListRef = useRef(null);

  const { mushafState, dispatch } = useMushafState();
  const { visibilityMode } = mushafState;

  const { playerState, dispatch: playerDispatch } = usePlayerProvider();

  // START – DEVELOPMENT VARIABLES
  // const [firstWordCovers, setFirstWordCovers] = useState({});
  // const [invisibleCovers, setInvisibleCovers] = useState({});
  // END – DEVELOPMENT VARIABLES

  // Active Ayah
  const [activeAyah, setActiveAyah] = useState(null);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActivePage(viewableItems[0].item);
    }
  });

  const verseLongPress = (ayah) => {
    setActiveAyah(ayah);
    handleDisplayAyahMenu(ayah);
  };

  const versePress = () => {
    setActiveAyah(null);
    setShowMenu(!showMenu);
    if (!!highlightedAyah) setHighlightedAyah(null)
    console.log("press");
  };
  
  useEffect(() => {
    if (activePage) {
      setActiveAyah(null);
      setCurrentContent(ContentMapper()[activeJuz].pages[activePage].content);
      dispatch({
        action: "SET_ACTIVE_CONTENT",
        payload: {
          juz: activeJuz,
          verses: ContentMapper()
            [activeJuz].pages[activePage].content.map((item) => item.verse)
            .reduce((acc, cur) => {
              if (!acc[cur.split(":")[0]]) {
                acc[cur.split(":")[0]] = [cur.split(":")[1]];
              } else {
                acc[cur.split(":")[0]].push(cur.split(":")[1]);
              }
              return acc;
            }, {}),
        },
      });
    }
  }, [activePage]);

  useEffect(() => {
    if (currentContent) {
      const [surahStart, ayahStart] = currentContent[0].verse.split(":");
      const [surahEnd, ayahEnd] =
        currentContent[currentContent.length - 1].verse.split(":");
      if (playerState.status === "stopped") {
        playerDispatch({
          type: "SET_RAW_DATA",
          payload: {
            surahStart,
            ayahStart,
            surahEnd,
            ayahEnd,
          }
        })
        playerDispatch({
          type: "SET_PLAYLIST",
          payload: generatePlaylistItems(
            Number(surahStart),
            Number(ayahStart),
            Number(surahEnd),
            Number(ayahEnd),
            "ar.alafasy"
          ),
        });
      }
    }
  }, [currentContent]);

  useEffect(() => {
    if (activeJuz) {
      setContent(ContentMapper()[activeJuz].pages);
    }
  }, [activeJuz]);

  useEffect(() => {
    setTimeout(() => {
      setShowMenu(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!!highlightedAyah) setHighlightedAyah(null)
    },5000)
  },[])

  // Scroll to page
  useEffect(() => {
    if (typeof pageIndex === "number") {
      flatListRef.current.scrollToIndex({
        index: pageIndex,
        animated: false,
      });
    }
  }, [pageIndex]);

  // START – DEVELOPMENT VARIABLES
  // useEffect(() => {
  //   if (currentContent) {
  //     const newFirstWordCovers = currentContent
  //       .map((ayah) => {
  //         return ayah.covers["firstWord"];
  //       })
  //       .reduce((acc, cur) => {
  //         return [...acc, ...cur];
  //       }, []);
  //     setFirstWordCovers(newFirstWordCovers);
  //     const newInvisibleCovers = currentContent
  //       .map((ayah) => {
  //         return ayah.covers["invisible"];
  //       })
  //       .reduce((acc, cur) => {
  //         return [...acc, ...cur];
  //       }, []);
  //     setInvisibleCovers(newInvisibleCovers);
  //   }
  // }, [currentContent]);
  // END – DEVELOPMENT VARIABLES

  return (
    <ScrollView>
      <FlatList
        style={{
          // height: '50%',
          // aspectRatio: 0.506,
          position: "relative",
        }}
        ref={flatListRef}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewChanged.current}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={pageIndex}
        // snapToInterval={width}
        // snapToAlignment={"center"}
        // decelerationRate={0}
        data={pages}
        keyExtractor={(item) => {
          return item;
        }}
        renderItem={(page) => {
          if (!content) return <></>;
          return (
            <RenderPage
              page={page}
              showMenu={{
                value: showMenu,
                setValue: setShowMenu,
              }}
              source={content[page.item]?.image ?? null}
              activeAyah={activeAyah}
              setActiveAyah={setActiveAyah}
              ayahPositions={content[page.item]?.content
                .map((ayah) => {
                  return ayah.coord;
                })
                .reduce((acc, cur) => {
                  return [...acc, ...cur];
                }, [])}
              versePress={versePress}
              verseLongPress={verseLongPress}
              covers={content[page.item]?.content
                .map((ayah) => {
                  return ayah.covers[visibilityMode] ?? [];
                })
                .reduce((acc, cur) => {
                  return [...acc, ...cur];
                }, [])}
              activePage={activePage}
              highlightedAyah={highlightedAyah}
              // START – DEVELOPMENT VARIABLES
              // invisibleCovers={invisibleCovers}
              // firstWordCovers={firstWordCovers}
              // END – DEVELOPMENT VARIABLES
            />
          );
        }}
      />
    </ScrollView>
  );
};

export default QuranPages;
