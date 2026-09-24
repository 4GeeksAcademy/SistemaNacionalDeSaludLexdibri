"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import (
    db,
    User,
    Patient,
    Doctor,
    Specialty,
    UserRole,
    Disease,
    Diagnosis,
    DoctorPatient,
    Appointment,
    Medication,
    Prescription,
    PrescriptionMedication,
)
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json
import requests
import random
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# =========================================================
# HELLO
# =========================================================

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# =========================================================
# SEED PACIENTES
# =========================================================

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

        user = User.query.filter_by(
            email=data["email"]
        ).first()

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
                data["date_of_birth"],
                "%Y-%m-%d"
            ).date(),
            sex=data["sex"],
            is_active=data["is_active"],
            role=UserRole(data["role"])
        )

        patient = Patient(
            cip=data["cip"],
            blood_type=data["blood_type"]
        )

        user.patient = patient

        db.session.add(user)
        created += 1

    db.session.commit()

    return jsonify({
        "message": "Pacientes creados correctamente",
        "creados": created,
        "ya_existian": existing
    }), 200


# =========================================================
# SEED MÉDICOS
# =========================================================

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

        user = User.query.filter_by(
            email=data["email"]
        ).first()

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
                data["date_of_birth"],
                "%Y-%m-%d"
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

        user.doctor = doctor

        db.session.add(user)
        created += 1

    db.session.commit()

    return jsonify({
        "message": "Doctores creados correctamente",
        "creados": created,
        "ya_existian": existing
    }), 200


# =========================================================
# SEED ESPECIALIDADES
# =========================================================

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


@api.route("/seed/especialidades-dos", methods=["GET"])
def seed_specialties_two():

    json_route = os.path.join(
        os.path.dirname(__file__),
        "../data/especialidades_dos.json"
    )

    try:
        with open(json_route, "r", encoding="utf-8") as file:
            specialties = json.load(file)

    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({
            "error": "No se pudo leer el archivo de especialidades"
        }), 500

    created = 0
    existing = 0

    for data in specialties:

        specialty = Specialty.query.filter_by(
            name=data["name"]
        ).first()

        if specialty:
            existing += 1
            continue

        db.session.add(
            Specialty(
                name=data["name"],
                description=data.get("description")
            )
        )

        created += 1

    db.session.commit()

    return jsonify({
        "message": "Especialidades adicionales creadas correctamente",
        "total": len(specialties),
        "creadas": created,
        "ya_existian": existing
    }), 200


# =========================================================
# ESPECIALIDADES
# =========================================================

@api.route("/especialidades", methods=["GET"])
def obtener_especialidades():

    specialties = db.session.execute(
        db.select(Specialty).order_by(
            Specialty.name.asc()
        )
    ).scalars().all()

    return jsonify({
        "especialidades": [
            specialty.serialize()
            for specialty in specialties
        ]
    }), 200


# =========================================================
# REGISTRO
# =========================================================

@api.route("/register", methods=["POST"])
def registro_usuario():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se han enviado datos"
        }), 400

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

    if data["role"] not in ["patient", "doctor"]:
        return jsonify({
            "error": "El role debe ser 'patient' o 'doctor'"
        }), 400

    existing_user = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_user:
        return jsonify({
            "error": "El email ya está registrado"
        }), 409

    user = User(
        email=data["email"],
        password_hash=generate_password_hash(
            data["password"]
        ),
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

    # -----------------------------------------------------
    # PACIENTE
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # MÉDICO
    # -----------------------------------------------------

    elif data["role"] == "doctor":

        if "medical_license" not in data:
            return jsonify({
                "error": "Para un médico se necesita medical_license"
            }), 400

        specialty_id = data.get("specialty_id")
        specialty_name = (
            data.get("specialty_name") or ""
        ).strip()

        if not specialty_id and specialty_name:

            specialty = Specialty.query.filter_by(
                name=specialty_name
            ).first()

            if not specialty:

                specialty = Specialty(
                    name=specialty_name
                )

                db.session.add(specialty)
                db.session.flush()

            specialty_id = specialty.id

        if not specialty_id:
            return jsonify({
                "error": "Para un médico se necesita una especialidad"
            }), 400

        doctor = Doctor(
            medical_license=data["medical_license"],
            specialty_id=specialty_id,
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


# =========================================================
# LOGIN
# =========================================================

@api.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se han enviado datos"
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email y contraseña son obligatorios"
        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "error": "Email o contraseña incorrectos"
        }), 401

    if not check_password_hash(
        user.password_hash,
        password
    ):
        return jsonify({
            "error": "Email o contraseña incorrectos"
        }), 401

    if not user.is_active:
        return jsonify({
            "error": "El usuario está desactivado"
        }), 403

    especialidad = None

    if user.role.value == "doctor":

        doctor = Doctor.query.filter_by(
            user_id=user.id
        ).first()

        if doctor and doctor.specialty:
            especialidad = doctor.specialty.name

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
            "role": user.role.value,
            "especialidad": especialidad
        }
    }), 200


# =========================================================
# DASHBOARD
# =========================================================

@api.route("/dashboard", methods=["GET"])
@jwt_required()
def entrar_en_dashboard():

    user_id = get_jwt_identity()
    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

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

    return jsonify({
        "error": "Role no válido"
    }), 403


# =========================================================
# ENFERMEDADES - SEED
# =========================================================

@api.route("/seed/enfermedades", methods=["GET"])
def sincronizar_enfermedades():

    url = (
        "https://analisis.datosabiertos.jcyl.es/api/explore/"
        "v2.1/catalog/datasets/"
        "enfermedades-de-declaracion-obligatoria-casos-por-"
        "grupo-de-edad/records"
    )

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
            db.select(Disease).where(
                Disease.name == nombre
            )
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


# =========================================================
# ENFERMEDADES DEL MÉDICO
# =========================================================

@api.route("/doctor/enfermedades", methods=["GET"])
@jwt_required()
def obtener_enfermedades():

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
            "error": "No tienes permisos para acceder a las enfermedades"
        }), 403

    diseases = db.session.execute(
        db.select(Disease).order_by(
            Disease.name
        )
    ).scalars().all()

    return jsonify({
        "enfermedades": [
            disease.serialize()
            for disease in diseases
        ]
    }), 200


# =========================================================
# ENFERMEDADES DEL PACIENTE
# =========================================================

@api.route(
    "/medico/pacientes/<int:patient_id>/enfermedades",
    methods=["GET"]
)
@jwt_required()
def obtener_enfermedades_paciente(patient_id):

    user_id = get_jwt_identity()
    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR :
        print(UserRole.DOCTOR ==   user.role)
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

    # if not patient_is_assigned:
    #     return jsonify({
    #         "error": "El paciente no está asignado a este médico"
    #     }), 403

    diagnoses = db.session.execute(
        db.select(Diagnosis)
        .join(
            Disease,
            Diagnosis.disease_id == Disease.id
        )
        .where(
            Diagnosis.patient_id == patient_id
        )
        .order_by(
            Diagnosis.diagnosed_at.desc()
        )
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


# =========================================================
# CREAR DIAGNÓSTICO
# =========================================================

@api.route(
    "/medico/pacientes/<int:patient_id>/diagnosticos",
    methods=["POST"]
)
@jwt_required()
def crear_diagnostico_paciente(patient_id):

    user_id = get_jwt_identity()
    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos para crear diagnósticos"
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

    data = request.get_json() or {}

    disease_id = data.get("disease_id")

    if not disease_id:
        return jsonify({
            "error": "Debes seleccionar una enfermedad"
        }), 400

    disease = db.session.get(
        Disease,
        int(disease_id)
    )

    if not disease:
        return jsonify({
            "error": "La enfermedad no existe"
        }), 404

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


# =========================================================
# CREAR CONSULTA - MÉDICO
# =========================================================

@api.route(
    "/medico/pacientes/<int:patient_id>/consultas",
    methods=["POST"]
)
@jwt_required()
def crear_consulta_medico(patient_id):

    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos para crear consultas"
        }), 403

    medico_creador = user.doctor

    # Comprobar que el paciente está asignado al médico que crea la cita
    patient_is_assigned = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == medico_creador.id,
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not patient_is_assigned:
        return jsonify({
            "error": "El paciente no está asignado a este médico"
        }), 403

    data = request.get_json() or {}

    specialty_id = data.get("specialty_id")
    scheduled_start_value = data.get("scheduled_start")
    scheduled_end_value = data.get("scheduled_end")
    modality = data.get("modality")

    # Validar especialidad
    if not specialty_id:
        return jsonify({
            "error": "Debes seleccionar una especialidad"
        }), 400

    try:
        specialty_id = int(specialty_id)
    except (TypeError, ValueError):
        return jsonify({
            "error": "La especialidad seleccionada no es válida"
        }), 400

    specialty = db.session.get(Specialty, specialty_id)

    if not specialty:
        return jsonify({
            "error": "La especialidad seleccionada no existe"
        }), 404

    # Validar modalidad
    if modality not in ("virtual", "presencial"):
        return jsonify({
            "error": (
                "Debes seleccionar si la consulta "
                "es virtual o presencial"
            )
        }), 400

    # Validar fecha
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

    # Obtener fecha de finalización
    scheduled_end = None

    if scheduled_end_value:
        try:
            scheduled_end = datetime.fromisoformat(
                scheduled_end_value.replace("Z", "+00:00")
            )
        except (TypeError, ValueError):
            return jsonify({
                "error": "La hora de finalización no es válida"
            }), 400

    # Si no llega scheduled_end, la consulta dura 30 minutos
    if not scheduled_end:
        scheduled_end = scheduled_start + timedelta(minutes=30)

    if scheduled_end <= scheduled_start:
        return jsonify({
            "error": (
                "La hora de finalización debe ser posterior "
                "a la hora de inicio"
            )
        }), 400

    # Buscar médicos de la especialidad
    medicos_especialidad = db.session.execute(
        db.select(Doctor).where(
            Doctor.specialty_id == specialty_id
        )
    ).scalars().all()

    if not medicos_especialidad:
        return jsonify({
            "error": (
                f"No hay médicos disponibles para "
                f"la especialidad {specialty.name}"
            )
        }), 409

    # Comprobar disponibilidad de cada médico
    medicos_disponibles = []

    for medico in medicos_especialidad:

        cita_conflictiva = db.session.execute(
            db.select(Appointment).where(
                Appointment.doctor_id == medico.id,

                Appointment.status.notin_(
                    ["cancelled", "completed"]
                ),

                Appointment.scheduled_start < scheduled_end,
                Appointment.scheduled_end > scheduled_start
            )
        ).scalars().first()

        if not cita_conflictiva:
            medicos_disponibles.append(medico)

    if not medicos_disponibles:
        return jsonify({
            "error": (
                "No hay médicos disponibles de esta especialidad "
                "para la fecha y hora seleccionadas"
            )
        }), 409

    # Elegir médico aleatoriamente
    medico_asignado = random.choice(medicos_disponibles)

    # Crear consulta
    consultation = Appointment(
        patient_id=patient_id,
        doctor_id=medico_asignado.id,
        specialty_id=specialty_id,
        appointment_type=(
            data.get("appointment_type")
            or "Consulta médica"
        ),
        modality=modality,
        scheduled_start=scheduled_start,
        scheduled_end=scheduled_end,
        status=data.get("status") or "scheduled",
        reason=data.get("reason") or None
    )

    db.session.add(consultation)
    db.session.commit()

    doctor_user = medico_asignado.user

    return jsonify({
        "message": "Consulta creada correctamente",

        "consulta": consultation.serialize(),

        "doctor_asignado": {
            "id": medico_asignado.id,
            "user_id": medico_asignado.user_id,
            "first_name": doctor_user.first_name,
            "last_name": doctor_user.last_name,
            "medical_license": medico_asignado.medical_license,
            "specialty_id": medico_asignado.specialty_id,
        },

        "specialty_name": specialty.name
    }), 201

# =========================================================
# OBTENER CONSULTAS DEL MÉDICO
# =========================================================

@api.route("/medico/consultas", methods=["GET"])
@jwt_required()
def obtener_consultas_pendientes():

    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos para consultar citas"
        }), 403

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
# =========================================================
# COMPLETAR CONSULTA
# =========================================================

@api.route(
    "/medico/consultas/<int:appointment_id>/completar",
    methods=["POST"]
)
@jwt_required()
def completar_consulta(appointment_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos para completar consultas"
        }), 403

    consultation = db.session.get(
        Appointment,
        appointment_id
    )

    if not consultation:
        return jsonify({
            "error": "La consulta no existe"
        }), 404

    if consultation.doctor_id != user.doctor.id:
        return jsonify({
            "error": (
                "No estás autorizado para completar "
                "esta consulta"
            )
        }), 403

    if consultation.status == "cancelled":
        return jsonify({
            "error": (
                "No se puede completar una consulta cancelada"
            )
        }), 409

    if consultation.status == "completed":
        return jsonify({
            "error": "La consulta ya está completada"
        }), 409

    consultation.status = "completed"

    db.session.commit()

    return jsonify({
        "message": "Consulta completada correctamente",
        "consulta": consultation.serialize()
    }), 200



# =========================================================
# TELECONSULTA
# =========================================================

@api.route(
    "/consultas/<int:appointment_id>",
    methods=["GET"]
)
@jwt_required()
def obtener_consulta_para_teleconsulta(appointment_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    consultation = db.session.get(
        Appointment,
        appointment_id
    )

    if not consultation:
        return jsonify({
            "error": "La consulta no existe"
        }), 404

    is_authorized = (
        user.role == UserRole.DOCTOR
        and user.doctor
        and consultation.doctor_id == user.doctor.id
    ) or (
        user.role == UserRole.PATIENT
        and user.patient
        and consultation.patient_id == user.patient.id
    )

    if not is_authorized:
        return jsonify({
            "error": (
                "No estás autorizado para acceder "
                "a esta consulta"
            )
        }), 403

    if consultation.modality != "virtual":
        return jsonify({
            "error": "Esta consulta no es una teleconsulta"
        }), 409

    if consultation.status in (
        "cancelled",
        "completed"
    ):
        return jsonify({
            "error": "Esta consulta no está disponible"
        }), 409

    return jsonify({
        "consulta": consultation.serialize()
    }), 200


# =========================================================
# CONSULTAS DEL PACIENTE
# =========================================================

@api.route("/paciente/consultas", methods=["GET"])
@jwt_required()
def obtener_consultas_paciente():

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.PATIENT or not user.patient:
        return jsonify({
            "error": "No tienes permisos para consultar tus citas"
        }), 403

    print("======================================")
    print("CREANDO CONSULTA")
    print("Paciente:", user.patient.id)
    print("Doctor asignado:", relation.doctor_id)
    print("======================================")

    consultations = db.session.execute(
        db.select(Appointment)
        .where(
            Appointment.patient_id == user.patient.id,
            Appointment.status.notin_([
                "cancelled",
                "completed"
            ])
        )
        .order_by(
            Appointment.scheduled_start.asc()
        )
    ).scalars().all()

    return jsonify({
        "consultas": [
            consultation.serialize()
            for consultation in consultations
        ]
    }), 200


# =========================================================
# CREAR CONSULTA - PACIENTE
# =========================================================

@api.route("/paciente/consultas", methods=["POST"])
@jwt_required()
def crear_consulta_paciente():

    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.PATIENT or not user.patient:
        return jsonify({
            "error": "Solo un paciente puede crear sus consultas"
        }), 403

    # Buscar el médico activo asignado al paciente
    relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.patient_id == user.patient.id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalars().first()

    if not relation:
        return jsonify({
            "error": (
                "No tienes un médico asignado "
                "para crear la consulta"
            )
        }), 409

    # Comprobar si ya existe una consulta activa
    active_consultation = db.session.execute(
        db.select(Appointment).where(
            Appointment.patient_id == user.patient.id,
            Appointment.doctor_id == relation.doctor_id,
            Appointment.status.notin_([
                "cancelled",
                "completed"
            ])
        )
    ).scalars().first()

    if active_consultation:

        specialty_name = (
            relation.doctor.specialty.name
            if relation.doctor
            and relation.doctor.specialty
            else "esta especialidad"
        )

        return jsonify({
            "error": (
                f"Ya tienes una consulta pendiente con "
                f"{specialty_name}. "
                "Cancélala antes de pedir otra."
            )
        }), 409

    data = request.get_json(silent=True) or {}

    modality = data.get("modality")
    scheduled_start_value = data.get("scheduled_start")

    if modality not in ("virtual", "presencial"):
        return jsonify({
            "error": (
                "Debes seleccionar si la consulta "
                "es virtual o presencial"
            )
        }), 400

    if not scheduled_start_value:
        return jsonify({
            "error": (
                "Debes indicar la fecha y hora "
                "de la consulta"
            )
        }), 400

    try:
        scheduled_start = datetime.fromisoformat(
            scheduled_start_value.replace("Z", "+00:00")
        )
    except (TypeError, ValueError):
        return jsonify({
            "error": (
                "La fecha y hora de la consulta "
                "no son válidas"
            )
        }), 400

    consultation = Appointment(
        patient_id=user.patient.id,
        doctor_id=relation.doctor_id,
        appointment_type=(
            data.get("appointment_type")
            or "Consulta médica"
        ),
        modality=modality,
        scheduled_start=scheduled_start,
        status="scheduled",
        reason=data.get("reason") or None
    )

    db.session.add(consultation)
    db.session.commit()

    return jsonify({
        "message": "Consulta creada correctamente",
        "consulta": consultation.serialize()
    }), 201

# =========================================================
# CANCELAR CONSULTA - PACIENTE
# =========================================================

@api.route(
    "/paciente/consultas/<int:appointment_id>/cancelar",
    methods=["POST"]
)
@jwt_required()
def cancelar_consulta_paciente(appointment_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.PATIENT or not user.patient:
        return jsonify({
            "error": (
                "Solo el paciente puede cancelar "
                "esta consulta"
            )
        }), 403

    consultation = db.session.get(
        Appointment,
        appointment_id
    )

    if not consultation:
        return jsonify({
            "error": "La consulta no existe"
        }), 404

    if consultation.patient_id != user.patient.id:
        return jsonify({
            "error": (
                "No estás autorizado para cancelar "
                "esta consulta"
            )
        }), 403

    if consultation.status in (
        "cancelled",
        "completed"
    ):
        return jsonify({
            "error": "Esta consulta ya no se puede cancelar"
        }), 409

    consultation.status = "cancelled"

    db.session.commit()

    return jsonify({
        "message": "Consulta cancelada correctamente",
        "consulta": consultation.serialize()
    }), 200


# =========================================================
# DASHBOARD PACIENTE
# =========================================================

@api.route(
    "/paciente/dashboard",
    methods=["GET"]
)
@jwt_required()
def obtener_dashboard_paciente():

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.PATIENT or not user.patient:
        return jsonify({
            "error": (
                "No tienes permisos para consultar "
                "este dashboard"
            )
        }), 403

    patient = user.patient

    doctor_relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.patient_id == patient.id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalars().first()

    assigned_doctor = None

    if doctor_relation and doctor_relation.doctor:

        doctor = doctor_relation.doctor

        specialty_name = (
            doctor.specialty.name
            if doctor.specialty
            else ""
        )

        assigned_doctor = {
            "id": doctor.id,
            "nombre": doctor.user.first_name,
            "apellidos": doctor.user.last_name,
            "especialidad": specialty_name
        }

    consultations = db.session.execute(
        db.select(Appointment)
        .where(
            Appointment.patient_id == patient.id
        )
        .order_by(
            Appointment.scheduled_start.desc()
        )
    ).scalars().all()

    diagnoses = db.session.execute(
        db.select(Diagnosis)
        .join(
            Disease,
            Diagnosis.disease_id == Disease.id
        )
        .where(
            Diagnosis.patient_id == patient.id
        )
        .order_by(
            Diagnosis.diagnosed_at.desc()
        )
    ).scalars().all()

    prescriptions = db.session.execute(
        db.select(Prescription)
        .where(
            Prescription.patient_id == patient.id
        )
        .order_by(
            Prescription.issued_at.desc()
        )
    ).scalars().all()

    serialized_prescriptions = []

    for prescription in prescriptions:

        serialized_prescriptions.append({
            **prescription.serialize(),
            "medications": [
                {
                    "name": item.medication.name,
                    "dosage": item.dosage,
                    "frequency": item.frequency,
                    "duration": item.duration,
                    "instructions": item.instructions
                }
                for item in prescription.medications
            ]
        })

    return jsonify({

        "paciente": {
            "id": patient.id,
            "user_id": user.id,
            "nombre": user.first_name,
            "apellidos": user.last_name,
            "email": user.email,
            "telefono": user.phone,
            "dni": user.dni,
            "cip": patient.cip,
            "fecha_nacimiento": (
                user.date_of_birth.isoformat()
                if user.date_of_birth
                else None
            ),
            "sexo": user.sex,
            "grupo_sanguineo": patient.blood_type
        },

        "medico_asignado": assigned_doctor,

        "consultas": [
            {
                **consultation.serialize(),
                "doctor_specialty": (
                    consultation.doctor.specialty.name
                    if consultation.doctor
                    and consultation.doctor.specialty
                    else None
                )
            }
            for consultation in consultations
        ],

        "diagnosticos": [
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
                "estado": (
                    diagnosis.status
                    or "Activo"
                ),
                "detalle": (
                    diagnosis.notes
                    or "Sin observaciones"
                )
            }
            for diagnosis in diagnoses
        ],

        "recetas": serialized_prescriptions

    }), 200


# =========================================================
# BUSCAR PACIENTES
# =========================================================

@api.route(
    "/medico/pacientes/buscar",
    methods=["GET"]
)
@jwt_required()
def buscar_pacientes():

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
            "error": (
                "No tienes permisos para buscar pacientes"
            )
        }), 403

    query = request.args.get(
        "q",
        ""
    ).strip()

    if not query:
        return jsonify({
            "error": (
                "Debes introducir un término "
                "de búsqueda"
            )
        }), 400

    pacientes = db.session.execute(
        db.select(Patient)
        .join(
            User,
            Patient.user_id == User.id
        )
        .where(
            db.or_(
                User.first_name.ilike(
                    f"%{query}%"
                ),
                User.last_name.ilike(
                    f"%{query}%"
                ),
                User.dni.ilike(
                    f"%{query}%"
                ),
                User.email.ilike(
                    f"%{query}%"
                ),
                Patient.cip.ilike(
                    f"%{query}%"
                )
            )
        )
        .order_by(
            User.last_name,
            User.first_name
        )
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


 #=========================================================
# AGREGAR PACIENTE
# SOLO MÉDICO DE CABECERA
# =========================================================

@api.route(
    "/medico/pacientes/<int:patient_id>",
    methods=["POST"]
)
@jwt_required()
def agregar_paciente(patient_id):

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
            "error": (
                "No tienes permisos para agregar pacientes"
            )
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": (
                "El usuario no tiene un perfil de médico"
            )
        }), 404

    # -----------------------------------------------------
    # SOLO MÉDICO DE CABECERA
    # -----------------------------------------------------

    if not doctor.specialty:
        return jsonify({
            "error": (
                "El médico no tiene una especialidad asignada"
            )
        }), 403

    specialty_name = (
        doctor.specialty.name or ""
    ).strip().lower()

    if specialty_name != "médico de cabecera":
        return jsonify({
            "error": (
                "Solo el médico de cabecera "
                "puede añadir pacientes"
            )
        }), 403

    # -----------------------------------------------------
    # BUSCAR PACIENTE
    # -----------------------------------------------------

    patient = db.session.get(
        Patient,
        patient_id
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    # -----------------------------------------------------
    # COMPROBAR MISMA ESPECIALIDAD
    # -----------------------------------------------------

    if doctor.specialty_id:

        same_specialty_relation = db.session.execute(
            db.select(DoctorPatient)
            .join(
                Doctor,
                DoctorPatient.doctor_id == Doctor.id
            )
            .where(
                DoctorPatient.patient_id == patient.id,
                DoctorPatient.is_active.is_(True),
                Doctor.specialty_id == doctor.specialty_id,
                DoctorPatient.doctor_id != doctor.id
            )
        ).scalars().first()

        if same_specialty_relation:

            specialty_name = doctor.specialty.name

            return jsonify({
                "error": (
                    "Este paciente ya está asignado "
                    f"a otro médico de {specialty_name}"
                )
            }), 409

    # -----------------------------------------------------
    # COMPROBAR RELACIÓN EXISTENTE
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # CREAR RELACIÓN
    # -----------------------------------------------------

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


# =========================================================
# MIS PACIENTES
# =========================================================

@api.route(
    "/medico/pacientes",
    methods=["GET"]
)
@jwt_required()
def obtener_mis_pacientes():

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
            "error": "No tienes permisos"
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    relaciones = db.session.execute(
        db.select(DoctorPatient)
        .join(
            Patient,
            DoctorPatient.patient_id == Patient.id
        )
        .join(
            User,
            Patient.user_id == User.id
        )
        .where(
            DoctorPatient.doctor_id == doctor.id,
            DoctorPatient.is_active.is_(True)
        )
        .order_by(
            User.last_name,
            User.first_name
        )
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


# =========================================================
# ELIMINAR PACIENTE
# SOLO MÉDICO DE CABECERA
# =========================================================

@api.route(
    "/medico/pacientes/<int:patient_id>",
    methods=["DELETE"]
)
@jwt_required()
def eliminar_paciente(patient_id):

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
            "error": (
                "No tienes permisos para eliminar pacientes"
            )
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    # -----------------------------------------------------
    # SOLO MÉDICO DE CABECERA
    # -----------------------------------------------------

    if not doctor.specialty:
        return jsonify({
            "error": (
                "El médico no tiene una especialidad asignada"
            )
        }), 403

    specialty_name = (
        doctor.specialty.name or ""
    ).strip().lower()

    if specialty_name != "médico de cabecera":
        return jsonify({
            "error": (
                "Solo el médico de cabecera "
                "puede eliminar pacientes"
            )
        }), 403

    # -----------------------------------------------------
    # BUSCAR RELACIÓN
    # -----------------------------------------------------

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

    if not relation.is_active:
        return jsonify({
            "error": (
                "El paciente ya no está en tu lista"
            )
        }), 409

    relation.is_active = False

    db.session.commit()

    return jsonify({
        "message": "Paciente eliminado correctamente"
    }), 200


# =========================================================
# ASIGNAR ESPECIALISTA
# SOLO MÉDICO DE CABECERA
# =========================================================

@api.route(
    "/medico/pacientes/<int:patient_id>/especialista",
    methods=["POST"]
)
@jwt_required()
def asignar_especialista(patient_id):

    # -----------------------------------------------------
    # USUARIO AUTENTICADO
    # -----------------------------------------------------

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    # -----------------------------------------------------
    # COMPROBAR QUE ES MÉDICO
    # -----------------------------------------------------

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": (
                "No tienes permisos para "
                "asignar especialistas"
            )
        }), 403

    doctor_cabecera = user.doctor

    # -----------------------------------------------------
    # COMPROBAR ESPECIALIDAD DEL MÉDICO
    # -----------------------------------------------------

    if not doctor_cabecera.specialty:
        return jsonify({
            "error": (
                "El médico no tiene una especialidad asignada"
            )
        }), 403

    specialty_name = (
        doctor_cabecera.specialty.name or ""
    ).strip().lower()

    if specialty_name != "médico de cabecera":
        return jsonify({
            "error": (
                "Solo el médico de cabecera "
                "puede asignar especialistas"
            )
        }), 403

    # -----------------------------------------------------
    # DATOS DEL FRONTEND
    # -----------------------------------------------------

    data = request.get_json(
        silent=True
    ) or {}

    specialist_id = data.get(
        "specialist_id"
    )

    if not specialist_id:
        return jsonify({
            "error": (
                "Debes seleccionar un especialista"
            )
        }), 400

    try:

        specialist_id = int(
            specialist_id
        )

    except (TypeError, ValueError):

        return jsonify({
            "error": (
                "El especialista seleccionado "
                "no es válido"
            )
        }), 400

    # -----------------------------------------------------
    # BUSCAR PACIENTE
    # -----------------------------------------------------

    patient = db.session.get(
        Patient,
        patient_id
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    # -----------------------------------------------------
    # COMPROBAR QUE EL PACIENTE ES DEL MÉDICO
    # -----------------------------------------------------

    patient_relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == doctor_cabecera.id,
            DoctorPatient.patient_id == patient.id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not patient_relation:
        return jsonify({
            "error": (
                "El paciente no está en tu lista de pacientes"
            )
        }), 403

    # -----------------------------------------------------
    # BUSCAR ESPECIALISTA
    # -----------------------------------------------------

    specialist = db.session.get(
        Doctor,
        specialist_id
    )

    if not specialist:
        return jsonify({
            "error": "Especialista no encontrado"
        }), 404

    if not specialist.specialty:
        return jsonify({
            "error": (
                "El médico seleccionado "
                "no tiene especialidad"
            )
        }), 400

    # -----------------------------------------------------
    # NO PERMITIR MÉDICO DE CABECERA
    # -----------------------------------------------------

    specialist_specialty = (
        specialist.specialty.name or ""
    ).strip().lower()

    if specialist_specialty == "médico de cabecera":
        return jsonify({
            "error": (
                "No puedes asignar a un médico "
                "de cabecera como especialista"
            )
        }), 400

    # -----------------------------------------------------
    # NO PERMITIR ASIGNARSE A SÍ MISMO
    # -----------------------------------------------------

    if specialist.id == doctor_cabecera.id:
        return jsonify({
            "error": (
                "No puedes asignarte a ti mismo "
                "como especialista"
            )
        }), 400

    # -----------------------------------------------------
    # COMPROBAR MISMA ESPECIALIDAD
    # -----------------------------------------------------

    if specialist.specialty_id:

        same_specialty_relation = db.session.execute(
            db.select(DoctorPatient)
            .join(
                Doctor,
                DoctorPatient.doctor_id == Doctor.id
            )
            .where(
                DoctorPatient.patient_id == patient.id,
                DoctorPatient.is_active.is_(True),
                Doctor.specialty_id == specialist.specialty_id,
                DoctorPatient.doctor_id != specialist.id
            )
        ).scalars().first()

        if same_specialty_relation:

            return jsonify({
                "error": (
                    "Este paciente ya está asignado "
                    "a otro médico de esta especialidad"
                )
            }), 409

    # -----------------------------------------------------
    # COMPROBAR RELACIÓN CON ESTE ESPECIALISTA
    # -----------------------------------------------------

    existing_relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == specialist.id,
            DoctorPatient.patient_id == patient.id
        )
    ).scalar_one_or_none()

    if existing_relation:

        # Ya está asignado
        if existing_relation.is_active:

            return jsonify({
                "error": (
                    "Este paciente ya está asignado "
                    "a este especialista"
                )
            }), 409

        # Estaba asignado pero se había eliminado
        existing_relation.is_active = True

        db.session.commit()

        return jsonify({
            "message": "Especialista asignado correctamente",
            "especialista": {
                "id": specialist.id,
                "nombre": specialist.user.first_name,
                "apellidos": specialist.user.last_name,
                "especialidad": specialist.specialty.name
            }
        }), 200

    # -----------------------------------------------------
    # CREAR NUEVA RELACIÓN
    # -----------------------------------------------------

    relation = DoctorPatient(
        doctor_id=specialist.id,
        patient_id=patient.id,
        is_active=True
    )

    db.session.add(relation)

    db.session.commit()

    return jsonify({
        "message": "Especialista asignado correctamente",
        "especialista": {
            "id": specialist.id,
            "nombre": specialist.user.first_name,
            "apellidos": specialist.user.last_name,
            "especialidad": specialist.specialty.name
        }
    }), 201


# =========================================================
# RECETAS - CREAR
# =========================================================

@api.route(
    "/medico/recetas",
    methods=["POST"]
)
@jwt_required()
def crear_receta():

    data = request.get_json(
        silent=True
    )

    if not data:
        return jsonify({
            "error": (
                "Los datos de la receta "
                "son obligatorios"
            )
        }), 400

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
            "error": (
                "No tienes permisos para "
                "crear recetas"
            )
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

    patient_id = data.get(
        "patient_id"
    )

    medication_external_id = data.get(
        "medication_external_id"
    )

    medication_name = (
        data.get("medication_name")
        or ""
    ).strip()

    dosage = (
        data.get("dosage")
        or ""
    ).strip()

    frequency = (
        data.get("frequency")
        or ""
    ).strip()

    duration = (
        data.get("duration")
        or ""
    ).strip()

    instructions = (
        data.get("instructions")
        or ""
    ).strip()

    appointment_id = data.get(
        "appointment_id"
    )

    if not patient_id:
        return jsonify({
            "error": "El paciente es obligatorio"
        }), 400

    if not dosage:
        return jsonify({
            "error": "La dosis es obligatoria"
        }), 400

    relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == doctor.id,
            DoctorPatient.patient_id == int(patient_id),
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not relation:
        return jsonify({
            "error": (
                "El paciente no pertenece "
                "a tu lista de pacientes"
            )
        }), 403

    patient = db.session.get(
        Patient,
        int(patient_id)
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    medication = None

    # -----------------------------------------------------
    # MEDICAMENTO DE CIMA
    # -----------------------------------------------------

    if medication_external_id:

        medication_external_id = str(
            medication_external_id
        ).strip()

        medication = db.session.execute(
            db.select(Medication).where(
                Medication.external_id ==
                medication_external_id
            )
        ).scalar_one_or_none()

        if not medication:

            cima_url = (
                "https://cima.aemps.es/cima/rest/medicamento"
            )

            try:

                response = requests.get(
                    cima_url,
                    params={
                        "nregistro":
                            medication_external_id
                    },
                    timeout=10
                )

                response.raise_for_status()

            except requests.RequestException:

                return jsonify({
                    "error": (
                        "No se pudo consultar "
                        "el medicamento en CIMA"
                    )
                }), 502

            cima_data = response.json()

            if not cima_data:
                return jsonify({
                    "error": (
                        "El medicamento "
                        "no existe en CIMA"
                    )
                }), 404

            medication = Medication(
                external_id=(
                    medication_external_id
                ),
                name=cima_data.get(
                    "nombre"
                ),
                active_ingredient=(
                    cima_data.get(
                        "vtm",
                        {}
                    ).get("nombre")
                    if cima_data.get("vtm")
                    else None
                ),
                strength=cima_data.get(
                    "dosis"
                ),
                type=(
                    cima_data.get(
                        "formaFarmaceutica",
                        {}
                    ).get("nombre")
                    if cima_data.get(
                        "formaFarmaceutica"
                    )
                    else None
                ),
                source="CIMA",
                last_synced_at=datetime.utcnow()
            )

            db.session.add(
                medication
            )

    # -----------------------------------------------------
    # MEDICAMENTO MANUAL
    # -----------------------------------------------------

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

        db.session.add(
            medication
        )

    # -----------------------------------------------------
    # CREAR RECETA
    # -----------------------------------------------------

    prescription = Prescription(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_id=appointment_id,
        issued_at=datetime.utcnow(),
        status="active",
        notes=None
    )

    db.session.add(
        prescription
    )

    # -----------------------------------------------------
    # MEDICAMENTO DE LA RECETA
    # -----------------------------------------------------

    prescription_medication = PrescriptionMedication(
        prescription=prescription,
        medication=medication,
        dosage=dosage,
        frequency=frequency or None,
        duration=duration or None,
        instructions=instructions or None
    )

    db.session.add(
        prescription_medication
    )

    # -----------------------------------------------------
    # GUARDAR
    # -----------------------------------------------------

    try:

        db.session.commit()

    except Exception:

        db.session.rollback()

        return jsonify({
            "error": "No se pudo guardar la receta"
        }), 500

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

                "dosage": (
                    prescription_medication.dosage
                ),

                "frequency": (
                    prescription_medication.frequency
                ),

                "duration": (
                    prescription_medication.duration
                ),

                "instructions": (
                    prescription_medication.instructions
                )
            }
        }

    }), 201


# =========================================================
# RECETAS - LISTAR
# =========================================================

@api.route(
    "/medico/recetas",
    methods=["GET"]
)
@jwt_required()
def obtener_recetas():

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
            "error": (
                "No tienes permisos para "
                "consultar recetas"
            )
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado"
        }), 404

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


# =========================================================
# RECETA - OBTENER UNA
# =========================================================

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
            "error": (
                "No tienes permisos para "
                "consultar recetas"
            )
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
            "external_id": (
                item.medication.external_id
            ),
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


# =========================================================
# CANCELAR RECETA
# =========================================================

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
            "error": (
                "No tienes permisos para "
                "cancelar recetas"
            )
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


# =========================================================
# MEDICAMENTOS
# =========================================================

@api.route(
    "/medicamentos",
    methods=["GET"]
)
def buscar_medicamentos():

    query = request.args.get(
        "q",
        ""
    ).strip()

    if not query:
        return jsonify({
            "error": (
                "Debes introducir un término "
                "de búsqueda"
            )
        }), 400

    url = (
        "https://cima.aemps.es/cima/rest/medicamentos"
    )

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

    for medicamento in data.get(
        "resultados",
        []
    ):

        resultados.append({

            "nombre": medicamento.get(
                "nombre"
            ),

            "principio_activo": (
                medicamento.get(
                    "vtm",
                    {}
                ).get("nombre")
                if medicamento.get("vtm")
                else None
            ),

            "dosis": medicamento.get(
                "dosis"
            ),

            "forma_farmaceutica": (
                medicamento.get(
                    "formaFarmaceutica",
                    {}
                ).get("nombre")
                if medicamento.get(
                    "formaFarmaceutica"
                )
                else None
            ),

            "laboratorio": medicamento.get(
                "labtitular"
            ),

            "registro": medicamento.get(
                "nregistro"
            ),

            "requiere_receta": medicamento.get(
                "receta"
            ),

            "generico": medicamento.get(
                "generico"
            ),

            "vias_administracion": [
                via.get("nombre")
                for via in medicamento.get(
                    "viasAdministracion",
                    []
                )
            ]
        })

    return jsonify({
        "pagina": data.get("pagina"),
        "resultados": resultados
    }), 200


# =========================================================
# ESPECIALISTAS
# =========================================================

@api.route(
    "/medico/especialistas",
    methods=["GET"]
)
@jwt_required()
def obtener_especialistas():

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
            "error": (
                "No tienes permisos para "
                "consultar especialistas"
            )
        }), 403

    doctores = db.session.execute(
        db.select(Doctor)
        .join(
            User,
            Doctor.user_id == User.id
        )
        .join(
            Specialty,
            Doctor.specialty_id == Specialty.id
        )
        .where(
            Specialty.name != "Médico de cabecera"
        )
        .order_by(
            Specialty.name.asc(),
            User.last_name.asc(),
            User.first_name.asc()
        )
    ).scalars().all()

    especialistas = []

    for doctor in doctores:

        especialistas.append({

            "id": doctor.id,
            "user_id": doctor.user_id,

            "nombre": doctor.user.first_name,
            "apellidos": doctor.user.last_name,

            "nombre_completo": (
                f"{doctor.user.first_name} "
                f"{doctor.user.last_name}"
            ),

            "email": doctor.user.email,
            "telefono": doctor.user.phone,

            "especialidad": {
                "id": doctor.specialty.id,
                "nombre": doctor.specialty.name,
                "descripcion": doctor.specialty.description
            },

            "medical_license": doctor.medical_license,
            "years_experience": doctor.years_experience
        })

    return jsonify({
        "especialistas": especialistas,
        "total": len(especialistas)
    }), 200

@api.route(
    "/medico/pacientes/<int:patient_id>/especialistas",
    methods=["GET"]
)
@jwt_required()
def obtener_especialistas_paciente(patient_id):

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos"
        }), 403

    doctor_cabecera = user.doctor

    if not doctor_cabecera.specialty:
        return jsonify({
            "error": "El médico no tiene una especialidad asignada"
        }), 403

    specialty_name = (
        doctor_cabecera.specialty.name or ""
    ).strip().lower()

    if specialty_name != "médico de cabecera":
        return jsonify({
            "error": "Solo el médico de cabecera puede consultar los especialistas"
        }), 403

    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    # Comprobar que el paciente pertenece al médico de cabecera
    patient_relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == doctor_cabecera.id,
            DoctorPatient.patient_id == patient.id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not patient_relation:
        return jsonify({
            "error": "El paciente no está en tu lista de pacientes"
        }), 403

    relations = db.session.execute(
        db.select(DoctorPatient)
        .join(Doctor, DoctorPatient.doctor_id == Doctor.id)
        .where(
            DoctorPatient.patient_id == patient.id,
            DoctorPatient.is_active.is_(True),
            DoctorPatient.doctor_id != doctor_cabecera.id
        )
    ).scalars().all()

    especialistas = []

    for relation in relations:

        doctor = relation.doctor

        if not doctor or not doctor.user:
            continue

        especialistas.append({
            "id": doctor.id,
            "nombre": doctor.user.first_name,
            "apellidos": doctor.user.last_name,
            "nombre_completo": (
                f"{doctor.user.first_name} "
                f"{doctor.user.last_name}"
            ),
            "especialidad": (
                doctor.specialty.name
                if doctor.specialty
                else None
            ),
            "medical_license": doctor.medical_license,
            "years_experience": doctor.years_experience
        })

    return jsonify({
        "especialistas": especialistas,
        "total": len(especialistas)
    }), 200


@api.route(
    "/medico/pacientes/<int:patient_id>/especialista/<int:specialist_id>",
    methods=["DELETE"]
)
@jwt_required()
def eliminar_especialista_paciente(patient_id, specialist_id):

    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos"
        }), 403

    doctor_cabecera = user.doctor

    if not doctor_cabecera.specialty:
        return jsonify({
            "error": "El médico no tiene una especialidad asignada"
        }), 403

    specialty_name = (
        doctor_cabecera.specialty.name or ""
    ).strip().lower()

    if specialty_name != "médico de cabecera":
        return jsonify({
            "error": "Solo el médico de cabecera puede eliminar especialistas"
        }), 403

    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    # Comprobar que el paciente pertenece al médico de cabecera
    patient_relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == doctor_cabecera.id,
            DoctorPatient.patient_id == patient.id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not patient_relation:
        return jsonify({
            "error": "El paciente no está en tu lista de pacientes"
        }), 403

    # Buscar la relación con el especialista
    specialist_relation = db.session.execute(
        db.select(DoctorPatient).where(
            DoctorPatient.doctor_id == specialist_id,
            DoctorPatient.patient_id == patient.id,
            DoctorPatient.is_active.is_(True)
        )
    ).scalar_one_or_none()

    if not specialist_relation:
        return jsonify({
            "error": "El especialista no está asignado a este paciente"
        }), 404

    # Desactivar la relación, no borrarla físicamente
    specialist_relation.is_active = False

    db.session.commit()

    return jsonify({
        "message": "Especialista eliminado correctamente"
    }), 200

@api.route("/paciente/consultas/disponibilidad", methods=["GET"])
@jwt_required()
def obtener_disponibilidad_consultas():

    # ==========================================================
    # USUARIO AUTENTICADO
    # ==========================================================

    current_user_id = get_jwt_identity()

    # ==========================================================
    # BUSCAR PACIENTE
    # ==========================================================

    patient = Patient.query.filter_by(
        user_id=current_user_id
    ).first()

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado."
        }), 404

    # ==========================================================
    # BUSCAR MÉDICO ASIGNADO
    # ==========================================================

    doctor_patient = DoctorPatient.query.filter_by(
        patient_id=patient.id,
        is_active=True
    ).first()

    if not doctor_patient:
        return jsonify({
            "doctor_id": None,
            "ocupadas": []
        }), 200

    doctor_id = doctor_patient.doctor_id

    # ==========================================================
    # BUSCAR CITAS DEL MÉDICO
    # ==========================================================

    appointments = Appointment.query.filter(
        Appointment.doctor_id == doctor_id,
        Appointment.scheduled_start.isnot(None)
    ).all()

    # ==========================================================
    # HORAS OCUPADAS
    # ==========================================================

    ocupadas = []

    for appointment in appointments:

        # Las citas canceladas no bloquean la hora.
        if appointment.status and appointment.status.lower() == "cancelada":
            continue

        ocupadas.append(
            appointment.scheduled_start.strftime("%Y-%m-%dT%H:%M")
        )

    # ==========================================================
    # RESPUESTA
    # ==========================================================

    return jsonify({
        "doctor_id": doctor_id,
        "ocupadas": ocupadas
    }), 200