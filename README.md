##Configuracion basica de SendBirChat V4 con Angular 15.
## Ejemplo Senbirchat v4 con [Angular 14](https://stackblitz.com/edit/angular-ivy-2peatk?file=src%2Fapp%2Fapp.component.ts).
##1-Para esto deben Tener una cuenta en Senbird: https://sendbird.com/ (Si no la tienen se pueden Registrar).

##2-Crear la aplicacion en la url mencionada una ves registrados, les va a dar una ID de la Aplicacion que es la que necesitan para Conectarse.
##3-Modulos a Instalar:
##
npm install --save @sendbird/chat
##
npm i @react-native-async-storage/async-storage
##
npm i sweetalert2
##
npm i @fortawesome/angular-fontawesome
##
npm i @fortawesome/free-solid-svg-icons
##
npm i bootstrap
##
npm i @popperjs/core
##
##Para SendbirdCall se Necesita instalar lo siguiente:
##
npm install sendbird-calls
##
## a Tener en cuenta con Sendbird Call:
Es posible que al iniciar con "ng serve" les tire un error.(para solucionarlo:)
##
Abrir el archivo "SendBirdCall.min.d.ts" que esta  node_modules/sendbird-calls
##
y editan la siguiente Linea
##
(...args: ArgsType<T>): void;  --(la remplazan por)-->  (...args: ArgsType<T>[]): void;
##
 
##4- El proyecto es totalmente publico y sin fines de lucro, solo con fines educativos.
##
Saludos Cordiales.
##
Pablo
##
# Chatsbv4

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
