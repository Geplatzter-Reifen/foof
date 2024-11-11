import {ApplicationProvider, Layout, Input, Text, Button} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import {StyleSheet} from "react-native";
import React from "react";
import {createTrip, getActiveJourney} from "@/model/database_functions";

export default function ManualTracking() {
    const [startingCoordinates, setStartingCoordinates] = React.useState();
    const [endCoordinates, setEndCoordinates] = React.useState();

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <Layout style={styles.container}>
                <Input
                    placeholder={"Startkoordinaten"}
                    value={startingCoordinates}
                    onChangeText={nextValue => setStartingCoordinates(nextValue)}
                />
                <Input
                    placeholder={"Endkoordinaten"}
                    value={endCoordinates}
                    onChangeText={nextValue => setEndCoordinates(nextValue)}
                />
                <Button onPress={() => createManualTrip(startingCoordinates, endCoordinates)}>Strecke eintragen.</Button>
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
});


async function createManualTrip(startingCoordinatesString, endCoordinatesString) {
    // TODO Fehlerbehandlung, falls keine Journey vorhanden
    let activeJourney = await getActiveJourney();
    let trip = await createTrip(activeJourney.id, 'Strecke');
    let startingCoordinates = parseCoordinates(startingCoordinatesString);
    let endCoordinates = parseCoordinates(endCoordinatesString);
    trip.addLocation(startingCoordinates?.latitude, startingCoordinates?.longitude);
    trip.addLocation(endCoordinates?.latitude, endCoordinates?.longitude);
}

function parseCoordinates(coordinateString: string): { latitude: number; longitude: number } | null {
    const regex = /^\s*([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)\s*$/;
    const match = coordinateString.match(regex);

    if (!match) {
        return null;
    }

    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);

    return { latitude, longitude };
}
