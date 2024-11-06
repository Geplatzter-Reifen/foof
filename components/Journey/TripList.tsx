import { Trip } from "@/model/model";
import { Layout } from "@ui-kitten/components";
import { withObservables } from "@nozbe/watermelondb/react";
import TripCard from "@/components/Journey/TripCard";

const TripList = ({ trips }: { trips: Trip[] }) => {
  return (
    <Layout>
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </Layout>
  );
};

const enhance = withObservables(["trips"], ({ trips }) => ({ trips }));
export default enhance(TripList);
