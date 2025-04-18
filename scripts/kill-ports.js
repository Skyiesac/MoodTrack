import { execSync } from 'child_process';

const PORTS = [3002, 5184];

function killPort(port) {
  try {
    // Get process ID using lsof
    const pid = execSync(`lsof -t -i:${port}`).toString().trim();
    
    if (pid) {
      console.log(`Killing process on port ${port} (PID: ${pid})`);
      execSync(`kill -9 ${pid}`);
      return true;
    }
  } catch (error) {
    // If lsof returns nothing, the port is not in use
    return false;
  }
  return false;
}

console.log('Checking for processes on required ports...');

for (const port of PORTS) {
  if (killPort(port)) {
    console.log(`Cleared port ${port}`);
  } else {
    console.log(`Port ${port} is already free`);
  }
}
