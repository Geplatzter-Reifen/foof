import { Journey } from "@/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { Text, Card, Layout } from "@ui-kitten/components";
import { Link } from "expo-router";
import { DATE, dateFormat } from "@/utils/dateUtil";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const JourneyList = ({ journeys }: { journeys: Journey[] }) => {
  return (
    <>
      {journeys.map((journey) => (
        <Link
          asChild
          style={{
            width: 400, // soll später dynamisch werden
          }}
          key={journey.id}
          href={{
            pathname: "/(tabs)/(reisen)/[journeyId]",
            params: { journeyId: journey.id },
          }}
        >
          <Card header={<Text category="h3">{journey.title}</Text>}>
            <Layout>
              {journey.startedAt && (
                <Layout style={{ flexDirection: "row" }}>
                  <FontAwesomeIcon icon="clock" />
                  <Text> {dateFormat(new Date(journey.startedAt), DATE)}</Text>
                </Layout>
              )}
              {journey.finishedAt && (
                <Layout style={{ flexDirection: "row" }}>
                  <FontAwesomeIcon icon="flag" />
                  <Text> {dateFormat(new Date(journey.finishedAt), DATE)}</Text>
                </Layout>
              )}
            </Layout>
          </Card>
        </Link>
      ))}
    </>
  );
};

const enhance = withObservables(["journeys"], ({ journeys }) => ({ journeys }));
export default enhance(JourneyList);
