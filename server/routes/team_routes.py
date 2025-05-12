from flask import Blueprint

# Give this blueprint a unique name
team_test_bp = Blueprint('team_test_bp', __name__)

@team_test_bp.route('/test', methods=['GET'])
def test_team():
    return {"message": "Team route is working!"}, 200
