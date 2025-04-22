import fetch from 'node-fetch';

const BACKEND_URL = 'http://127.0.0.1:3002/health';
const MAX_RETRIES = 30;
const RETRY_DELAY = 1000; // 1 second

async function checkBackend(retryCount = 1) {
  try {
    console.log(`Making request to ${BACKEND_URL}...`);
    const response = await fetch(BACKEND_URL);
    console.log(`Response status: ${response.status}`);
    
    const text = await response.text();
    console.log(`Response body: ${text}`);
    
    const data = JSON.parse(text);
    console.log(`Parsed data:`, data);

    if (data.status === 'healthy') {
      console.log('Backend is ready!');
      
      // Start frontend
      const { spawn } = await import('child_process');
      spawn('npm', ['run', 'dev:frontend'], { 
        stdio: 'inherit',
        shell: true 
      });
      return;
    }
    
    throw new Error(`Backend not healthy: ${data.status}`);
  } catch (error) {
    console.error(`Error details:`, error);

    if (retryCount >= MAX_RETRIES) {
      console.error('Backend failed to become ready in time');
      process.exit(1);
    }

    console.log(`Attempt ${retryCount}/${MAX_RETRIES}: Backend not ready, retrying in 1s...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return checkBackend(retryCount + 1);
  }
}

checkBackend();
