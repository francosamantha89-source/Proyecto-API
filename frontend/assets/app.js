const demoCredentials = {
  email: 'admin@inventario.com',
  password: '123456'
};

let users = [
  { id: 1, name: 'Administrador StockControl', email: 'admin@inventario.com', role: 'admin', active: true },
  { id: 2, name: 'Operador Bodega', email: 'operador@inventario.com', role: 'operator', active: true }
];

let products = [
  { id: 1, name: 'Caja organizadora industrial', sku: 'SC-CAJ-001', category: 'Almacenamiento', quantity: 128, minStock: 20, price: 45000 },
  { id: 2, name: 'Etiqueta RFID', sku: 'SC-RFID-024', category: 'Identificacion', quantity: 24, minStock: 30, price: 2800 },
  { id: 3, name: 'Sensor de inventario', sku: 'SC-SEN-003', category: 'Tecnologia', quantity: 3, minStock: 8, price: 120000 }
];

let services = [
  { id: 1, name: 'Auditoria de inventario', code: 'SRV-AUD-001', area: 'Inventario', priority: 'Alta', active: true },
  { id: 2, name: 'Mantenimiento de bodega', code: 'SRV-MNT-002', area: 'Operaciones', priority: 'Media', active: true }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const viewTitles = {
  dashboardSection: 'Dashboard',
  usersSection: 'Gestion de usuarios',
  productsSection: 'Gestion de productos',
  servicesSection: 'Gestion de servicios'
};

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2400);
}

function nextId(collection) {
  return collection.length ? Math.max(...collection.map((item) => item.id)) + 1 : 1;
}

function getProductStatus(product) {
  if (Number(product.quantity) <= 0) return 'Agotado';
  if (Number(product.quantity) <= Number(product.minStock)) return 'Bajo stock';
  return 'Disponible';
}

function badgeClass(value) {
  if (['Disponible', 'Activo', 'Baja'].includes(value)) return 'success';
  if (['Bajo stock', 'Media'].includes(value)) return 'warning';
  if (['Agotado', 'Inactivo', 'Alta'].includes(value)) return 'danger';
  return '';
}

function showView(viewId) {
  $$('.view-section').forEach((section) => section.classList.add('hidden'));
  $(`#${viewId}`).classList.remove('hidden');
  $('#viewTitle').textContent = viewTitles[viewId];

  $$('.nav-link').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewId);
  });
}

function renderDashboard() {
  const stockAlerts = products.filter((product) => getProductStatus(product) !== 'Disponible').length;
  const activeUsers = users.filter((user) => user.active).length;

  $('#activeUsersCount').textContent = activeUsers;
  $('#productsCount').textContent = products.length;
  $('#stockAlertsCount').textContent = stockAlerts;
  $('#servicesCount').textContent = services.length;

  $('#recentActivity').innerHTML = [
    `<div class="activity-item"><span>Usuario administrador activo</span><span class="badge success">Correcto</span></div>`,
    `<div class="activity-item"><span>${stockAlerts} productos requieren revision</span><span class="badge warning">Stock</span></div>`,
    `<div class="activity-item"><span>${services.length} servicios operativos registrados</span><span class="badge">Servicios</span></div>`
  ].join('');
}

function renderUsers() {
  $('#usersTable').innerHTML = users
    .map((user) => {
      const status = user.active ? 'Activo' : 'Inactivo';
      return `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td><span class="badge ${badgeClass(status)}">${status}</span></td>
          <td>
            <div class="actions">
              <button class="icon-button" onclick="editUser(${user.id})">Editar</button>
              <button class="icon-button danger" onclick="deleteUser(${user.id})">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderProducts() {
  $('#productsTable').innerHTML = products
    .map((product) => {
      const status = getProductStatus(product);
      return `
        <tr>
          <td>${product.name}</td>
          <td>${product.sku}</td>
          <td>${product.category}</td>
          <td>${product.quantity}</td>
          <td><span class="badge ${badgeClass(status)}">${status}</span></td>
          <td>
            <div class="actions">
              <button class="icon-button" onclick="editProduct(${product.id})">Editar</button>
              <button class="icon-button danger" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderServices() {
  $('#servicesTable').innerHTML = services
    .map((service) => {
      const status = service.active ? 'Activo' : 'Inactivo';
      return `
        <tr>
          <td>${service.name}</td>
          <td>${service.code}</td>
          <td>${service.area}</td>
          <td><span class="badge ${badgeClass(service.priority)}">${service.priority}</span></td>
          <td><span class="badge ${badgeClass(status)}">${status}</span></td>
          <td>
            <div class="actions">
              <button class="icon-button" onclick="editService(${service.id})">Editar</button>
              <button class="icon-button danger" onclick="deleteService(${service.id})">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderAll() {
  renderDashboard();
  renderUsers();
  renderProducts();
  renderServices();
}

function clearLoginErrors() {
  $('#emailError').textContent = '';
  $('#passwordError').textContent = '';
}

function handleLogin(event) {
  event.preventDefault();
  clearLoginErrors();

  const email = $('#email').value.trim();
  const password = $('#password').value.trim();
  let hasError = false;

  if (!email) {
    $('#emailError').textContent = 'El correo es obligatorio.';
    hasError = true;
  } else if (!isValidEmail(email)) {
    $('#emailError').textContent = 'Ingresa un correo valido.';
    hasError = true;
  }

  if (!password) {
    $('#passwordError').textContent = 'La contrasena es obligatoria.';
    hasError = true;
  } else if (password.length < 6) {
    $('#passwordError').textContent = 'Minimo 6 caracteres.';
    hasError = true;
  }

  if (hasError) return;

  if (email !== demoCredentials.email || password !== demoCredentials.password) {
    $('#passwordError').textContent = 'Credenciales demo incorrectas.';
    return;
  }

  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  renderAll();
  showView('dashboardSection');
  showToast('Sesion iniciada');
}

function handleUserForm(event) {
  event.preventDefault();

  const id = $('#userId').value;
  const name = $('#userName').value.trim();
  const email = $('#userEmail').value.trim();
  const role = $('#userRole').value;

  if (!name || !email || !isValidEmail(email)) {
    showToast('Completa nombre y correo valido.');
    return;
  }

  if (id) {
    users = users.map((user) =>
      user.id === Number(id) ? { ...user, name, email, role } : user
    );
    showToast('Usuario actualizado');
  } else {
    users.push({ id: nextId(users), name, email, role, active: true });
    showToast('Usuario creado');
  }

  event.target.reset();
  $('#userId').value = '';
  renderAll();
}

function editUser(id) {
  const user = users.find((item) => item.id === id);
  if (!user) return;

  $('#userId').value = user.id;
  $('#userName').value = user.name;
  $('#userEmail').value = user.email;
  $('#userRole').value = user.role;
}

function deleteUser(id) {
  users = users.filter((user) => user.id !== id);
  renderAll();
  showToast('Usuario eliminado');
}

function handleProductForm(event) {
  event.preventDefault();

  const id = $('#productId').value;
  const product = {
    name: $('#productName').value.trim(),
    sku: $('#productSku').value.trim().toUpperCase(),
    category: $('#productCategory').value.trim(),
    quantity: Number($('#productQuantity').value),
    minStock: Number($('#productMinStock').value),
    price: Number($('#productPrice').value)
  };

  if (!product.name || !product.sku || !product.category || product.quantity < 0 || product.minStock < 0 || product.price < 0) {
    showToast('Completa los datos del producto sin valores negativos.');
    return;
  }

  if (id) {
    products = products.map((item) => (item.id === Number(id) ? { ...item, ...product } : item));
    showToast('Producto actualizado');
  } else {
    products.push({ id: nextId(products), ...product });
    showToast('Producto creado');
  }

  event.target.reset();
  $('#productId').value = '';
  renderAll();
}

function editProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  $('#productId').value = product.id;
  $('#productName').value = product.name;
  $('#productSku').value = product.sku;
  $('#productCategory').value = product.category;
  $('#productQuantity').value = product.quantity;
  $('#productMinStock').value = product.minStock;
  $('#productPrice').value = product.price;
}

function deleteProduct(id) {
  products = products.filter((product) => product.id !== id);
  renderAll();
  showToast('Producto eliminado');
}

function handleServiceForm(event) {
  event.preventDefault();

  const id = $('#serviceId').value;
  const service = {
    name: $('#serviceName').value.trim(),
    code: $('#serviceCode').value.trim().toUpperCase(),
    area: $('#serviceArea').value.trim(),
    priority: $('#servicePriority').value,
    active: true
  };

  if (!service.name || !service.code || !service.area) {
    showToast('Completa servicio, codigo y area.');
    return;
  }

  if (id) {
    services = services.map((item) => (item.id === Number(id) ? { ...item, ...service } : item));
    showToast('Servicio actualizado');
  } else {
    services.push({ id: nextId(services), ...service });
    showToast('Servicio creado');
  }

  event.target.reset();
  $('#serviceId').value = '';
  renderAll();
}

function editService(id) {
  const service = services.find((item) => item.id === id);
  if (!service) return;

  $('#serviceId').value = service.id;
  $('#serviceName').value = service.name;
  $('#serviceCode').value = service.code;
  $('#serviceArea').value = service.area;
  $('#servicePriority').value = service.priority;
}

function deleteService(id) {
  services = services.filter((service) => service.id !== id);
  renderAll();
  showToast('Servicio eliminado');
}

function logout() {
  $('#appView').classList.add('hidden');
  $('#loginView').classList.remove('hidden');
  $('#loginForm').reset();
  clearLoginErrors();
  showToast('Sesion cerrada');
}

function bindEvents() {
  $('#loginForm').addEventListener('submit', handleLogin);
  $('#userForm').addEventListener('submit', handleUserForm);
  $('#productForm').addEventListener('submit', handleProductForm);
  $('#serviceForm').addEventListener('submit', handleServiceForm);
  $('#logoutButton').addEventListener('click', logout);

  $$('.nav-link').forEach((button) => {
    button.addEventListener('click', () => showView(button.dataset.view));
  });
}

bindEvents();
renderAll();
