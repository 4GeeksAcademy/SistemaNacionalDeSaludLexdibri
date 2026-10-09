"""add Didit registration sessions and signed webhook tracking

Revision ID: d9e2a74c6b31
Revises:
Create Date: 2026-10-09 15:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = "d9e2a74c6b31"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "registration_dni",
        sa.Column("hospital_id", sa.Integer(), nullable=True),
    )
    op.execute(
        "UPDATE registration_dni SET hospital_id = 1 "
        "WHERE hospital_id IS NULL"
    )
    op.alter_column(
        "registration_dni",
        "hospital_id",
        existing_type=sa.Integer(),
        nullable=False,
    )
    op.create_foreign_key(
        "fk_registration_dni_hospital_id_hospital",
        "registration_dni",
        "hospital",
        ["hospital_id"],
        ["id"],
    )

    op.create_table(
        "registration_kyc",
        sa.Column("session_id", sa.String(length=64), nullable=False),
        sa.Column("vendor_data", sa.String(length=100), nullable=False),
        sa.Column("registration_dni_id", sa.Integer(), nullable=True),
        sa.Column("role", sa.String(length=20), nullable=True),
        sa.Column("email", sa.String(length=120), nullable=True),
        sa.Column("password_hash", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=30), nullable=True),
        sa.Column("medical_license", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column("didit_status", sa.String(length=50), nullable=True),
        sa.Column("identity_verified_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["registration_dni_id"],
            ["registration_dni.id"],
            name="fk_registration_kyc_registration_dni_id_registration_dni",
        ),
        sa.PrimaryKeyConstraint("session_id"),
        sa.UniqueConstraint("vendor_data"),
    )
    op.create_index(
        "ix_registration_kyc_expires_at",
        "registration_kyc",
        ["expires_at"],
    )

    op.create_table(
        "didit_webhook_event",
        sa.Column("event_id", sa.String(length=100), nullable=False),
        sa.Column("received_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("event_id"),
    )


def downgrade():
    op.drop_table("didit_webhook_event")
    op.drop_index(
        "ix_registration_kyc_expires_at",
        table_name="registration_kyc",
    )
    op.drop_table("registration_kyc")
    op.drop_constraint(
        "fk_registration_dni_hospital_id_hospital",
        "registration_dni",
        type_="foreignkey",
    )
    op.drop_column("registration_dni", "hospital_id")
