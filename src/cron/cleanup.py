import datetime

from src.extensions import db
from src.models import Game, User


def cleanup_database():
    """Remove games and users that are older than 1 day"""
    threshold_date = datetime.datetime.now() - datetime.timedelta(days=1)
    outdated_games = Game.query.filter(Game.updated_at < threshold_date)
    for game in outdated_games:
        db.session.delete(game)
    outdated_users = User.query.filter(User.updated_at < threshold_date)
    for user in outdated_users:
        db.session.delete(user)
    db.session.commit()


if __name__ == "__main__":
    cleanup_database()

