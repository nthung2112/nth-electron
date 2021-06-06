const childProcess = require('child_process');

// Invoke "yarn react-start" and "yarn electron-start".
const options = process.platform === 'win32' ? { shell: true } : {};
const parts = ['react', 'electron'].map((arg) => spawn('yarn', [`${arg}-start`, ...process.argv.slice(2)], options));

// Wait for either to complete then kill the other.
Promise.race(parts.map((part) => part.promise)).then((child) => parts.filter((part) => part.child !== child).forEach(kill));

function spawn(command, args, options) {
  const child = childProcess.spawn(command, args, options);
  child.stderr.on('data', (data) => process.stderr.write(data.toString()));
  child.stdout.on('data', (data) => process.stdout.write(data.toString()));
  return {
    child,
    promise: new Promise((resolve, _reject) => {
      let hasResolved = false;
      child.on('error', (_ex) => {
        hasResolved = hasResolved || (resolve(child), true);
      });
      child.on('exit', (_code) => {
        hasResolved = hasResolved || (resolve(child), true);
      });
    }),
  };
}

function kill({ child }) {
  if (process.platform === 'win32') {
    childProcess.spawnSync('taskkill', ['/f', '/pid', child.pid, '/t']);
  } else {
    child.kill();
  }
}
