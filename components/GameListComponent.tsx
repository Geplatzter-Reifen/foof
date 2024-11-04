import { BoardGame } from "@/model/model";
import { View, Text } from "react-native";

export default function GameListComponent({ games }: { games: BoardGame[] }) {
  return (
    <View>
      {games.map((game) => (
        <View key={game.title}>
          <Text>{game.title} - </Text>
          <Text>Min Players: {game.minPlayers}</Text>
        </View>
      ))}
    </View>
  );
}
