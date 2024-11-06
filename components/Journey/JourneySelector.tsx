import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";
import { Journey } from "@/model/model";
import { Select, SelectItem, Layout } from "@ui-kitten/components";

const JourneySelector = ({ journeys }: { journeys: Journey[] }) => {
    const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(null);
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);

    // Handle selection from dropdown
    const onSelectJourney = (index) => {
        setSelectedJourneyIndex(index);
        setSelectedJourney(journeys[index.row]);  // Set selected journey from journeys list
    };

    return (
        <Layout style={styles.container}>
            {/* Journey Selector Dropdown */}
            <Select
                selectedIndex={selectedJourneyIndex}
                onSelect={onSelectJourney}
                placeholder="Select a Journey"
                style={styles.select}
            >
                {journeys.map((journey) => (
                    <SelectItem title={journey.title} key={journey.id} />
                ))}
            </Select>

            {/* Display Selected Journey Details */}
            {selectedJourney && (
                <View style={styles.details}>
                    <Text style={styles.title}>Reisetitel: {selectedJourney.title}</Text>
                    <Text style={styles.id}>ID: {selectedJourney.id}</Text>
                </View>
            )}
        </Layout>
    );
};

// Enhance component to observe journey data from the database
const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneySelector);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    select: {
        marginVertical: 20,
    },
    details: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#f7f9fc",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    id: {
        fontSize: 14,
        color: "#8f9bb3",
    },
});
