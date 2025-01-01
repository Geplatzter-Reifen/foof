import { Tour, Location } from "@/database/model/model";
import { calculateDistance, MapPoint } from "@/utils/locationUtil";
import { getAllLocationsByStageId } from "../data/locationService";
import { flensburg, oberstdorf } from "./data";

const maxDistanceFromCenterFlensburg = 5;
const maxDistanceFromCenterOberstdorf = 10;

export async function isFinished(tour: Tour): Promise<boolean> {
  const stageList = await tour.stages.fetch();

  // Falls eine der Stages alleine schon von Flensburg nach Oberstdorf geht
  for (let stage of stageList) {
    const locations = await getAllLocationsByStageId(stage.id);
    if (locations.length === 0) {
      continue;
    }
    const firstLocation = getFirstLocation(locations);
    const lastLocation = getLastLocation(locations);
    if (areHeadAndTailInFlensburgAndOberstdorf(firstLocation, lastLocation)) {
      return true;
    }
  }

  let head: MapPoint | undefined;
  let tail: MapPoint | undefined;

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
        if (isLocationInRadius(firstLocationA, firstLocationB)) {
          head = lastLocationA;
          tail = lastLocationB;

          stageList.splice(j, 1);
        } else if (isLocationInRadius(firstLocationA, lastLocationB)) {
          head = lastLocationA;
          tail = firstLocationB;

          stageList.splice(j, 1);
        } else if (isLocationInRadius(lastLocationA, firstLocationB)) {
          head = firstLocationA;
          tail = lastLocationB;

          stageList.splice(j, 1);
        } else if (isLocationInRadius(lastLocationA, lastLocationB)) {
          head = firstLocationA;
          tail = firstLocationB;

          stageList.splice(j, 1);
        }
      }
    } else {
      // wenn schon Elemente in der Liste ist, dann prüfe ob head oder tail verknüpfbar sind mit stageList[i].
      // Wenn ja, dann packe die Elemente in die linked list
      if (!head || !tail) {
        throw new Error("Head or tail is undefined");
      }

      if (isLocationInRadius(head, firstLocationA)) {
        head = lastLocationA;
      } else if (isLocationInRadius(head, lastLocationA)) {
        head = firstLocationA;
      } else if (isLocationInRadius(tail, firstLocationA)) {
        tail = lastLocationA;
      } else if (isLocationInRadius(tail, lastLocationA)) {
        tail = firstLocationA;
      }
    }
    // i erhöhen um zum nächsten Element zu kommen
    i++;
  }
  // Jetzt sollte einmal durch die Liste durchgegangen sein und head und tail gesetzt sein.
  // Jetzt prüfen ob head und tail in der Nähe von Flensburg und Oberstdorf sind
  if (!head || !tail) {
    return false;
  }
  return areHeadAndTailInFlensburgAndOberstdorf(head, tail);
}

export function areHeadAndTailInFlensburgAndOberstdorf(
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

export function isLocationInRadius(
  location1: MapPoint,
  location2: MapPoint,
  radius: number = 1,
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
