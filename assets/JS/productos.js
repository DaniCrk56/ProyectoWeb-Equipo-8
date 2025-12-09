 // Registrar producto
  document.getElementById("presionar").addEventListener("click", () => {
    const producto = {
      idproducto: document.getElementById("idproducto").value,
      nombre: document.getElementById("nombre").value,
      precio: parseFloat(document.getElementById("precio").value),
      categoria: document.getElementById("categoria").value
    };

    fetch("http://localhost:8000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      listarProductos();
    });
  });

  // Listar productos
  function listarProductos() {
    fetch("http://localhost:8000/productos")
      .then(res => res.json())
      .then(productos => {
        const tbody = document.getElementById("productTableBody");
        tbody.innerHTML = "";
        productos.forEach(p => {
          const row = `
            <tr>
              <td>${p.idproducto}</td>
              <td>${p.nombre}</td>
              <td>$${p.precio.toFixed(2)}</td>
              <td>${p.categoria}</td>
              <td class="text-center">
                <button onclick="eliminarProducto('${p.idproducto}')" class="btn btn-danger btn-sm">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>`;
          tbody.innerHTML += row;
        });
      });
  }

  // Inicial
  listarProductos();


// Eliminar producto
function eliminarProducto(idproducto) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    fetch(`http://localhost:8000/productos/${idproducto}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      location.reload();
    });
  }
}
