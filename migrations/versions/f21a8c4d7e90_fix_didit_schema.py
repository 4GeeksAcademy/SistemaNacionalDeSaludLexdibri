"""Transition after existing Didit schema fix.

Revision ID: f21a8c4d7e90
Revises: d9e2a74c6b31
"""

from alembic import op

revision = "f21a8c4d7e90"
down_revision = "d9e2a74c6b31"
branch_labels = None
depends_on = None


def upgrade():
    # Las columnas y la tabla de Didit ya existen en la base de datos.
    # No se realizan cambios para evitar duplicar objetos.
    pass


def downgrade():
    # No eliminar columnas ni tablas que pueden contener datos.
    pass
