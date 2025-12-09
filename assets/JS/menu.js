
// menu.js — Reemplaza los botones por un menú responsive con dropdown
// Requiere Bootstrap 5 (bundle JS) cargado en la página.



document.addEventListener("DOMContentLoaded", () => {
  const existingHeader = document.querySelector("header");
  const header = existingHeader || document.createElement("header");
  header.className = "bg-success text-white py-2 mb-4"; // usa tu gradiente aplicado a header.bg-success

  const navbarHTML = `
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand fw-bold" href="pagina.html">NutriSalud</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="pagina.html">Inicio</a>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="productosDropdown" role="button"
                 data-bs-toggle="dropdown" aria-expanded="false">
                Productos
              </a>
              <ul class="dropdown-menu" aria-labelledby="productosDropdown">
                <li><a class="dropdown-item" href="productos.html">Todas las categorías</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="Limpieza.html">Limpieza y Detox</a></li>
                <li><a class="dropdown-item" href="ControlPeso.html">Control de Peso</a></li>
                <li><a class="dropdown-item" href="Inmunologica.html">Sistema Inmunológico</a></li>
                <li><a class="dropdown-item" href="AntiAge.html">Antiage</a></li>
                <li><a class="dropdown-item" href="Revitaliza.html">Revitaliza</a></li>
                <li><a class="dropdown-item" href="Nutricion.html">Nutrición (Nutre y Regenera)</a></li>
                <li><a class="dropdown-item" href="UrgorMental.html">Vigor Mental</a></li>
                <li><a class="dropdown-item" href="Sport.html">Sport</a></li>
              </ul>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="nosotros.html">Nosotros</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="contactanos.html">Contáctanos</a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-2">
            <span class="small d-none d-md-inline">Bienvenido, <strong id="nombreUsuario"></strong></span>
            <a class="btn btn-outline-light" href="carrito.html">🛒 Carrito</a>
            <button class="btn btn-danger" id="cerrar_sesion">Cerrar Sesión</button>
          </div>
        </div>
      </nav>
    </div>
  `;

  header.innerHTML = navbarHTML;

  if (!existingHeader) {
    // si no había header, lo insertamos al inicio
    document.body.prepend(header);
  }

  // Completar nombre del usuario si existe
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    if (usuario && usuario.nombre) {
      const nombreSpot = header.querySelector("#nombreUsuario");
      if (nombreSpot) nombreSpot.textContent = usuario.nombre;
    }
  } catch (e) { /* no-op */ }

  // Cerrar sesión
  const btnSalir = header.querySelector("#cerrar_sesion");
  if (btnSalir) {
    btnSalir.addEventListener("click", () => {
      try { localStorage.removeItem("usuario"); } catch (e) {}
      window.location.href = "../index.html";
    });
  }
});
