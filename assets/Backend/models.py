from sqlalchemy import Column, String, Enum
from database import Base

class Usuario(Base):
    __tablename__ = "usuario"

    cedula = Column(String(15), primary_key=True, index=True)
    nombre = Column(String(100))
    correo = Column(String(100))
    contrasena = Column(String(100))
    barrio = Column(String(100))
    direccion = Column(String(150))
    codigo_postal = Column(String(10))
    tipo = Column(Enum("Administrador", "Usuario"))
