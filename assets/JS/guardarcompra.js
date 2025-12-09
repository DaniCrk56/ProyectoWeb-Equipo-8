async function agregarAlCarrito(idproducto) {
  try {
    // Obtenemos la cédula del usuario ya validado en localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) throw "Usuario no logueado";
    const cedula = usuario.cedula;

    // Llamada correcta al endpoint POST /agregar-al-carrito
    const res = await fetch("http://127.0.0.1:8000/agregar-al-carrito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cedula: cedula,
        idproducto: idproducto,
        cantidad: 1
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw err.detail || JSON.stringify(err);
    }

    const data = await res.json();
    alert(data.mensaje || "Producto agregado al carrito");
  } catch (e) {
    console.error("Error agregando al carrito:", e);
    alert("No se pudo agregar el producto. Revisa la consola para más detalles.");
  }
}
