"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Patient, Doctor, Specialty, UserRole, Disease,DoctorPatient
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
import os
import json
import requests
from werkzeug.security import generate_password_hash, check_password_hash
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


# Acceso a dashboard´s

@api.route("/dashboard", methods=["GET"])
@jwt_required()
def entrar_en_dashboard():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.role == UserRole.DOCTOR:
        return jsonify({
            "message": "Acceso permitido",
            "dashboard": "doctor",
            "redirect": "/dashboard/doctor"
        }), 200

    elif user.role == UserRole.PATIENT:
        return jsonify({
            "message": "Acceso permitido",
            "dashboard": "patient",
            "redirect": "/dashboard/patient"
        }), 200

    return jsonify({"error": "Role no válido"}), 403


# Obtener enfermedades de API externa

@api.route("/seed/enfermedades", methods=["GET"])
def sincronizar_enfermedades():

    url = "https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/enfermedades-de-declaracion-obligatoria-casos-por-grupo-de-edad/records"

    params = {
        "select": "enfermedad",
        "group_by": "enfermedad",
        "order_by": "enfermedad",
        "limit": 100
    }

    try:
        response = requests.get(
            url,
            params=params,
            timeout=10
        )
        response.raise_for_status()

    except requests.RequestException as e:
        return jsonify({
            "error": "No se han podido obtener las enfermedades",
            "details": str(e)
        }), 500

    data = response.json()

    enfermedades = [
        item["enfermedad"].strip()
        for item in data.get("results", [])
        if item.get("enfermedad")
    ]

    enfermedades_creadas = 0

    for nombre in enfermedades:

        disease = db.session.execute(
            db.select(Disease).where(Disease.name == nombre)
        ).scalar_one_or_none()

        if disease is None:

            disease = Disease(
                name=nombre,
                code=None,
                description=None
            )

            db.session.add(disease)
            enfermedades_creadas += 1

    db.session.commit()

    return jsonify({
        "message": "Enfermedades sincronizadas correctamente",
        "obtenidas": len(enfermedades),
        "nuevas": enfermedades_creadas
    }), 200


@api.route("/doctor/enfermedades", methods=["GET"])
@jwt_required()
def obtener_enfermedades():

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para acceder a las enfermedades"
        }), 403

    diseases = db.session.execute(
        db.select(Disease).order_by(Disease.name)
    ).scalars().all()

    return jsonify({
        "enfermedades": [
            disease.serialize()
            for disease in diseases
        ]
    }), 200

@api.route("/medico/pacientes/buscar", methods=["GET"])
@jwt_required()
def buscar_pacientes():

    # Obtener usuario autenticado
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    # Comprobar que es médico
    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para buscar pacientes"
        }), 403

    # Obtener búsqueda
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({
            "error": "Debes introducir un término de búsqueda"
        }), 400

    # Buscar pacientes y sus datos de usuario
    pacientes = db.session.execute(
        db.select(Patient)
        .join(User, Patient.user_id == User.id)
        .where(
            db.or_(
                User.first_name.ilike(f"%{query}%"),
                User.last_name.ilike(f"%{query}%"),
                User.dni.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%"),
                Patient.cip.ilike(f"%{query}%")
            )
        )
        .order_by(User.last_name, User.first_name)
    ).scalars().all()

    return jsonify({
        "pacientes": [
            {
                "id": paciente.id,
                "user_id": paciente.user_id,
                "nombre": paciente.user.first_name,
                "apellidos": paciente.user.last_name,
                "dni": paciente.user.dni,
                "email": paciente.user.email,
                "telefono": paciente.user.phone,
                "cip": paciente.cip,
                "fecha_nacimiento": (
                    paciente.user.date_of_birth.isoformat()
                    if paciente.user.date_of_birth
                    else None
                ),
                "sexo": paciente.user.sex,
                "grupo_sanguineo": paciente.blood_type
            }
            for paciente in pacientes
        ],
        "total": len(pacientes)
    }), 200

@api.route("/medico/pacientes/<int:patient_id>", methods=["POST"])
@jwt_required()
def agregar_paciente(patient_id):

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para agregar pacientes"
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "El usuario no tiene un perfil de médico"
        }), 404

    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    existing_relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == doctor.id,
            DoctorPatient.patient_id == patient.id
        )
    ).scalar_one_or_none()

    if existing_relation:

        if existing_relation.is_active:
            return jsonify({
                "error": "El paciente ya está en tu lista"
            }), 409

        existing_relation.is_active = True
        db.session.commit()

        return jsonify({
            "message": "Paciente agregado nuevamente"
        }), 200

    relation = DoctorPatient(
        doctor_id=doctor.id,
        patient_id=patient.id,
        is_active=True
    )

    db.session.add(relation)
    db.session.commit()

    return jsonify({
        "message": "Paciente agregado correctamente"
    }), 201


@api.route("/medico/pacientes", methods=["GET"])
@jwt_required()
def obtener_mis_pacientes():

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos"
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    relaciones = db.session.execute(
        db.select(DoctorPatient)
        .join(Patient, DoctorPatient.patient_id == Patient.id)
        .join(User, Patient.user_id == User.id)
        .where(
            DoctorPatient.doctor_id == doctor.id,
            DoctorPatient.is_active.is_(True)
        )
        .order_by(User.last_name, User.first_name)
    ).scalars().all()

    pacientes = []

    for relacion in relaciones:
        patient = relacion.patient
        patient_user = patient.user

        pacientes.append({
            "id": patient.id,
            "user_id": patient.user_id,
            "nombre": patient_user.first_name,
            "apellidos": patient_user.last_name,
            "dni": patient_user.dni,
            "email": patient_user.email,
            "telefono": patient_user.phone,
            "cip": patient.cip,
            "fecha_nacimiento": (
                patient_user.date_of_birth.isoformat()
                if patient_user.date_of_birth
                else None
            ),
            "sexo": patient_user.sex,
            "grupo_sanguineo": patient.blood_type,
            "assigned_at": (
                relacion.assigned_at.isoformat()
                if relacion.assigned_at
                else None
            )
        })

    return jsonify({
        "pacientes": pacientes,
        "total": len(pacientes)
    }), 200