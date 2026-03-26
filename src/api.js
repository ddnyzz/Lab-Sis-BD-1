const express = require("express");
const { openDb } = require("./db");

function apiRouter() {
  const router = express.Router();

  // ========================= AUTORES =========================

  router.get("/autores", async (req, res) => {
    try {
      const db = await openDb();
      const q = req.query.q ? `%${req.query.q}%` : "%";
      const [rows] = await db.execute(
        "SELECT * FROM autor WHERE Nombre LIKE ? OR Nacionalidad LIKE ? ORDER BY ID",
        [q, q]
      );
      res.json({ data: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener autores" });
    }
  });

  router.post("/autores", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre, Nacionalidad, biografia, email } = req.body;
      if (!Nombre) return res.status(400).json({ error: "Nombre es obligatorio" });
      await db.execute(
        "INSERT INTO autor (Nombre, Nacionalidad, biografia, email) VALUES (?, ?, ?, ?)",
        [Nombre, Nacionalidad || null, biografia || null, email || null]
      );
      res.json({ mensaje: "Autor creado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear autor" });
    }
  });

  router.put("/autores/:id", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre, Nacionalidad, biografia, email } = req.body;
      await db.execute(
        "UPDATE autor SET Nombre=?, Nacionalidad=?, biografia=?, email=? WHERE ID=?",
        [Nombre, Nacionalidad || null, biografia || null, email || null, req.params.id]
      );
      res.json({ mensaje: "Autor actualizado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar autor" });
    }
  });

  router.delete("/autores/:id", async (req, res) => {
    try {
      const db = await openDb();
      await db.execute("DELETE FROM autor WHERE ID=?", [req.params.id]);
      res.json({ mensaje: "Autor eliminado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar autor" });
    }
  });

  // ========================= LIBROS =========================

  router.get("/libros", async (req, res) => {
    try {
      const db = await openDb();
      const q = req.query.q ? `%${req.query.q}%` : "%";
      const [rows] = await db.execute(
        "SELECT * FROM libro WHERE Nombre_libro LIKE ? OR Genero LIKE ? ORDER BY ID",
        [q, q]
      );
      res.json({ data: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener libros" });
    }
  });

  router.post("/libros", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre_libro, Genero, fecha_publicacion } = req.body;
      if (!Nombre_libro) return res.status(400).json({ error: "Nombre_libro es obligatorio" });
      await db.execute(
        "INSERT INTO libro (Nombre_libro, Genero, fecha_publicacion) VALUES (?, ?, ?)",
        [Nombre_libro, Genero || null, fecha_publicacion || null]
      );
      res.json({ mensaje: "Libro creado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear libro" });
    }
  });

  router.put("/libros/:id", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre_libro, Genero, fecha_publicacion } = req.body;
      await db.execute(
        "UPDATE libro SET Nombre_libro=?, Genero=?, fecha_publicacion=? WHERE ID=?",
        [Nombre_libro, Genero || null, fecha_publicacion || null, req.params.id]
      );
      res.json({ mensaje: "Libro actualizado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar libro" });
    }
  });

  router.delete("/libros/:id", async (req, res) => {
    try {
      const db = await openDb();
      await db.execute("DELETE FROM libro WHERE ID=?", [req.params.id]);
      res.json({ mensaje: "Libro eliminado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar libro" });
    }
  });

  // ========================= EDITORIALES =========================

  router.get("/editoriales", async (req, res) => {
    try {
      const db = await openDb();
      const q = req.query.q ? `%${req.query.q}%` : "%";
      const [rows] = await db.execute(
        "SELECT * FROM editorial WHERE Nombre_Editorial LIKE ? ORDER BY ID",
        [q]
      );
      res.json({ data: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener editoriales" });
    }
  });

  router.post("/editoriales", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre_Editorial, Direccion, fecha_publicacion_edit } = req.body;
      if (!Nombre_Editorial) return res.status(400).json({ error: "Nombre_Editorial es obligatorio" });
      await db.execute(
        "INSERT INTO editorial (Nombre_Editorial, Direccion, fecha_publicacion_edit) VALUES (?, ?, ?)",
        [Nombre_Editorial, Direccion || null, fecha_publicacion_edit || null]
      );
      res.json({ mensaje: "Editorial creada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear editorial" });
    }
  });

  router.put("/editoriales/:id", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre_Editorial, Direccion, fecha_publicacion_edit } = req.body;
      await db.execute(
        "UPDATE editorial SET Nombre_Editorial=?, Direccion=?, fecha_publicacion_edit=? WHERE ID=?",
        [Nombre_Editorial, Direccion || null, fecha_publicacion_edit || null, req.params.id]
      );
      res.json({ mensaje: "Editorial actualizada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar editorial" });
    }
  });

  router.delete("/editoriales/:id", async (req, res) => {
    try {
      const db = await openDb();
      await db.execute("DELETE FROM editorial WHERE ID=?", [req.params.id]);
      res.json({ mensaje: "Editorial eliminada" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar editorial" });
    }
  });

  // ========================= USUARIOS =========================

  router.get("/usuarios", async (req, res) => {
    try {
      const db = await openDb();
      const q = req.query.q ? `%${req.query.q}%` : "%";
      const [rows] = await db.execute(
        "SELECT * FROM usuario WHERE Nombre_usario LIKE ? OR Telefono LIKE ? ORDER BY ID",
        [q, q]
      );
      res.json({ data: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  });

  router.post("/usuarios", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre_usario, Direcion, Telefono } = req.body;
      if (!Nombre_usario) return res.status(400).json({ error: "Nombre_usario es obligatorio" });
      await db.execute(
        "INSERT INTO usuario (Nombre_usario, Direcion, Telefono) VALUES (?, ?, ?)",
        [Nombre_usario, Direcion || null, Telefono || null]
      );
      res.json({ mensaje: "Usuario creado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear usuario" });
    }
  });

  router.put("/usuarios/:id", async (req, res) => {
    try {
      const db = await openDb();
      const { Nombre_usario, Direcion, Telefono } = req.body;
      await db.execute(
        "UPDATE usuario SET Nombre_usario=?, Direcion=?, Telefono=? WHERE ID=?",
        [Nombre_usario, Direcion || null, Telefono || null, req.params.id]
      );
      res.json({ mensaje: "Usuario actualizado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  });

  router.delete("/usuarios/:id", async (req, res) => {
    try {
      const db = await openDb();
      await db.execute("DELETE FROM usuario WHERE ID=?", [req.params.id]);
      res.json({ mensaje: "Usuario eliminado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  });

  return router;
}

module.exports = { apiRouter };