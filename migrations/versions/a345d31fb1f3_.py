
"""empty message

Revision ID: a345d31fb1f3
Revises: 04d1df59ddaf
Create Date: 2026-09-25 15:23:35.835768

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "a345d31fb1f3"
down_revision = "04d1df59ddaf"
branch_labels = None
depends_on = None


def upgrade():
    doctor_status = postgresql.ENUM(
        "ACTIVE",
        "VACATION",
        "TEMPORARY_LEAVE",
        "INACTIVE",
        name="doctorstatus",
    )

    # Crear primero el tipo ENUM en PostgreSQL
    doctor_status.create(
        op.get_bind(),
        checkfirst=True,
    )

    # Después crear la columna
    op.add_column(
        "doctor",
        sa.Column(
            "status",
            doctor_status,
            nullable=False,
            server_default="ACTIVE",
        ),
    )

    # Quitamos el valor por defecto después de rellenar
    # los médicos existentes
    op.alter_column(
        "doctor",
        "status",
        server_default=None,
    )


def downgrade():
    # Eliminar primero la columna
    op.drop_column(
        "doctor",
        "status",
    )

    # Después eliminar el ENUM
    doctor_status = postgresql.ENUM(
        "ACTIVE",
        "VACATION",
        "TEMPORARY_LEAVE",
        "INACTIVE",
        name="doctorstatus",
    )

    doctor_status.drop(
        op.get_bind(),
        checkfirst=True,
    )

