import { Tour, Location } from "@/database/model/model";
import { calculateDistance, MapPoint } from "@/utils/locationUtil";
import LinkedList from "ts-linked-list";
import { getAllLocationsByStageId } from "../data/locationService";
import { flensburg, oberstdorf } from "./data";

const maxDistanceFromCenterFlensburg = 5;
const maxDistanceFromCenterOberstdorf = 10;

export async function isFinished(tour: Tour): Promise<boolean> {
  const connectedLocationList = new LinkedList<MapPoint>();
  const stageList = await tour.stages.fetch();

  let i = 0;
  while (i < stageList.length) {
    const stageA = stageList[i];
    const locationsA: Location[] = await getAllLocationsByStageId(stageA.id);
    const firstLocationA = getFirstLocation(locationsA);
    const lastLocationA = getLastLocation(locationsA);
    if (connectedLocationList.length === 0) {
      // wenn Liste leer, dann prüfe ob die ersten zwei zusammenpassen. Wenn ja, dann packe beide in die linked list
      for (let j = i + 1; j < stageList.length; j++) {
        const stageB = stageList[i + 1];
        const locationsB = await getAllLocationsByStageId(stageB.id);
        const firstLocationB = getFirstLocation(locationsB);
        const lastLocationB = getLastLocation(locationsB);
        if (isLocationInRadius(firstLocationA, firstLocationB, 1)) {
          // in linked list einfügen mit prev = null und next=etappen_list_sorted[j]
          connectedLocationList.push(
            lastLocationA,
            firstLocationA,
            firstLocationB,
            lastLocationB,
          );
          stageList.splice(j, 1);
        } else if (isLocationInRadius(firstLocationA, lastLocationB, 1)) {
          connectedLocationList.push(
            lastLocationA,
            firstLocationA,
            lastLocationB,
            firstLocationB,
          );

          stageList.splice(j, 1);
        } else if (isLocationInRadius(lastLocationA, firstLocationB, 1)) {
          connectedLocationList.push(
            firstLocationA,
            lastLocationA,
            firstLocationB,
            lastLocationB,
          );

          stageList.splice(j, 1);
        } else if (isLocationInRadius(lastLocationA, lastLocationB, 1)) {
          connectedLocationList.push(
            firstLocationA,
            lastLocationA,
            lastLocationB,
            firstLocationB,
          );

          stageList.splice(j, 1);
        }
      }
    } else {
      // wenn schon Elemente in der Liste ist, dann prüfe ob head oder tail verknüpfbar sind mit stageList[i].
      // Wenn ja, dann packe die Elemente in die linked list
      const head = connectedLocationList.head;
      const tail = connectedLocationList.tail;
      if (!head || !tail) {
        throw new Error("Head or tail is undefined");
      }

      if (isLocationInRadius(head.value, firstLocationA, 1)) {
        connectedLocationList.prepend(lastLocationA, firstLocationA);
      } else if (isLocationInRadius(head!.value, lastLocationA, 1)) {
        connectedLocationList.prepend(firstLocationA, lastLocationA);
      } else if (isLocationInRadius(tail!.value, firstLocationA, 1)) {
        connectedLocationList.push(firstLocationA, lastLocationA);
      } else if (isLocationInRadius(tail!.value, lastLocationA, 1)) {
        connectedLocationList.push(lastLocationA, firstLocationA);
      }
    }
    // i erhöhen um zum nächsten Element zu kommen
    i++;
  }
  // Jetzt sollte einmal durch die Liste durchgegangen sein und einige Elemente in der linked list sein.
  // Jetzt prüfen ob head und tail in der Nähe von Flensburg und Oberstdorf sind
  const head = connectedLocationList.head;
  const tail = connectedLocationList.tail;
  if (!head || !tail) {
    return false;
  }
  return (
    (isLocationInRadius(
      flensburg,
      head.value,
      maxDistanceFromCenterFlensburg,
    ) &&
      isLocationInRadius(
        oberstdorf,
        tail.value,
        maxDistanceFromCenterOberstdorf,
      )) ||
    (isLocationInRadius(
      flensburg,
      tail.value,
      maxDistanceFromCenterFlensburg,
    ) &&
      isLocationInRadius(
        oberstdorf,
        head.value,
        maxDistanceFromCenterOberstdorf,
      ))
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
function getLastLocation(locations: Location[]): MapPoint {
  const location = locations.reduce((prevValue, initValue) =>
    prevValue.recordedAt! > initValue.recordedAt! ? prevValue : initValue,
  );
  return {
    latitude: location.latitude,
    longitude: location.longitude,
  } as MapPoint;
}

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
