from flask import Blueprint

team_bp = Blueprint("team", __name__)

@team_bp.route("/test", methods=["GET"])
def test_team():
    return {"message": "Team route is working!"}
