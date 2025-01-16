import Share from "react-native-share";
import { getActiveTour } from "./data/tourService";
import { Stage, Tour } from "@/database/model/model";
import {
  getStageDurationString,
  getTourAverageSpeedString,
  getTourDistanceString,
  getTourDurationString,
} from "@/services/statisticsService";
import { formatDate, DateFormat } from "@/utils/dateUtils";

/**
 * Generates a shareable message for a stage.
 *
 * @param {string} title - Stage title.
 * @param {string} distance - Stage distance in kilometers.
 * @param {string} avgSpeed - Stage average speed in km/h.
 * @param {string} duration - Stage duration.
 * @param {string} startedAtDate - Start date of the stage.
 * @param {string} startedAtTime - Start time of the stage.
 * @param {string} [finishedAtDate] - Optional finish date of the stage.
 * @param {string} [finishedAtTime] - Optional finish time of the stage.
 * @returns {string} Shareable message for the stage.
 */
const shareStageMaker = (
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
    `Ich bin ${distance} km in ${duration} gefahren mit einer Durchschnittsgeschwindigkeit von ${avgSpeed} km/h.\n`,
    finishedAtTime && finishedAtDate
      ? `Angekommen bin ich am ${finishedAtDate} um ${finishedAtTime}\n`
      : "",
  ].join("");
};

/**
 * Generates a shareable message for a tour.
 *
 * @param {string} title - Tour title.
 * @param {string} distance - Tour distance in kilometers.
 * @param {string} avgSpeed - Tour average speed in km/h.
 * @param {string} duration - Tour duration.
 * @param {string} startedAtDate - Start date of the tour.
 * @param {string} startedAtTime - Start time of the tour.
 * @param {string} [finishedAtDate] - Optional finish date of the tour.
 * @param {string} [finishedAtTime] - Optional finish time of the tour.
 * @returns {string} Shareable message for the tour.
 */
const shareTourMaker = (
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
    `Ich bin ${distance} km in ${duration} gefahren mit einer Durchschnittsgeschwindigkeit von ${avgSpeed}.\n`,
    finishedAtTime && finishedAtDate
      ? `Angekommen bin ich am ${finishedAtDate} um ${finishedAtTime}\n`
      : "",
  ].join("");
};

/**
 * Shares details of a single stage.
 *
 * @param {Stage} stage - The stage to share.
 * @returns {Promise<void>} Resolves when the share is completed or fails.
 */
export const shareStage = async (stage: Stage) => {
  const stageTitle = stage.title;
  const stageDistance = stage.distance.toFixed(2);
  const stageAverageSpeed = stage.avgSpeed.toFixed(2);
  const stageDuration = getStageDurationString(stage);

  const stageStartedAtDate = formatDate(stage.startedAt, DateFormat.DATE);
  const stageStartedAtTime = formatDate(stage.startedAt, DateFormat.TIME);

  const stageFinishedAtDate = stage.finishedAt
    ? formatDate(stage.finishedAt, DateFormat.DATE)
    : undefined;
  const stageFinishedAtTime = stage.finishedAt
    ? formatDate(stage.finishedAt, DateFormat.TIME)
    : undefined;
  try {
    await Share.open({
      title: "Share Stage",
      message: shareStageMaker(
        stageTitle,
        stageDistance,
        stageAverageSpeed,
        stageDuration,
        stageStartedAtDate,
        stageStartedAtTime,
        stageFinishedAtDate,
        stageFinishedAtTime,
      ),
    });
  } catch (error) {
    error && console.log(error);
  }
};

/**
 * Shares details of a tour.
 *
 * @param {string} [uri] - Optional URI to attach to the share.
 * @throws {Error} If there is no active tour or required data is missing.
 * @returns {Promise<void>} Resolves when the share is completed or fails.
 */
export const shareTour = async (uri?: string) => {
  const tour: Tour | null = await getActiveTour();
  if (!tour) throw new Error("No active Tour");
  const stages: Stage[] = await tour.stages.fetch();
  const tourTitle = tour.title;
  const tourDistance = getTourDistanceString(stages, 2);
  const tourAverageSpeed = getTourAverageSpeedString(stages, 2);
  const tourDuration = getTourDurationString(stages);

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
    message: shareTourMaker(
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
