document.addEventListener("DOMContentLoaded", function () {
    // Función para calcular el promedio de un array de notas
    const calcularPromedio = (notas) =>
      notas.reduce((total, nota) => total + nota, 0) / notas.length;
  
    // Función para renderizar los usuarios en el DOM
    const renderizarUsuarios = (usuarios) => {
      const usuariosContainer = document.getElementById("usuarios");
      usuariosContainer.innerHTML = "";
  
      usuarios.forEach((usuario, index) => {
        // Crear un elemento de usuario
        const usuarioElement = document.createElement("div");
        usuarioElement.classList.add("usuario");
        usuarioElement.innerHTML = `
          <p>${usuario.nombre} ${usuario.apellido}</p>
          <p>Materia: ${usuario.materia}</p>
          <p>Notas: ${usuario.notas.join(", ")}</p>
          <p>Promedio: ${usuario.promedio}</p>
          <div class="botones">
            <button class="eliminar" data-index="${index}">Eliminar</button>
            <button class="editar" data-index="${index}">Editar</button>
          </div>
        `;
  
        // Agregar listeners para botones Eliminar y Editar
        usuarioElement.querySelector(".eliminar").addEventListener("click", () => {
          eliminarUsuario(index);
        });
  
        usuarioElement.querySelector(".editar").addEventListener("click", () => {
          editarUsuario(index);
        });
  
        usuariosContainer.appendChild(usuarioElement);
      });
    };
  
    // Función para mostrar el resultado en el DOM y guardar en Local Storage
    const mostrarResultado = (nombre, apellido, materia, notas, indexEditar) => {
      // Calcular promedio y determinar si aprobó o no
      const promedio = calcularPromedio(notas).toFixed(2);
      const aprobado = promedio >= 6 ? "Aprobado" : "Desaprobado";
  
      // Obtener datos almacenados o crear nuevo registro
      const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
  
      if (indexEditar !== undefined) {
        // Editar registro existente
        const usuarioEditado = almacenados[indexEditar];
        usuarioEditado.nombre = nombre;
        usuarioEditado.apellido = apellido;
        usuarioEditado.materia = materia;
        usuarioEditado.notas = notas;
        usuarioEditado.promedio = promedio;
        usuarioEditado.aprobado = aprobado;
      } else {
        // Agregar nuevo registro
        almacenados.push({
          nombre,
          apellido,
          materia,
          notas,
          promedio,
          aprobado,
        });
      }
  
      // Guardar en Local Storage y renderizar usuarios
      localStorage.setItem("alumnos", JSON.stringify(almacenados));
      renderizarUsuarios(almacenados);
    };
  
    // Función para editar un usuario existente
    const editarUsuario = (index) => {
      // Obtener datos almacenados y usuario a editar
      const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
      const usuarioEditado = almacenados[index];
  
      // Llenar campos del formulario con datos del usuario
      document.getElementById("nombre").value = usuarioEditado.nombre;
      document.getElementById("apellido").value = usuarioEditado.apellido;
      document.getElementById("materia").value = usuarioEditado.materia;
      document.getElementById("parcial1").value = usuarioEditado.notas[0];
      document.getElementById("parcial2").value = usuarioEditado.notas[1];
      document.getElementById("parcial3").value = usuarioEditado.notas[2];
  
      // Eliminar usuario actual y reemplazar listener de botón Calcular
      eliminarUsuario(index);
      document.getElementById("calcular").removeEventListener("click", calcularListener);
      document.getElementById("calcular").addEventListener("click", () => {
        // Obtener valores del formulario y validar notas
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const materia = document.getElementById("materia").value;
        const parcial1 = validarNota(Number(document.getElementById("parcial1").value));
        const parcial2 = validarNota(Number(document.getElementById("parcial2").value));
        const parcial3 = validarNota(Number(document.getElementById("parcial3").value));
  
        const notas = [parcial1, parcial2, parcial3];
  
        // Mostrar resultado y reemplazar datos en Local Storage
        mostrarResultado(nombre, apellido, materia, notas, index);
      });
    };
  
    // Función para eliminar un usuario
    const eliminarUsuario = (index) => {
      const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
      almacenados.splice(index, 1);
      localStorage.setItem("alumnos", JSON.stringify(almacenados));
      renderizarUsuarios(almacenados);
    };
  
    // Función para cargar datos almacenados al cargar la página
    const cargarDatosAlmacenados = () => {
      const almacenados = JSON.parse(localStorage.getItem("alumnos")) || [];
      renderizarUsuarios(almacenados);
    };
  
    // Función para validar una nota y limitarla entre 0 y 10
    const validarNota = (nota) => {
      const maxNota = 10;
      return Math.min(Math.max(nota, 0), maxNota);
    };
  
    // Cargar datos almacenados y agregar listener al botón Calcular
    cargarDatosAlmacenados();
    document.getElementById("calcular").addEventListener("click", () => {
      // Obtener valores del formulario y validar notas
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const materia = document.getElementById("materia").value;
      const parcial1 = validarNota(Number(document.getElementById("parcial1").value));
      const parcial2 = validarNota(Number(document.getElementById("parcial2").value));
      const parcial3 = validarNota(Number(document.getElementById("parcial3").value));
  
      const notas = [parcial1, parcial2, parcial3];
  
      // Mostrar resultado y guardar en Local Storage
      mostrarResultado(nombre, apellido, materia, notas);
    });
  });
  