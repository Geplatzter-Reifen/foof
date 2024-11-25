import { ImageProps, Platform, StatusBar, StyleSheet } from "react-native";
import { router } from "expo-router";
import {
  getActiveTour,
  getAllStagesByTourIdQuery,
} from "@/model/database_functions";
import React, { useEffect, useState } from "react";
import { Tour } from "@/model/model";
import {
  Layout,
  Button,
  Text,
  IconElement,
  Icon,
  TopNavigation,
  TopNavigationAction,
  Divider,
} from "@ui-kitten/components";
import { withObservables } from "@nozbe/watermelondb/react";
import RNFadedScrollView from "rn-faded-scrollview";
import { hexToRgba } from "@/utils/colorUtil";
import { foofTheme } from "@/constants/custom-theme";
import StageList from "@/components/Tour/StageList";
import TourStats from "@/components/Statistics/TourStats";

const MapIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="map"
    style={[props?.style, { height: 24, width: "auto" }]}
  />
);

const EditIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="edit" style={[props?.style, { height: 24 }]} />
);

const PlusIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="plus"
    style={[props?.style, { height: 40, width: "auto" }]}
  />
);

export default function Touruebersicht() {
  const [activeTour, setActiveTour] = useState<Tour>();

  useEffect(() => {
    (async () => {
      const activeTour = await getActiveTour();
      if (activeTour) {
        setActiveTour(activeTour);
      }
    })();
  }, []);

  const Header = ({ tour }: { tour: Tour }) => (
    <Text category="h4">{tour.title}</Text>
  );

  const enhance = withObservables([], () => ({
    tour: activeTour!,
  }));
  const EnhancedHeader = enhance(Header);

  const renderMapAction = (): React.ReactElement => (
    <TopNavigationAction icon={MapIcon} hitSlop={15} />
  );

  const renderEditAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={EditIcon}
      hitSlop={15}
      onPress={() =>
        router.push({
          pathname: "./touren",
          params: {
            tourId: activeTour?.id,
            tourTitle: activeTour?.title,
          },
        })
      }
    />
  );

  if (!activeTour) {
    return null;
  }

  return (
    <Layout level="2" style={styles.container}>
      <Layout>
        <TopNavigation
          title={EnhancedHeader}
          accessoryLeft={renderMapAction}
          accessoryRight={renderEditAction}
          style={styles.header}
          alignment="center"
        ></TopNavigation>
        <Divider />
      </Layout>
      <TourStats tour={activeTour} />
      <Text category="h5" style={styles.stagesHeader}>
        Etappen
      </Text>
      <RNFadedScrollView
        allowStartFade={true}
        horizontal={false}
        fadeSize={10}
        fadeColors={[
          hexToRgba(foofTheme["color-basic-200"], 0.18),
          hexToRgba(foofTheme["color-basic-200"], 0.9),
        ]}
        // startFadeStyle={styles.fadeStyle}
        // endFadeStyle={styles.fadeStyle}
      >
        <StageList stages={getAllStagesByTourIdQuery(activeTour.id)} />
      </RNFadedScrollView>
      <Button
        style={styles.button}
        accessoryLeft={PlusIcon}
        onPress={() =>
          router.push({
            pathname: "./createManualStage",
            params: {
              tourId: activeTour?.id,
            },
          })
        }
      ></Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  stagesHeader: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  button: {
    position: "absolute",
    bottom: 35,
    right: 15,
    width: 80,
    height: 80,
    borderRadius: 50,
    elevation: 3,
  },
});
