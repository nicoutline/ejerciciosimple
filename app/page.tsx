"use client";

import { useState, useEffect } from "react";
import { Button, Input, Paper, Text, Title } from "@mantine/core";

export default function Home() {
  // Estado para "Crear Empleado"
  const [nombreCrear, setNombreCrear] = useState("");
  const [emailCrear, setEmailCrear] = useState("");

  // Estado para "Actualizar Empleado"
  const [nombreActualizar, setNombreActualizar] = useState("");
  const [emailActualizar, setEmailActualizar] = useState("");
  const [idEmpleado, setIdEmpleado] = useState<number | null>(null); // ID seleccionado para actualizar/eliminar

  // Estado para empleados
  const [empleados, setEmpleados] = useState<any[]>([]);

  // Crear un nuevo empleado
  const crearEmpleado = async () => {
    try {
      const res = await fetch("/api/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombreCrear, email: emailCrear }),
      });
      const data = await res.json();
      alert(data.message);
      buscarEmpleados(); // Actualiza la lista de empleados después de la creación
      setNombreCrear(""); // Limpia los campos del formulario
      setEmailCrear("");
    } catch (error) {
      console.error("Error creando empleado", error);
    }
  };

  // Buscar todos los empleados
  const buscarEmpleados = async () => {
    try {
      const res = await fetch("/api/empleados");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmpleados(data);
      } else {
        console.error("Error: Datos no son un array");
        setEmpleados([]);
      }
    } catch (error) {
      console.error("Error buscando empleados", error);
    }
  };

  // Actualizar un empleado
  const actualizarEmpleado = async () => {
    if (!idEmpleado) {
      alert("Por favor, selecciona un empleado para actualizar.");
      return;
    }
    try {
      const res = await fetch("/api/empleados", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: idEmpleado,
          nombre: nombreActualizar,
          email: emailActualizar,
        }),
      });
      const data = await res.json();
      alert(data.message);
      buscarEmpleados(); // Actualiza la lista después de la actualización
      setIdEmpleado(null); // Limpia la selección
      setNombreActualizar("");
      setEmailActualizar("");
    } catch (error) {
      console.error("Error actualizando empleado", error);
    }
  };

  // Eliminar un empleado
  const eliminarEmpleado = async () => {
    if (!idEmpleado) {
      alert("Por favor, selecciona un empleado para eliminar.");
      return;
    }
    try {
      const res = await fetch("/api/empleados", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: idEmpleado }),
      });
      const data = await res.json();
      alert(data.message);
      buscarEmpleados(); // Actualiza la lista después de eliminar
      setIdEmpleado(null);
    } catch (error) {
      console.error("Error eliminando empleado", error);
    }
  };

  // Al montar el componente, cargamos los empleados
  useEffect(() => {
    buscarEmpleados();
  }, []);

  // Seleccionar empleado de la lista para actualizar o eliminar
  const seleccionarEmpleado = (empleado: any) => {
    setIdEmpleado(empleado.id);
    setNombreActualizar(empleado.nombre);
    setEmailActualizar(empleado.email);
  };

  return (
    <div style={{ display: "flex", p: "20px" }}>
      {/* Columna izquierda: Crear, Actualizar, Eliminar */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <Title order={2} style={{ marginBottom: "20px" }}>
          Gestión de Empleados
        </Title>

        {/* Crear Empleado */}
        <Paper shadow="md" withBorder p="md" style={{ marginBottom: "20px" }}>
          <Title order={3}>Crear Empleado</Title>
          <Input
            placeholder="Nombre"
            value={nombreCrear}
            onChange={(event) => setNombreCrear(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="Email"
            value={emailCrear}
            onChange={(event) => setEmailCrear(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button onClick={crearEmpleado}>Crear Empleado</Button>
        </Paper>

        {/* Actualizar Empleado */}
        <Paper shadow="md" withBorder p="md" style={{ marginBottom: "20px" }}>
          <Title order={3}>Actualizar Empleado</Title>
          <Input
            placeholder="Nombre"
            value={nombreActualizar}
            onChange={(event) => setNombreActualizar(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="Email"
            value={emailActualizar}
            onChange={(event) => setEmailActualizar(event.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button onClick={actualizarEmpleado}>Actualizar Empleado</Button>
        </Paper>

        {/* Eliminar Empleado */}
        <Paper shadow="md" withBorder p="md" style={{ marginBottom: "20px" }}>
          <Title order={3}>Eliminar Empleado</Title>
          <Button onClick={eliminarEmpleado}>
            Eliminar Empleado Seleccionado
          </Button>
        </Paper>
      </div>

      {/* Columna derecha: Lista de Empleados */}
      <div style={{ flex: 1 }}>
        <Title  order={2} style={{ marginBottom: "20px" }}>Lista de Empleados</Title>
        <Paper shadow="md" withBorder p="md">
          <Button onClick={buscarEmpleados} style={{ marginBottom: "10px" }}>
            Actualizar Lista de Empleados
          </Button>
          {empleados.length > 0 ? (
            empleados.map((empleado: any) => (
              <Text
                key={empleado.id}
                onClick={() => seleccionarEmpleado(empleado)}
                style={{
                  cursor: "pointer",
                  margin: "5px 0",
                  p: "5px",
                  borderRadius: "5px",
                  backgroundColor:
                    empleado.id === idEmpleado ? "#f0f0f0" : "transparent", // Marca el empleado seleccionado
                  border:
                    empleado.id === idEmpleado ? "2px solid #007bff" : "none", // Resalta con un borde
                }}
              >
                {empleado.nombre} - {empleado.email}
              </Text>
            ))
          ) : (
            <p>No hay empleados</p>
          )}
        </Paper>
      </div>
    </div>
  );
}
