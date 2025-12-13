from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="bd_proyecto"
    )


# ------------------- USUARIOS -------------------
@app.get("/usuarios")
def listar_usuarios():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario")
    usuarios = cursor.fetchall()
    cursor.close()
    db.close()
    return usuarios

@app.post("/usuarios")
async def crear_usuario(request: Request):
    data = await request.json()
    db = get_db()
    cursor = db.cursor()
    query = "INSERT INTO usuario (cedula, nombre, correo, contrasena, tipo) VALUES (%s, %s, %s, %s, %s)"
    valores = (
        data["cedula"], data["nombre"], data["correo"], data["contrasena"], data["tipo"]
    )
    cursor.execute(query, valores)
    db.commit()
    cursor.close()
    db.close()
    return {"mensaje": "Usuario creado correctamente"}

@app.delete("/usuarios/{cedula}")
def eliminar_usuario(cedula: str):
    db = get_db()
    cursor = db.cursor()
    query = "DELETE FROM usuario WHERE cedula = %s"
    cursor.execute(query, (cedula,))
    db.commit()
    cursor.close()
    db.close()
    return {"mensaje": "Usuario eliminado correctamente"}

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    correo = data.get("correo")
    contrasena = data.get("contrasena")

    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario WHERE correo = %s AND contrasena = %s", (correo, contrasena))
    usuario = cursor.fetchone()
    cursor.close()
    db.close()

    if usuario:
        return {"mensaje": "Login exitoso", "usuario": usuario}
    else:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

# ------------------- PRODUCTOS -------------------
@app.get("/productos")
def listar_productos():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM producto")
    productos = cursor.fetchall()
    cursor.close()
    db.close()
    return productos

@app.post("/productos")
async def crear_producto(request: Request):
    data = await request.json()
    db = get_db()
    cursor = db.cursor()
    query = "INSERT INTO producto (idproducto, nombre, precio, categoria) VALUES (%s, %s, %s, %s)"
    valores = (
        data["idproducto"], data["nombre"], data["precio"], data["categoria"]
    )
    cursor.execute(query, valores)
    db.commit()
    cursor.close()
    db.close()
    return {"mensaje": "Producto creado correctamente"}

@app.delete("/productos/{idproducto}")
def eliminar_producto(idproducto: str):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM producto WHERE idproducto = %s", (idproducto,))
    db.commit()
    cursor.close()
    db.close()
    return {"mensaje": "Producto eliminado correctamente"}

@app.get("/productos/categoria/{categoria}")
def obtener_productos_por_categoria(categoria: str):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM producto WHERE categoria = %s", (categoria,))
    productos = cursor.fetchall()
    cursor.close()
    db.close()
    return productos

@app.post("/agregar-al-carrito")
async def agregar_al_carrito(request: Request):
    datos = await request.json()
    cedula = datos.get("cedula")
    idproducto = datos.get("idproducto")
    cantidad = datos.get("cantidad", 1)

    db = get_db()
    cursor = db.cursor()

    # Buscar si ya existe una compra de hoy para ese usuario
    cursor.execute("""
        SELECT idcompra FROM compra 
        WHERE cedula = %s AND fecha = CURDATE()
    """, (cedula,))
    compra = cursor.fetchone()

    # Si no hay compra creada, la creamos
    if not compra:
        cursor.execute("INSERT INTO compra (cedula, fecha) VALUES (%s, CURDATE())", (cedula,))
        db.commit()
        idcompra = cursor.lastrowid
    else:
        idcompra = compra[0]

    # Verificar si el producto ya está en el carrito
    cursor.execute("""
        SELECT iddetalle FROM detallecompra 
        WHERE idcompra = %s AND idproducto = %s
    """, (idcompra, idproducto))
    detalle = cursor.fetchone()

    if detalle:
        # Si ya está, actualizamos la cantidad
        cursor.execute("""
            UPDATE detallecompra 
            SET cantidad = cantidad + %s 
            WHERE iddetalle = %s
        """, (cantidad, detalle[0]))
    else:
        # Si no está, lo insertamos
        cursor.execute("""
            INSERT INTO detallecompra (idcompra, idproducto, cantidad) 
            VALUES (%s, %s, %s)
        """, (idcompra, idproducto, cantidad))

    db.commit()
    cursor.close()
    db.close()
    return {"mensaje": "Producto agregado al carrito"}



@app.get("/ver-carrito/{cedula}")
def ver_carrito(cedula: str):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT d.iddetalle, p.nombre, p.precio, d.cantidad
        FROM compra c
        JOIN detallecompra d ON c.idcompra = d.idcompra
        JOIN producto p ON d.idproducto = p.idproducto
        WHERE c.cedula = %s AND c.fecha = CURDATE()
    """, (cedula,))
    productos = cursor.fetchall()

    cursor.close()
    db.close()
    return {"productos": productos}


@app.delete("/eliminar-detalle/{iddetalle}")
def eliminar_detalle(iddetalle: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM detallecompra WHERE iddetalle = %s", (iddetalle,))
    db.commit()
    cursor.close()
    db.close()
    return {"mensaje": "Producto eliminado del carrito"}


@app.post("/finalizar-compra/{cedula}")
def finalizar_compra(cedula: str):
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute("""
        DELETE FROM detallecompra 
        WHERE idcompra IN (
            SELECT idcompra FROM compra WHERE cedula = %s AND fecha = CURDATE()
        )
    """, (cedula,))
    db.commit()
    cursor.close()
    db.close()
    return {"mensaje": "Compra finalizada"}

