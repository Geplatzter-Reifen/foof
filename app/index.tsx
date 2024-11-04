import { View, StyleSheet } from "react-native";
import {Link} from "expo-router";


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href='/reise' style={styles.button}>
        zur Reiseübersicht
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 17,
    textDecorationLine: 'underline',
    color: '#00f',
  },
});
