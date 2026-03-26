const $ = (s) => document.querySelector(s);

const state = { view: "libros", q: "" };

const api = {
  async get(path) {
    const r = await fetch(path);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.message || "Error del servidor");
    return j;
  },
  async send(path, method, body) {
    const r = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.message || "Error del servidor");
    return j;
  }
};

function toast(msg, isError = false) {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show" + (isError ? " error" : "");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  });
  children.forEach((c) =>
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c)
  );
  return el;
}

function table(headers, rows) {
  if (!rows.length) return h("div", { class: "empty" }, ["Sin registros."]);
  const thead = h("thead", {}, [h("tr", {}, headers.map((x) => h("th", {}, [x])))]);
  const tbody = h("tbody", {}, rows.map((r) => h("tr", {}, r.map((c) => h("td", {}, [c])))));
  return h("table", { class: "table" }, [thead, tbody]);
}

function field(label, name, value = "", full = false) {
  const input = h("input", { class: "input", name, value: String(value ?? "") });
  return h("div", { class: "field" + (full ? " full" : "") }, [
    h("div", { class: "label" }, [label]),
    input
  ]);
}

function dateField(label, name, value = "", full = false) {
  const input = h("input", { class: "input", type: "date", name, value: String(value ?? "").slice(0, 10) });
  return h("div", { class: "field" + (full ? " full" : "") }, [
    h("div", { class: "label" }, [label]),
    input
  ]);
}

function readForm(root) {
  const obj = {};
  root.querySelectorAll("input[name], select[name], textarea[name]").forEach((i) => {
    obj[i.name] = i.value.trim();
  });
  return obj;
}

function openModal(title, subtitle, bodyEl, footerEls) {
  $("#modalTitle").textContent = title;
  $("#modalSubtitle").textContent = subtitle || "";
  const body = $("#modalBody");
  const foot = $("#modalFooter");
  body.innerHTML = "";
  foot.innerHTML = "";
  body.appendChild(bodyEl);
  (footerEls || []).forEach((x) => foot.appendChild(x));
  $("#modal").classList.add("show");
}

function closeModal() {
  $("#modal").classList.remove("show");
}

$("#modalClose").addEventListener("click", closeModal);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

document.querySelectorAll(".chip").forEach((b) => {
  b.addEventListener("click", () => {
    state.view = b.dataset.view;
    $("#search").value = "";
    state.q = "";
    setActiveNav();
    render();
  });
});

function setActiveNav() {
  document.querySelectorAll(".chip").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === state.view)
  );
}

$("#search").addEventListener("input", (e) => { state.q = e.target.value.trim(); });
$("#refresh").addEventListener("click", () => render());
$("#newBtn").addEventListener("click", () => onNew());

const viewMeta = {
  libros:      ["Libros",      "Gestión del catálogo de libros"],
  autores:     ["Autores",     "Gestión de autores"],
  editoriales: ["Editoriales", "Gestión de editoriales"],
  usuarios:    ["Usuarios",    "Gestión de usuarios"]
};

async function render() {
  setActiveNav();
  const [title, hint] = viewMeta[state.view] || ["", ""];
  $("#viewTitle").textContent = title;
  $("#viewHint").textContent = hint;
  $("#content").innerHTML = "<div class='loading'>Cargando...</div>";
  try {
    if (state.view === "libros")      return await renderLibros();
    if (state.view === "autores")     return await renderAutores();
    if (state.view === "editoriales") return await renderEditoriales();
    if (state.view === "usuarios")    return await renderUsuarios();
  } catch (e) {
    $("#content").innerHTML = "";
    $("#content").appendChild(h("div", { class: "error-box" }, ["⚠ " + e.message]));
  }
}

// ========================= LIBROS =========================
async function renderLibros() {
  const { data } = await api.get(`/api/libros?q=${encodeURIComponent(state.q)}`);
  const rows = data.map((x) => [
    String(x.ID),
    x.Nombre_libro || "—",
    x.Genero || "—",
    x.fecha_publicacion ? String(x.fecha_publicacion).slice(0, 10) : "—",
    h("div", { class: "actions" }, [
      h("button", { class: "btn", onClick: () => editLibro(x) }, ["Editar"]),
      h("button", { class: "btn danger", onClick: () => delLibro(x.ID) }, ["Eliminar"])
    ])
  ]);
  $("#content").innerHTML = "";
  $("#content").appendChild(table(["ID", "Nombre", "Género", "Fecha publicación", "Acciones"], rows));
}

async function newLibro() {
  const { data } = await api.get("/api/libros?q=");
  const nextId = data.length ? Math.max(...data.map((x) => x.ID)) + 1 : 1;
  const form = h("div", { class: "form" }, [
    field("ID", "ID", nextId),
    field("Nombre del libro", "Nombre_libro", ""),
    field("Género", "Genero", ""),
    dateField("Fecha publicación", "fecha_publicacion", "")
  ]);
  const save = async () => {
    const p = readForm(form);
    if (!p.ID || !p.Nombre_libro) return toast("ID y Nombre son obligatorios", true);
    await api.send("/api/libros", "POST", p);
    toast("Libro creado ✓"); closeModal(); render();
  };
  openModal("Nuevo libro", "Catálogo", form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Crear"])
  ]);
}

async function editLibro(x) {
  const form = h("div", { class: "form" }, [
    field("Nombre del libro", "Nombre_libro", x.Nombre_libro),
    field("Género", "Genero", x.Genero || ""),
    dateField("Fecha publicación", "fecha_publicacion", x.fecha_publicacion ? String(x.fecha_publicacion).slice(0, 10) : "")
  ]);
  const save = async () => {
    const p = readForm(form);
    await api.send(`/api/libros/${x.ID}`, "PUT", p);
    toast("Libro actualizado ✓"); closeModal(); render();
  };
  openModal("Editar libro", `ID ${x.ID}`, form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Guardar"])
  ]);
}

async function delLibro(id) {
  if (!confirm("¿Eliminar este libro?")) return;
  await api.send(`/api/libros/${id}`, "DELETE");
  toast("Libro eliminado"); render();
}

// ========================= AUTORES =========================
async function renderAutores() {
  const { data } = await api.get(`/api/autores?q=${encodeURIComponent(state.q)}`);
  const rows = data.map((x) => [
    String(x.ID),
    x.Nombre || "—",
    x.Nacionalidad || "—",
    x.email || "—",
    h("div", { class: "actions" }, [
      h("button", { class: "btn", onClick: () => editAutor(x) }, ["Editar"]),
      h("button", { class: "btn danger", onClick: () => delAutor(x.ID) }, ["Eliminar"])
    ])
  ]);
  $("#content").innerHTML = "";
  $("#content").appendChild(table(["ID", "Nombre", "Nacionalidad", "Email", "Acciones"], rows));
}

async function newAutor() {
  const { data } = await api.get("/api/autores?q=");
  const nextId = data.length ? Math.max(...data.map((x) => x.ID)) + 1 : 1;
  const form = h("div", { class: "form" }, [
    field("ID", "ID", nextId),
    field("Nombre", "Nombre", ""),
    field("Nacionalidad", "Nacionalidad", ""),
    field("Biografía", "biografia", ""),
    field("Email", "email", "")
  ]);
  const save = async () => {
    const p = readForm(form);
    if (!p.ID || !p.Nombre) return toast("ID y Nombre son obligatorios", true);
    await api.send("/api/autores", "POST", p);
    toast("Autor creado ✓"); closeModal(); render();
  };
  openModal("Nuevo autor", "Catálogo", form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Crear"])
  ]);
}

async function editAutor(x) {
  const form = h("div", { class: "form" }, [
    field("Nombre", "Nombre", x.Nombre),
    field("Nacionalidad", "Nacionalidad", x.Nacionalidad || ""),
    field("Biografía", "biografia", x.biografia || ""),
    field("Email", "email", x.email || "")
  ]);
  const save = async () => {
    const p = readForm(form);
    await api.send(`/api/autores/${x.ID}`, "PUT", p);
    toast("Autor actualizado ✓"); closeModal(); render();
  };
  openModal("Editar autor", `ID ${x.ID}`, form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Guardar"])
  ]);
}

async function delAutor(id) {
  if (!confirm("¿Eliminar este autor?")) return;
  await api.send(`/api/autores/${id}`, "DELETE");
  toast("Autor eliminado"); render();
}

// ========================= EDITORIALES =========================
async function renderEditoriales() {
  const { data } = await api.get(`/api/editoriales?q=${encodeURIComponent(state.q)}`);
  const rows = data.map((x) => [
    String(x.ID),
    x.Nombre_Editorial || "—",
    x.Direccion || "—",
    x.fecha_publicacion_edit ? String(x.fecha_publicacion_edit).slice(0, 10) : "—",
    h("div", { class: "actions" }, [
      h("button", { class: "btn", onClick: () => editEditorial(x) }, ["Editar"]),
      h("button", { class: "btn danger", onClick: () => delEditorial(x.ID) }, ["Eliminar"])
    ])
  ]);
  $("#content").innerHTML = "";
  $("#content").appendChild(table(["ID", "Nombre", "Dirección", "Fecha publicación", "Acciones"], rows));
}

async function newEditorial() {
  const { data } = await api.get("/api/editoriales?q=");
  const nextId = data.length ? Math.max(...data.map((x) => x.ID)) + 1 : 1;
  const form = h("div", { class: "form" }, [
    field("ID", "ID", nextId),
    field("Nombre Editorial", "Nombre_Editorial", ""),
    field("Dirección", "Direccion", ""),
    dateField("Fecha publicación", "fecha_publicacion_edit", "")
  ]);
  const save = async () => {
  try {
    const p = readForm(form);
    if (!p.ID || !p.Nombre_Editorial) return toast("ID y Nombre son obligatorios", true);
    await api.send("/api/editoriales", "POST", p);
    toast("Editorial creada ✓"); closeModal(); render();
  } catch(e) {
    toast("Error: " + e.message, true);
  }
};
  openModal("Nueva editorial", "Catálogo", form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Crear"])
  ]);
}

async function editEditorial(x) {
  const form = h("div", { class: "form" }, [
    field("Nombre Editorial", "Nombre_Editorial", x.Nombre_Editorial),
    field("Dirección", "Direccion", x.Direccion || ""),
    dateField("Fecha publicación", "fecha_publicacion_edit", x.fecha_publicacion_edit ? String(x.fecha_publicacion_edit).slice(0, 10) : "")
  ]);
  const save = async () => {
    const p = readForm(form);
    await api.send(`/api/editoriales/${x.ID}`, "PUT", p);
    toast("Editorial actualizada ✓"); closeModal(); render();
  };
  openModal("Editar editorial", `ID ${x.ID}`, form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Guardar"])
  ]);
}

async function delEditorial(id) {
  if (!confirm("¿Eliminar esta editorial?")) return;
  await api.send(`/api/editoriales/${id}`, "DELETE");
  toast("Editorial eliminada"); render();
}

// ========================= USUARIOS =========================
async function renderUsuarios() {
  const { data } = await api.get(`/api/usuarios?q=${encodeURIComponent(state.q)}`);
  const rows = data.map((x) => [
    String(x.ID),
    x.Nombre_usario || "—",
    x.Direcion || "—",
    x.Telefono || "—",
    h("div", { class: "actions" }, [
      h("button", { class: "btn", onClick: () => editUsuario(x) }, ["Editar"]),
      h("button", { class: "btn danger", onClick: () => delUsuario(x.ID) }, ["Eliminar"])
    ])
  ]);
  $("#content").innerHTML = "";
  $("#content").appendChild(table(["ID", "Nombre", "Dirección", "Teléfono", "Acciones"], rows));
}

async function newUsuario() {
  const { data } = await api.get("/api/usuarios?q=");
  const nextId = data.length ? Math.max(...data.map((x) => x.ID)) + 1 : 1;
  const form = h("div", { class: "form" }, [
    field("ID", "ID", nextId),
    field("Nombre de usuario", "Nombre_usario", ""),
    field("Dirección", "Direcion", ""),
    field("Teléfono", "Telefono", "")
  ]);
  const save = async () => {
    const p = readForm(form);
    if (!p.ID || !p.Nombre_usario) return toast("ID y Nombre son obligatorios", true);
    await api.send("/api/usuarios", "POST", p);
    toast("Usuario creado ✓"); closeModal(); render();
  };
  openModal("Nuevo usuario", "Biblioteca", form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Crear"])
  ]);
}

async function editUsuario(x) {
  const form = h("div", { class: "form" }, [
    field("Nombre de usuario", "Nombre_usario", x.Nombre_usario),
    field("Dirección", "Direcion", x.Direcion || ""),
    field("Teléfono", "Telefono", x.Telefono || "")
  ]);
  const save = async () => {
    const p = readForm(form);
    await api.send(`/api/usuarios/${x.ID}`, "PUT", p);
    toast("Usuario actualizado ✓"); closeModal(); render();
  };
  openModal("Editar usuario", `ID ${x.ID}`, form, [
    h("button", { class: "btn", onClick: closeModal }, ["Cancelar"]),
    h("button", { class: "btn primary", onClick: save }, ["Guardar"])
  ]);
}

async function delUsuario(id) {
  if (!confirm("¿Eliminar este usuario?")) return;
  await api.send(`/api/usuarios/${id}`, "DELETE");
  toast("Usuario eliminado"); render();
}

function onNew() {
  if (state.view === "libros")      return newLibro();
  if (state.view === "autores")     return newAutor();
  if (state.view === "editoriales") return newEditorial();
  if (state.view === "usuarios")    return newUsuario();
}

render();