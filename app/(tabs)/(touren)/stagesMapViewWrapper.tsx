// Wrapper component that extracts `tourId` and passes it as a prop
import { useLocalSearchParams } from "expo-router";
import { Layout, Text } from "@ui-kitten/components";
import StagesMapView from "../../../components/Tour/StagesMapView";

/**
 * StagesMapViewWrapper Component
 *
 * This wrapper component extracts the `tourId` parameter from the URL using `useLocalSearchParams`.
 * - If `tourId` is not provided, it displays an error message.
 * - If `tourId` is available, it passes it as a prop to the `StagesMapView` component.
 *
 * @returns {JSX.Element}
 * - An error message if `tourId` is missing.
 * - The `StagesMapView` component with the `tourId` prop if it's available.
 *
 * Usage:
 * This component acts as a bridge to inject the `tourId` parameter into the `StagesMapView` component.
 */
type localParams = {
  tourId?: string;
};

export default function StagesMapViewWrapper() {
  const { tourId } = useLocalSearchParams<localParams>(); // Get tourId from URL
  if (!tourId) {
    return (
      <Layout>
        <Text category="h5" status="danger">
          No tourId provided.
        </Text>
      </Layout>
    );
  }

  // Pass tourId to the enhanced component
  return <StagesMapView tourId={tourId} />;
}
