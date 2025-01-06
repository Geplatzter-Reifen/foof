import {
  Divider,
  Icon,
  Input,
  Layout,
  TopNavigationAction,
  useTheme,
  Text,
  ThemeType,
  IconElement,
} from "@ui-kitten/components";
import { ImageProps, StyleSheet, View } from "react-native";

const TourNameSection = ({
  tourname,
  setTourname,
  titleBeingEdited,
  setTitleBeingEdited,
  onUpdate,
}: {
  tourname: string;
  setTourname: (name: string) => void;
  titleBeingEdited: boolean;
  setTitleBeingEdited: (editing: boolean) => void;
  onUpdate: (newName: string) => void;
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const OkayIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon {...props} name="check" style={[props?.style, { height: 24 }]} />
  );

  const EditIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon {...props} name="edit" style={[props?.style, { height: 24 }]} />
  );
  return (
    <Layout style={styles.settingContainer}>
      <Text category={"s2"} style={styles.settingHeader}>
        Tourname
      </Text>
      <Divider style={styles.divider} />
      {titleBeingEdited ? (
        <View style={styles.inlineContainer}>
          <Input
            style={styles.input}
            value={tourname}
            onChangeText={setTourname}
            onSubmitEditing={(event) => onUpdate(event.nativeEvent.text)}
          />
          <TopNavigationAction
            icon={OkayIcon}
            onPress={() => onUpdate(tourname)}
          />
        </View>
      ) : (
        <View style={styles.inlineContainer}>
          <Text category={"h6"}>{tourname}</Text>
          <TopNavigationAction
            icon={EditIcon}
            onPress={() => setTitleBeingEdited(true)}
          />
        </View>
      )}
    </Layout>
  );
};

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    divider: {
      backgroundColor: theme["color-basic-400"],
      height: 1,
      alignSelf: "stretch",
      marginVertical: 3,
    },
    settingHeader: {
      color: theme["color-basic-500"],
    },
    card: {
      marginTop: 10,
      alignSelf: "flex-start",
      paddingHorizontal: 15,
      marginHorizontal: 10,
    },
    inlineContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
    },
    iconGroup: {
      flexDirection: "row",
      gap: 10,
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
    settingContainer: {
      marginBottom: 15,
    },
  });
