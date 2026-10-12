"""Add resolution details to patient access reports.

Revision ID: c51a77d2e803
Revises: b37c9e21d04a
"""
from alembic import op
import sqlalchemy as sa


revision = "c51a77d2e803"
down_revision = "b37c9e21d04a"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "medical_record_access_report",
        sa.Column("resolution", sa.Text(), nullable=True),
    )


def downgrade():
    op.drop_column("medical_record_access_report", "resolution")
