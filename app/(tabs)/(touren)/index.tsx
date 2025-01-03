import { ImageProps, StyleSheet } from "react-native";
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
import { hexToRgba } from "@/utils/colorUtils";
import { StageList } from "@/components/Tour/StageList";
import TourStats from "@/components/Statistics/TourStats";
import { getActiveTour } from "@/services/data/tourService";
import { getAllStagesByTourIdQuery } from "@/services/data/stageService";
import { shareTour } from "@/services/sharingService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
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
          router.navigate({
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

  const renderEditAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={EditIcon}
      hitSlop={15}
      onPress={() =>
        router.navigate({
          pathname: "./tourSettings",
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
        {renderEditAction()}
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
          style={{ marginTop: insets.top }}
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
          router.navigate({
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
