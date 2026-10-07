"""add hospital to colegiado registration

Revision ID: b68e024f1c37
Revises: 9c415ac371b2
Create Date: 2026-10-07 21:28:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b68e024f1c37"
down_revision = "9c415ac371b2"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "colegiado_registration",
        sa.Column(
            "hospital_id",
            sa.Integer(),
            server_default="1",
            nullable=False,
        ),
    )
    op.create_foreign_key(
        "fk_colegiado_registration_hospital_id_hospital",
        "colegiado_registration",
        "hospital",
        ["hospital_id"],
        ["id"],
    )


def downgrade():
    op.drop_constraint(
        "fk_colegiado_registration_hospital_id_hospital",
        "colegiado_registration",
        type_="foreignkey",
    )
    op.drop_column("colegiado_registration", "hospital_id")
