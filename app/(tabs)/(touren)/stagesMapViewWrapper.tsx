// Wrapper component that extracts `tourId` and passes it as a prop
import { useLocalSearchParams } from "expo-router";
import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import StagesMapView from "../../../components/Tour/stagesMapView";

type localParams = {
  tourId?: string;
  tour?: string;
};

export default function StagesMapViewWrapper() {
  const { tourId, tour } = useLocalSearchParams<localParams>(); // Get tourId from URL
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
  return <StagesMapView tourId={tourId} tour={tour} />;
}
