import { Journey } from "@/model/model";
import { View, Text } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";
import { Link } from "expo-router";

const JourneyList = ({ journeys }: { journeys: Journey[] }) => {
  return (
    <View>
      {journeys.map((journey) => (
        <Link
          key={journey.id}
          href={{
            pathname: "/(tabs)/(reisen)/[journeyId]",
            params: { journeyId: journey.id },
          }}
        >
          <View>
            <Text>Reisetitel: {journey.title}</Text>
            <Text>ID: {journey.id}</Text>
          </View>
        </Link>
      ))}
    </View>
  );
};

const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneyList);
