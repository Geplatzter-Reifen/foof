import {StyleSheet, View} from "react-native";
import {ApplicationProvider, Button, Layout} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import {useState} from "react";

const LOCATION_TASK_NAME = 'background-location-task';


export default function App() {
    const [isTracking, setIsTracking] = useState(false)

    const startTracking = async () => {
        setIsTracking(true);

        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus === 'granted') {
            console.log('Foreground status: ', foregroundStatus);
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus === 'granted') {
                console.log('Background status: ', backgroundStatus);
                if(await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)) {
                    console.log('Tracking already started.');
                } else {
                    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                        accuracy: Location.Accuracy.Highest,
                    });
                    console.log('Tracking started.')
                }
            }
        }
    };

    const stopTracking = async () => {
        if(await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            setIsTracking(false);
            console.log('Tracking stopped.');
        } else {
            console.log('Tracking already stopped.');
        }
    };


    return(
        <ApplicationProvider {...eva} theme={eva.light}>
            <Layout style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} onPress={startTracking} status={"primary"}>Start</Button>
                    <Button style={styles.button} onPress={stopTracking} status={"primary"}>Stop</Button>
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


TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        // Error occurred - check `error.message` for more details.
        console.log(error.message)
        return;
    }
    if (data) {
        const { locations } = data;
        console.log('New background location: ', locations)
        // do something with the locations captured in the background
    }
});


