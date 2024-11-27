import Share, { ShareOptions } from "react-native-share";
import { getActiveTour } from "./data/tourService";
import { Stage, Tour } from "@/model/model";
import {
  getTourAverageSpeed,
  getTourDuration,
} from "@/services/statisticsService";
import { dateFormat, DATE, TIME } from "@/utils/dateUtil";

const url = "https://awesome.contents.com/";
const title = "Awesome Contents";
const message = "Please check this out.";
const icon = "data:<data_type>/<file_extension>;base64,<base64_data>";
const shareTextConstructor = (
  tour: Tour,
  tourDistance: number,
  tourAverageSpeed: number,
): string => {
  const title = `Schau dir meine Tour "${tour.title}" an!\n`;
  if (!tour.startedAt) {
    return `${title}`;
  }
  const dates = `Ich bin am ${dateFormat(tour.startedAt, DATE)} um ${dateFormat(tour.startedAt, TIME)}\n`;
  return title + dates;
};

const options: ShareOptions = {
  title: "Share file",
  message: "Share file: " + url,
  url: url,
  subject: title, //  for email
  filename: "test", // only for base64 file in Android
};

export const share = async () => {
  const tour: Tour | null = await getActiveTour();
  if (!tour) return;
  const stages: Stage[] = await tour.stages.fetch();
  const tourDistance = getTourDuration(stages);
  const tourAverageSpeed = getTourAverageSpeed(stages);
  Share.open({
    title: "Share Tour",
    message: shareTextConstructor(tour, tourDistance, tourAverageSpeed),
  })
    .then((res) => console.log(res))
    .catch((err) => err && console.log(err));
};
