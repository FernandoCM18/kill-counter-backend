# Kill Counter Backend

Este repositorio lo cree para practicar GraphQL y para poder hacer algun tipo de competencia con mis amigos al jugar Warzone o algun otro tipo de videojuego similar aun me falta mejorar muchas cosas esto es lo que llevo al momento:

### Usuarios.
- [x] Crear usuario.
  - **Campos a pedir**
  - [x] Nombre.
  - [x] Username.
  - [x] Email.
  - [x] Contraseña.
  - **Validaciones**
  - [x] Verificar que el usuario no exista no se puede repetir email y username.
  - [x] El nombre es requerido.
  - [x] El nombre debe de tener al menos 2 caracteres.
  - [x] El username es requerido.
  - [x] El username debe de tener al menos 2 caracteres.
  - [x] La contraseña es requerida.
  - [x] La contraseña debe de tener al menos 6 caracteres.
  - [x] La contraseña debe de estar encriptada.
- [x] Actualizar usuario.
  - **Validaciones**
  - [ ] Verificar que el usuario no exista no se puede repetir email y username.
  - [ ] El nombre es requerido.
  - [ ] El nombre debe de tener al menos 2 caracteres.
  - [ ] El username es requerido.
  - [ ] El username debe de tener al menos 2 caracteres.
  - [ ] La contraseña es requerida.
  - [ ] La contraseña debe de tener al menos 6 caracteres.
  - [ ] La contraseña debe de estar encriptada.
- [ ] Borrar usuario.
- [x] Mostrar usuario.
  - **Validaciones**
  - [x] Verificar que el usuario exista.
  - [x] Mostrar en base al id,
  - [x] Mostrar en base el username.
- [x] Mostrar mi usuario.
  - **Validaciones**
 - [x] Verificar por medio de token.
- [x] Mostrar usuarios.
  - **Validaciones**
  - [] Mostrar solo un maximo de 10 usuarios.
  - [] Hacer paginacion.
- [x] Login.
  - **Validaciones**
  - [x] Pedir email y contraseña.
  - [x] Verificar que el email y contraseña existan.
  - [x] Generar token.

### Grupos
- [x] Crear grupo.
  - **Campos a pedir**
  - [x] Nombre
  - [x] Descripcion.
  - [x] Author es quien creo el grupo
  - [x] Users una lista de los usuarios que estan en ese grupo al crearlo solo debe de estar el que lo creo.
  - **Validaciones**
  - [x] Verificar que el nombre no exista no se puede repetir nombre
  - [x] El nombre es requerido.
  - [x] El nombre debe de tener al menos 2 caracteres.
  - [x] La descripcion es requerida.
  - [x] La descripcion debe de tener al menos 2 caracteres.
  - [x] Agregar al usuario que creo el grupo como Author.
  - [x] Incluir al Author en la lista de usuarios.
- [x] Actualizar grupo.
  - **Validaciones**
  - [ ] Verificar que el nombre no exista no se puede repetir nombre
  - [ ] El nombre es requerido.
  - [ ] El nombre debe de tener al menos 2 caracteres.
  - [ ] La descripcion es requerida.
  - [ ] La descripcion debe de tener al menos 2 caracteres.
  - [x] Solo lo puede actualizar el usuario que lo creo.
- [x] Borrar grupo.
  - **Validaciones**
  - [x] Verificar que el grupo exista.
  - [x] Solo lo puede borrar el usuario que lo creo.
- [x] Mostar grupo.
  - **Validaciones**
  - [x] Verificar que el grupo exista.
  - [x] Mostrar en base al id,
  - [x] Mostrar en base al nombre.
- [ ] Mostrar mis grupos.
  - **Validaciones**
- [x] Mostrar grupos.
  - **Validaciones**
  - [] Mostrar solo un maximo de 10 grupos.
  - [] Hacer paginacion.
- [x] Agregar usuarios al grupo.
  - **Validaciones**
  - [x] Solo puede agregar el Author del grupo.
  - [x] Verificar que exista el grupo.
  - [x] Verificar que el usuario al que se va agregar no exista ya que no puede estar dos veces el mismo usuario.
- [x] Borrar usuarios del grupo.
  - **Validaciones**
  - [x] Solo el Author puede eliminar usuarios.
  - [x] Verficar que el usuario a eliminar exista.
  - [x] El Author no se puede eliminar.

### Kills
- [x] Crear una kill.
  - **Campos a pedir**
  - [x] Bajas es numero
  - [x] Usuario que esta ingresando las bajas.
  - [x] Grupo en el cual se esta creando la baja.
  - **Validaciones**
  - [x] La baja es requerida.
  - [x] El usuario que la creo es requerido.
  - [x] Agregar al usuario por medio del context.
  - [x] Verificar que el usuario exista.
  - [x] Verificar que el usuario exista en el grupo.
  - [x] El grupo es requerido.
  - [x] Verificar que el grupo exista.
  - [ ] Enviar datos a la subcripciones para mostrar.
- [x] Actualizar kill.
  - **Validaciones**
  - [ ] La baja es requerida.
  - [x] Solo puede actulizar usuario que la creo.
  - [ ] Agregar al usuario por medio del context.
  - [ ] Verificar que el usuario exista.
  - [ ] Verificar que el usuario exista en el grupo.
  - [ ] El grupo es requerido.
  - [ ] Verificar que el grupo exista.
- [x] Borrar kill.
  - **Validaciones**
  - [x] Verificar que la kill exista.
  - [x] Solo lo puede borrar el usuario que lo creo.
- [x] Mostar kill.
  - **Validaciones**
  - [x] Verificar que la kill exista.
  - [x] Mostrar en base al id,
- [ ] Mostrar mis kills.
  - **Validaciones**
- [x] Mostrar kills.
  - **Validaciones**
  - [] Mostrar solo un maximo de 10 grupos.
  - [] Hacer paginacion.
- [x] Mostrar el total de kills de un grupo
  - **Validaciones**
  - [x] Verificar que el grupo exista por medio del id del grupo.
  - [ ] Crear subscripcion para poder mostrar datos en tiempo real.
- [x] Mostrar el total de kill por usuario.
  - **Validaciones**
  - [x] Verificar que el usuario exista por medio del id.
  - [ ] Crear subscripcion para poder mostrar datos en tiempo real.
- [x] Mostar el total de kills de un usuario en un grupo
  - **Validaciones**
  - [x] Verificar que el usuario exista en ese grupo.
  - [ ] Crear subscripcion para poder mostrar datos en tiempo real.




Para usarlo antes hay que instalar node_modules con:
```
npm install
```

Modo de desarrollo
```
npm run dev
```