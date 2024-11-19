import { StyleSheet } from "react-native";

const customStyles = StyleSheet.create({
  basicCard: {
    borderRadius: 5,
  },
  basicShadow: {
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,

    // Android
    elevation: 2,
  },
});

export default customStyles;
