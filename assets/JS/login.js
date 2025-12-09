const API_URL = "http://127.0.0.1:8000";

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login exitoso. Bienvenido " + data.usuario.nombre);

      // Guardar sesión
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      if (data.usuario.tipo === "Administrador") {
        window.location.href = "html/admin.html";
      } else if (data.usuario.tipo === "Usuario") {
        window.location.href = "html/pagina.html";
      } else {
        alert("Tipo de usuario no reconocido.");
      }
    } else {
      document.getElementById("loginMensaje").textContent = data.detail || "Error al iniciar sesión";
      document.getElementById("loginMensaje").style.color = "red";
    }
  } catch (error) {
    document.getElementById("loginMensaje").textContent = "Error de conexión con el servidor";
    document.getElementById("loginMensaje").style.color = "red";
    console.error(error);
  }
});

// Modal abrir/cerrar
document.getElementById("abrirModal").addEventListener("click", () => {
  document.getElementById("modalCrearCuenta").style.display = "flex";
});

document.getElementById("cerrarModal").addEventListener("click", () => {
  document.getElementById("modalCrearCuenta").style.display = "none";
});

// CREAR CUENTA
document.getElementById("crearCuentaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = {
    cedula: document.getElementById("cedulaNueva").value,
    nombre: document.getElementById("nombreNueva").value,
    correo: document.getElementById("correoNueva").value,
    contrasena: document.getElementById("contrasenaNueva").value,
    tipo: document.getElementById("tipoNueva").value,
  };

  try {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    const data = await res.json();

    document.getElementById("mensajeCrearCuenta").textContent = data.mensaje || "Cuenta creada";
    document.getElementById("mensajeCrearCuenta").style.color = "green";

    setTimeout(() => {
      document.getElementById("crearCuentaForm").reset();
      document.getElementById("modalCrearCuenta").style.display = "none";
      document.getElementById("mensajeCrearCuenta").textContent = "";
    }, 2000);
  } catch (error) {
    document.getElementById("mensajeCrearCuenta").textContent = "Error al crear cuenta";
    document.getElementById("mensajeCrearCuenta").style.color = "red";
    console.error(error);
  }
});

