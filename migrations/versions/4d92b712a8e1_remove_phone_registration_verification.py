"""remove phone registration verification

Revision ID: 4d92b712a8e1
Revises: 7a4e2f91c6d3
Create Date: 2026-10-08 19:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4d92b712a8e1"
down_revision = "7a4e2f91c6d3"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_table("phone_verification")


def downgrade():
    op.create_table(
        "phone_verification",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("phone", sa.String(length=16), nullable=False),
        sa.Column("code_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "registration_token_hash",
            sa.String(length=255),
            nullable=True,
        ),
        sa.Column("request_ip", sa.String(length=45), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("sent", sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column("attempts", sa.Integer(), server_default="0", nullable=False),
        sa.Column("verified_at", sa.DateTime(), nullable=True),
        sa.Column("consumed_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_phone_verification_phone",
        "phone_verification",
        ["phone"],
    )
    op.create_index(
        "ix_phone_verification_created_at",
        "phone_verification",
        ["created_at"],
    )
    op.create_index(
        "ix_phone_verification_request_ip",
        "phone_verification",
        ["request_ip"],
    )
