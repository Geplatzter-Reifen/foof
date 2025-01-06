// Wrapper component that extracts `tourId` and passes it as a prop
import { useLocalSearchParams } from "expo-router";
import { Divider, Layout, Text, TopNavigation } from "@ui-kitten/components";
import StagesMapView from "../../../components/Tour/StagesMapView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import renderBackAction from "@/components/TopNavigation/renderBackAction";

type localParams = {
  tourId?: string;
};

export default function StagesMapViewWrapper() {
  const insets = useSafeAreaInsets();
  const { tourId } = useLocalSearchParams<localParams>(); // Get tourId from URL

  // Pass tourId to the enhanced component
  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        title={() => <Text category="h4">Tourübersicht</Text>}
        style={{ marginTop: insets.top }}
        alignment="center"
        accessoryLeft={renderBackAction}
      ></TopNavigation>
      <Divider />
      {tourId ? (
        <StagesMapView tourId={tourId} />
      ) : (
        <Text category="h5" status="danger">
          No tourId provided.
        </Text>
      )}
    </Layout>
  );
}
