import { StyleSheet } from "react-native";

const customStyles = StyleSheet.create({
  basicCard: {
    borderRadius: 8,
    borderWidth: 0,
  },
  basicShadow: {
    // shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    // shadow for Android
    elevation: 3,
  },
});

export default customStyles;
