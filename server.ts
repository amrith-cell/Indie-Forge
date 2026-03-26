/**
 * CLOUD DEPLOYMENT PROXY
 * Ensures that legacy PaaS cloud providers executing this root file are accurately routed into the isolated robust backend environment.
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Cloud execution intercepted at root. Bootstrapping isolated backend...");

const backendPath = path.join(__dirname, 'backend');

// Boot the backend Express app using ts-node inside the backend context so it automatically discovers its own isolated node_modules array.
const api = spawn('npx', ['ts-node', 'server.ts'], { 
  cwd: backendPath, 
  stdio: 'inherit', 
  shell: true 
});

api.on('close', (code) => {
  console.log(`Cloud Runtime Terminated: Backend process exited with code ${code}`);
  process.exit(code || 0);
});
