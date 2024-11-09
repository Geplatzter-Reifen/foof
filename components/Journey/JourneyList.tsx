import { Journey } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { Text } from "@ui-kitten/components";
import { Link } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";

const JourneyList = ({ journeys }: { journeys: Journey[] }) => {
  return (
    <>
      {journeys.map((journey) => (
        <Link
          asChild
          style={{
            padding: 10,
            marginVertical: 10,
            width: 400, // soll später dynamisch werden
          }}
          key={journey.id}
          href={{
            pathname: "/(tabs)/(reisen)/[journeyId]",
            params: { journeyId: journey.id },
          }}
        >
          <TouchableOpacity>
            <Text category="h3">{journey.title}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </>
  );
};

const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneyList);
