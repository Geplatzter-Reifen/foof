// This file defines the `CenterButton` and `RouteButton` components, which are used as map control buttons in the application.
// The `CenterButton` recenters the map on the user's location, while the `RouteButton` displays the route on the map if there are any routes available.
// These buttons can be utilized to provide map interaction functionalities.

import { withObservables } from "@nozbe/watermelondb/react";
import { Tour } from "@/database/model/model";
import React from "react";
import SmallIconButton from "@/components/Buttons/SmallIconButton";

type CenterButtonProps = {
  onPress: () => void;
};

export const CenterButton = ({ onPress }: CenterButtonProps) => (
  <SmallIconButton
    icon="location-crosshairs"
    style={styles.mapButton}
    onPress={onPress}
  />
);

type RouteButtonProps = {
  routeCount: number;
  onPress: () => void;
};

export const RouteButton = ({ routeCount, onPress }: RouteButtonProps) => {
  if (routeCount === 0) {
    return null;
  }
  return (
    <SmallIconButton
      icon="route"
      style={[styles.mapButton, styles.routeButton]}
      onPress={onPress}
    />
  );
};

const enhance = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
  routeCount: tour.routes.observeCount(),
}));

export const EnhancedRouteButton = enhance(RouteButton);

const styles = {
  mapButton: {
    backgroundColor: "#fff",
  },
  routeButton: {
    marginBottom: 11,
  },
};
