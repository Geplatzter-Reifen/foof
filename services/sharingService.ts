import Share from "react-native-share";
import { getActiveTour } from "./data/tourService";
import { Stage, Tour } from "@/model/model";
import {
  getTourAverageSpeed,
  getTourDistance,
  getTourDuration,
} from "@/services/statisticsService";
import {
  formatDate,
  DateFormat,
  getTotalMillisecondsString,
} from "@/utils/dateUtil";
const shareStageConstructor = (
  title: string,
  distance: string,
  avgSpeed: string,
  duration: string,
  startedAtDate: string,
  startedAtTime: string,
  finishedAtDate?: string,
  finishedAtTime?: string,
): string => {
  return [
    `Hier ist meine gefahrene Etappe "${title}".\n`,
    `Gestartet bin ich am ${startedAtDate} um ${startedAtTime} Uhr.\n`,
    `Ich bin ${distance} km in ${duration} gefahren mit einer Durchschnittsgeschwindigkeit von ${avgSpeed} km/h\n`,
    finishedAtTime && finishedAtDate
      ? `Angekommen bin ich am ${finishedAtDate} um ${finishedAtTime}\n`
      : "",
  ].join("");
};

const shareTourConstructor = (
  title: string,
  distance: string,
  avgSpeed: string,
  duration: string,
  startedAtDate: string,
  startedAtTime: string,
  finishedAtDate?: string,
  finishedAtTime?: string,
): string => {
  return [
    `Hier ist meine gefahrene Tour "${title}".\n`,
    `Gestartet bin ich am ${startedAtDate} um ${startedAtTime} Uhr.\n`,
    `Ich bin ${distance} km in ${duration} h gefahren mit einer Durchschnittsgeschwindigkeit von ${avgSpeed} km/h\n`,
    finishedAtTime && finishedAtDate
      ? `Angekommen bin ich am ${finishedAtDate} um ${finishedAtTime}\n`
      : "",
  ].join("");
};

export const shareStage = async (stage: Stage) => {
  const stageTitle = stage.title;
  const stageDistance = stage.distance.toFixed(2);
  const stageAverageSpeed = stage.avgSpeed.toFixed(2);
  const stageDuration = getTotalMillisecondsString(
    stage.finishedAt
      ? stage.finishedAt - stage.startedAt
      : Date.now() - stage.startedAt,
  );

  const stageStartedAtDate = formatDate(stage.startedAt, DateFormat.DATE);
  const stageStartedAtTime = formatDate(stage.startedAt, DateFormat.TIME);

  const stageFinishedAtDate = stage.finishedAt
    ? formatDate(stage.finishedAt, DateFormat.DATE)
    : undefined;
  const stageFinishedAtTime = stage.finishedAt
    ? formatDate(stage.finishedAt, DateFormat.TIME)
    : undefined;

  Share.open({
    title: "Share Stage",
    message: shareStageConstructor(
      stageTitle,
      stageDistance,
      stageAverageSpeed,
      stageDuration,
      stageStartedAtDate,
      stageStartedAtTime,
      stageFinishedAtDate,
      stageFinishedAtTime,
    ),
  })
    .then()
    .catch((err) => err && console.log(err));
};

export const shareTour = async (uri?: string) => {
  const tour: Tour | null = await getActiveTour();
  if (!tour) throw new Error("No active Tour");
  const stages: Stage[] = await tour.stages.fetch();
  const tourTitle = tour.title;
  const tourDistance = getTourDistance(stages).toFixed(2);
  const tourAverageSpeed = getTourAverageSpeed(stages).toFixed(2);
  const tourDuration = getTotalMillisecondsString(getTourDuration(stages));

  if (!tour.startedAt) throw new Error("Tour has no start date");
  const tourStartedAtDate = formatDate(tour.startedAt, DateFormat.DATE);
  const tourStartedAtTime = formatDate(tour.startedAt, DateFormat.TIME);

  const tourFinishedAtDate = tour.finishedAt
    ? formatDate(tour.finishedAt, DateFormat.DATE)
    : undefined;
  const tourFinishedAtTime = tour.finishedAt
    ? formatDate(tour.finishedAt, DateFormat.DATE)
    : undefined;

  Share.open({
    title: "Share Tour",
    message: shareTourConstructor(
      tourTitle,
      tourDistance,
      tourAverageSpeed,
      tourDuration,
      tourStartedAtDate,
      tourStartedAtTime,
      tourFinishedAtDate,
      tourFinishedAtTime,
    ),
    url: uri,
  })
    .then()
    .catch((err) => err && console.log(err));
};
