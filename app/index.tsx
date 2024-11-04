import React from "react";
import { Button, Text, ScrollView } from "react-native";
import {
  createBoardGame,
  gamesQuery,
  deleteAllBoardGames,
} from "@/model/database_functions";
import { GameList } from "@/model/gameList";
let i = 1;
export default function Index() {
  return (
    <ScrollView>
      <Text>Games:</Text>
      <GameList games={gamesQuery} />
      <Button
        onPress={() => createBoardGame("My Board Game" + iii(), iii())}
        title="Create Game"
      />
      <Button onPress={deleteAllBoardGames} title="Delete All Games" />
    </ScrollView>
  );
}

const iii = () => i++;
