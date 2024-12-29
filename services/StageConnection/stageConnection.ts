import { Tour, Location } from "@/database/model/model";
import { calculateDistance, MapPoint } from "@/utils/locationUtil";
import { getAllLocationsByStageId } from "../data/locationService";
import { flensburg, oberstdorf } from "./data";

const maxDistanceFromCenterFlensburg = 5;
const maxDistanceFromCenterOberstdorf = 10;

export async function isFinished(tour: Tour): Promise<boolean> {
  let head: MapPoint | undefined;
  let tail: MapPoint | undefined;
  const stageList = await tour.stages.fetch();

  // Falls nur eine Stage existiert
  if (stageList.length === 1) {
    const locations = await getAllLocationsByStageId(stageList[0].id);
    if (locations.length === 0) {
      return false;
    }
    const firstLocation = getFirstLocation(locations);
    const lastLocation = getLastLocation(locations);
    return areHeadAndTailInFlensburgAndOberstdorf(firstLocation, lastLocation);
  }

  let i = 0;
  while (i < stageList.length) {
    const stageA = stageList[i];
    const locationsA: Location[] = await getAllLocationsByStageId(stageA.id);
    let firstLocationA: MapPoint;
    let lastLocationA: MapPoint;
    try {
      firstLocationA = getFirstLocation(locationsA);
      lastLocationA = getLastLocation(locationsA);
    } catch {
      return false;
    }

    // wenn head und tail noch nicht definiert sind, dann prüfe ob die ersten zwei MapPoints beieinander liegen. Wenn ja, dann packe beide in die linked list
    if (!(head && tail)) {
      for (let j = i + 1; j < stageList.length; j++) {
        const stageB = stageList[i + 1];
        const locationsB = await getAllLocationsByStageId(stageB.id);
        let firstLocationB: MapPoint;
        let lastLocationB: MapPoint;
        try {
          firstLocationB = getFirstLocation(locationsB);
          lastLocationB = getLastLocation(locationsB);
        } catch {
          return false;
        }
        if (isLocationInRadius(firstLocationA, firstLocationB, 1)) {
          head = lastLocationA;
          tail = lastLocationB;

          stageList.splice(j, 1);
        } else if (isLocationInRadius(firstLocationA, lastLocationB, 1)) {
          head = lastLocationA;
          tail = firstLocationB;

          stageList.splice(j, 1);
        } else if (isLocationInRadius(lastLocationA, firstLocationB, 1)) {
          head = firstLocationA;
          tail = lastLocationB;

          stageList.splice(j, 1);
        } else if (isLocationInRadius(lastLocationA, lastLocationB, 1)) {
          head = firstLocationA;
          tail = firstLocationB;

          stageList.splice(j, 1);
        }
      }
    } else {
      // wenn schon Elemente in der Liste ist, dann prüfe ob head oder tail verknüpfbar sind mit stageList[i].
      // Wenn ja, dann packe die Elemente in die linked list
      //const head = connectedLocationList.head;
      //const tail = connectedLocationList.tail;
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
  //const head = connectedLocationList.head;
  //const tail = connectedLocationList.tail;
  if (!head || !tail) {
    return false;
  }
  console.log(connectedLocationList);
  return areHeadAndTailInFlensburgAndOberstdorf(head.value, tail.value);
}

function areHeadAndTailInFlensburgAndOberstdorf(
  head: MapPoint,
  tail: MapPoint,
) {
  return (
    (isLocationInRadius(flensburg, head, maxDistanceFromCenterFlensburg) &&
      isLocationInRadius(oberstdorf, tail, maxDistanceFromCenterOberstdorf)) ||
    (isLocationInRadius(flensburg, tail, maxDistanceFromCenterFlensburg) &&
      isLocationInRadius(oberstdorf, head, maxDistanceFromCenterOberstdorf))
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
  if (locations.length === 0) {
    throw new Error("No locations found");
  }
  // finds the earliest recorded location in the array
  const location = locations.reduce((prevValue, initValue) =>
    prevValue.recordedAt! < initValue.recordedAt! ? prevValue : initValue,
  );
  return {
    latitude: location.latitude,
    longitude: location.longitude,
  } as MapPoint;
}
function getLastLocation(locations: Location[]): MapPoint {
  if (locations.length === 0) {
    throw new Error("No locations found");
  }
  const location = locations.reduce((prevValue, initValue) =>
    prevValue.recordedAt! > initValue.recordedAt! ? prevValue : initValue,
  );
  return {
    latitude: location.latitude,
    longitude: location.longitude,
  } as MapPoint;
}
