from flask import Blueprint

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/test", methods=["GET"])
def test_chat():
    return {"message": "Chat route is working!"}
