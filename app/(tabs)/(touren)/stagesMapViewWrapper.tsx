// Wrapper component that extracts `tourId` and passes it as a prop
import { useLocalSearchParams } from "expo-router";
import { Layout, Text } from "@ui-kitten/components";
import React, { ReactElement } from "react";
import StagesMapView from "../../../components/Tour/stagesMapView";
import { Tour } from "@/model/model";

export default function StagesMapViewWrapper() {
  const { tourId, tour } = useLocalSearchParams<{
    tourId: string;
    tour: ReactElement;
  }>(); // Get tourId from URL
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
