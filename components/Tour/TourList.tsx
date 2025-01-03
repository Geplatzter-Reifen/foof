import { Tour } from "@/database/model/model";
import { withObservables } from "@nozbe/watermelondb/react";
import { Text, Card, Layout } from "@ui-kitten/components";
import { Link } from "expo-router";
import { DATE, formatDate } from "@/utils/dateUtil";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const TourList = ({ tours }: { tours: Tour[] }) => {
  return (
    <>
      {tours.map((tour) => (
        <Link
          asChild
          style={{
            width: 400, // soll später dynamisch werden
          }}
          key={tour.id}
          href={{
            pathname: "/(tabs)/(touren)/[tourId]",
            params: { tourId: tour.id },
          }}
        >
          <Card header={<Text category="h3">{tour.title}</Text>}>
            <Layout>
              {tour.startedAt && (
                <Layout style={{ flexDirection: "row" }}>
                  <FontAwesomeIcon icon="clock" />
                  <Text> {formatDate(new Date(tour.startedAt), DATE)}</Text>
                </Layout>
              )}
              {tour.finishedAt && (
                <Layout style={{ flexDirection: "row" }}>
                  <FontAwesomeIcon icon="flag" />
                  <Text> {formatDate(new Date(tour.finishedAt), DATE)}</Text>
                </Layout>
              )}
            </Layout>
          </Card>
        </Link>
      ))}
    </>
  );
};

const enhance = withObservables(["tours"], ({ tours }) => ({ tours }));
export default enhance(TourList);
