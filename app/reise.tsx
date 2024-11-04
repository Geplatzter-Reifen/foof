import {Text, View} from "react-native";
import StreckeCard, {StreckeData} from "../components/StreckeCard"

export default function Reise() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StreckeCard startLoc={getStreckeData().startLoc} endLoc={getStreckeData().endLoc}
                   startTime={getStreckeData().startTime} endTime={getStreckeData().endTime}/>
    </View>
  );
}

function getStreckeData(): StreckeData {
  return {
    startLoc: "50.7019264,7.1303168",
    endLoc: "50.6285290,7.2064826",
    startTime: new Date("2024-11-04T09:12"),
    endTime: new Date("2024-11-04T16:46")
  }
}