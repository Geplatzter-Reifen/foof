import { ImageProps, TouchableOpacity } from "react-native";
import { Icon } from "@ui-kitten/components";
import { withObservables } from "@nozbe/watermelondb/react";
import { Tour } from "@/database/model/model";
import React from "react";

type CenterButtonProps = {
  onPress: () => void;
};

export const CenterButton = (
  props: CenterButtonProps & Partial<ImageProps>,
) => (
  <TouchableOpacity style={styles.centerButton} onPress={props.onPress}>
    <Icon
      {...props}
      name="location-crosshairs"
      style={[props.style, { height: 23 }]}
    />
  </TouchableOpacity>
);

type RouteButtonProps = {
  routeCount: number;
  onPress: () => void;
};

export const RouteButton = (props: RouteButtonProps & Partial<ImageProps>) => {
  if (props.routeCount === 0) {
    return null;
  }
  return (
    <TouchableOpacity style={styles.routeButton} onPress={props.onPress}>
      <Icon name="route" style={{ height: 22 }} />
    </TouchableOpacity>
  );
};

const enhance = withObservables(["tour"], ({ tour }: { tour: Tour }) => ({
  routeCount: tour.routes.observeCount(),
}));

export const EnhancedRouteButton = enhance(RouteButton);

const styles = {
  centerButton: {
    backgroundColor: "#fff",
    width: 44,
    height: 44,
    borderRadius: 22,
    elevation: 3,
    padding: 10.5,
  },
  routeButton: {
    backgroundColor: "#fff",
    width: 44,
    height: 44,
    borderRadius: 22,
    elevation: 3,
    padding: 10.5,
    marginBottom: 10,
  },
};
