import { Trip } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import TripCard from "@/components/Journey/TripCard";
import { Layout } from "@ui-kitten/components";

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
