# Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js

[![Node.js CI](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/node.js.yml) [![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/coveralls.yml) [![Sonar-Cloud](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/sonarcloud.yml) [![pages-build-deployment](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-iluzioDev/actions/workflows/pages/pages-build-deployment)

Durante esta práctica se realizarán ejercicios relacionados con el uso de las APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js.

## Tareas Previas

- [x] Aceptar la [asignación](https://classroom.github.com/a/NApXvVde) de la práctica en Github Classroom.
- [x] Familiarizarse con la clase `EventEmitter` de Node.js, del módulo `events`.
- [x] Familiarizarse con el módulo `fs` de Node.js.
- [x] Familiarizarse con el módulo `child_process` de Node.js.
- [x] Familiarizarse con el módulo `net` de Node.js.
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

### Traza de Ejecución

**Pila de Llamadas:** Iniciar el programa: test.ts

**Registro de eventos de la API:** ninguna actividad

**Cola de manejadores:** 

ninguna actividad
La función global del archivo comprueba si se proporcionó un argumento válido y, en caso contrario, imprime un mensaje de error en la consola y sale del programa. Como el argumento es válido, el código continúa ejecutando.
Pila de llamadas:

global function
Registro de eventos de la API:

ninguna actividad
Cola de manejadores:

ninguna actividad
La función global del archivo llama a fs.access() para comprobar si el archivo especificado existe. Se agrega una nueva entrada a la pila de llamadas para la llamada a fs.access().
Pila de llamadas:

fs.access()
global function
Registro de eventos de la API:

ninguna actividad
Cola de manejadores:

ninguna actividad
La función fs.access() devuelve null en la función de devolución de llamada, lo que indica que el archivo existe. La función de devolución de llamada se ejecuta sin errores. El código continúa ejecutando.
Después de que se maneje el resultado de fs.access(), la pila de llamadas se deshace de la entrada para fs.access().

Pila de llamadas:

global function
Registro de eventos de la API:

ninguna actividad
Cola de manejadores:

ninguna actividad
La función global del archivo llama a fs.watch() para crear un objeto de vigilancia para el archivo especificado. Se agrega una nueva entrada a la pila de llamadas para la llamada a fs.watch().
Pila de llamadas:

fs.watch()
global function
Registro de eventos de la API:

ninguna actividad
Cola de manejadores:

ninguna actividad
La función fs.watch() devuelve un objeto de vigilancia para el archivo especificado. El objeto de vigilancia se usa para detectar cambios en el archivo. La función de devolución de llamada para la detección de cambios se registra con el objeto de vigilancia.
Después de que se cree el objeto de vigilancia, la pila de llamadas se deshace de la entrada para fs.watch().

Pila de llamadas:

global function
Registro de eventos de la API:

ninguna actividad
Cola de manejadores:

ninguna actividad
Se imprime un mensaje en la consola que indica que se está observando el archivo.
Pila de llamadas:

global function
Registro de eventos de la API:

ninguna actividad
Cola de manejadores:

ninguna actividad
Se lleva a cabo una modificación en el archivo helloworld.txt. El objeto de vigilancia detecta el cambio y agrega un evento change a la cola de manejadores.
Pila de llamadas:

global function
Registro de eventos de la API:

change evento agregado a la cola de manej

## Ejercicio 2

Desarrollar una aplicación que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto. La ruta donde se encuentra el fichero deberá ser un parámetro pasado a la aplicación desde la línea de comandos. Adicionalmente, también deberá indicarle al programa desde la línea de comandos si desea visualizar el número de líneas, palabras, caracteres o combinaciones de ellas.

Llevar a cabo el ejercicio anterior de dos maneras diferentes:

- Haciendo uso del método pipe de un Stream para poder redirigir la salida de un comando hacia otro.
- Sin hacer uso del método pipe, solamente creando los subprocesos necesarios y registrando manejadores a aquellos eventos necesarios para implementar la funcionalidad solicitada.

### Planteamiento del ejercicio

Para llevar a cabo el ejercicio, se ha construido una clase abstracta padre para la implementación de las dos alternativas. Esta clase se llama `BasicReader` y contiene los métodos `lines`, `words` y `characters`, que devuelven el número de líneas, palabras y caracteres que contiene el fichero de texto. Las clases que definirán las dos alternativas se llamarán `PipeReader` y `HandlerReader`, respectivamente, y lo que harán será sobreescribir los métodos mencionados.

```typescript
export abstract class BasicReader {
  public constructor(protected path: string) {}
  public abstract lines: (callback: (data: number | undefined) => void) => void
  public abstract words: (callback: (data: number | undefined) => void) => void
  public abstract characters: (
    callback: (data: number | undefined) => void
  ) => void
}
```

Podemos observar como los métodos se han definido siguiendo el patrón callback, para facilitar las pruebas en Mocha.

### Implementación con el método pipe

La clase `PipeReader`, como su nombre indica, implementa los métodos redirigiendo la salida de un comando hacia otro. Sin embargo, para mayor control se ha realizado una pequeña modificación, en vez de utilizar el método `pipe` (tal como se puede ver en el comentario), se ha utilizado el evento `data` del Stream de salida del comando, para poder almacenar la salida en una variable y poder procesarla posteriormente. Se ha hecho de esta manera para poder realizar las pruebas unitarias con Mocha y controlar los valores de salida.

```typescript
export class PipeReader extends BasicReader {
  public constructor(protected path: string) {
    super(path)
  }

  public lines = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const wc = spawn('wc', ['-l', this.path])
    // wc.stdout.pipe(process.stdout)
    let output = ''
    wc.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    wc.on('exit', () => {
      callback(parseInt(output.split(' ')[0]))
    })
  }

  public words = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const wc = spawn('wc', ['-w', this.path])
    // wc.stdout.pipe(process.stdout)
    let output = ''
    wc.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    wc.on('exit', () => {
      callback(parseInt(output.split(' ')[0]))
    })
  }

  public characters = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const wc = spawn('wc', ['-m', this.path])
    // wc.stdout.pipe(process.stdout)
    let output = ''
    wc.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    wc.on('exit', () => {
      callback(parseInt(output.split(' ')[0]))
    })
  }
}
```

### Implementación sin el método pipe

La clase `HandlerPipe` implementa los métodos sin hacer uso del método `pipe`, creando los subprocesos necesarios y registrando manejadores a aquellos eventos necesarios para detectar cuando se ha terminado de leer el fichero.

```typescript
export class HandlerReader extends BasicReader {
  public constructor(protected path: string) {
    super(path)
  }

  public lines = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const readStream = fs.createReadStream(this.path, 'utf8')
    let lines = 0
    readStream.on('data', (chunk) => {
      lines += chunk.toString().split(/\r\n|\r|\n/).length - 1
    })
    readStream.on('end', () => {
      callback(lines)
    })
  }

  public words = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const readStream = fs.createReadStream(this.path, 'utf8')
    let words = 0
    readStream.on('data', (chunk) => {
      words += chunk.toString().replace(/\s+/g, '\n').split(/\n/).length - 1
    })
    readStream.on('end', () => {
      callback(words)
    })
  }

  public characters = (callback: (data: number | undefined) => void): void => {
    if (!fs.existsSync(this.path)) {
      callback(undefined)
      return
    }
    const readStream = createReadStream(this.path, 'utf8')
    let characters = 0
    readStream.on('data', (chunk) => {
      characters += chunk.toString().length
    })
    readStream.on('end', () => {
      callback(characters)
    })
  }
}
```

### Ejecución del programa

Se ha escrito un fichero `main.ts` dónde se ha utilizado el paquete `yargs` para poder pasar los argumentos desde la línea de comandos. El programa se ejecuta de la siguiente manera:

```console
node main.js read-info --path "FILE_PATH" [--lines] [--words] [--characters]
```

Las opciones `--lines`, `--words` y `--characters` son opcionales, si no se especifica ninguna, no se mostrará nada por pantalla. Así si ejecutamos por ejemplo:

```console
node main.js read-info --path ".gitignore" --lines --words --characters
Number of lines: 7
Number of words: 7
Number of characters: 78
```

Teniendo en cuenta que el fichero `.gitignore` tiene el siguiente contenido:

```console
dist
node_modules
package-lock.json
.nyc_output
coverage
.coveralls.yml
data/
```

## Ejercicio 3 - Cliente y servidor para aplicación de registro de Funko Pops

## PE120

Desarrollar un cliente y un servidor en Node.js, haciendo uso de sockets, que incorporen la siguiente funcionalidad:

- El cliente debe recibir, desde la línea de comandos, un comando Unix/Linux, además de sus argumentos correspondientes, que ejecutaremos en el servidor.

- El servidor debe recibir la petición del cliente, procesarla, esto es, ejecutar el comando solicitado, y devolver la respuesta del comando al cliente. Para ello, piense que el comando solicitado puede haberse ejecutado correctamente o puede haber fallado, por ejemplo, por no existir o porque se le han pasado unos argumentos no válidos.

### Desarrollo del Ejercicio

Para este ejercicio se han creado dos clases: `Client` y `Server`. La clase `Client` se encarga de enviar la petición al servidor, y la clase `Server` se encarga de recibir la petición del cliente y ejecutar el comando solicitado.

```typescript
export class Client {
  public port: number = -1
  public socket: net.Socket

  public constructor(port?: number) {
    if (port) this.port = port
    this.socket = new net.Socket()
  }

  public connect = (
    args: string[],
    callback: (success: boolean) => void = () => {}
  ): void => {
    if (this.port >= 0) {
      this.socket.connect(this.port)
      this.sendCommand(args, (success) => {
        if (success) {
          this.receiveOutput((data) => {
            console.log(data)
            this.socket.end()
            callback(true)
          })
        } else {
          console.log('Invalid command')
        }
      })
    } else {
      console.log('Invalid port')
      callback(false)
    }
  }

  private sendCommand = (
    args: string[],
    callback: (success: boolean) => void
  ): void => {
    if (argv.length >= 3) {
      this.socket.write(
        JSON.stringify({ command: args[2], arguments: args.slice(3) }) + '\n'
      )
      callback(true)
    } else {
      callback(false)
    }
  }

  private receiveOutput = (callback: (data?: string) => void): void => {
    let output = ''
    this.socket.on('data', (data) => {
      output += data.toString()
    })
    this.socket.on('end', () => {
      callback(output)
    })
  }
}
```

```typescript
export class Server {
  public port: number = -1
  public server: net.Server = new net.Server()

  public constructor(port?: number) {
    if (port) this.port = port
  }

  public listen = (callback: (success: boolean) => void): void => {
    if (this.port < 0) {
      console.error('Invalid port')
      callback(false)
      return
    } else {
      this.server = net
        .createServer(this.handleConnection)
        .listen(this.port, () => {
          console.log('Waiting for client')
        })
      this.server.on('close', () => {
        console.log('Server closed')
        callback(true)
      })
    }
  }

  private handleConnection = (connection: net.Socket): void => {
    console.log('Client connected')
    let output = ''
    connection.on('data', (data) => {
      output += data.toString()
      if (output.includes('\n')) {
        console.log('Received data from client: ' + output)
        const file = JSON.parse(output)
        this.execute(
          file.command + ' ' + file.arguments.join(' '),
          connection,
          (success) => {
            if (success)
              console.log('Command executed and result sent to client')
            else console.error('Error executing or sending result to client')
            connection.end()
          }
        )
      }
    })
  }

  private execute = (
    command: string,
    connection: net.Socket,
    callback: (success: boolean) => void = () => {}
  ): void => {
    exec(command, (error, stdout, _) => {
      if (error) {
        console.error(error)
        connection.write(error.message)
        callback(false)
      } else {
        console.log(stdout)
        connection.write(stdout)
        callback(true)
      }
    })
  }
}
```

En este caso se ha optado por indicarle al servidor cuándo ha terminado la transimisión del comando por parte del cliente a través de un salto de línea. Esto se hace para que el servidor pueda recibir el comando completo y no se quede esperando, una vez ocurre esto, el servidor ejecuta el comando y envía la respuesta al cliente.
