"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Patient, Doctor, Specialty, UserRole, Disease, Diagnosis, DoctorPatient, Appointment, Medication, Prescription, PrescriptionMedication
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


@api.route("/medico/pacientes/<int:patient_id>/enfermedades", methods=["GET"])
@jwt_required()
def obtener_enfermedades_paciente(patient_id):

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos para consultar enfermedades"
        }), 403

    patient_is_assigned = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == user.doctor.id,
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not patient_is_assigned:
        return jsonify({
            "error": "El paciente no está asignado a este médico"
        }), 403

    diagnoses = db.session.execute(
        db.select(Diagnosis)
        .join(Disease, Diagnosis.disease_id == Disease.id)
        .where(Diagnosis.patient_id == patient_id)
        .order_by(Diagnosis.diagnosed_at.desc())
    ).scalars().all()

    return jsonify({
        "enfermedades": [
            {
                "id": diagnosis.id,
                "nombre": diagnosis.disease.name,
                "descripcion": (
                    diagnosis.disease.description
                    or "Sin descripción disponible"
                ),
                "fecha": (
                    diagnosis.diagnosed_at.isoformat()
                    if diagnosis.diagnosed_at
                    else None
                ),
                "estado": diagnosis.status or "Activo",
                "detalle": diagnosis.notes or "Sin observaciones"
            }
            for diagnosis in diagnoses
        ]
    }), 200


@api.route("/medico/pacientes/<int:patient_id>/diagnosticos", methods=["POST"])
@jwt_required()
def crear_diagnostico_paciente(patient_id):

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({"error": "No tienes permisos para crear diagnósticos"}), 403

    patient_is_assigned = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == user.doctor.id,
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not patient_is_assigned:
        return jsonify({
            "error": "El paciente no está asignado a este médico"
        }), 403

    data = request.get_json() or {}
    disease_id = data.get("disease_id")

    if not disease_id:
        return jsonify({"error": "Debes seleccionar una enfermedad"}), 400

    disease = db.session.get(Disease, int(disease_id))
    if not disease:
        return jsonify({"error": "La enfermedad no existe"}), 404

    diagnosis = Diagnosis(
        patient_id=patient_id,
        disease_id=disease.id,
        doctor_id=user.doctor.id,
        diagnosed_at=datetime.utcnow(),
        status=data.get("status") or "Activo",
        notes=data.get("notes")
    )

    db.session.add(diagnosis)
    db.session.commit()

    return jsonify({
        "message": "Diagnóstico creado correctamente",
        "diagnostico": diagnosis.serialize()
    }), 201


@api.route("/medico/pacientes/<int:patient_id>/consultas", methods=["POST"])
@jwt_required()
def crear_consulta_paciente(patient_id):

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({"error": "No tienes permisos para crear consultas"}), 403

    patient_is_assigned = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == user.doctor.id,
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not patient_is_assigned:
        return jsonify({
            "error": "El paciente no está asignado a este médico"
        }), 403

    data = request.get_json() or {}
    scheduled_start_value = data.get("scheduled_start")
    modality = data.get("modality")

    if modality not in ("virtual", "presencial"):
        return jsonify({
            "error": "Debes seleccionar si la consulta es virtual o presencial"
        }), 400

    if not scheduled_start_value:
        return jsonify({
            "error": "Debes indicar la fecha y hora de la consulta"
        }), 400

    try:
        scheduled_start = datetime.fromisoformat(
            scheduled_start_value.replace("Z", "+00:00")
        )
    except (TypeError, ValueError):
        return jsonify({
            "error": "La fecha y hora de la consulta no son válidas"
        }), 400

    scheduled_end = None
    if data.get("scheduled_end"):
        try:
            scheduled_end = datetime.fromisoformat(
                data["scheduled_end"].replace("Z", "+00:00")
            )
        except (TypeError, ValueError):
            return jsonify({
                "error": "La hora de finalización no es válida"
            }), 400

    consultation = Appointment(
        patient_id=patient_id,
        doctor_id=user.doctor.id,
        appointment_type=data.get("appointment_type") or "Consulta médica",
        modality=modality,
        scheduled_start=scheduled_start,
        scheduled_end=scheduled_end,
        status=data.get("status") or "scheduled",
        reason=data.get("reason") or None
    )

    db.session.add(consultation)
    db.session.commit()

    return jsonify({
        "message": "Consulta creada correctamente",
        "consulta": consultation.serialize()
    }), 201


@api.route("/medico/consultas", methods=["GET"])
@jwt_required()
def obtener_consultas_pendientes():

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({"error": "No tienes permisos para consultar citas"}), 403

    consultations = db.session.execute(
        db.select(Appointment)
        .join(Patient, Appointment.patient_id == Patient.id)
        .join(User, Patient.user_id == User.id)
        .where(
            Appointment.doctor_id == user.doctor.id,
            Appointment.status.notin_(["cancelled", "completed"])
        )
        .order_by(Appointment.scheduled_start.asc())
    ).scalars().all()

    return jsonify({
        "consultas": [
            {
                **consultation.serialize(),
                "patient_name": (
                    f"{consultation.patient.user.first_name} "
                    f"{consultation.patient.user.last_name}"
                )
            }
            for consultation in consultations
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


@api.route("/medico/pacientes/<int:patient_id>", methods=["DELETE"])
@jwt_required()
def eliminar_paciente(patient_id):

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
            "error": "No tienes permisos para eliminar pacientes"
        }), 403

    # Obtener médico
    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    # Buscar la relación médico-paciente
    relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == doctor.id,
            DoctorPatient.patient_id == patient_id
        )
    ).scalar_one_or_none()

    if not relation:
        return jsonify({
            "error": "El paciente no está en tu lista"
        }), 404

    # Si ya estaba desactivada
    if not relation.is_active:
        return jsonify({
            "error": "El paciente ya no está en tu lista"
        }), 409

    # Desactivar la relación
    relation.is_active = False

    db.session.commit()

    return jsonify({
        "message": "Paciente eliminado correctamente"
    }), 200

@api.route("/medico/recetas", methods=["POST"])
@jwt_required()
def crear_receta():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Los datos de la receta son obligatorios"
        }), 400

    # =========================================================
    # 1. OBTENER USUARIO AUTENTICADO
    # =========================================================

    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    # =========================================================
    # 2. COMPROBAR QUE ES MÉDICO
    # =========================================================

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para crear recetas"
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    # =========================================================
    # 3. DATOS BÁSICOS
    # =========================================================

    patient_id = data.get("patient_id")

    medication_external_id = data.get(
        "medication_external_id"
    )

    medication_name = (
        data.get("medication_name") or ""
    ).strip()

    dosage = (
        data.get("dosage") or ""
    ).strip()

    frequency = (
        data.get("frequency") or ""
    ).strip()

    duration = (
        data.get("duration") or ""
    ).strip()

    instructions = (
        data.get("instructions") or ""
    ).strip()

    appointment_id = data.get("appointment_id")

    # =========================================================
    # 4. VALIDACIONES
    # =========================================================

    if not patient_id:
        return jsonify({
            "error": "El paciente es obligatorio"
        }), 400

    if not dosage:
        return jsonify({
            "error": "La dosis es obligatoria"
        }), 400

    # =========================================================
    # 5. COMPROBAR RELACIÓN MÉDICO-PACIENTE
    # =========================================================

    relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == doctor.id,
            DoctorPatient.patient_id == int(patient_id),
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not relation:
        return jsonify({
            "error": "El paciente no pertenece a tu lista de pacientes"
        }), 403

    patient = db.session.get(
        Patient,
        int(patient_id)
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    # =========================================================
    # 6. OBTENER / CREAR MEDICAMENTO
    # =========================================================

    medication = None

    # ---------------------------------------------------------
    # CASO A: MEDICAMENTO DE CIMA
    # ---------------------------------------------------------

    if medication_external_id:

        medication_external_id = str(
            medication_external_id
        ).strip()

        # Primero buscamos si ya lo tenemos guardado
        medication = db.session.execute(
            db.select(Medication).where(
                Medication.external_id ==
                medication_external_id
            )
        ).scalar_one_or_none()

        # Si no existe, lo obtenemos de CIMA
        if not medication:

            cima_url = (
                "https://cima.aemps.es/cima/rest/medicamento"
            )

            try:

                response = requests.get(
                    cima_url,
                    params={
                        "nregistro": medication_external_id
                    },
                    timeout=10
                )

                response.raise_for_status()

            except requests.RequestException:
                return jsonify({
                    "error": (
                        "No se pudo consultar el medicamento "
                        "en CIMA"
                    )
                }), 502

            cima_data = response.json()

            if not cima_data:
                return jsonify({
                    "error": (
                        "El medicamento no existe en CIMA"
                    )
                }), 404

            medication = Medication(
                external_id=medication_external_id,
                name=cima_data.get("nombre"),
                active_ingredient=(
                    cima_data.get("vtm", {}).get("nombre")
                    if cima_data.get("vtm")
                    else None
                ),
                strength=cima_data.get("dosis"),
                type=(
                    cima_data.get(
                        "formaFarmaceutica",
                        {}
                    ).get("nombre")
                    if cima_data.get("formaFarmaceutica")
                    else None
                ),
                source="CIMA",
                last_synced_at=datetime.utcnow()
            )

            db.session.add(medication)

    # ---------------------------------------------------------
    # CASO B: MEDICAMENTO MANUAL
    # ---------------------------------------------------------

    else:

        if not medication_name:
            return jsonify({
                "error": (
                    "El nombre del medicamento "
                    "es obligatorio"
                )
            }), 400

        medication = Medication(
            external_id=None,
            name=medication_name,
            active_ingredient=data.get(
                "active_ingredient"
            ),
            strength=data.get(
                "strength"
            ),
            type=data.get(
                "type"
            ),
            source="MANUAL",
            last_synced_at=None
        )

        db.session.add(medication)

    # =========================================================
    # 7. CREAR RECETA
    # =========================================================

    prescription = Prescription(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_id=appointment_id,
        issued_at=datetime.utcnow(),
        status="active",
        notes=None
    )

    db.session.add(prescription)

    # =========================================================
    # 8. AÑADIR MEDICAMENTO A LA RECETA
    # =========================================================

    prescription_medication = PrescriptionMedication(
        prescription=prescription,
        medication=medication,
        dosage=dosage,
        frequency=frequency or None,
        duration=duration or None,
        instructions=instructions or None
    )

    db.session.add(prescription_medication)

    # =========================================================
    # 9. GUARDAR TODO
    # =========================================================

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "error": "No se pudo guardar la receta"
        }), 500

    # =========================================================
    # 10. RESPUESTA
    # =========================================================

    return jsonify({
        "message": "Receta creada correctamente",
        "prescription": {
            "id": prescription.id,
            "patient_id": prescription.patient_id,
            "doctor_id": prescription.doctor_id,
            "appointment_id": prescription.appointment_id,
            "issued_at": (
                prescription.issued_at.isoformat()
                if prescription.issued_at
                else None
            ),
            "status": prescription.status,
            "medication": {
                "id": medication.id,
                "name": medication.name,
                "external_id": medication.external_id,
                "source": medication.source,
                "dosage": prescription_medication.dosage,
                "frequency": prescription_medication.frequency,
                "duration": prescription_medication.duration,
                "instructions": (
                    prescription_medication.instructions
                )
            }
        }
    }), 201

@api.route("/medico/recetas", methods=["GET"])
@jwt_required()
def obtener_recetas():

    # =========================================================
    # 1. USUARIO AUTENTICADO
    # =========================================================

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    # =========================================================
    # 2. COMPROBAR MÉDICO
    # =========================================================

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para consultar recetas"
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    # =========================================================
    # 3. OBTENER RECETAS
    # =========================================================

    prescriptions = db.session.execute(
        db.select(Prescription)
        .where(
            Prescription.doctor_id == doctor.id
        )
        .order_by(
            Prescription.issued_at.desc()
        )
    ).scalars().all()

    resultado = []

    for prescription in prescriptions:

        medicamentos = []

        for item in prescription.medications:

            medicamentos.append({
                "id": item.medication.id,
                "name": item.medication.name,
                "external_id": (
                    item.medication.external_id
                ),
                "source": item.medication.source,
                "dosage": item.dosage,
                "frequency": item.frequency,
                "duration": item.duration,
                "instructions": item.instructions
            })

        resultado.append({
            "id": prescription.id,
            "patient_id": prescription.patient_id,
            "doctor_id": prescription.doctor_id,
            "appointment_id": prescription.appointment_id,
            "issued_at": (
                prescription.issued_at.isoformat()
                if prescription.issued_at
                else None
            ),
            "status": prescription.status,
            "notes": prescription.notes,
            "medications": medicamentos
        })

    return jsonify({
        "prescriptions": resultado
    }), 200

@api.route(
    "/medico/recetas/<int:prescription_id>",
    methods=["GET"]
)
@jwt_required()
def obtener_receta(prescription_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para consultar recetas"
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    prescription = db.session.execute(
        db.select(Prescription).where(
            Prescription.id == prescription_id,
            Prescription.doctor_id == doctor.id
        )
    ).scalar_one_or_none()

    if not prescription:
        return jsonify({
            "error": "Receta no encontrada"
        }), 404

    medicamentos = []

    for item in prescription.medications:

        medicamentos.append({
            "id": item.medication.id,
            "name": item.medication.name,
            "external_id": item.medication.external_id,
            "source": item.medication.source,
            "dosage": item.dosage,
            "frequency": item.frequency,
            "duration": item.duration,
            "instructions": item.instructions
        })

    return jsonify({
        "id": prescription.id,
        "patient_id": prescription.patient_id,
        "doctor_id": prescription.doctor_id,
        "appointment_id": prescription.appointment_id,
        "issued_at": (
            prescription.issued_at.isoformat()
            if prescription.issued_at
            else None
        ),
        "status": prescription.status,
        "notes": prescription.notes,
        "medications": medicamentos
    }), 200

@api.route(
    "/medico/recetas/<int:prescription_id>",
    methods=["DELETE"]
)
@jwt_required()
def cancelar_receta(prescription_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para cancelar recetas"
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    prescription = db.session.execute(
        db.select(Prescription).where(
            Prescription.id == prescription_id,
            Prescription.doctor_id == doctor.id
        )
    ).scalar_one_or_none()

    if not prescription:
        return jsonify({
            "error": "Receta no encontrada"
        }), 404

    if prescription.status == "cancelled":
        return jsonify({
            "error": "La receta ya está cancelada"
        }), 409

    prescription.status = "cancelled"

    db.session.commit()

    return jsonify({
        "message": "Receta cancelada correctamente"
    }), 200

@api.route("/medicamentos", methods=["GET"])
def buscar_medicamentos():

    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({
            "error": "Debes introducir un término de búsqueda"
        }), 400

    url = "https://cima.aemps.es/cima/rest/medicamentos"

    params = {
        "nombre": query
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
            "error": "No se pudo consultar CIMA",
            "details": str(e)
        }), 502

    data = response.json()

    resultados = []

    for medicamento in data.get("resultados", []):
        resultados.append({
            "nombre": medicamento.get("nombre"),

            "principio_activo": (
                medicamento.get("vtm", {}).get("nombre")
                if medicamento.get("vtm")
                else None
            ),

            "dosis": medicamento.get("dosis"),

            "forma_farmaceutica": (
                medicamento.get("formaFarmaceutica", {}).get("nombre")
                if medicamento.get("formaFarmaceutica")
                else None
            ),

            "laboratorio": medicamento.get("labtitular"),

            "registro": medicamento.get("nregistro"),

            "requiere_receta": medicamento.get("receta"),

            "generico": medicamento.get("generico"),

            "vias_administracion": [
                via.get("nombre")
                for via in medicamento.get("viasAdministracion", [])
            ]
        })

    return jsonify({
        "pagina": data.get("pagina"),
        "resultados": resultados
    }), 200