import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

const startTracking = async () => {
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
        console.log('Tracking stopped.');
    } else {
        console.log('Tracking already stopped.');
    }
};


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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default function Index() {
    return (
        <View style={styles.container}>
            <Button onPress={startTracking} title={"Start tracking"} />
            <Button onPress={stopTracking} title={"Stop tracking"}/>
        </View>
    );
}
