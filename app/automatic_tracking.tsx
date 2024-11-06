import {StyleSheet, View} from "react-native";
import {ApplicationProvider, Button, Layout} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";


export default function App() {
    return(
        <ApplicationProvider {...eva} theme={eva.light}>
            <Layout style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} status={"primary"}>Start</Button>
                    <Button style={styles.button} status={"primary"}>Stop</Button>
                    <Button style={styles.button} status={"primary"}>Pause</Button>
                </View>
            </Layout>
        </ApplicationProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 10,
    },
    button: {
        flex: 1,
        alignSelf: "center",
        marginBottom: 20,
    },
});