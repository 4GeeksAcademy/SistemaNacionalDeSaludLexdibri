"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Patient, Doctor, Specialty, UserRole
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
import os
import json
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# Seed pacientes

@api.route("/seed/pacientes", methods=["GET"])
def seed_patients():

    json_route = os.path.join(
        os.path.dirname(__file__),
        "../data/pacientes.json"
    )

    with open(json_route, "r", encoding="utf-8") as file:
        patients = json.load(file)

    existing = 0
    created = 0

    for data in patients:

        user = User.query.filter_by(email=data["email"]).first()

        if user:
            existing += 1
            continue

        user = User(
            email=data["email"],
            password_hash=generate_password_hash(data["password"]),
            first_name=data["first_name"],
            last_name=data["last_name"],
            dni=data["dni"],
            phone=data["phone"],
            date_of_birth=datetime.strptime(
                data["date_of_birth"], "%Y-%m-%d"
            ).date(),
            sex=data["sex"],
            is_active=data["is_active"],
            role=UserRole(data["role"])
        )

        patient = Patient(
            cip=data["cip"],
            blood_type=data["blood_type"]
        )

        # Relación User 1:1 Patient
        user.patient = patient

        db.session.add(user)
        created += 1

    db.session.commit()

    return jsonify({
        "message": "Pacientes creados correctamente",
        "creados": created,
        "ya_existian": existing
    }), 200


# Seed médicos
@api.route("/seed/medicos", methods=["GET"])
def seed_doctors():

    json_route = os.path.join(
        os.path.dirname(__file__),
        "../data/medicos.json"
    )

    with open(json_route, "r", encoding="utf-8") as file:
        doctors = json.load(file)

    existing = 0
    created = 0

    for data in doctors:

        user = User.query.filter_by(email=data["email"]).first()

        if user:
            existing += 1
            continue

        user = User(
            email=data["email"],
            password_hash=generate_password_hash(data["password"]),
            first_name=data["first_name"],
            last_name=data["last_name"],
            dni=data["dni"],
            phone=data["phone"],
            date_of_birth=datetime.strptime(
                data["date_of_birth"], "%Y-%m-%d"
            ).date(),
            sex=data["sex"],
            is_active=data["is_active"],
            role=UserRole(data["role"])
        )

        doctor = Doctor(
            medical_license=data["medical_license"],
            specialty_id=data["specialty_id"],
            years_experience=data["years_experience"]
        )

        # Relación User 1:1 Doctor
        user.doctor = doctor

        db.session.add(user)
        created += 1

    db.session.commit()

    return jsonify({
        "message": "Doctores creados correctamente",
        "creados": created,
        "ya_existian": existing
    }), 200


@api.route("/seed/especialidades", methods=["GET"])
def seed_specialties():

    json_route = os.path.join(
        os.path.dirname(__file__),
        "../data/especialidades.json"
    )

    with open(json_route, "r", encoding="utf-8") as file:
        specialties = json.load(file)

    for data in specialties:

        specialty = Specialty(
            name=data["name"],
            description=data.get("description")
        )

        db.session.add(specialty)

    db.session.commit()

    return jsonify({
        "message": "Especialidades creadas correctamente",
        "total": len(specialties)
    }), 200


@api.route("/register", methods=["POST"])
def registro_usuario():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se han enviado datos"
        }), 400

    # Campos comunes
    required_fields = [
        "email",
        "password",
        "first_name",
        "last_name",
        "dni",
        "phone",
        "date_of_birth",
        "sex",
        "role"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "error": f"Falta el campo: {field}"
            }), 400

    # Comprobar role
    if data["role"] not in ["patient", "doctor"]:
        return jsonify({
            "error": "El role debe ser 'patient' o 'doctor'"
        }), 400

    # Comprobar email
    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:
        return jsonify({
            "error": "El email ya está registrado"
        }), 409

    # Crear User
    user = User(
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
        first_name=data["first_name"],
        last_name=data["last_name"],
        dni=data["dni"],
        phone=data["phone"],
        date_of_birth=datetime.strptime(
            data["date_of_birth"],
            "%Y-%m-%d"
        ).date(),
        sex=data["sex"],
        is_active=True,
        role=UserRole(data["role"])
    )

    # Si es paciente
    if data["role"] == "patient":

        if "cip" not in data or "blood_type" not in data:
            return jsonify({
                "error": "Para un paciente se necesita cip y blood_type"
            }), 400

        patient = Patient(
            cip=data["cip"],
            blood_type=data["blood_type"]
        )

        user.patient = patient

    # Si es médico
    elif data["role"] == "doctor":

        if "medical_license" not in data:
            return jsonify({
                "error": "Para un médico se necesita medical_license"
            }), 400

        doctor = Doctor(
            medical_license=data["medical_license"],
            specialty_id=data["specialty_id"],
            years_experience=data["years_experience"]
        )

        user.doctor = doctor

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Usuario registrado correctamente",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role.value
        }
    }), 201


@api.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se han enviado datos"
        }), 400

    email = data.get("email")
    password = data.get("password")
    print(email, password)
    if not email or not password:
        return jsonify({
            "error": "Email y contraseña son obligatorios"
        }), 400

    # Buscar usuario
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "error": "Email o contraseña incorrectos"
        }), 401

    # Comprobar contraseña
    if not check_password_hash(user.password_hash, password):
        return jsonify({
            "error": "Email o contraseña incorrectos"
        }), 401

    # Comprobar usuario activo
    if not user.is_active:
        return jsonify({
            "error": "El usuario está desactivado"
        }), 403

    # Crear JWT
    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "message": "Inicio de sesión correcto",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role.value
        }
    }), 200
