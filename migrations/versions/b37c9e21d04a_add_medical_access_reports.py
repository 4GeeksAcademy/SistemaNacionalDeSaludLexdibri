"""Add patient reports for clinical record access.

Revision ID: b37c9e21d04a
Revises: 8a1d4c6f2b90
"""
from alembic import op
import sqlalchemy as sa


revision = "b37c9e21d04a"
down_revision = "8a1d4c6f2b90"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "medical_record_access_report",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("access_log_id", sa.Integer(), nullable=False),
        sa.Column("patient_id", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column(
            "status",
            sa.String(length=32),
            server_default="pending",
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["access_log_id"],
            ["medical_record_access_log.id"],
            ondelete="CASCADE",
            name="fk_medical_record_access_report_access_log",
        ),
        sa.ForeignKeyConstraint(
            ["patient_id"],
            ["patient.id"],
            ondelete="CASCADE",
            name="fk_medical_record_access_report_patient",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "access_log_id",
            name="uq_medical_record_access_report_access_log",
        ),
    )


def downgrade():
    op.drop_table("medical_record_access_report")
