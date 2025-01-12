// Wrapper component that extracts `tourId` and passes it as a prop
import { useLocalSearchParams } from "expo-router";
import { Divider, Layout, Text, TopNavigation } from "@ui-kitten/components";
import StagesMapView from "../../../components/Tour/StagesMapView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import renderBackAction from "@/components/TopNavigation/renderBackAction";

type localParams = {
  tourId?: string;
};
/**
 * This wrapper component acts as a bridge to inject the `tourId` parameter into the `StagesMapView` component.
 * It extracts the `tourId` parameter from the URL using `useLocalSearchParams`.
 * - If `tourId` is not provided, it displays an error message.
 * - If `tourId` is available, it passes it as a prop to the `StagesMapView` component.
 *
 * @returns {JSX.Element}
 * - An error message if `tourId` is missing.
 * - The `StagesMapView` component with the `tourId` prop if it's available.
 */
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
