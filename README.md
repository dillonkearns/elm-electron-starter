# Elm Electron Starter
Get up and running with a cross-platform desktop app built in Elm. Electron allows you to render web pages in Elm as native desktop interfaces. Electron runs a web page and manages native desktop interfaces (quit application, set global shortcut, create multiple windows, etc.) using NodeJS.

Main Stack:
* `Electron`
* `Elm` (for the browser window part of Electron)
* `typescript` (for the NodeJS part of Electron)
* `webpack` with hot-module replacement
* `elm-test`

Elm Electron Starter uses typescript for the NodeJS code. It communicates between NodeJS/Typescript process and the Elm application using the npm package `elm-electron` to get type-safe inter-process messages.

To run, just
```bash
git clone https://github.com/dillonkearns/elm-electron-starter.git
npm install
npm start
```
