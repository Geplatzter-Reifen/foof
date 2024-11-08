import { Journey } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { Layout, Text } from "@ui-kitten/components";
import { Link } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

const JourneyList = ({ journeys }: { journeys: Journey[] }) => {
  return (
    <ScrollView style={{flex:1}}>
      <Layout style={{ justifyContent: "center" }}>
        {journeys.map((journey) => (
          <Link
            style={{
              padding: 10,
              borderColor: "orange",
              borderWidth: 1,
              borderRadius: 5,
            }}
            key={journey.id}
            href={{
              pathname: "/(tabs)/(reisen)/[journeyId]",
              params: { journeyId: journey.id },
            }}
          >
            <Layout>
              <Text category="h3">{journey.title}</Text>
            </Layout>
          </Link>
        ))}
      </Layout>
    </ScrollView>
  );
};



const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneyList);
