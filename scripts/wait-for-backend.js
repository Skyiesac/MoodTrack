import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:3002';
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 1000; // 1 second

async function checkHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    return false;
  }
}

async function waitForBackend() {
  console.log('Waiting for backend to be ready...');
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    const isHealthy = await checkHealth();
    
    if (isHealthy) {
      console.log('Backend is ready!');
      process.exit(0);
    }
    
    console.log(`Attempt ${i + 1}/${MAX_RETRIES}: Backend not ready, retrying in ${RETRY_INTERVAL/1000}s...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
  }
  
  console.error('Backend failed to become ready in time');
  process.exit(1);
}

waitForBackend().catch(error => {
  console.error('Error while waiting for backend:', error);
  process.exit(1);
});
