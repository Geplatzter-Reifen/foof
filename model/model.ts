import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export class BoardGame extends Model {
  static table = 'board_games'; // bind the model to specific table
  // @ts-ignore
  @text('title') title: string; // binds a table column to a model property
  // @ts-ignore
  @field('min_players') minPlayers; // for non-text fields you the "field" decorator
}