const STORE_KEY = 'mock_db';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || getEmptyDb();
  } catch {
    return getEmptyDb();
  }
}

function save(db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}

function getEmptyDb() {
  return {
    users: [],
    households: [],
    tasks: [],
    invitations: [],
    memberships: [],
    tokens: {},
  };
}

function uid() {
  return Date.now() + Math.floor(Math.random() * 10000);
}

function token() {
  return 'mock-jwt-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

function nowISO() {
  return new Date().toISOString();
}

// ----------- AUTH -----------

export async function mockRegister(nombre, email, password) {
  await delay();
  const db = load();
  if (db.users.find((u) => u.email === email)) {
    throw new Error('El email ya está registrado');
  }
  const user = {
    usuarioId: uid(),
    nombre,
    email,
    password,
    creadoEn: nowISO(),
  };
  db.users.push(user);
  const tkn = token();
  db.tokens[tkn] = user.usuarioId;
  save(db);
  return { token: tkn, email, nombre };
}

export async function mockLogin(email, password) {
  await delay();
  const db = load();
  const user = db.users.find((u) => u.email === email);
  if (!user || user.password !== password) {
    throw new Error('Correo o contraseña incorrectos');
  }
  const tkn = token();
  db.tokens[tkn] = user.usuarioId;
  save(db);
  return { token: tkn, email: user.email, nombre: user.nombre };
}

export async function mockLogout() {
  await delay();
  const db = load();
  const tkn = getCurrentToken();
  if (tkn) {
    delete db.tokens[tkn];
    save(db);
  }
  return { message: 'Sesión cerrada' };
}

export async function mockForgotPassword(email) {
  await delay();
  const db = load();
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    throw new Error('No se encontró una cuenta con ese correo');
  }
  return { message: 'Se ha enviado un enlace a tu correo para restablecer la contraseña' };
}

export async function mockResetPassword(token, nuevaPassword) {
  await delay();
  const db = load();
  if (token !== 'mock-reset-token') {
    return { message: 'Contraseña cambiada exitosamente' };
  }
  return { message: 'Contraseña cambiada exitosamente' };
}

// ----------- HELPERS -----------

function getCurrentToken() {
  return localStorage.getItem('token');
}

function getCurrentUserId() {
  const tkn = getCurrentToken();
  if (!tkn) return null;
  const db = load();
  return db.tokens[tkn] || null;
}

function getCurrentUser() {
  const userId = getCurrentUserId();
  if (!userId) return null;
  const db = load();
  return db.users.find((u) => u.usuarioId === userId);
}

function getUserById(userId) {
  const db = load();
  return db.users.find((u) => u.usuarioId === userId);
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) throw new Error('Sesión expirada o no autorizada');
  return user;
}

function requireMembership(hogarId) {
  const user = requireAuth();
  const db = load();
  const m = db.memberships.find((m) => m.usuarioId === user.usuarioId && m.hogarId === hogarId);
  if (!m) throw new Error('No perteneces a este hogar');
  return m;
}

function requireAdmin(hogarId) {
  const m = requireMembership(hogarId);
  if (m.rol !== 'Administrador') throw new Error('Solo el Administrador puede realizar esta acción');
  return m;
}

// ----------- HOUSEHOLDS -----------

export async function mockCreateHousehold(nombre, descripcion) {
  await delay();
  const user = requireAuth();
  const db = load();
  const hogar = {
    hogarId: uid(),
    nombre,
    descripcion: descripcion || '',
    creadoEn: nowISO(),
  };
  db.households.push(hogar);
  db.memberships.push({
    usuarioId: user.usuarioId,
    hogarId: hogar.hogarId,
    rol: 'Administrador',
    fechaUnion: nowISO(),
  });
  save(db);
  return { hogarId: hogar.hogarId, nombre: hogar.nombre, descripcion: hogar.descripcion, creadoEn: hogar.creadoEn };
}

export async function mockGetMembers(hogarId) {
  await delay();
  requireMembership(hogarId);
  const db = load();
  const memberships = db.memberships.filter((m) => m.hogarId === hogarId);
  return memberships.map((m) => {
    const u = getUserById(m.usuarioId);
    return u
      ? { usuarioId: u.usuarioId, nombre: u.nombre, email: u.email, rol: m.rol, fechaUnion: m.fechaUnion }
      : null;
  }).filter(Boolean);
}

export async function mockInvite(hogarId, emailInvitado) {
  await delay();
  requireAdmin(hogarId);
  const db = load();
  const existingInv = db.invitations.find(
    (i) => i.hogarId === hogarId && i.emailInvitado === emailInvitado && i.estado === 'Pendiente'
  );
  if (existingInv) throw new Error('Ya hay una invitación pendiente para este email');

  const hogar = db.households.find((h) => h.hogarId === hogarId);
  const inv = {
    invitacionId: uid(),
    hogarId,
    emailInvitado,
    token: token(),
    fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'Pendiente',
    nombreHogar: hogar?.nombre || '',
  };
  db.invitations.push(inv);
  save(db);
  return inv;
}

export async function mockRespondInvitation(invitationToken, accion) {
  await delay();
  const user = requireAuth();
  const db = load();
  const inv = db.invitations.find((i) => i.token === invitationToken);
  if (!inv) throw new Error('Token no válido');
  if (inv.emailInvitado !== user.email) throw new Error('El email no corresponde a esta invitación');
  if (inv.estado !== 'Pendiente') throw new Error('Esta invitación ya fue procesada');

  if (accion === 'Aceptar') {
    inv.estado = 'Aceptada';
    db.memberships.push({
      usuarioId: user.usuarioId,
      hogarId: inv.hogarId,
      rol: 'Miembro',
      fechaUnion: nowISO(),
    });
  } else {
    inv.estado = 'Rechazada';
  }
  save(db);
  return inv;
}

// ----------- TASKS -----------

export async function mockGetTasks(hogarId, filters = {}) {
  await delay();
  requireMembership(hogarId);
  const db = load();
  let tasks = db.tasks.filter((t) => t.hogarId === hogarId);
  if (filters.estado) tasks = tasks.filter((t) => t.estado === filters.estado);
  if (filters.categoria) tasks = tasks.filter((t) => t.categoria === filters.categoria);
  if (filters.asignadoA) tasks = tasks.filter((t) => t.asignadoAId === Number(filters.asignadoA));
  return tasks.map((t) => ({
    tareaId: t.tareaId,
    titulo: t.titulo,
    categoria: t.categoria,
    estado: t.estado,
    prioridad: t.prioridad || null,
    fechaLimite: t.fechaLimite,
    asignadoANombre: t.asignadoAId ? getUserById(t.asignadoAId)?.nombre || null : null,
  }));
}

export async function mockGetTask(tareaId) {
  await delay();
  const db = load();
  const t = db.tasks.find((t) => t.tareaId === tareaId);
  if (!t) throw new Error('Tarea no encontrada');
  requireMembership(t.hogarId);
  return {
    tareaId: t.tareaId,
    hogarId: t.hogarId,
    titulo: t.titulo,
    descripcion: t.descripcion,
    categoria: t.categoria,
    estado: t.estado,
    prioridad: t.prioridad || null,
    fechaLimite: t.fechaLimite,
    completadaAt: t.completadaAt || null,
    asignadoA: t.asignadoAId
      ? (() => {
          const u = getUserById(t.asignadoAId);
          return u ? { usuarioId: u.usuarioId, nombre: u.nombre, email: u.email } : null;
        })()
      : null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export async function mockCreateTask(hogarId, data) {
  await delay();
  const user = requireAuth();
  requireMembership(hogarId);
  const db = load();

  const tarea = {
    tareaId: uid(),
    hogarId,
    titulo: data.titulo,
    descripcion: data.descripcion || '',
    categoria: data.categoria || '',
    estado: 'Pendiente',
    prioridad: data.prioridad || null,
    fechaLimite: data.fechaLimite || null,
    asignadoAId: data.asignadoAId || null,
    completadaAt: null,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  db.tasks.push(tarea);
  save(db);
  return {
    tareaId: tarea.tareaId,
    hogarId: tarea.hogarId,
    titulo: tarea.titulo,
    descripcion: tarea.descripcion,
    categoria: tarea.categoria,
    estado: tarea.estado,
    prioridad: tarea.prioridad || null,
    fechaLimite: tarea.fechaLimite,
    completadaAt: tarea.completadaAt || null,
    asignadoA: tarea.asignadoAId
      ? (() => {
          const u = getUserById(tarea.asignadoAId);
          return u ? { usuarioId: u.usuarioId, nombre: u.nombre, email: u.email } : null;
        })()
      : null,
    createdAt: tarea.createdAt,
    updatedAt: tarea.updatedAt,
  };
}

export async function mockUpdateTask(tareaId, data) {
  await delay();
  const db = load();
  const t = db.tasks.find((t) => t.tareaId === tareaId);
  if (!t) throw new Error('Tarea no encontrada');
  requireMembership(t.hogarId);

  if (data.titulo !== undefined) t.titulo = data.titulo;
  if (data.descripcion !== undefined) t.descripcion = data.descripcion;
  if (data.categoria !== undefined) t.categoria = data.categoria;
  if (data.prioridad !== undefined) t.prioridad = data.prioridad;
  if (data.fechaLimite !== undefined) t.fechaLimite = data.fechaLimite;
  if (data.asignadoAId !== undefined) t.asignadoAId = data.asignadoAId;
  t.updatedAt = nowISO();
  save(db);

  return {
    tareaId: t.tareaId,
    hogarId: t.hogarId,
    titulo: t.titulo,
    descripcion: t.descripcion,
    categoria: t.categoria,
    estado: t.estado,
    prioridad: t.prioridad || null,
    fechaLimite: t.fechaLimite,
    completadaAt: t.completadaAt || null,
    asignadoA: t.asignadoAId
      ? (() => {
          const u = getUserById(t.asignadoAId);
          return u ? { usuarioId: u.usuarioId, nombre: u.nombre, email: u.email } : null;
        })()
      : null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export async function mockDeleteTask(tareaId) {
  await delay();
  const db = load();
  const t = db.tasks.find((t) => t.tareaId === tareaId);
  if (!t) throw new Error('Tarea no encontrada');
  requireAdmin(t.hogarId);
  db.tasks = db.tasks.filter((t) => t.tareaId !== tareaId);
  save(db);
}

export async function mockUpdateTaskStatus(tareaId, estado) {
  await delay();
  const db = load();
  const t = db.tasks.find((t) => t.tareaId === tareaId);
  if (!t) throw new Error('Tarea no encontrada');
  requireMembership(t.hogarId);

  const validStatus = ['Pendiente', 'En_progreso', 'Completada'];
  if (!validStatus.includes(estado)) throw new Error('Estado inválido');

  t.estado = estado;
  if (estado === 'Completada') {
    t.completadaAt = nowISO();
  }
  t.updatedAt = nowISO();
  save(db);

  return {
    tareaId: t.tareaId,
    hogarId: t.hogarId,
    titulo: t.titulo,
    descripcion: t.descripcion,
    categoria: t.categoria,
    estado: t.estado,
    prioridad: t.prioridad || null,
    fechaLimite: t.fechaLimite,
    completadaAt: t.completadaAt || null,
    asignadoA: t.asignadoAId
      ? (() => {
          const u = getUserById(t.asignadoAId);
          return u ? { usuarioId: u.usuarioId, nombre: u.nombre, email: u.email } : null;
        })()
      : null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export async function mockGetMyHouseholds() {
  await delay();
  const user = requireAuth();
  const db = load();
  const memberships = db.memberships.filter((m) => m.usuarioId === user.usuarioId);
  return memberships.map((m) => {
    const h = db.households.find((h) => h.hogarId === m.hogarId);
    if (!h) return null;
    return {
      hogarId: h.hogarId,
      nombre: h.nombre,
      descripcion: h.descripcion,
      creadoEn: h.creadoEn,
      rol: m.rol,
    };
  }).filter(Boolean);
}

export async function mockGetMyInvitations() {
  await delay();
  const user = requireAuth();
  const db = load();
  return db.invitations
    .filter((i) => i.emailInvitado === user.email && i.estado === 'Pendiente')
    .map((i) => {
      const hogar = db.households.find((h) => h.hogarId === i.hogarId);
      return {
        ...i,
        nombreHogar: hogar?.nombre || i.nombreHogar,
      };
    });
}

// ----------- REPORTS -----------

export async function mockGetDistributionReport(hogarId) {
  await delay(500);
  requireMembership(hogarId);
  const db = load();

  const memberships = db.memberships.filter((m) => m.hogarId === hogarId);
  const tasks = db.tasks.filter((t) => t.hogarId === hogarId);

  const miembros = [];

  // Members with assigned tasks
  for (const m of memberships) {
    const user = getUserById(m.usuarioId);
    const userTasks = tasks.filter((t) => t.asignadoAId === m.usuarioId);
    miembros.push({
      usuarioId: m.usuarioId,
      nombre: user?.nombre || 'Desconocido',
      total: userTasks.length,
      pendientes: userTasks.filter((t) => t.estado === 'Pendiente').length,
      enProgreso: userTasks.filter((t) => t.estado === 'En_progreso').length,
      completadas: userTasks.filter((t) => t.estado === 'Completada').length,
    });
  }

  // Unassigned tasks
  const unassigned = tasks.filter((t) => !t.asignadoAId);
  if (unassigned.length > 0) {
    miembros.push({
      usuarioId: 0,
      nombre: 'Sin asignar',
      total: unassigned.length,
      pendientes: unassigned.filter((t) => t.estado === 'Pendiente').length,
      enProgreso: unassigned.filter((t) => t.estado === 'En_progreso').length,
      completadas: unassigned.filter((t) => t.estado === 'Completada').length,
    });
  }

  // Members without any tasks still show
  for (const m of memberships) {
    if (!miembros.find((mb) => mb.usuarioId === m.usuarioId)) {
      const user = getUserById(m.usuarioId);
      miembros.push({
        usuarioId: m.usuarioId,
        nombre: user?.nombre || 'Desconocido',
        total: 0,
        pendientes: 0,
        enProgreso: 0,
        completadas: 0,
      });
    }
  }

  return { hogarId, miembros };
}

export async function mockGetCumplimientoReport(hogarId) {
  await delay(500);
  requireMembership(hogarId);
  const db = load();

  const memberships = db.memberships.filter((m) => m.hogarId === hogarId);
  const tasks = db.tasks.filter((t) => t.hogarId === hogarId);

  const usuarios = [];

  for (const m of memberships) {
    const user = getUserById(m.usuarioId);
    const userTasks = tasks.filter((t) => t.asignadoAId === m.usuarioId);

    const totalAsignadas = userTasks.length;
    const completadas = userTasks.filter((t) => t.estado === 'Completada').length;

    let aTiempo = 0;
    let tarde = 0;

    for (const t of userTasks) {
      if (t.estado !== 'Completada') continue;
      if (t.fechaLimite && t.completadaAt) {
        if (new Date(t.completadaAt) <= new Date(t.fechaLimite)) {
          aTiempo++;
        } else {
          tarde++;
        }
      } else {
        // No deadline set — count as on time
        aTiempo++;
      }
    }

    const tasaCumplimiento = totalAsignadas > 0
      ? Math.round((completadas / totalAsignadas) * 1000) / 10
      : 0;

    usuarios.push({
      usuarioId: m.usuarioId,
      nombre: user?.nombre || 'Desconocido',
      totalAsignadas,
      completadas,
      aTiempo,
      tarde,
      tasaCumplimiento,
    });
  }

  return { hogarId, usuarios };
}
