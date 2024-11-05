import { Journey } from "@/model/model";
import { View, Text } from "react-native";
import { withObservables } from "@nozbe/watermelondb/react";

const JourneyList = ({ journeys }: { journeys: Journey[] }) => {
  return (
    <View>
      {journeys.map((j) => (
        <View key={j.id}>
          <Text>Reisetitel: {j.title}</Text>
          <Text>ID: {j.id}</Text>
        </View>
      ))}
    </View>
  );
};

const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneyList);
