import { Journey } from "@/model/model";
import { View, Text } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

const JourneyList = ({ journeys }: { journeys: Journey[] }) => {
  return (
    <View>
      {journeys.map((journey) => (
        <View key={journey.id}>
          <Text>Reisetitel: {journey.title}</Text>
        </View>
      ))}
    </View>
  );
};

const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneyList);
