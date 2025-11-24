# Ionic Mobile App - CasinoSoft

Aplicación móvil para el sistema de gestión de vales de alimentación.

## 🚀 Ejecutar la Aplicación

### Requisitos
- Node.js instalado
- Backend corriendo en `http://localhost:3000`

### Pasos

1. **Navegar a la carpeta del proyecto:**
```bash
cd frontendapp
```

2. **Instalar dependencias (solo la primera vez):**
```bash
npm install
```

3. **Ejecutar la aplicación:**
```bash
ionic serve
```

4. **Abrir en el navegador:**
- La aplicación se abrirá automáticamente en `http://localhost:8100`
- También puedes ver la vista móvil en el navegador (F12 → Toggle Device Toolbar)

## 📱 Características

### Para Funcionarios
- **Login**: Autenticación con email y contraseña
- **Home**: Página de bienvenida con información de comidas
- **Dashboard**: Generación de vales según turno asignado
- **Mis Vales**: Lista de vales generados con estado (Pendiente/Canjeado)
- **Pull to Refresh**: Actualizar datos deslizando hacia abajo

### Para Administradores
- **Gestión de Usuarios**: Crear y eliminar funcionarios
- **Auditoría**: Ver todos los vales generados
- **Vales Extra**: Generar vales especiales (Galletas, Bebidas)
- **Canjear Vales**: Marcar vales como canjeados

## 🔧 Tecnologías

- **Ionic 8**: Framework móvil
- **Angular 18**: Framework web
- **Capacitor**: Para compilar a iOS/Android (opcional)
- **Backend**: Node.js + Express (mismo backend que la web)

## 📦 Compilar para Móvil (Opcional)

### Android
```bash
ionic capacitor add android
ionic capacitor build android
```

### iOS (solo en Mac)
```bash
ionic capacitor add ios
ionic capacitor build ios
```

## 🔐 Credenciales de Prueba

**Administrador:**
- Email: admin@librosimpresos.cl
- Contraseña: admin

**Funcionarios:** Crear desde el panel de administración

## 🎨 Componentes Ionic Utilizados

- `ion-header`, `ion-toolbar`: Navegación
- `ion-card`: Tarjetas de contenido
- `ion-list`, `ion-item`: Listas
- `ion-button`: Botones
- `ion-input`, `ion-select`: Formularios
- `ion-segment`: Pestañas
- `ion-refresher`: Pull to refresh
- `ion-badge`: Etiquetas de estado
- `ion-alert`: Alertas y confirmaciones

## 📝 Notas

- La aplicación se conecta al mismo backend que la versión web
- Los datos se sincronizan automáticamente
- Funciona en navegadores móviles y de escritorio
- Optimizada para pantallas táctiles
