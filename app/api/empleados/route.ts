import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Configura la conexión a MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'empleados',
  port: 3306,
});

// Manejo de métodos POST, GET, PUT y DELETE
export async function POST(req: NextRequest) {
  try {
    const { nombre, email } = await req.json();
    await db.query('INSERT INTO empleados (nombre, email) VALUES (?, ?)', [
      nombre,
      email,
    ]);
    return NextResponse.json({ message: 'Empleado creado exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creando empleado' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM empleados');
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error obteniendo empleados' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, nombre, email } = await req.json();
    await db.query('UPDATE empleados SET nombre = ?, email = ? WHERE id = ?', [
      nombre,
      email,
      id,
    ]);
    return NextResponse.json({ message: 'Empleado actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error actualizando empleado' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.query('DELETE FROM empleados WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error eliminando empleado' }, { status: 500 });
  }
}
