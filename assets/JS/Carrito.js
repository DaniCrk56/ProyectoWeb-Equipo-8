document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    alert("Debes iniciar sesión para ver el carrito.");
    window.location.href = "../index.html";
    return;
  }

  const carritoBody = document.getElementById("carrito-body");
  const totalGeneralSpan = document.getElementById("total-general");
  const finalizarBtn = document.getElementById("finalizar-compra");

  // 1) Cargar los ítems del carrito
  fetch(`http://localhost:8000/ver-carrito/${usuario.cedula}`)
    .then(res => res.json())
    .then(data => {
      const productos = data.productos;            // {"productos": [...]}
      let totalGeneral = 0;
      carritoBody.innerHTML = "";

      productos.forEach(item => {
        const subtotal = parseFloat(item.precio) * item.cantidad;
        totalGeneral += subtotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.nombre}</td>
          <td>$${parseFloat(item.precio).toFixed(2)}</td>
          <td>${item.cantidad}</td>
          <td>$${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-danger btn-sm eliminar" data-id="${item.iddetalle}">
              🗑️
            </button>
          </td>
        `;
        carritoBody.appendChild(tr);
      });

      totalGeneralSpan.textContent = `$${totalGeneral.toFixed(2)}`;
    })
    .catch(err => {
      console.error("Error al cargar el carrito:", err);
      alert("No se pudieron cargar los productos del carrito.");
    });

  // 2) Eliminar un ítem del carrito
  carritoBody.addEventListener("click", e => {
    if (!e.target.classList.contains("eliminar")) return;
    const iddetalle = e.target.getAttribute("data-id");
    if (!confirm("¿Eliminar este producto del carrito?")) return;

    fetch(`http://localhost:8000/eliminar-detalle/${iddetalle}`, {
      method: "DELETE"
    })
    .then(res => {
      if (res.ok) {
        e.target.closest("tr").remove();
        // recarga para actualizar totales
        setTimeout(() => location.reload(), 200);
      } else {
        alert("No se pudo eliminar el producto.");
      }
    })
    .catch(err => {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el producto.");
    });
  });

  // 3) Finalizar compra (borra todos los detalles del día)
  finalizarBtn.addEventListener("click", () => {
    if (!confirm("¿Deseas finalizar tu compra?")) return;

    fetch(`http://localhost:8000/finalizar-compra/${usuario.cedula}`, {
      method: "POST"
    })
    .then(res => {
      if (res.ok) {
        alert("Compra finalizada con éxito.");
        window.location.href = "productos.html";
      } else {
        alert("No se pudo finalizar la compra.");
      }
    })
    .catch(err => {
      console.error("Error al finalizar:", err);
      alert("Error al finalizar la compra.");
    });
  });
});
