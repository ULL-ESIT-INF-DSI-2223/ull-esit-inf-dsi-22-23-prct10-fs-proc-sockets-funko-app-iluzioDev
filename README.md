# Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js

[![Node.js CI](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/node.js.yml) [![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/coveralls.yml) [![Sonar-Cloud](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/sonarcloud.yml) [![pages-build-deployment](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/pages/pages-build-deployment)

Durante esta práctica se realizarán ejercicios relacionados con el uso de las APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js.

## Tareas Previas

- [x] Aceptar la [asignación](https://classroom.github.com/a/NApXvVde) de la práctica en Github Classroom.
- [] Familiarizarse con la clase `EventEmitter` de Node.js, del módulo `events`.
- [x] Familiarizarse con el módulo `fs` de Node.js.
- [] Familiarizarse con el módulo `child_process` de Node.js.
- [] Familiarizarse con el módulo `net` de Node.js.
- [x] Repasar los paquetes `yargs` y `chalk` que habíamos utilizado en la práctica anterior.

## Ejercicio 1

Considerando el siguiente ejemplo de uso de la API asíncrona de gestión del sistema de ficheros de Node.js:

```typescript
import { access, constants, watch } from 'fs'

if (process.argv.length !== 3) {
  console.log('Please, specify a file')
} else {
  const filename = process.argv[2]

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`)
    } else {
      console.log(`Starting to watch file ${filename}`)

      const watcher = watch(process.argv[2])

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`)
      })

      console.log(`File ${filename} is no longer watched`)
    }
  })
}
```

Realizar una traza de ejecución mostrando, paso a paso, el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores, además de lo que se muestra por la consola.

- ¿Qué hace la función `access`?
- ¿Para qué sirve el objeto `constants`?

## Ejercicio 2

## PE120

Desarrollar un cliente y un servidor en Node.js, haciendo uso de sockets, que incorporen la siguiente funcionalidad:

- El cliente debe recibir, desde la línea de comandos, un comando Unix/Linux, además de sus argumentos correspondientes, que ejecutaremos en el servidor.

- El servidor debe recibir la petición del cliente, procesarla, esto es, ejecutar el comando solicitado, y devolver la respuesta del comando al cliente. Para ello, piense que el comando solicitado puede haberse ejecutado correctamente o puede haber fallado, por ejemplo, por no existir o porque se le han pasado unos argumentos no válidos.
