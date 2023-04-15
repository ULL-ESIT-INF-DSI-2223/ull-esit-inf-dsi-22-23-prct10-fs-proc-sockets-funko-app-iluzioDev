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

Consiste en una función asíncrona que comprueba los permisos de acceso a un archivo o directorio. En este caso se comprueba si el archivo existe.

- ¿Para qué sirve el objeto `constants`?

Es una constante del paquete `fs` que determina si el fichero es accesible para lectura, escritura o ejecución, es decir, si el fichero existe.

### Ejecución

- Se inicia el programa con el siguiente comando: ``node test.ts helloworld.txt`, y se añade a la pila de llamadas la función global del archivo.
- Se comprueba que la longitud del vector de argumentos sea 3, ya que los dos primeros argumentos son el comando de ejecución, es decir `node`, y el segundo argumento es el nombre del archivo, en este caso `test.ts`. En nuestro caso el tercer argumento es el nombre de un archivo de texto.
- En este caso como se ha especificado un archivo, se llama a la función `access` pasándole como parámetro el nombre del archivo y la constante `F_OK`, que indica que se comprueba si el archivo existe. Al llamar a la función `access` se añade una nueva entrada a la pila de llamadas.
- En el caso de error, se muestra por consola el mensaje `File helloworld.txt does not exist`, y se elimina la entrada de la pila de llamadas.
- En caso contrario, se muestra por consola el mensaje `Starting to watch file helloworld.txt`, y se llama a la función `watch` pasándole como parámetro el nombre del archivo. Al llamar a la función `watch` se añade una nueva entrada a la pila de llamadas.
- Si modificamos el archivo `helloworld.txt`, se detecta el cambio y se añade un evento `change` a la cola de manejadores, este evento se ejecuta cuando se vacía la pila de llamadas, es decir, cuando se termina de ejecutar el programa.
- Una vez se ha ejecutado el programa, se muestra por consola el mensaje `File helloworld.txt is no longer watched`, y se elimina la entrada de la pila de llamadas.

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

Implementar al ejercicio de la práctica 9 de la aplicación de registro de Funko Pops, un cliente y un servidor que permitan a los usuarios conectarse a la aplicación desde diferentes dispositivos. El servidor se encargará de procesar todas las peticiones de los clientes y devolverles una respuesta.

### Desarrollo del Ejercicio

Para este ejercicio, se han utilizado las mismas clases `FunkoPop` y `User` con sus respectivas clases padres, tipos y enumerados con modificaciones muy puntuales. Para implementar el cliente/servidor se han creado dos clases adicionales: `Client` y `FunkoApp`.

#### Cliente

Si en la anterior práctica se manejó `yargs` a través de un fichero `main.ts`, ahora nuestra clase Cliente se encargará de manejarlo:

```typescript
export class Client {
  public socket = new net.Socket()

  public constructor(
    public port = -1,
    public request: RequestType = { type: 'unknown', user: '' }
  ) {
    const commands = yargs(hideBin(process.argv))
      .command('add', 'Adds a funko', FunkoData, (argv) => {
        if (argv.type && !checkType(argv.type as string)) return
        if (argv.genre && !checkGenre(argv.genre as string)) return
        const funko = createFunko(argv)
        this.request = {
          user: argv.user as string,
          type: 'add',
          funkoPop: funko,
        }
      })
      .command('update', 'Updates a funko', FunkoData, (argv) => {
        if (argv.type && !checkType(argv.type as string)) return
        if (argv.genre && !checkGenre(argv.genre as string)) return

        const funko = createFunko(argv)
        this.request = {
          user: argv.user as string,
          type: 'update',
          funkoPop: funko,
        }
      })
      .command('remove', 'Removes a funko', BasicData, (argv) => {
        this.request = {
          user: argv.user as string,
          type: 'remove',
          id: argv.id as number,
        }
      })
      .command('list', 'Lists all funkos', UserData, (argv) => {
        this.request = {
          user: argv.user as string,
          type: 'list',
        }
      })
      .command('search', 'Searches for a funko', BasicData, (argv) => {
        this.request = {
          user: argv.user as string,
          type: 'search',
          id: argv.id as number,
        }
      })
      .help()

    if (process.argv.length > 2) commands.parse()
    else commands.showHelp()

    if (this.port < 0) console.log(chalk.red('Invalid port'))
  }

  public connect(
    request: RequestType,
    callback: (response: ResponseType) => void
  ) {
    this.socket.connect(this.port, 'localhost', () => {
      console.log(chalk.blue(`Client connected to port ${this.port}`))
      this.proccessCommand(request, (response) => {
        if (response) {
          this.socket.end()
          callback(response)
        }
      })
    })
  }

  private proccessCommand(
    request: RequestType,
    callback: (response: ResponseType | undefined) => void
  ) {
    if (request.type === 'unknown') {
      console.log(chalk.red('Unknown command'))
      callback(undefined)
    }
    console.log(
      chalk.blue(`Sending request to server: ${JSON.stringify(request)}`)
    )
    this.socket.write(JSON.stringify(request) + '\n')
    let data = ''
    this.socket.on('data', (chunk) => {
      data += chunk.toString()
    })
    this.socket.on('end', () => {
      const response: ResponseType = JSON.parse(data)
      switch (response.type) {
        case 'add':
          if (response.success)
            console.log(chalk.green('Funko added successfully'))
          else console.log(chalk.red('Already exists a funko with that ID'))
          break
        case 'update':
          if (response.success)
            console.log(chalk.green('Funko updated successfully'))
          else console.log(chalk.red('There is no funko with that ID'))
          break
        case 'remove':
          if (response.success)
            console.log(chalk.green('Funko removed successfully'))
          else console.log(chalk.red('There is no funko with that ID'))
          break
        case 'list':
          if (response.success) {
            if (response.funkoPops === undefined) return
            response.funkoPops.forEach((funko) => {
              FunkoPop.print(funko)
            })
          } else console.log(chalk.red('There are no funkos'))
          break
        case 'search':
          if (response.success) {
            if (response.funkoPops === undefined) return
            FunkoPop.print(response.funkoPops[0])
          } else console.log(chalk.red('There is no funko with that ID'))
          break
        default:
          console.log(chalk.red('Invalid response'))
      }
      callback(response)
    })
  }
}
```

Básicamente el Cliente se conecta al puerto indicado, y construye la petición a partir de los argumentos pasados por línea de comandos. Una vez construida la petición, se envía al servidor, y se espera a recibir la respuesta. Una vez recibida la respuesta, se muestra por pantalla el resultado de la operación en base a la respuesta recibida.

#### Servidor

```typescript
export class FunkoApp {
  public server: net.Server = new net.Server()

  public constructor(public port = -1) {
    if (this.port >= 0) {
      this.start()
    } else {
      console.log(chalk.red('Invalid port'))
    }
  }

  public start(): void {
    this.server = net
      .createServer(this.handleConnection)
      .listen(this.port, () => {
        console.log(chalk.green(`Server listening on port ${this.port}`))
      })
  }

  private handleConnection = (connection: net.Socket): void => {
    console.log(chalk.yellow('Client connected'))
    let data = ''
    connection.on('data', (chunk) => {
      data += chunk.toString()
      if (data.includes('\n')) {
        const request: RequestType = JSON.parse(data)
        connection.write(JSON.stringify(this.proccessRequest(request)))
        connection.end()
        console.log(chalk.yellow('Client disconnected'))
      }
    })
  }

  private proccessRequest = (request: RequestType): ResponseType => {
    const user = new User(request.user)
    user.load()
    let response: ResponseType = { type: 'unknown', success: false }
    switch (request.type) {
      case 'add':
        response = this.processAdd(user, request.funkoPop)
        break
      case 'update':
        response = this.processUpdate(user, request.funkoPop)
        break
      case 'remove':
        response = this.processRemove(user, request.funkoPop)
        break
      case 'search':
        response = this.processSearch(user, request.funkoPop)
        break
      case 'list':
        response = this.processList(user)
        break
    }
    user.save()
    return response
  }

  private processAdd = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user.addFunko(funkoPop).includes('Already exists')
        ? { type: 'add', success: false }
        : { type: 'add', success: true }
    return { type: 'add', success: false }
  }

  private processUpdate = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user
        .updateFunko(funkoPop)
        .includes(`not in ${user.name}'s collection`)
        ? { type: 'update', success: false }
        : { type: 'update', success: true }
    return { type: 'update', success: false }
  }

  private processRemove = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user
        .removeFunko(funkoPop.id)
        .includes(`not in ${user.name}'s collection`)
        ? { type: 'remove', success: false }
        : { type: 'remove', success: true }
    return { type: 'remove', success: false }
  }

  private processSearch = (
    user: User,
    funkoPop: FunkoPop | undefined
  ): ResponseType => {
    if (funkoPop)
      return user
        .searchFunko(funkoPop.id)
        .includes(`not in ${user.name}'s collection`)
        ? { type: 'search', success: false }
        : { type: 'search', success: true, funkoPops: [funkoPop] }
    return { type: 'search', success: false }
  }

  private processList = (user: User): ResponseType => {
    if (user.collection.length === 0) return { type: 'list', success: false }
    return { type: 'list', success: true, funkoPops: user.collection }
  }

  public stop(): void {
    this.server.close()
  }
}
```

El servidor se encarga de procesar toda la información, haciendo uso de la clase `User`, crea y modifica las carpetas de los usuarios existentes, y cada vez que recibe una conexión, la gestiona con el método `handleConnection`. Este método se encarga de recibir la petición del cliente, procesarla con el método `proccessRequest`, y devolver una respuesta al cliente.

¿Cómo sabe el servidor cuando ha recibido la petición completa? Pues se ha puesto como carácter de fin de petición el salto de línea, por lo que cuando se recibe un salto de línea, se sabe que la petición ha terminado, y se puede procesar para devolver la respuesta.

Así, si ejecutamos el servidor e intentamos conectarnos con el cliente veremos salidas por pantalla como las siguientes:

##### 1º Intento

**Servidor**

```console
node dist/Ejercicio-03-FunkoApp/FunkoApp/FunkoApp.js
Server listening on port 8080
```

**Cliente**

```console
node dist/Ejercicio-03-FunkoApp/FunkoApp/Client.js
Client.js [command]

Commands:
  Client.js add     Adds a funko
  Client.js update  Updates a funko
  Client.js remove  Removes a funko
  Client.js list    Lists all funkos
  Client.js search  Searches for a funko

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
Client connected to port 8080
Unknown command
Client disconnected
```

**Servidor**

```console
Client connected
Client disconnected
```

##### 2º Intento

**Servidor**

```console
node dist/Ejercicio-03-FunkoApp/FunkoApp/FunkoApp.js
Server listening on port 8080
```

**Cliente**

```console
node dist/Ejercicio-03-FunkoApp/FunkoApp/Client.js list --user "Iluzio"
Client connected to port 8080
Sending request to server: {"user":"Iluzio","type":"list"}
There are no funkos
Client disconnected
```

```console
node dist/Ejercicio-03-FunkoApp/FunkoApp/Client.js add --user "Iluzio" --id 0 --name "All Might" --desc "Nº 1 Hero" --type "Pop!" --genre "Anime" --brand "My Hero Academia" --brandId 0 --price 40
Client connected to port 8080
Sending request to server: {"user":"Iluzio","type":"add","funkoPop":{"id":0,"name":"All Might","description":"Nº 1 Hero","type":"Pop!","genre":"Anime","brand":"My Hero Academia","brandId":0,"marketPrice":40,"exclusive":false,"especial":""}}
Funko added successfully
Client disconnected
```

```console
node dist/Ejercicio-03-FunkoApp/FunkoApp/Client.js list --user "Iluzio"
Client connected to port 8080
Sending request to server: {"user":"Iluzio","type":"list"}
┌─────────────┬────────────────────┐
│   (index)   │       Values       │
├─────────────┼────────────────────┤
│     id      │         0          │
│    name     │    'All Might'     │
│ description │    'Nº 1 Hero'     │
│    type     │       'Pop!'       │
│    genre    │      'Anime'       │
│    brand    │ 'My Hero Academia' │
│   brandId   │         0          │
│  exclusive  │       false        │
│  especial   │         ''         │
└─────────────┴────────────────────┘
Market Price: $40
Client disconnected
```

```console
Client connected
Client disconnected
Client connected
Client disconnected
Client connected
Client disconnected
Client connected
Client disconnected
```

#### Peticiones y respuestas

Cabe destacar que el sistema de peticiones y respuestas funciona gracias a los siguientes tipos:

- `RequestType`: Tipo que define la estructura de una petición. Se compone de un usuario, un tipo de operación, un objeto `FunkoPop` y un identificador de `FunkoPop`, tanto el objeto como el identificador son opcionales, ya que no todos los tipos de operación necesitan de ellos (por ejemplo `list` no los requiere).
- `ResponseType`: Tipo que define la estructura de una respuesta. Se compone de un tipo de operación, un booleano que indica si la operación se ha realizado con éxito o no, y un array de objetos `FunkoPop`, este array es opcional, ya que no todas las operaciones devuelven un array de objetos `FunkoPop` (por ejemplo `add` no lo devuelve).

```typescript
export type RequestType = {
  user: string
  type: Operation
  funkoPop?: FunkoPop
  id?: number
}

export type ResponseType = {
  type: Operation
  success: boolean
  funkoPops?: FunkoPop[]
}
```

Y con esto habríamos terminado el ejercicio.

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

## Conclusiones

En esta práctica se ha podido comprobar que el uso de sockets es una herramienta muy útil para la comunicación entre procesos, ya que permite que estos puedan comunicarse de forma continua y así poder realizar tareas que requieran de una comunicación constante. A su vez, hemos aprendido que hay que tener mucho cuidado con la sincronización de los procesos, ya que si no se hace de forma correcta puede provocar que los procesos se queden bloqueados o que se produzcan errores en la comunicación.
