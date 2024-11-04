import GameListComponent from '@/components/GameListComponent';
import {withObservables} from '@nozbe/watermelondb/react';


const enhance = withObservables(
    ['games'], // this is a list of props that trigger observation restart, (equivalent to `deps` of a React `useHook`)
    ({ games }) => ({ // this is a list of props that our component receives
        games: games.observe(), // and with this statement we 'replace' the original prop with an observable.
    }));

export const GameList = enhance(GameListComponent);
