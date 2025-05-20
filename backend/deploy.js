/**
 * Deployment script for Shakti Margam backend
 * 
 * This script automates the deployment process for the Shakti Margam backend.
 * It performs the following steps:
 * 1. Runs tests to ensure everything is working
 * 2. Builds the application
 * 3. Deploys the application to the specified environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Environment to deploy to (development, staging, production)
  environment: process.env.DEPLOY_ENV || 'development',
  
  // Whether to run tests before deployment
  runTests: process.env.RUN_TESTS !== 'false',
  
  // Whether to build the application before deployment
  build: process.env.BUILD !== 'false',
  
  // Whether to deploy the application
  deploy: process.env.DEPLOY !== 'false',
  
  // Deployment target (vercel, heroku, etc.)
  deployTarget: process.env.DEPLOY_TARGET || 'vercel'
};

// Print configuration
console.log('Deployment Configuration:');
console.log(JSON.stringify(config, null, 2));

// Run command and print output
function runCommand(command, options = {}) {
  console.log(`\n> ${command}`);
  try {
    const output = execSync(command, {
      stdio: 'inherit',
      ...options
    });
    return { success: true, output };
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return { success: false, error };
  }
}

// Run tests
function runTests() {
  console.log('\n=== Running Tests ===');
  
  // Run unit tests
  const unitTestResult = runCommand('npm run test:unit');
  if (!unitTestResult.success) {
    console.error('Unit tests failed. Aborting deployment.');
    process.exit(1);
  }
  
  // Run integration tests
  const integrationTestResult = runCommand('npm run test:integration');
  if (!integrationTestResult.success) {
    console.error('Integration tests failed. Aborting deployment.');
    process.exit(1);
  }
  
  console.log('All tests passed successfully.');
}

// Build the application
function buildApplication() {
  console.log('\n=== Building Application ===');
  
  // Clean build directory
  if (fs.existsSync('dist')) {
    console.log('Cleaning build directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // Create build directory
  fs.mkdirSync('dist', { recursive: true });
  
  // Copy source files
  console.log('Copying source files...');
  runCommand('cp -r src dist/');
  
  // Copy package.json and package-lock.json
  console.log('Copying package files...');
  runCommand('cp package.json dist/');
  runCommand('cp package-lock.json dist/');
  
  // Copy .env.example
  console.log('Copying environment files...');
  runCommand('cp .env.example dist/');
  
  // Create production .env file
  console.log('Creating production environment file...');
  const envContent = fs.readFileSync('.env.example', 'utf8');
  fs.writeFileSync('dist/.env', envContent.replace(/your_/g, 'production_'));
  
  console.log('Build completed successfully.');
}

// Deploy the application
function deployApplication() {
  console.log(`\n=== Deploying to ${config.environment} ===`);
  
  switch (config.deployTarget) {
    case 'vercel':
      deployToVercel();
      break;
    case 'heroku':
      deployToHeroku();
      break;
    default:
      console.error(`Unknown deployment target: ${config.deployTarget}`);
      process.exit(1);
  }
}

// Deploy to Vercel
function deployToVercel() {
  console.log('Deploying to Vercel...');
  
  // Check if Vercel CLI is installed
  const vercelCliResult = runCommand('vercel --version', { stdio: 'pipe' });
  if (!vercelCliResult.success) {
    console.error('Vercel CLI is not installed. Please install it with: npm install -g vercel');
    process.exit(1);
  }
  
  // Deploy to Vercel
  const deployResult = runCommand(`vercel --prod --confirm --env-file .env.${config.environment}`);
  if (!deployResult.success) {
    console.error('Deployment to Vercel failed.');
    process.exit(1);
  }
  
  console.log('Deployment to Vercel completed successfully.');
}

// Deploy to Heroku
function deployToHeroku() {
  console.log('Deploying to Heroku...');
  
  // Check if Heroku CLI is installed
  const herokuCliResult = runCommand('heroku --version', { stdio: 'pipe' });
  if (!herokuCliResult.success) {
    console.error('Heroku CLI is not installed. Please install it from: https://devcenter.heroku.com/articles/heroku-cli');
    process.exit(1);
  }
  
  // Deploy to Heroku
  const appName = `shakti-margam-${config.environment}`;
  const deployResult = runCommand(`git push heroku main`);
  if (!deployResult.success) {
    console.error('Deployment to Heroku failed.');
    process.exit(1);
  }
  
  console.log('Deployment to Heroku completed successfully.');
}

// Main function
function main() {
  console.log('=== Shakti Margam Backend Deployment ===');
  console.log(`Environment: ${config.environment}`);
  
  // Run tests if enabled
  if (config.runTests) {
    runTests();
  } else {
    console.log('\n=== Skipping Tests ===');
  }
  
  // Build application if enabled
  if (config.build) {
    buildApplication();
  } else {
    console.log('\n=== Skipping Build ===');
  }
  
  // Deploy application if enabled
  if (config.deploy) {
    deployApplication();
  } else {
    console.log('\n=== Skipping Deployment ===');
  }
  
  console.log('\n=== Deployment Process Completed ===');
}

// Run the main function
main();
