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
import { CreateManualStageModal } from "@/components/Tour/CreateManualStageModal";

const MapIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="map"
    style={[props?.style, { height: 24, width: "100%" }]}
  />
);

const EditIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="edit"
    style={[props?.style, { height: 24, width: "100%" }]}
  />
);

const PlusIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon
    {...props}
    name="plus"
    style={[props?.style, { height: 40, width: "100%" }]}
  />
);

export default function Touruebersicht() {
  const [activeTour, setActiveTour] = useState<Tour>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const activeTour = await getActiveTour();
      if (activeTour) {
        setActiveTour(activeTour);
      }
    })();
  }, []);

  const Header = ({ tour }: { tour: Tour }) => (
    <Text status={"primary"} category="h4">
      {tour.title}
    </Text>
  );

  const enhance = withObservables([], () => ({
    tour: activeTour!,
  }));
  const EnhancedHeader = enhance(Header);

  const renderMapAction = (): React.ReactElement => (
    <TopNavigationAction icon={MapIcon} />
  );

  const renderEditAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={EditIcon}
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
    <Layout style={styles.container}>
      <TopNavigation
        title={EnhancedHeader}
        accessoryLeft={renderMapAction}
        accessoryRight={renderEditAction}
        style={styles.header}
        alignment={"center"}
      ></TopNavigation>
      <Divider />
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
        <Layout level="2">
          <StageList stages={getAllStagesByTourIdQuery(activeTour.id)} />
        </Layout>
      </RNFadedScrollView>
      <CreateManualStageModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        tourId={activeTour.id}
      />
      <Button
        style={styles.button}
        accessoryLeft={PlusIcon}
        onPress={() => setModalVisible(true)}
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
  box: {
    padding: 40,
    backgroundColor: "#EDCBB4",
    elevation: 3,
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
