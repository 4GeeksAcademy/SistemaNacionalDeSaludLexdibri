"""empty message

Revision ID: 261cca3a05d5
Revises: a345d31fb1f3
Create Date: 2026-09-25 16:25:58.953266

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '261cca3a05d5'
down_revision = 'a345d31fb1f3'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('registration_dni',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('dni', sa.String(length=20), nullable=False),
    sa.Column('first_name', sa.String(length=100), nullable=False),
    sa.Column('last_name', sa.String(length=150), nullable=False),
    sa.Column('date_of_birth', sa.Date(), nullable=True),
    sa.Column('sex', sa.String(length=20), nullable=True),
    sa.Column('cip', sa.String(length=50), nullable=True),
    sa.Column(
        'role',
        postgresql.ENUM('PATIENT', 'DOCTOR', 'ADMIN', name='userrole', create_type=False),
        nullable=False
    ),
    sa.Column('is_registered', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('cip'),
    sa.UniqueConstraint('dni')
    )


def downgrade():
    op.drop_table('registration_dni')