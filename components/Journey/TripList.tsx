import { Trip } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import TripCard from "@/components/Journey/TripCard";
import { ScrollView } from "react-native";

const TripList = ({ trips }: { trips: Trip[] }) => {
  return (
    <ScrollView>
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </ScrollView>
  );
};

const enhance = withObservables(["trips"], ({ trips }) => ({ trips }));
export default enhance(TripList);
