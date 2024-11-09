import {ApplicationProvider, Layout, Input, Text, Button} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import {StyleSheet} from "react-native";
import React from "react";
import {createTrip, getAllJourneys, getAllJourneysQuery} from "@/model/database_functions";
import JourneySelector from "@/components/Journey/JourneySelector";

export default function ManualTracking() {
    const [startingCoordinates, setStartingCoordinates] = React.useState();
    const [endCoordinates, setEndCoordinates] = React.useState();


    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <Layout style={styles.container}>
                <Text>{startingCoordinates}</Text>
                <Text>{endCoordinates}</Text>
                <JourneySelector journeys={getAllJourneysQuery}></JourneySelector>
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
                <Button onPress={createManualTrip}>Strecke eintragen.</Button>
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


async function createManualTrip() {
    // TODO Fehlerbehandlung, falls keine Journey vorhanden
    let journeys = await getAllJourneys();
    let firstJourney = journeys.at(0);
    createTrip(firstJourney.id, 'Strecke');
}
