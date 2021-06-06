// This file is here to quiet electron-builder.  Without it, it complains about
// it missing even though it's not referenced anywhere in this application.
// Having "main": "build/electron.js", the desired entry point that is usually
// in the public folder, in package.json does not quiet it.  Targeting the
// public folder as the output of the main process build process comes with its
// own problems.
