# Documentacion funcional de modulos y paginas

## 1. Vision general del sistema

La aplicacion corresponde a un sistema web de gestion de almacen orientado al control operativo de entradas, salidas, asignaciones y retornos de inventario. El sistema trabaja con tres grandes tipos de recursos:

- Herramientas: activos asignables a trabajadores.
- Productos especificos: unidades identificadas individualmente mediante QR o datamatrix y reconocibles por MAC o codigo unico.
- Consumibles o productos genericos: inventario controlado por cantidad y, en algunos casos, por identificador de lote o presentacion.

Ademas del control de inventario, la aplicacion incluye administracion de usuarios, permisos, menu dinamico y trazabilidad historica de los movimientos.

## 2. Modulos transversales

### 2.1. Autenticacion y sesion

**Pantalla involucrada:** `AuthPage`

**Objetivo funcional**

Permitir el acceso al sistema solo a cuentas habilitadas para uso web y mantener una sesion autenticada con token.

**Funcionalidades**

- Inicio de sesion por usuario y contrasena.
- Validacion de tipo de cuenta antes de permitir acceso web.
- Almacenamiento persistente del estado de autenticacion.
- Cierre de sesion manual desde el layout.
- Cierre automatico por expiracion local de la sesion.
- Cierre automatico si el backend responde `401`.
- Actualizacion del token si el backend devuelve `x-new-token` en la respuesta.

**Casos de uso**

- Un usuario administrativo accede al sistema para operar inventario.
- Un usuario sin tipo de cuenta web intenta ingresar y el sistema bloquea el acceso.
- Un usuario autenticado mantiene su sesion activa mientras navega.
- La sesion expira y el sistema fuerza el retorno al login.

### 2.2. Autorizacion por ruta

**Pantallas involucradas:** `ProtectedRoute`, `NoPermissionPage`

**Objetivo funcional**

Garantizar que un usuario autenticado solo pueda acceder a las rutas autorizadas para sus permisos.

**Funcionalidades**

- Verificacion de acceso a cada ruta contra el backend.
- Redireccion a `/login` cuando no hay token.
- Redireccion a `/unauthorized` cuando la ruta no esta permitida.
- Soporte para menu dinamico construido desde el arbol de opciones devuelto por autenticacion.

**Casos de uso**

- Un operador puede entrar a `entries` pero no a `account`.
- Un administrador puede entrar a todas las rutas configuradas.
- Un usuario intenta abrir manualmente una URL restringida y recibe la pagina de no autorizado.

### 2.3. Layout y navegacion

**Pantalla involucrada:** `Layout`

**Objetivo funcional**

Servir como contenedor principal del sistema, con menu lateral, salida rapida de sesion y carga del contenido de cada pagina.

**Funcionalidades**

- Sidebar colapsable con persistencia en `localStorage`.
- Menu dinamico construido desde el arbol de permisos del usuario.
- Soporte para items anidados.
- Resaltado visual de la ruta activa.
- Carga del `Outlet` segun la pagina seleccionada.
- Acceso rapido para cerrar sesion.

**Casos de uso**

- Un usuario navega por las secciones segun su rol.
- Un supervisor colapsa el menu para tener mas espacio operativo.
- El sistema muestra solo las secciones habilitadas para el usuario autenticado.

### 2.4. Scanner global

**Modulos involucrados:** `ScannerProvider`, `useBarcodeScanner`, `ScannerContext`

**Objetivo funcional**

Permitir que el lector de codigos funcione de forma global sin depender de un input puntual.

**Funcionalidades**

- Captura de teclas a nivel ventana.
- Construccion del codigo escaneado hasta recibir `Enter`.
- Exposicion del ultimo escaneo a las paginas mediante contexto.
- Limpieza del ultimo escaneo una vez procesado.

**Paginas que lo aprovechan**

- `EntriesPage`
- `AssignmentsPage`
- `OutPutPage`
- `HistoryPage` consume y limpia escaneos para evitar interferencias

**Casos de uso**

- El operador escanea un producto en la pantalla de entradas sin enfocar un campo.
- El operador escanea un item desde asignaciones para enviarlo a un trabajador.
- El operador escanea un producto especifico en salidas para localizarlo rapido.

### 2.5. Notificaciones y manejo global de errores

**Modulos involucrados:** `NotificationsProvider`, `GlobalErrorProvider`, `queryClient`, `useGlobalError`

**Objetivo funcional**

Unificar el feedback de exito, advertencia y error en toda la aplicacion.

**Funcionalidades**

- Snackbar global con severidades `success`, `warning`, `error`, `info`.
- Captura centralizada de errores de queries y mutations.
- Traduccion de errores HTTP a mensajes visibles para usuario.

**Casos de uso**

- Confirmar que una entrada se registro correctamente.
- Mostrar que un producto ya fue agregado al area de preparacion.
- Informar fallos de backend sin tener que repetir logica de UI en cada pagina.

### 2.6. Persistencia operativa

**Modulos involucrados:** store Redux persistido

**Objetivo funcional**

Evitar perdida de informacion operativa temporal y del contexto de autenticacion.

**Funcionalidades**

- Persistencia de autenticacion.
- Persistencia del area de preparacion de entradas para productos especificos.
- Persistencia del area de preparacion de entradas para consumibles.
- Control de tiempo de cache local para entradas.

**Casos de uso**

- El operador recarga la pagina en medio de una entrada y conserva la preparacion.
- El usuario vuelve a abrir la aplicacion y mantiene sesion mientras el token siga valido.

## 3. Paginas activas del sistema

Las paginas activas son las definidas en el router y accesibles desde la aplicacion.

### 3.1. Login

**Ruta:** `/login`

**Objetivo**

Punto de entrada al sistema.

**Funcionalidades**

- Captura usuario y contrasena.
- Llama al servicio de autenticacion.
- Valida que la cuenta tenga acceso web.
- Guarda token, usuario, rutas y arbol de menu.
- Redirige a `entries` despues de login exitoso.

**Casos de uso**

- Inicio de sesion de administrador.
- Inicio de sesion de operador de almacen.
- Reintento de acceso despues de expiracion o cierre de sesion.

### 3.2. Entradas

**Ruta:** `/entries`

**Objetivo**

Registrar el ingreso de inventario al almacen, tanto de productos especificos como de consumibles genericos.

**Funcionalidades**

- Dos flujos de carga: productos especificos por codigo QR o datamatrix de 32 caracteres, y consumibles genericos por seleccion manual, cantidad e identificador.
- Identificacion del producto especifico a partir del QR.
- Prevencion de duplicados en el area de preparacion usando la MAC del item.
- Consulta de identificadores disponibles para un modelo generico antes de registrarlo.
- Agrupacion visual de los items pendientes por modelo y por codigo.
- Incremento, decremento y eliminacion de lineas pendientes.
- Registro masivo final de la entrada en un solo envio.
- Persistencia local del area de preparacion mediante Redux Persist.

**Casos de uso principales**

- Recepcion de un lote de equipos individuales escaneando uno por uno.
- Ingreso de consumibles por cantidad y por identificador de lote.
- Preparacion de una entrada mixta con varios productos antes de guardarla.
- Correccion del area de preparacion antes del envio final.

**Valor operativo**

Esta pagina es el punto de abastecimiento del inventario. Alimenta el stock disponible que luego podra ser asignado, retirado o consultado en historial.

### 3.3. Salidas

**Ruta:** `/out`

**Objetivo**

Registrar salidas de almacen que no corresponden a asignaciones a trabajadores, sino a egresos operativos o extraordinarios.

**Funcionalidades**

- Dos flujos de salida: producto generico por seleccion, cantidad y motivo, y producto especifico por busqueda o escaneo con motivo obligatorio.
- Busqueda manual o por escaneo de producto especifico.
- Preparacion de multiples lineas antes de registrar la salida.
- Agrupacion visual de productos especificos y genericos pendientes.
- Ajuste de cantidades en genericos antes del envio final.
- Validacion obligatoria de motivo de salida.
- Registro consolidado de todas las salidas pendientes.

**Casos de uso principales**

- Baja de consumibles usados internamente.
- Salida por descarte, dano o consumo operativo.
- Retiro de una unidad especifica del inventario con trazabilidad del motivo.
- Consolidacion de varias salidas en un solo registro.

**Valor operativo**

Permite formalizar egresos de inventario fuera del flujo de asignacion, conservando el motivo de la baja.

### 3.4. Asignaciones

**Ruta:** `/assigment`

**Objetivo**

Entregar stock a un trabajador y dejar trazabilidad de que herramientas, productos especificos y consumibles quedaron bajo su responsabilidad.

**Funcionalidades**

- Seleccion obligatoria del trabajador antes de habilitar la operacion.
- Tres tabs operativos: herramientas disponibles, productos especificos disponibles por modelo y consumibles genericos disponibles por cantidad.
- Escaneo directo de productos especificos para agregarlos a preparacion.
- Seleccion multiple de herramientas.
- Seleccion multiple de items especificos.
- Seleccion de consumibles con control de cantidad disponible.
- Agrupacion del area de preparacion por tipo de recurso.
- Registro consolidado de la asignacion hacia un trabajador.

**Casos de uso principales**

- Entrega de herramientas a un tecnico para una jornada.
- Asignacion de equipos individualizados a un trabajador concreto.
- Entrega de consumibles para una orden de trabajo.
- Preparacion mixta de herramientas, unidades y consumibles en una sola asignacion.

**Valor operativo**

Es la pagina clave para mover inventario desde el almacen hacia el stock en poder del trabajador.

### 3.5. Retornos

**Ruta:** `/returns`

**Objetivo**

Registrar la devolucion al almacen de los elementos que previamente fueron asignados a un trabajador.

**Funcionalidades**

- Seleccion del trabajador.
- Carga del stock actualmente asignado al trabajador.
- Tres tabs operativos: herramientas asignadas, productos especificos asignados por modelo y consumibles genericos asignados por cantidad.
- Seleccion de elementos a retornar solo desde el stock real del trabajador.
- Ajuste de cantidad a retornar en consumibles, sin exceder lo asignado.
- Limpieza de area de retorno al cambiar de trabajador, con confirmacion.
- Registro consolidado del retorno.
- Recarga del stock asignado al trabajador despues del retorno.

**Casos de uso principales**

- Devolucion completa de herramientas al finalizar turno.
- Retorno parcial de consumibles no utilizados.
- Retorno de equipos especificos por MAC.
- Reconciliacion del stock de un trabajador antes de cierre operativo.

**Valor operativo**

Devuelve inventario desde el trabajador al almacen y actualiza la disponibilidad operativa para nuevas asignaciones.

### 3.6. Historial

**Ruta:** `/history`

**Objetivo**

Consultar la trazabilidad de los movimientos de inventario agrupados por evento.

**Funcionalidades**

- Filtro por fecha inicial y fecha final.
- Filtro por categoria de movimiento: Entrada, Asignacion, Devolucion o Todo.
- Consulta de grupos de eventos desde backend.
- Transformacion de eventos en una vista agrupada por producto y por identificador.
- Presentacion progresiva por bloques, con opcion de cargar mas movimientos.
- Visualizacion de origen, destino, ejecutor, fecha y detalle del movimiento.

**Casos de uso principales**

- Auditoria de entradas registradas en una semana.
- Revision de asignaciones hechas a trabajadores.
- Seguimiento de devoluciones en un periodo.
- Analisis de trazabilidad por producto especifico o consumible.

**Valor operativo**

Es la capa de auditoria del sistema y soporta control, supervision y revision historica.

### 3.7. Permisos

**Ruta:** `/permisses`

**Objetivo**

Administrar permisos funcionales y relacionarlos con la estructura del menu.

**Funcionalidades**

- Alta de permisos.
- Edicion de permisos.
- Eliminacion de permisos.
- Visualizacion tabular de permisos.
- Creacion de items de menu desde la misma pantalla.
- Visualizacion del arbol de menu.
- Seleccion jerarquica de menus permitidos por permiso.
- Asignacion de un permiso a multiples items de menu.

**Casos de uso principales**

- Crear un permiso para acceso a administracion.
- Editar la descripcion o nombre de un permiso.
- Definir que menus ve un rol o permiso determinado.
- Relacionar nuevas rutas con permisos ya existentes.

**Valor operativo**

Es el nucleo de autorizacion funcional. Determina que rutas y opciones de menu quedan disponibles para los usuarios.

### 3.8. Cuentas

**Ruta:** `/account`

**Objetivo**

Gestionar cuentas de acceso al sistema y asociarles permisos.

**Funcionalidades**

- Alta de cuentas.
- Edicion de cuentas.
- Eliminacion de cuentas.
- Visualizacion tabular de cuentas.
- Seleccion de una cuenta para ver su matriz de permisos.
- Activacion y desactivacion de permisos por cuenta desde una segunda tabla editable.

**Casos de uso principales**

- Crear una cuenta para un nuevo usuario interno.
- Cambiar credenciales o estado de una cuenta.
- Asignar permisos administrativos a una cuenta.
- Revocar permisos cuando un usuario cambia de rol.

**Valor operativo**

Vincula usuarios concretos con la politica de acceso del sistema.

### 3.9. Herramientas

**Ruta:** `/tool`

**Objetivo**

Administrar el catalogo de herramientas asignables.

**Funcionalidades**

- Alta de herramientas.
- Edicion de nombre y descripcion.
- Visualizacion tabular de herramientas.

**Casos de uso principales**

- Registrar una nueva herramienta que podra asignarse a trabajadores.
- Corregir el nombre o descripcion de una herramienta existente.
- Mantener actualizado el catalogo de herramientas disponibles.

**Valor operativo**

Mantiene el maestro de activos que luego se usan en asignaciones y retornos.

### 3.10. Modelos de producto

**Ruta:** `/product_model`

**Objetivo**

Administrar el catalogo maestro de productos o modelos de inventario.

**Funcionalidades**

- Alta de modelo de producto.
- Edicion de modelo.
- Eliminacion de modelo.
- Validacion de nombre obligatorio.
- Validacion de tipo de producto obligatorio.
- Relacion del modelo con su `kindType`.

**Casos de uso principales**

- Crear un nuevo modelo de equipo.
- Clasificar un producto por tipo antes de usarlo en entradas.
- Depurar modelos obsoletos del catalogo.

**Valor operativo**

Es la base del inventario estructurado. Sin un modelo de producto correcto no se pueden organizar entradas, asignaciones ni consultas.

### 3.11. Trabajadores

**Ruta:** `/worker`

**Objetivo**

Gestionar el maestro de trabajadores y consultar el stock actualmente asignado a cada uno.

**Funcionalidades**

- Alta de trabajador.
- Edicion de trabajador.
- Eliminacion de trabajador.
- Dos modos de visualizacion: vista panel y vista tabla.
- Seleccion de trabajador para cargar su stock asignado.
- Resumen por herramientas, consumibles y productos especificos.
- Agrupacion de productos especificos por modelo y detalle por MAC.

**Casos de uso principales**

- Registrar personal nuevo.
- Consultar rapidamente que tiene asignado cada trabajador.
- Confirmar herramientas o productos bajo responsabilidad de un operario.
- Validar informacion previa a una devolucion o auditoria.

**Valor operativo**

Funciona como ficha operativa del trabajador y como vista consolidada del stock fuera del almacen.

### 3.12. Tipos de herramienta

**Ruta:** `/tooltype`

**Objetivo**

Administrar la clasificacion de herramientas por tipo o familia.

**Funcionalidades**

- Alta de tipo de herramienta.
- Edicion de tipo de herramienta.
- Eliminacion de tipo de herramienta.
- Validacion de nombre obligatorio.

**Casos de uso principales**

- Crear una categoria para nuevas familias de herramientas.
- Estandarizar la clasificacion del catalogo.
- Mantener ordenada la informacion de herramientas en el sistema.

**Valor operativo**

Da estructura al catalogo tecnico y facilita una gestion mas consistente de herramientas.

### 3.13. Pagina de no autorizado

**Ruta:** `/unauthorized`

**Objetivo**

Informar al usuario que no tiene acceso a la seccion solicitada.

**Funcionalidades**

- Mensaje explicito de falta de permisos.
- Boton para volver atras.
- Boton para ir al inicio.

**Casos de uso**

- Un usuario abre una ruta restringida.
- Un permiso fue retirado y la ruta deja de estar disponible.

## 4. Modulos internos o auxiliares detectados

Estos modulos existen en el codigo, pero no estan expuestos como pagina activa o no estan completos en el router actual.

### 4.1. Modulo Menu

**Archivo:** `src/modules/menu/page/MenuPage.tsx`

**Estado**

- Existe una pagina para menus, pero no esta registrada en el router principal.
- La logica realmente utilizada hoy esta integrada en la pagina de permisos.
- La implementacion visible de `MenuPage` parece incompleta o heredada.

**Uso real actual**

- Crear menus desde la pantalla de permisos.
- Consultar el arbol de menu para asignarlo a permisos.

### 4.2. Modulo Product Identifier

**Archivo:** `src/modules/catalogo/ProductIndetifier/Page/ProductIndentifierPage.tsx`

**Estado**

- El archivo existe, pero actualmente esta vacio y no esta conectado al router.
- No representa una funcionalidad operativa utilizable en el estado actual del proyecto.

## 5. Resumen funcional por flujo de negocio

### 5.1. Flujo de abastecimiento

- Se crean modelos, tipos y maestros necesarios.
- Se registran entradas en `EntriesPage`.
- El stock queda disponible para asignacion o salida.

### 5.2. Flujo de entrega a trabajador

- Se administra el maestro de trabajadores.
- Se asignan herramientas, productos y consumibles desde `AssignmentsPage`.
- El stock del trabajador queda visible en `WorkerPage`.

### 5.3. Flujo de retorno

- Se consulta el stock asignado al trabajador.
- Se selecciona lo que regresa en `ReturnsPage`.
- El inventario vuelve al almacen.

### 5.4. Flujo de egreso no asignado

- Se registra una salida en `OutPutPage`.
- Se documenta el motivo del egreso.
- El movimiento queda reflejado en historial.

### 5.5. Flujo de administracion y control

- `AccountPage` administra cuentas.
- `PermissionsPage` administra permisos y menu.
- `HistoryPage` permite auditoria de todos los movimientos.

## 6. Conclusion

El sistema esta organizado en torno a un flujo operativo claro:

- autenticacion y control de acceso,
- carga de inventario,
- asignacion a trabajadores,
- retorno al almacen,
- salida por consumo o baja,
- y trazabilidad historica.

Las paginas mas criticas para la operacion diaria son `EntriesPage`, `AssignmentsPage`, `ReturnsPage`, `OutPutPage` y `HistoryPage`. Las paginas `AccountPage`, `PermissionsPage`, `ToolPage`, `ProductModelPage`, `WorkerPage` y `ToolTypePage` cumplen un rol de administracion y soporte estructural para que la operacion funcione correctamente.
