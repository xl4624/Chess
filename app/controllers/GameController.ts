import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

import { AppDataSource } from "../../db/DataSource.ts";
import { Game } from "../../db/entities/Game.ts";
import { GameModel, GameParams } from "../types/GameTypes.ts";

export const getAllGames = (_req: Request, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .find()
    .then((result) => res.send(result))
    .catch((err: Error) => next(err));
};

export const createGame = (req: Request<unknown, unknown, GameModel>, res: Response, next: NextFunction): void => {
  const game = plainToClass(Game, req.body);

  validate(game)
    .then((errors) => {
      if (errors.length <= 0) {
        AppDataSource.getRepository("Game")
          .save(game)
          .then((result) => res.send(result))
          .catch((err) => next(err));
      } else {
        res.status(400).json({ errors });
      }
    })
    .catch((err: Error) => next(err));
};

export const deleteAllGames = (_req: Request, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .clear()
    .then(() => res.send("All games deleted"))
    .catch((err: Error) => next(err));
};

export const getGame = (req: Request<GameParams>, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .findOne({ where: { token: req.params.token } })
    .then((result) => res.send(result))
    .catch((err: Error) => next(err));
};

export const updateGame = (req: Request<GameParams, unknown, GameModel>, res: Response, next: NextFunction): void => {
  const gameRepository = AppDataSource.getRepository("Game");

  gameRepository
    .findOne({ where: { token: req.params.token } })
    .then((existingGame) => {
      if (existingGame) {
        const updatedGame = gameRepository.merge(existingGame, req.body);

        validate(updatedGame)
          .then((errors) => {
            if (errors.length <= 0) {
              gameRepository
                .save(updatedGame)
                .then((result) => res.send(result))
                .catch((err) => next(err));
            } else {
              res.status(400).json({ errors });
            }
          })
          .catch((err) => next(err));
      } else {
        res.status(404).json({ error: "Game not found" });
      }
    })
    .catch((err) => next(err));
};

export const deleteGame = (req: Request<GameParams>, res: Response, next: NextFunction): void => {
  AppDataSource.getRepository("Game")
    .delete({ token: req.params.token })
    .then((result) => res.send(result))
    .catch((err: Error) => next(err));
};
