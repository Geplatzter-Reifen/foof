import { Journey } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { Text } from "@ui-kitten/components";
import { Link } from "expo-router";

const JourneyList = ({ journeys }: { journeys: Journey[] }) => {
  return (
    <>
      {journeys.map((journey) => (
        <Link
          style={{
            padding: 10,
            marginVertical: 10,
            width: 400,
          }}
          key={journey.id}
          href={{
            pathname: "/(tabs)/(reisen)/[journeyId]",
            params: { journeyId: journey.id },
          }}
        >
          <Text category="h3" status="primary">
            {journey.title}
          </Text>
        </Link>
      ))}
    </>
  );
};

const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneyList);
