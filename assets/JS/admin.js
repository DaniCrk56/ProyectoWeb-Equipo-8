const API_URL = "http://127.0.0.1:8000";

// Obtener todos los usuarios
const fetchUsuarios = async () => {
  const res = await fetch(`${API_URL}/usuarios`);
  return await res.json();
};

// Crear un nuevo usuario
const crearUsuario = async (usuario) => {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return await res.json();
};

// Eliminar usuario por cédula
const eliminarUsuario = async (cedula) => {
  await fetch(`${API_URL}/usuarios/${cedula}`, {
    method: "DELETE",
  });
};

// Renderizar tabla de usuarios
const renderTable = async () => {
  const usuarios = await fetchUsuarios();
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";
  usuarios.forEach(usuario => {
    tbody.innerHTML += `
      <tr>
        <td>${usuario.cedula}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.contrasena}</td>
        <td>${usuario.tipo}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminar('${usuario.cedula}')">Eliminar</button>
        </td>
      </tr>
    `;
  });
};

// Eliminar usuario con confirmación
window.eliminar = async (cedula) => {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    await eliminarUsuario(cedula);
    renderTable();
  }
};

// Enviar formulario
document.getElementById("presionar").addEventListener("click", async () => {
  const usuario = {
    cedula: document.getElementById("cedula").value,
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    contrasena: document.getElementById("contrasena").value,
    tipo: document.getElementById("tipo").value
  };
  await crearUsuario(usuario);
  document.getElementById("userForm").reset();
  renderTable();
});

document.addEventListener("DOMContentLoaded", renderTable);

document.getElementById("cerrarSesion").addEventListener("click", () => {
  // Si usas localStorage/sessionStorage, puedes limpiar aquí:
  // localStorage.clear(); 
  // sessionStorage.clear();

  // Redirigir a login
  window.location.href = "index.html";
});
