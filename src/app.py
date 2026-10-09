import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.exceptions import TooManyRequests

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.extensions import limiter

from flask_jwt_extended import JWTManager
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

static_file_dir = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "../dist/"
)

app = Flask(__name__)
app.url_map.strict_slashes = False

# Rate limiting
app.config["RATELIMIT_HEADERS_ENABLED"] = True
limiter.init_app(app)

# CORS
CORS(app)

# Base de datos
db_url = os.getenv("DATABASE_URL")

if db_url is not None:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace(
        "postgres://",
        "postgresql://"
    )
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Base de datos y migraciones
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Administración y comandos
setup_admin(app)
setup_commands(app)

# Manejador global de errores 429 (Rate Limit)
@app.errorhandler(429)
def handle_rate_limit(error):
    response = jsonify({
        "error": "too_many_requests",
        "message": (
            "Has realizado demasiados intentos de inicio de sesión. "
            "Espera unos minutos antes de volver a intentarlo."
        )
    })
    response.status_code = 429
    return response

# Rutas API
app.register_blueprint(api, url_prefix="/api")


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)

    return send_from_directory(static_file_dir, "index.html")


@app.route("/<path:path>", methods=["GET"])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = "index.html"

    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0

    return response


if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)

