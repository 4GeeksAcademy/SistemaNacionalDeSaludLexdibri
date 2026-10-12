"""Add persistent patient privacy preferences.

Revision ID: 8a1d4c6f2b90
Revises: f21a8c4d7e90
"""
from alembic import op
import sqlalchemy as sa


revision = "8a1d4c6f2b90"
down_revision = "f21a8c4d7e90"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "patient_privacy_setting",
        sa.Column("patient_id", sa.Integer(), nullable=False),
        sa.Column(
            "access_scope",
            sa.String(length=32),
            server_default="national",
            nullable=False,
        ),
        sa.Column(
            "restrict_sensitive_records",
            sa.Boolean(),
            server_default=sa.false(),
            nullable=False,
        ),
        sa.Column(
            "notify_accesses",
            sa.Boolean(),
            server_default=sa.false(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["patient_id"],
            ["patient.id"],
            ondelete="CASCADE",
            name="fk_patient_privacy_setting_patient_id_patient",
        ),
        sa.PrimaryKeyConstraint("patient_id"),
    )


def downgrade():
    op.drop_table("patient_privacy_setting")
