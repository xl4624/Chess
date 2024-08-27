# Multiplayer Chess

## Demo
![demo](https://github.com/xl4624/chess-with-friends/assets/116298054/da102c8e-cc97-4b76-bb2f-1460af8f956b)


## Local Setup Instructions
1. Initialize the Database
In your PostgreSQL console, run:
```
CREATE DATABASE flask_api;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE flask_api TO postgres;
```

2. Install Dependencies
Run `pip install -r requirements.txt` and `npm run install`.

3. Database Migrations
Run `flask db upgrade` to apply database migrations (use `flask db migrate -m "message here"` to create a migration file once you've updated database models).

4. Running the application
Start the application ins dev mode with `npm run dev`.

To test the docker image, run `docker compose build` followed by `docker compose up` (add -d for detached mode) to start up a container.

## Game Mechanics
Everyone viewing a chess game is going to have a chess.js instance running for client-side validation. When a spectator joins mid-game, we send all the moves and have them use `chess.js`'s `load_pgn()` to get the updated version of the game..

- make a move
    - validate the move using `chess.js`
    - send it to the backend
        - validate that the correct user is making their move and not a spectator or the opponent
        - so if it fails validation for any reason bc the wrong person is making this move (through sending user.id and matching white_player_id and black_player_id)
            - send some error message/code and don't make the move in the chess.js game instance 
        - but if it is a valid move
            - updates the Game model with the moves
            - sends the move to both player1 and player2 where they push the move to each of their own game instances.

## TODO
- [ ] Migrate to server-side move validation, since right now you could manipulate the JavaScript using the console and break the game. Moving this logic to the server-side would improve security and integrity. To do this, we could leverage `python-chess` to validate moves from the FEN, and manually check for stalemate from threefold repetition or fifty-move rule.
- [ ] Implement the vs Computer feature which would include the ability to choose to play versus different engines. Right now the two engines we are planning on adding are one that is standard engine using search and evaluate methods, and one using a basic trained 1 move look ahead neural network.

