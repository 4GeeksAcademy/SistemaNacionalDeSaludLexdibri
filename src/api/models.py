from datetime import date, datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Date, DateTime, ForeignKey, Integer, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum

db = SQLAlchemy()

# NOTA: no se define __tablename__ en ninguna clase, así que Flask-SQLAlchemy
# genera el nombre de tabla por defecto a partir del nombre de la clase
# (CamelCase -> snake_case, en singular). Por eso todas las ForeignKey de
# abajo apuntan a esos nombres (p.ej. "user.id", "patient.id",
# "doctor_health_center.id"...) en vez de a nombres en plural.

### =====================================  ENUMS    ===========================================================###


class UserRole(Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"

### =====================================  DB    ==============================================================###


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    first_name: Mapped[str] = mapped_column(String(100),
                                            nullable=False,
                                            )
    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    dni: Mapped[str | None] = mapped_column(
        String(20),
        unique=True,
        nullable=True,
    )
    phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )
    date_of_birth: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )
    sex: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    patient: Mapped["Patient | None"] = relationship(
        back_populates="user",
        uselist=False,
    )
    doctor: Mapped["Doctor | None"] = relationship(
        back_populates="user",
        uselist=False,
    )
    sent_messages: Mapped[list["Message"]] = relationship(
        back_populates="sender",
    )

    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        nullable=False,
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.first_name,
            "apellidos": self.last_name,
            "sex": self.sex,
            "role": self.role
            # do not serialize the password, its a security breach
        }

# Pacientes


class Patient(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"),
        unique=True,
        nullable=False,
    )

    cip: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    blood_type: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # 1:1
    user: Mapped["User"] = relationship(
        back_populates="patient",
    )

    # N:M
    health_centers: Mapped[list["PatientHealthCenter"]] = relationship(
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    # 1:N
    appointments: Mapped[list["Appointment"]] = relationship(
        back_populates="patient",
    )

    # 1:N
    diagnoses: Mapped[list["Diagnosis"]] = relationship(
        back_populates="patient",
    )

    # 1:N
    prescriptions: Mapped[list["Prescription"]] = relationship(
        back_populates="patient",
    )

    # 1:N
    medical_records: Mapped[list["MedicalRecord"]] = relationship(
        back_populates="patient",
    )

    # 1:N
    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="patient",
    )

    # 1:N
    access_logs: Mapped[list["MedicalRecordAccessLog"]] = relationship(
        back_populates="patient",
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "cip": self.cip,
            "blood_type": self.blood_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# Especialidades


class Specialty(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    name: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(Text)

    doctors: Mapped[list["Doctor"]] = relationship(
        back_populates="specialty",
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }


# Centros de salud


class HealthCenter(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    address: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(30))

    doctors: Mapped[list["DoctorHealthCenter"]] = relationship(
        back_populates="health_center",
        cascade="all, delete-orphan",
    )

    patients: Mapped[list["PatientHealthCenter"]] = relationship(
        back_populates="health_center",
        cascade="all, delete-orphan",
    )

    appointments: Mapped[list["Appointment"]] = relationship(
        back_populates="health_center",
    )

    access_logs: Mapped[list["MedicalRecordAccessLog"]] = relationship(
        back_populates="health_center",
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "phone": self.phone,
        }


# Doctores


class Doctor(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"),
        unique=True,
        nullable=False,
    )

    medical_license: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    specialty_id: Mapped[int | None] = mapped_column(
        ForeignKey("specialty.id"),
        nullable=True,
    )

    years_experience: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # 1:1
    user: Mapped["User"] = relationship(
        back_populates="doctor",
    )

    # N:1
    specialty: Mapped["Specialty | None"] = relationship(
        back_populates="doctors",
    )

    # N:M
    health_centers: Mapped[list["DoctorHealthCenter"]] = relationship(
        back_populates="doctor",
        cascade="all, delete-orphan",
    )

    # 1:N
    appointments: Mapped[list["Appointment"]] = relationship(
        back_populates="doctor",
    )

    # 1:N
    diagnoses: Mapped[list["Diagnosis"]] = relationship(
        back_populates="doctor",
    )

    # 1:N
    prescriptions: Mapped[list["Prescription"]] = relationship(
        back_populates="doctor",
    )

    # 1:N
    medical_records: Mapped[list["MedicalRecord"]] = relationship(
        back_populates="doctor",
    )

    # 1:N
    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="doctor",
    )

    # 1:N
    access_logs: Mapped[list["MedicalRecordAccessLog"]] = relationship(
        back_populates="doctor",
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "medical_license": self.medical_license,
            "specialty_id": self.specialty_id,
            "years_experience": self.years_experience,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# Centro del Doctor


class DoctorHealthCenter(db.Model):

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctor.id"),
        primary_key=True,
    )

    health_center_id: Mapped[int] = mapped_column(
        ForeignKey("health_center.id"),
        primary_key=True,
    )

    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    doctor: Mapped["Doctor"] = relationship(
        back_populates="health_centers",
    )

    health_center: Mapped["HealthCenter"] = relationship(
        back_populates="doctors",
    )

    def serialize(self):
        return {
            "doctor_id": self.doctor_id,
            "health_center_id": self.health_center_id,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "is_active": self.is_active,
        }


# Centro del Paciente


class PatientHealthCenter(db.Model):

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.id"),
        primary_key=True,
    )

    health_center_id: Mapped[int] = mapped_column(
        ForeignKey("health_center.id"),
        primary_key=True,
    )

    is_primary: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    assigned_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    patient: Mapped["Patient"] = relationship(
        back_populates="health_centers",
    )

    health_center: Mapped["HealthCenter"] = relationship(
        back_populates="patients",
    )

    def serialize(self):
        return {
            "patient_id": self.patient_id,
            "health_center_id": self.health_center_id,
            "is_primary": self.is_primary,
            "assigned_at": self.assigned_at.isoformat()
            if self.assigned_at else None,
        }


# Citas


class Appointment(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.id"),
        nullable=False,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctor.id"),
        nullable=False,
    )

    health_center_id: Mapped[int | None] = mapped_column(
        ForeignKey("health_center.id"),
        nullable=True,
    )

    appointment_type: Mapped[str | None] = mapped_column(String(50))

    scheduled_start: Mapped[datetime | None] = mapped_column(DateTime)
    scheduled_end: Mapped[datetime | None] = mapped_column(DateTime)

    status: Mapped[str | None] = mapped_column(String(50))

    reason: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    patient: Mapped["Patient"] = relationship(
        back_populates="appointments",
    )

    doctor: Mapped["Doctor"] = relationship(
        back_populates="appointments",
    )

    health_center: Mapped["HealthCenter | None"] = relationship(
        back_populates="appointments",
    )

    diagnoses: Mapped[list["Diagnosis"]] = relationship(
        back_populates="appointment",
    )

    prescriptions: Mapped[list["Prescription"]] = relationship(
        back_populates="appointment",
    )

    medical_records: Mapped[list["MedicalRecord"]] = relationship(
        back_populates="appointment",
    )

    conversations: Mapped[list["Conversation"]] = relationship(
        back_populates="appointment",
    )

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_id": self.doctor_id,
            "health_center_id": self.health_center_id,
            "appointment_type": self.appointment_type,
            "scheduled_start": (
                self.scheduled_start.isoformat()
                if self.scheduled_start else None
            ),
            "scheduled_end": (
                self.scheduled_end.isoformat()
                if self.scheduled_end else None
            ),
            "status": self.status,
            "reason": self.reason,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at else None
            ),
        }


# Enfermedades


class Disease(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    code: Mapped[str | None] = mapped_column(
        String(50),
        unique=True,
        nullable=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(Text)

    diagnoses: Mapped[list["Diagnosis"]] = relationship(
        back_populates="disease",
    )

    def serialize(self):
        return {
            "id": self.id,
            "code": self.code,
            "name": self.name,
            "description": self.description,
        }


# Diagnósticos


class Diagnosis(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.id"),
        nullable=False,
    )

    disease_id: Mapped[int] = mapped_column(
        ForeignKey("disease.id"),
        nullable=False,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctor.id"),
        nullable=False,
    )

    appointment_id: Mapped[int | None] = mapped_column(
        ForeignKey("appointment.id"),
        nullable=True,
    )

    diagnosed_at: Mapped[datetime | None] = mapped_column(DateTime)

    status: Mapped[str | None] = mapped_column(String(50))

    notes: Mapped[str | None] = mapped_column(Text)

    patient: Mapped["Patient"] = relationship(
        back_populates="diagnoses",
    )

    disease: Mapped["Disease"] = relationship(
        back_populates="diagnoses",
    )

    doctor: Mapped["Doctor"] = relationship(
        back_populates="diagnoses",
    )

    appointment: Mapped["Appointment | None"] = relationship(
        back_populates="diagnoses",
    )

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "disease_id": self.disease_id,
            "doctor_id": self.doctor_id,
            "appointment_id": self.appointment_id,
            "diagnosed_at": (
                self.diagnosed_at.isoformat()
                if self.diagnosed_at else None
            ),
            "status": self.status,
            "notes": self.notes,
        }


# Medicamentos


class Medication(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    external_id: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    active_ingredient: Mapped[str | None] = mapped_column(String(255))
    strength: Mapped[str | None] = mapped_column(String(100))
    type: Mapped[str | None] = mapped_column(String(100))
    source: Mapped[str | None] = mapped_column(String(100))

    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime)

    prescriptions: Mapped[list["PrescriptionMedication"]] = relationship(
        back_populates="medication",
        cascade="all, delete-orphan",
    )

    def serialize(self):
        return {
            "id": self.id,
            "external_id": self.external_id,
            "name": self.name,
            "active_ingredient": self.active_ingredient,
            "strength": self.strength,
            "type": self.type,
            "source": self.source,
            "last_synced_at": (
                self.last_synced_at.isoformat()
                if self.last_synced_at else None
            ),
        }


# Prescripciones


class Prescription(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.id"),
        nullable=False,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctor.id"),
        nullable=False,
    )

    appointment_id: Mapped[int | None] = mapped_column(
        ForeignKey("appointment.id"),
        nullable=True,
    )

    issued_at: Mapped[datetime | None] = mapped_column(DateTime)

    status: Mapped[str | None] = mapped_column(String(50))

    notes: Mapped[str | None] = mapped_column(Text)

    patient: Mapped["Patient"] = relationship(
        back_populates="prescriptions",
    )

    doctor: Mapped["Doctor"] = relationship(
        back_populates="prescriptions",
    )

    appointment: Mapped["Appointment | None"] = relationship(
        back_populates="prescriptions",
    )

    medications: Mapped[list["PrescriptionMedication"]] = relationship(
        back_populates="prescription",
        cascade="all, delete-orphan",
    )

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_id": self.doctor_id,
            "appointment_id": self.appointment_id,
            "issued_at": (
                self.issued_at.isoformat()
                if self.issued_at else None
            ),
            "status": self.status,
            "notes": self.notes,
        }


# Conexión prescripción-medicación


class PrescriptionMedication(db.Model):

    prescription_id: Mapped[int] = mapped_column(
        ForeignKey("prescription.id"),
        primary_key=True,
    )

    medication_id: Mapped[int] = mapped_column(
        ForeignKey("medication.id"),
        primary_key=True,
    )

    dosage: Mapped[str | None] = mapped_column(String(100))
    frequency: Mapped[str | None] = mapped_column(String(100))
    duration: Mapped[str | None] = mapped_column(String(100))
    instructions: Mapped[str | None] = mapped_column(Text)

    prescription: Mapped["Prescription"] = relationship(
        back_populates="medications",
    )

    medication: Mapped["Medication"] = relationship(
        back_populates="prescriptions",
    )

    def serialize(self):
        return {
            "prescription_id": self.prescription_id,
            "medication_id": self.medication_id,
            "dosage": self.dosage,
            "frequency": self.frequency,
            "duration": self.duration,
            "instructions": self.instructions,
        }


# Historiales médicos


class MedicalRecord(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.id"),
        nullable=False,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctor.id"),
        nullable=False,
    )

    appointment_id: Mapped[int | None] = mapped_column(
        ForeignKey("appointment.id"),
        nullable=True,
    )

    record_type: Mapped[str | None] = mapped_column(String(100))
    title: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    patient: Mapped["Patient"] = relationship(
        back_populates="medical_records",
    )

    doctor: Mapped["Doctor"] = relationship(
        back_populates="medical_records",
    )

    appointment: Mapped["Appointment | None"] = relationship(
        back_populates="medical_records",
    )

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_id": self.doctor_id,
            "appointment_id": self.appointment_id,
            "record_type": self.record_type,
            "title": self.title,
            "description": self.description,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            ),
        }


# Conversaciones


class Conversation(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.id"),
        nullable=False,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctor.id"),
        nullable=False,
    )

    appointment_id: Mapped[int | None] = mapped_column(
        ForeignKey("appointment.id"),
        nullable=True,
    )

    status: Mapped[str | None] = mapped_column(String(50))

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    closed_at: Mapped[datetime | None] = mapped_column(DateTime)

    patient: Mapped["Patient"] = relationship(
        back_populates="conversations",
    )

    doctor: Mapped["Doctor"] = relationship(
        back_populates="conversations",
    )

    appointment: Mapped["Appointment | None"] = relationship(
        back_populates="conversations",
    )

    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation",
        cascade="all, delete-orphan",
    )

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "doctor_id": self.doctor_id,
            "appointment_id": self.appointment_id,
            "status": self.status,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            ),
            "closed_at": (
                self.closed_at.isoformat()
                if self.closed_at else None
            ),
        }


# Mensajes


class Message(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    conversation_id: Mapped[int] = mapped_column(
        ForeignKey("conversation.id"),
        nullable=False,
    )

    sender_user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    message_type: Mapped[str | None] = mapped_column(String(50))

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    conversation: Mapped["Conversation"] = relationship(
        back_populates="messages",
    )

    sender: Mapped["User"] = relationship(
        back_populates="sent_messages",
    )

    def serialize(self):
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "sender_user_id": self.sender_user_id,
            "content": self.content,
            "message_type": self.message_type,
            "is_read": self.is_read,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            ),
        }


# Registro de acceso al historial médico


class MedicalRecordAccessLog(db.Model):

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("doctor.id"),
        nullable=False,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patient.id"),
        nullable=False,
    )

    health_center_id: Mapped[int | None] = mapped_column(
        ForeignKey("health_center.id"),
        nullable=True,
    )

    action: Mapped[str | None] = mapped_column(String(100))
    reason: Mapped[str | None] = mapped_column(String(255))

    accessed_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    doctor: Mapped["Doctor"] = relationship(
        back_populates="access_logs",
    )

    patient: Mapped["Patient"] = relationship(
        back_populates="access_logs",
    )

    health_center: Mapped["HealthCenter | None"] = relationship(
        back_populates="access_logs",
    )

    def serialize(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "patient_id": self.patient_id,
            "health_center_id": self.health_center_id,
            "action": self.action,
            "reason": self.reason,
            "accessed_at": (
                self.accessed_at.isoformat()
                if self.accessed_at else None
            ),
        }
