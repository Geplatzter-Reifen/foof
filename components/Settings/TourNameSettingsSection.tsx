import React, { useState } from "react";
import {
  Icon,
  IconElement,
  Input,
  Text,
  ThemeType,
  TopNavigationAction,
  useTheme,
} from "@ui-kitten/components";
import { ImageProps, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";

import SingleSettingLayout from "@/components/Settings/SingleSettingLayout";

import InlineRow from "@/components/Settings/InlineRow";
import { updateTourNameById } from "@/services/data/tourService";

const OkayIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="check" style={[props?.style, { height: 24 }]} />
);

const EditIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="edit" style={[props?.style, { height: 24 }]} />
);

type TourenParams = {
  tourId: string;
  tourTitle: string;
};

/**
 * TourNameSettingsSection
 *
 * A React component for managing the tour name in the application settings.
 * Users can view, edit, and update the name of the current tour.
 *
 * @component
 *
 * @returns {React.ReactElement}
 *
 */

export default function TourNameSettingsSection(): React.ReactElement {
  const params = useLocalSearchParams() as TourenParams;
  const { tourTitle, tourId } = params;
  const [tourname, setTourname] = useState(tourTitle);
  const [titleBeingEdited, setTitleBeingEdited] = useState(false);

  const theme = useTheme();
  const styles = makeStyles(theme);

  const updateTourname = (newTourName: string) => {
    updateTourNameById(tourId, newTourName).then(() => {
      setTourname(newTourName);
      setTitleBeingEdited(false);
    });
  };

  return (
    <SingleSettingLayout settingName={"Tourname"}>
      {titleBeingEdited ? (
        <InlineRow
          leftComponent={
            <Input
              style={styles.input}
              value={tourname}
              onChangeText={setTourname}
              onSubmitEditing={(event) =>
                updateTourname(event.nativeEvent.text)
              }
            />
          }
          buttons={
            <TouchableOpacity onPress={() => updateTourname(tourname)}>
              <OkayIcon style={styles.iconStyle} />
            </TouchableOpacity>
          }
        />
      ) : (
        <InlineRow
          leftComponent={<Text category={"h6"}>{tourname}</Text>}
          buttons={
            <TouchableOpacity onPress={() => setTitleBeingEdited(true)}>
              <EditIcon style={styles.iconStyle} />
            </TouchableOpacity>
          }
        />
      )}
    </SingleSettingLayout>
  );
}

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    successMessage: {
      marginTop: 10,
      color: theme["color-primary-600"],
    },
    input: {
      marginTop: 5,
      alignSelf: "stretch",
      width: "80%",
    },
    description: {
      marginTop: 5,
      color: theme["color-basic-500"],
    },
    accentText: {
      color: theme["color-primary-600"],
    },
    iconStyle: {
      height: 25,
      width: "auto",
      color: theme["color-primary-500"],
    },
  });
