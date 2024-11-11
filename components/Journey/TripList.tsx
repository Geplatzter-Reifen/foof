import { Trip } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import TripCard from "@/components/Journey/TripCard";
import { Layout, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

const TripList = ({ trips }: { trips: Trip[] }) => {
  return (
    <Layout level="3">
      {trips.length === 0 ? (
        <Text style={styles.noTripText}>Starte eine Strecke!</Text>
      ) : (
        trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
      )}
    </Layout>
  );
};

const enhance = withObservables(["trips"], ({ trips }) => ({ trips }));
export default enhance(TripList);

const styles = StyleSheet.create({
  noTripText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 20,
  },
});
