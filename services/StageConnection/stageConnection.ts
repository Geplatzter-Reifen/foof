import { Stage, Tour, Location } from "@/database/model/model";
import { calculateDistance, MapPoint } from "@/utils/locationUtil";
import LinkedList from "ts-linked-list";
import { getAllLocationsByStageId } from "../data/locationService";
import { flensburg, oberstdorf } from "./data";

const connectedStageList = new LinkedList<Stage>();
const maxDistanceFromCenterFlensburg = 5;
const maxDistanceFromCenterOberstdorf = 10;

export async function isFinished(tour: Tour): Promise<boolean> {
  const stageList = await tour.stages.fetch();

  for (const stage of stageList) {
    await getAllLocationsByStageId(stage.id);
  }

  const mapPoint0: MapPoint = {
    latitude: locations0[0].latitude,
    longitude: locations0[0].longitude,
  };
  const locations1 = await getAllLocationsByStageId(stageList[1].id);
  const mapPoint1: MapPoint = {
    latitude: locations1[locations1.length - 1].latitude,
    longitude: locations1[locations1.length - 1].longitude,
  };
  return (
    isLocationInRadius(mapPoint0, flensburg, maxDistanceFromCenterFlensburg) &&
    isLocationInRadius(mapPoint1, oberstdorf, maxDistanceFromCenterOberstdorf)
  );
}
function isLocationInRadius(
  location1: MapPoint,
  location2: MapPoint,
  radius: number,
): boolean {
  return calculateDistance(location1, location2) <= radius;
}

function getFirstLocation(locations: Location[]): MapPoint {
  const location = locations.reduce((prevValue, initValue) =>
    prevValue.recordedAt! < initValue.recordedAt! ? prevValue : initValue,
  );
  return {
    latitude: location.latitude,
    longitude: location.longitude,
  } as MapPoint;
}
function getLastLocation() {}

/*
linked_list = []
etappen_list_sorted
for (int i = 0; i < etappen_list_sorted.lenght; i++):
  erste_location_i
  letzte_location_i
  linked_list.push(etappen_list_sorted[i])
  for(int j = i+1; j < etappen_list_sorted.length; j++):
    erste_location_j
    letzte_location_j
    if (in_area(erste_location_i, erste_location_j))
      # in linked list einfügen mit 
      # prev = null und 
      # next=etappen_list_sorted[j]
      
    else if (in_area(erste_location_i, letzte_location_j))
      ...
    else if (in_area(letzte_location_i, erste_location_j))
      ...
    else if (in_area(letzte_location_i, letzte_location_j))
      ...
    */
