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
    Allergy,
    Vaccination,
    Surgery,
    Hospital,
    DoctorStatus
)
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json
import requests
import random
import resend
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
    updated = 0

    for data in doctors:

        user = User.query.filter_by(
            email=data["email"]
        ).first()

        # =====================================================
        # MÉDICO YA EXISTENTE
        # =====================================================

        if user:

            existing += 1

            doctor = Doctor.query.filter_by(
                user_id=user.id
            ).first()

            if doctor:
                doctor.hospital_id = data["hospital_id"]
                doctor.specialty_id = data["specialty_id"]
                doctor.years_experience = data["years_experience"]
                doctor.medical_license = data["medical_license"]

                updated += 1

            continue

        # =====================================================
        # CREAR USUARIO
        # =====================================================

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
            is_active=data["is_active"],
            role=UserRole(data["role"])
        )

        # =====================================================
        # CREAR MÉDICO
        # =====================================================

        doctor = Doctor(
            medical_license=data["medical_license"],
            specialty_id=data["specialty_id"],
            years_experience=data["years_experience"],
            hospital_id=data["hospital_id"]
        )

        user.doctor = doctor

        db.session.add(user)

        created += 1

    db.session.commit()

    return jsonify({
        "message": "Médicos procesados correctamente",
        "creados": created,
        "ya_existian": existing,
        "actualizados": updated
    }), 200

# =========================================================
# SEED ADMINISTRADORES
# =========================================================

@api.route("/seed/admins", methods=["GET"])
def seed_admins():

    json_route = os.path.join(
        os.path.dirname(__file__),
        "../data/admins.json"
    )

    with open(
        json_route,
        "r",
        encoding="utf-8"
    ) as file:

        admins = json.load(file)

    existing = 0
    created = 0
    updated = 0

    for data in admins:

        user = User.query.filter_by(
            email=data["email"]
        ).first()

        # ==========================================
        # ADMIN YA EXISTENTE
        # ==========================================

        if user:

            existing += 1

            if user.role == UserRole.ADMIN:

                user.hospital_id = data["hospital_id"]

                updated += 1

            continue

        # ==========================================
        # CREAR ADMIN
        # ==========================================

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
            is_active=data["is_active"],
            role=UserRole(data["role"]),
            hospital_id=data["hospital_id"]
        )

        db.session.add(user)

        created += 1

    db.session.commit()

    return jsonify({
        "message": "Administradores procesados correctamente",
        "creados": created,
        "ya_existian": existing,
        "actualizados": updated
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

# =========================================================
# SEED HOSPITALES
# =========================================================

@api.route("/seed/hospitales", methods=["GET"])
def seed_hospitals():

    json_route = os.path.join(
        os.path.dirname(__file__),
        "../data/hospitales.json"
    )

    with open(json_route, "r", encoding="utf-8") as file:
        hospitals = json.load(file)

    existing = 0
    created = 0

    for data in hospitals:

        hospital = Hospital.query.filter_by(
            name=data["name"]
        ).first()

        if hospital:
            existing += 1
            continue

        hospital = Hospital(
            name=data["name"],
            city=data.get("city"),
            address=data.get("address")
        )

        db.session.add(hospital)
        created += 1

    db.session.commit()

    return jsonify({
        "message": "Hospitales procesados correctamente",
        "creados": created,
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
    hospital = None
    hospital_id = None

    if user.role.value == "doctor":

        doctor = Doctor.query.filter_by(
            user_id=user.id
        ).first()

        if doctor:

            if doctor.specialty:
                especialidad = doctor.specialty.name

            if doctor.hospital:
                hospital = doctor.hospital.name
                hospital_id = doctor.hospital.id

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
            "especialidad": especialidad,
            "hospital": hospital,
            "hospital_id": hospital_id
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

    if user.role == UserRole.ADMIN:

        return jsonify({
            "message": "Acceso permitido",
            "dashboard": "admin",
            "redirect": "/dashboard/admin"
        }), 200

    elif user.role == UserRole.DOCTOR:

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

    if user.role != UserRole.DOCTOR:
        print(UserRole.DOCTOR == user.role)
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
# OBTENER HISTORIAL DE CONSULTAS - MÉDICO
# =========================================================


@api.route(
    "/medico/pacientes/<int:patient_id>/consultas",
    methods=["GET"]
)
@jwt_required()
def obtener_consultas_paciente_medico(patient_id):

    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.DOCTOR or not user.doctor:
        return jsonify({
            "error": "No tienes permisos para consultar el historial"
        }), 403

    # Obtener todas las consultas del paciente.
    # No comprobamos que el paciente esté asignado
    # al médico que realiza la petición.
    consultas = db.session.execute(
        db.select(Appointment)
        .where(
            Appointment.patient_id == patient_id
        )
        .order_by(
            Appointment.scheduled_start.desc()
        )
    ).scalars().all()

    return jsonify({
        "consultas": [
            consulta.serialize()
            for consulta in consultas
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

# =========================================================
# ADMIN - AGREGAR PACIENTE A UN MÉDICO
# =========================================================

@api.route(
    "/admin/medicos/<int:doctor_id>/pacientes/<int:patient_id>",
    methods=["POST"]
)
@jwt_required()
def admin_agregar_paciente(doctor_id, patient_id):

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
    # SOLO ADMIN
    # -----------------------------------------------------

    if user.role != UserRole.ADMIN:
        return jsonify({
            "error": "No tienes permisos para agregar pacientes"
        }), 403

    # -----------------------------------------------------
    # BUSCAR MÉDICO
    # -----------------------------------------------------

    doctor = db.session.get(
        Doctor,
        doctor_id
    )

    if not doctor:
        return jsonify({
            "error": "Médico no encontrado"
        }), 404

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

            specialty_name = (
                doctor.specialty.name
                if doctor.specialty
                else "esta especialidad"
            )

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

        # Ya está asignado
        if existing_relation.is_active:
            return jsonify({
                "error": (
                    "El paciente ya está asignado "
                    "a este médico"
                )
            }), 409

        # Existía anteriormente pero fue eliminado
        existing_relation.is_active = True

        db.session.commit()

        return jsonify({
            "message": "Paciente asignado nuevamente"
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
        "message": "Paciente asignado correctamente"
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
# ADMIN - ELIMINAR PACIENTE DE UN MÉDICO
# =========================================================

@api.route(
    "/admin/medicos/<int:doctor_id>/pacientes/<int:patient_id>",
    methods=["DELETE"]
)
@jwt_required()
def admin_eliminar_paciente(doctor_id, patient_id):

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
    # SOLO ADMIN
    # -----------------------------------------------------

    if user.role != UserRole.ADMIN:
        return jsonify({
            "error": "No tienes permisos para eliminar pacientes"
        }), 403

    # -----------------------------------------------------
    # BUSCAR MÉDICO
    # -----------------------------------------------------

    doctor = db.session.get(
        Doctor,
        doctor_id
    )

    if not doctor:
        return jsonify({
            "error": "Médico no encontrado"
        }), 404

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
            "error": (
                "El paciente no está asignado "
                "a este médico"
            )
        }), 404

    # -----------------------------------------------------
    # COMPROBAR SI YA ESTÁ INACTIVA
    # -----------------------------------------------------

    if not relation.is_active:
        return jsonify({
            "error": (
                "El paciente ya no está asignado "
                "a este médico"
            )
        }), 409

    # -----------------------------------------------------
    # SOFT DELETE
    # -----------------------------------------------------

    relation.is_active = False

    db.session.commit()

    return jsonify({
        "message": "Paciente desasignado correctamente"
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

# ====================
# OBTENER ALERGIAS
# ===================


@api.route(
    '/medico/pacientes/<int:patient_id>/alergias',
    methods=['GET']
)
@jwt_required()
def obtener_alergias_paciente(patient_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado."
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para consultar este historial."
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado."
        }), 404

    patient = db.session.get(
        Patient,
        patient_id
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado."
        }), 404

    alergias = db.session.execute(
        db.select(Allergy)
        .where(
            Allergy.patient_id == patient.id
        )
        .order_by(
            Allergy.created_at.desc()
        )
    ).scalars().all()

    resultado = []

    for alergia in alergias:
        resultado.append({
            "id": alergia.id,
            "patient_id": alergia.patient_id,
            "allergen": alergia.allergen,
            "reaction": alergia.reaction,
            "severity": alergia.severity,
            "notes": alergia.notes,
            "created_at": (
                alergia.created_at.isoformat()
                if alergia.created_at
                else None
            ),
        })

    return jsonify({
        "alergias": resultado
    }), 200


# ====================
# CREAR ALERGIA
# ====================

@api.route(
    '/medico/pacientes/<int:patient_id>/alergias',
    methods=['POST']
)
@jwt_required()
def crear_alergia_paciente(patient_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado."
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para registrar alergias."
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado."
        }), 404

    patient = db.session.get(
        Patient,
        patient_id
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado."
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se recibieron datos."
        }), 400

    allergen = data.get("allergen")
    reaction = data.get("reaction")
    severity = data.get("severity")
    notes = data.get("notes")

    if not allergen or not allergen.strip():
        return jsonify({
            "error": "El alérgeno es obligatorio."
        }), 400

    alergia = Allergy(
        patient_id=patient.id,
        allergen=allergen.strip(),
        reaction=reaction.strip() if reaction else None,
        severity=severity.strip() if severity else None,
        notes=notes.strip() if notes else None,
    )

    try:

        db.session.add(alergia)
        db.session.commit()

    except Exception as error:

        db.session.rollback()

        print(
            "Error creando alergia:",
            error
        )

        return jsonify({
            "error": "No se pudo registrar la alergia."
        }), 500

    return jsonify({
        "message": "Alergia registrada correctamente.",
        "alergia": {
            "id": alergia.id,
            "patient_id": alergia.patient_id,
            "allergen": alergia.allergen,
            "reaction": alergia.reaction,
            "severity": alergia.severity,
            "notes": alergia.notes,
            "created_at": (
                alergia.created_at.isoformat()
                if alergia.created_at
                else None
            ),
        }
    }), 201


# ====================
# OBTENER VACUNAS
# ===================

@api.route(
    '/medico/pacientes/<int:patient_id>/vacunas',
    methods=['GET']
)
@jwt_required()
def obtener_vacunas_paciente(patient_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado."
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para consultar este historial."
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado."
        }), 404

    patient = db.session.get(
        Patient,
        patient_id
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado."
        }), 404

    vacunas = db.session.execute(
        db.select(Vaccination)
        .where(
            Vaccination.patient_id == patient.id
        )
        .order_by(
            Vaccination.vaccination_date.desc()
        )
    ).scalars().all()

    resultado = []

    for vacuna in vacunas:
        resultado.append({
            "id": vacuna.id,
            "patient_id": vacuna.patient_id,
            "vaccine_name": vacuna.vaccine_name,
            "vaccination_date": (
                vacuna.vaccination_date.isoformat()
                if vacuna.vaccination_date
                else None
            ),
            "dose": vacuna.dose,
            "lot_number": vacuna.lot_number,
            "manufacturer": vacuna.manufacturer,
            "next_dose_date": (
                vacuna.next_dose_date.isoformat()
                if vacuna.next_dose_date
                else None
            ),
            "notes": vacuna.notes,
        })

    return jsonify({
        "vacunas": resultado
    }), 200
# =========================================================
# VACUNACIONES (MÉDICO)
# =========================================================

@api.route("/medico/vacunaciones", methods=["POST"])
@jwt_required()
def crear_vacunacion():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user or user.role.value != "doctor":
        return jsonify({
            "error": "No autorizado"
        }), 403

    doctor = Doctor.query.filter_by(
        user_id=user.id
    ).first()

    if not doctor:
        return jsonify({
            "error": "Médico no encontrado"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se han enviado datos"
        }), 400

    patient_id = data.get("patient_id")
    vaccine = (data.get("vaccine") or "").strip()
    dose = (data.get("dose") or "").strip()
    administration_date = data.get("administration_date")

    if not patient_id:
        return jsonify({
            "error": "Falta el paciente"
        }), 400

    if not vaccine:
        return jsonify({
            "error": "Introduce el nombre de la vacuna"
        }), 400

    if not dose:
        return jsonify({
            "error": "Introduce la dosis"
        }), 400

    if not administration_date:
        return jsonify({
            "error": "Introduce la fecha de administración"
        }), 400

    relation = DoctorPatient.query.filter_by(
        doctor_id=doctor.id,
        patient_id=patient_id,
        is_active=True
    ).first()

    if not relation:
        return jsonify({
            "error": "Este paciente no está asignado a tu consulta"
        }), 403

    try:
        vaccination_date = datetime.strptime(
            administration_date, "%Y-%m-%d"
        ).date()
    except ValueError:
        return jsonify({
            "error": "Fecha de administración inválida"
        }), 400

    next_dose_date = None
    next_dose_raw = data.get("next_dose_date")

    if next_dose_raw:
        try:
            next_dose_date = datetime.strptime(
                next_dose_raw, "%Y-%m-%d"
            ).date()
        except ValueError:
            return jsonify({
                "error": "Fecha de próxima dosis inválida"
            }), 400

    new_vaccination = Vaccination(
        patient_id=patient_id,
        vaccine_name=vaccine,
        vaccination_date=vaccination_date,
        dose=dose,
        lot_number=(data.get("lot") or "").strip() or None,
        manufacturer=(data.get("manufacturer") or "").strip() or None,
        next_dose_date=next_dose_date,
        notes=(data.get("observations") or "").strip() or None,
    )

    db.session.add(new_vaccination)
    db.session.commit()

    return jsonify({
        "message": "Registro de vacunación creado correctamente",
        "vaccination": {
            "id": new_vaccination.id,
            "patient_id": new_vaccination.patient_id,
            "vaccine_name": new_vaccination.vaccine_name,
            "vaccination_date": new_vaccination.vaccination_date.isoformat(),
            "dose": new_vaccination.dose,
            "lot_number": new_vaccination.lot_number,
            "manufacturer": new_vaccination.manufacturer,
            "next_dose_date": (
                new_vaccination.next_dose_date.isoformat()
                if new_vaccination.next_dose_date else None
            ),
            "notes": new_vaccination.notes,
        }
    }), 201


# ====================
# OBTENER CIRUGÍAS
# ===================

@api.route(
    '/medico/pacientes/<int:patient_id>/cirugias',
    methods=['GET']
)
@jwt_required()
def obtener_cirugias_paciente(patient_id):

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "error": "Usuario no encontrado."
        }), 404

    if user.role != UserRole.DOCTOR:
        return jsonify({
            "error": "No tienes permisos para consultar este historial."
        }), 403

    doctor = user.doctor

    if not doctor:
        return jsonify({
            "error": "Perfil médico no encontrado."
        }), 404

    patient = db.session.get(
        Patient,
        patient_id
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado."
        }), 404

    cirugias = db.session.execute(
        db.select(Surgery)
        .where(
            Surgery.patient_id == patient.id
        )
        .order_by(
            Surgery.surgery_date.desc()
        )
    ).scalars().all()

    resultado = []

    for cirugia in cirugias:
        resultado.append({
            "id": cirugia.id,
            "patient_id": cirugia.patient_id,
            "name": cirugia.name,
            "surgery_date": (
                cirugia.surgery_date.isoformat()
                if cirugia.surgery_date
                else None
            ),
            "hospital": cirugia.hospital,
            "surgeon": cirugia.surgeon,
            "notes": cirugia.notes,
        })

    return jsonify({
        "cirugias": resultado
    }), 200

# =========================================================
# CIRUGÍAS (CUALQUIER MÉDICO)
# =========================================================

@api.route("/medico/cirugias", methods=["POST"])
@jwt_required()
def crear_cirugia():

    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role.value != "doctor":
        return jsonify({
            "error": "No autorizado"
        }), 403

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se han enviado datos"
        }), 400

    patient_id = data.get("patient_id")
    name = (data.get("name") or "").strip()
    surgery_date_raw = data.get("surgery_date")

    if not patient_id:
        return jsonify({
            "error": "Falta el paciente"
        }), 400

    if not name:
        return jsonify({
            "error": "Introduce el nombre de la cirugía"
        }), 400

    if not surgery_date_raw:
        return jsonify({
            "error": "Introduce la fecha de la cirugía"
        }), 400

    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    try:
        surgery_date = datetime.strptime(
            surgery_date_raw, "%Y-%m-%d"
        ).date()
    except ValueError:
        return jsonify({
            "error": "Fecha de cirugía inválida"
        }), 400

    new_surgery = Surgery(
        patient_id=patient_id,
        name=name,
        surgery_date=surgery_date,
        hospital=(data.get("hospital") or "").strip() or None,
        surgeon=(data.get("surgeon") or "").strip() or None,
        notes=(data.get("notes") or "").strip() or None,
    )

    db.session.add(new_surgery)
    db.session.commit()

    return jsonify({
        "message": "Registro de cirugía creado correctamente",
        "surgery": {
            "id": new_surgery.id,
            "patient_id": new_surgery.patient_id,
            "name": new_surgery.name,
            "surgery_date": (
                new_surgery.surgery_date.isoformat()
                if new_surgery.surgery_date else None
            ),
            "hospital": new_surgery.hospital,
            "surgeon": new_surgery.surgeon,
            "notes": new_surgery.notes,
        }
    }), 201

# =========================================================
# FORMULARIO DE CONTACTO
# =========================================================

@api.route('/contacto', methods=['POST'])
def enviar_contacto():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se recibieron datos."
        }), 400

    nombre = data.get("nombre")
    email = data.get("email")
    mensaje = data.get("mensaje")

    if not nombre or not email or not mensaje:
        return jsonify({
            "error": "Todos los campos son obligatorios."
        }), 400

    try:

        resend.Emails.send({
            "from": "Lexdibri <onboarding@resend.dev>",
            "to": ["briancafee7@gmail.com"],
            "reply_to": email,
            "subject": f"Nuevo mensaje de contacto - {nombre}",
            "html": f"""
                <h2>Nuevo mensaje de contacto</h2>

                <p>
                    <strong>Nombre:</strong> {nombre}
                </p>

                <p>
                    <strong>Email:</strong> {email}
                </p>

                <p>
                    <strong>Mensaje:</strong>
                </p>

                <p>
                    {mensaje}
                </p>
            """
        })

        return jsonify({
            "message": "Mensaje enviado correctamente."
        }), 200

    except Exception as error:

        print("Error enviando email:", error)

        return jsonify({
            "error": "No se pudo enviar el mensaje."
        }), 500

# ============================================================
# ADMINISTRACIÓN DEL HOSPITAL
# ============================================================

def get_admin_actual():

    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return None, jsonify({
            "error": "Usuario no encontrado"
        }), 404

    if user.role != UserRole.ADMIN:
        return None, jsonify({
            "error": "Acceso exclusivo para administradores"
        }), 403

    if not user.hospital_id:
        return None, jsonify({
            "error": "El administrador no tiene un hospital asignado"
        }), 400

    return user, None, None


# ============================================================
# 1. OBTENER HOSPITAL DEL ADMIN
# ============================================================

@api.route("/admin/hospital", methods=["GET"])
@jwt_required()
def admin_hospital():

    user, error, status = get_admin_actual()

    if error:
        return error, status

    hospital = db.session.get(
        Hospital,
        user.hospital_id
    )

    if not hospital:
        return jsonify({
            "error": "Hospital no encontrado"
        }), 404

    return jsonify({
        "id": hospital.id,
        "name": hospital.name,
        "city": hospital.city,
        "address": hospital.address
    }), 200


# ============================================================
# 2. OBTENER DOCTORES DEL HOSPITAL
# ============================================================


@api.route("/admin/doctores", methods=["GET"])
@jwt_required()
def admin_doctores():
    user, error, status = get_admin_actual()
    if error:
        return error, status

    doctores = Doctor.query.filter_by(
        hospital_id=user.hospital_id
    ).all()

    resultado = []

    for doctor in doctores:
        resultado.append({
            "id": doctor.id,
            "user_id": doctor.user_id,

            "first_name": doctor.user.first_name,
            "last_name": doctor.user.last_name,
            "email": doctor.user.email,
            "dni": doctor.user.dni,
            "phone": doctor.user.phone,

            "medical_license": doctor.medical_license,

            "specialty": (
                doctor.specialty.name
                if doctor.specialty
                else None
            ),

            "specialty_id": doctor.specialty_id,
            "years_experience": doctor.years_experience,

            # Estado profesional del médico
            "status": (
                doctor.status.value
                if doctor.status
                else None
            ),

            # Estado de la cuenta del usuario
            "is_active": doctor.user.is_active,

            "hospital_id": doctor.hospital_id,
        })

    return jsonify({
        "doctores": resultado,
        "total": len(resultado)
    }), 200



# ============================================================
# 3. OBTENER PACIENTES
# ============================================================

@api.route("/admin/pacientes", methods=["GET"])
@jwt_required()
def admin_pacientes():

    user, error, status = get_admin_actual()

    if error:
        return error, status

    pacientes = Patient.query.all()

    resultado = []

    for patient in pacientes:

        relaciones = (
            DoctorPatient.query
            .join(Doctor)
            .filter(
                DoctorPatient.patient_id == patient.id,
                DoctorPatient.is_active.is_(True),
                Doctor.hospital_id == user.hospital_id
            )
            .all()
        )

        medicos = []

        for relacion in relaciones:

            doctor = relacion.doctor

            medicos.append({
                "id": doctor.id,
                "first_name": doctor.user.first_name,
                "last_name": doctor.user.last_name,
                "specialty": (
                    doctor.specialty.name
                    if doctor.specialty
                    else None
                ),
                "assigned_at": (
                    relacion.assigned_at.isoformat()
                    if relacion.assigned_at
                    else None
                )
            })

        resultado.append({
            "id": patient.id,
            "user_id": patient.user_id,
            "first_name": patient.user.first_name,
            "last_name": patient.user.last_name,
            "email": patient.user.email,
            "dni": patient.user.dni,
            "cip": patient.cip,
            "blood_type": patient.blood_type,
            "doctores": medicos
        })

    return jsonify({
        "pacientes": resultado,
        "total": len(resultado)
    }), 200


# ============================================================
# 4. ASIGNAR MÉDICO A PACIENTE
# ============================================================

@api.route("/admin/asignar-medico", methods=["POST"])
@jwt_required()
def asignar_medico():

    user, error, status = get_admin_actual()

    if error:
        return error, status

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No se han enviado datos"
        }), 400

    patient_id = data.get("patient_id")
    doctor_id = data.get("doctor_id")

    if not patient_id or not doctor_id:
        return jsonify({
            "error": "patient_id y doctor_id son obligatorios"
        }), 400

    patient = db.session.get(
        Patient,
        patient_id
    )

    if not patient:
        return jsonify({
            "error": "Paciente no encontrado"
        }), 404

    doctor = db.session.get(
        Doctor,
        doctor_id
    )

    if not doctor:
        return jsonify({
            "error": "Médico no encontrado"
        }), 404

    # El médico debe pertenecer al hospital
    # del administrador autenticado
    if doctor.hospital_id != user.hospital_id:
        return jsonify({
            "error": "El médico no pertenece a tu hospital"
        }), 403

    relacion = DoctorPatient.query.filter_by(
        doctor_id=doctor.id,
        patient_id=patient.id
    ).first()

    if relacion:

        if relacion.is_active:
            return jsonify({
                "error": "El médico ya está asignado a este paciente"
            }), 409

        # Reactivar una relación anterior
        relacion.is_active = True

    else:

        relacion = DoctorPatient(
            doctor_id=doctor.id,
            patient_id=patient.id,
            is_active=True
        )

        db.session.add(relacion)

    db.session.commit()

    return jsonify({
        "message": "Médico asignado correctamente",
        "doctor_id": doctor.id,
        "patient_id": patient.id
    }), 200


# ============================================================
# 5. DESASIGNAR MÉDICO DE PACIENTE
# ============================================================

@api.route(
    "/admin/desasignar-medico/<int:doctor_id>/<int:patient_id>",
    methods=["PUT"]
)
@jwt_required()
def desasignar_medico(doctor_id, patient_id):

    user, error, status = get_admin_actual()

    if error:
        return error, status

    doctor = db.session.get(
        Doctor,
        doctor_id
    )

    if not doctor:
        return jsonify({
            "error": "Médico no encontrado"
        }), 404

    # El médico debe pertenecer al hospital
    # del administrador autenticado
    if doctor.hospital_id != user.hospital_id:
        return jsonify({
            "error": "El médico no pertenece a tu hospital"
        }), 403

    relacion = DoctorPatient.query.filter_by(
        doctor_id=doctor_id,
        patient_id=patient_id
    ).first()

    if not relacion:
        return jsonify({
            "error": "La asignación no existe"
        }), 404

    relacion.is_active = False

    db.session.commit()

    return jsonify({
        "message": "Médico desasignado correctamente"
    }), 200




@api.route("/admin/doctores/<int:doctor_id>/estado", methods=["PUT"])
@jwt_required()
def admin_cambiar_estado_doctor(doctor_id):
    print("\n================ CAMBIAR ESTADO MÉDICO ================")
    print(">>> ENTRÓ AL ENDPOINT")
    print(">>> doctor_id:", doctor_id)

    try:
        # --------------------------------------------------
        # 1. Comprobar administrador
        # --------------------------------------------------
        print(">>> Comprobando administrador...")

        user, error, status = get_admin_actual()

        if error:
            print(">>> ERROR EN get_admin_actual()")
            print(">>> error:", error)
            print(">>> status:", status)
            return error, status

        print(">>> Admin correcto")
        print(">>> admin user_id:", user.id)
        print(">>> admin hospital_id:", user.hospital_id)

        # --------------------------------------------------
        # 2. Buscar médico
        # --------------------------------------------------
        print(">>> Buscando médico...")

        doctor = db.session.get(Doctor, doctor_id)

        if not doctor:
            print(">>> MÉDICO NO ENCONTRADO")
            return jsonify({
                "error": "Médico no encontrado"
            }), 404

        print(">>> Médico encontrado")
        print(">>> doctor.id:", doctor.id)
        print(">>> doctor.user_id:", doctor.user_id)
        print(">>> doctor.hospital_id:", doctor.hospital_id)
        print(">>> doctor.status actual:", doctor.status)

        # --------------------------------------------------
        # 3. Comprobar hospital
        # --------------------------------------------------
        print(">>> Comprobando hospital...")

        if doctor.hospital_id != user.hospital_id:
            print(">>> ERROR: el médico no pertenece al hospital del admin")
            print(">>> doctor.hospital_id:", doctor.hospital_id)
            print(">>> admin.hospital_id:", user.hospital_id)

            return jsonify({
                "error": "El médico no pertenece a tu hospital"
            }), 403

        print(">>> Hospital correcto")

        # --------------------------------------------------
        # 4. Leer JSON
        # --------------------------------------------------
        print(">>> Leyendo JSON de la petición...")

        data = request.get_json(silent=True)

        print(">>> data recibida:", data)

        if not data:
            print(">>> ERROR: no se recibió JSON")

            return jsonify({
                "error": "No se recibió ningún JSON"
            }), 400

        nuevo_estado = data.get("status")

        print(">>> nuevo_estado:", nuevo_estado)
        print(">>> tipo nuevo_estado:", type(nuevo_estado))

        # --------------------------------------------------
        # 5. Comprobar status
        # --------------------------------------------------
        if not nuevo_estado:
            print(">>> ERROR: falta el campo status")

            return jsonify({
                "error": "El campo 'status' es obligatorio"
            }), 400

        # --------------------------------------------------
        # 6. Convertir al Enum
        # --------------------------------------------------
        print(">>> Estados permitidos:")

        for estado in DoctorStatus:
            print(
                "    -",
                estado.name,
                "=",
                estado.value
            )

        print(">>> Intentando asignar nuevo estado...")

        try:
            doctor.status = DoctorStatus(nuevo_estado)

            print(">>> Estado asignado correctamente")
            print(">>> doctor.status:", doctor.status)
            print(">>> doctor.status.value:", doctor.status.value)

        except (ValueError, TypeError) as e:
            print(">>> ERROR AL CONVERTIR EL ESTADO")
            print(">>> excepción:", repr(e))

            return jsonify({
                "error": "Estado de médico no válido",
                "estados_permitidos": [
                    estado.value
                    for estado in DoctorStatus
                ]
            }), 400

        # --------------------------------------------------
        # 7. Guardar en BD
        # --------------------------------------------------
        print(">>> Haciendo commit en la base de datos...")

        db.session.commit()

        print(">>> COMMIT CORRECTO")
        print(">>> Nuevo estado guardado:", doctor.status.value)

        # --------------------------------------------------
        # 8. Respuesta
        # --------------------------------------------------
        respuesta = {
            "message": "Estado del médico actualizado correctamente",
            "doctor_id": doctor.id,
            "status": doctor.status.value
        }

        print(">>> RESPUESTA:", respuesta)
        print("========================================================\n")

        return jsonify(respuesta), 200

    except Exception as e:
        # --------------------------------------------------
        # ERROR INESPERADO
        # --------------------------------------------------
        print("\n!!!!!!!!!!!!!!!! ERROR INESPERADO !!!!!!!!!!!!!!!!")
        print(">>> Tipo:", type(e).__name__)
        print(">>> Error:", str(e))
        print(">>> repr:", repr(e))

        import traceback
        traceback.print_exc()

        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")

        db.session.rollback()

        return jsonify({
            "error": "Error interno al cambiar el estado del médico",
            "detail": str(e)
        }), 500
