"""create colegiado registration table

Revision ID: 9c415ac371b2
Revises: 83d5631a08ad
Create Date: 2026-10-07 21:25:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9c415ac371b2"
down_revision = "83d5631a08ad"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "colegiado_registration",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("medical_license", sa.String(length=100), nullable=False),
        sa.Column("specialty_id", sa.Integer(), nullable=False),
        sa.Column("years_since_license", sa.Integer(), nullable=False),
        sa.Column(
            "is_registered",
            sa.Boolean(),
            server_default=sa.false(),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["specialty_id"],
            ["specialty.id"],
            name="fk_colegiado_registration_specialty_id_specialty",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("medical_license"),
    )


def downgrade():
    op.drop_table("colegiado_registration")
