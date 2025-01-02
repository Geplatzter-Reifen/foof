import { ImageProps, Platform, StatusBar, StyleSheet } from "react-native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Tour } from "@/database/model/model";
import {
  Layout,
  Button,
  Text,
  IconElement,
  Icon,
  TopNavigation,
  TopNavigationAction,
  Divider,
  useTheme,
} from "@ui-kitten/components";
import { withObservables } from "@nozbe/watermelondb/react";
import RNFadedScrollView from "rn-faded-scrollview";
import { hexToRgba } from "@/utils/colorUtil";
import { StageList } from "@/components/Tour/StageList";
import TourStats from "@/components/Statistics/TourStats";
import { getActiveTour } from "@/services/data/tourService";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import { shareTour } from "@/services/sharingService";

const MapIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="map"
    style={[props?.style, { height: 24, width: "auto" }]}
  />
);

const SettingsIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="gear" style={[props?.style, { height: 24 }]} />
);

const ShareIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="share-nodes" style={[props?.style, { height: 24 }]} />
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
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const activeTour = await getActiveTour();
      if (activeTour) {
        setActiveTour(activeTour);
      }
    })();
  }, []);

  const renderMapAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MapIcon}
      hitSlop={15}
      onPress={() => {
        if (activeTour) {
          router.push({
            pathname: "./stagesMapViewWrapper",
            params: {
              tourId: activeTour.id,
            },
          });
        }
      }}
    />
  );

  const renderShareAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={ShareIcon}
      hitSlop={15}
      onPress={() => {
        shareTour();
      }}
    />
  );

  const renderSettingsAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={SettingsIcon}
      hitSlop={15}
      onPress={() =>
        router.push({
          pathname: "./settings",
          params: {
            tourId: activeTour?.id,
            tourTitle: activeTour?.title,
          },
        })
      }
    />
  );

  const Header = ({ tour }: { tour: Tour }) => (
    <Text category="h4">{tour.title}</Text>
  );

  const headerRight = () => {
    return (
      <>
        {renderSettingsAction()}
        {renderShareAction()}
      </>
    );
  };

  const enhance = withObservables([], () => ({
    tour: activeTour!,
  }));
  const EnhancedHeader = enhance(Header);

  if (!activeTour) {
    return null;
  }

  return (
    <Layout level="2" style={styles.container}>
      <Layout>
        <TopNavigation
          title={EnhancedHeader}
          accessoryLeft={renderMapAction}
          accessoryRight={headerRight}
          style={styles.header}
          alignment="center"
        ></TopNavigation>
        <Divider />
      </Layout>

      {/* Tourstatistiken in orangem Kasten */}
      <TourStats tour={activeTour} />

      {/* Liste mit Etappen innerhalb einer Scrollview mit Fade */}
      <RNFadedScrollView
        allowStartFade={true}
        horizontal={false}
        fadeSize={15}
        fadeColors={[
          hexToRgba(theme["background-basic-color-2"], 0.3),
          hexToRgba(theme["background-basic-color-2"], 0.9),
        ]}
      >
        <StageList stages={getAllStagesByTourIdQuery(activeTour.id)} />
      </RNFadedScrollView>

      {/* Button zum erstellen einer manuellen Etappe */}
      <Button
        style={styles.button}
        accessoryLeft={PlusIcon}
        onPress={() =>
          router.push({
            pathname: "./createManualStage",
            params: {
              tourId: activeTour?.id,
              tour: activeTour?.title,
            },
          })
        }
      />
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
