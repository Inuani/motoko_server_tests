// require('dotenv').config();

// const { HttpAgent } = require("@dfinity/agent");
// const fs = require("fs");
// const path = require("path");
// const { Ed25519KeyIdentity } = require("@dfinity/identity");
// const { AssetManager } = require("@dfinity/assets");
// const { spawn } = require("child_process");


// // Create a test identity
// const encoder = new TextEncoder();
// const seed = new Uint8Array(32);
// const base = encoder.encode("test");
// seed.set(base, 0);
// seed.fill(0);
// const testIdentity = Ed25519KeyIdentity.generate(seed);

// const canisterId = process.env.CANISTER_ID_HTTP_SERVER_TEST

// const HOST = `http://127.0.0.1:4943`;

// // const HOST = `https://ic0.app`;

// // First authorize the identity
// console.log("Authorizing identity...");
// const child = spawn("dfx", [
//   "canister",
//   "call",
//   "http_server_test",
//   "authorize",
//   `(principal "${testIdentity.getPrincipal().toText()}")`,
// ]);

// child.stdout.on("data", (data) => {
//   console.log(`Authorization success: ${data}`);
// });

// child.stderr.on("data", (data) => {
//   console.error(`Authorization error: ${data}`);
// });

// // Only proceed with upload after authorization
// child.on("close", (code) => {
//   if (code === 0) {
//     uploadAssets();
//   }
// });

// async function uploadAssets() {
//   const agent = new HttpAgent({ 
//     host: HOST,
//     identity: testIdentity 
//   });
//   await agent.fetchRootKey();

//   const assetManager = new AssetManager({
//     canisterId,
//     agent,
//   });

//   const assets = [];
//   fs.readdirSync(path.join(__dirname, "src/assets")).forEach((file) => {
//     assets.push([file, fs.readFileSync(path.join(__dirname, "src/assets", file))]);
//   });

//   console.log(`Uploading ${assets.length} files...`);
  
//   for (const [name, file] of assets) {
//     const key = await assetManager.store(file, { fileName: name });
//     const asset = await assetManager.get(key);
//     console.log(`Uploaded ${name}, size: ${asset.length} bytes`);
//   }
// }


require('dotenv').config();
const { HttpAgent, Actor } = require("@dfinity/agent");
const fs = require("fs");
const path = require("path");
const { Ed25519KeyIdentity } = require("@dfinity/identity");
const { AssetManager } = require("@dfinity/assets");
const { spawn } = require("child_process");

// Create a test identity
const encoder = new TextEncoder();
const seed = new Uint8Array(32);
const base = encoder.encode("test");
seed.set(base, 0);
seed.fill(0);
const testIdentity = Ed25519KeyIdentity.generate(seed);

const canisterId = process.env.CANISTER_ID_HTTP_SERVER_TEST;
const HOST = "https://ic0.app";

// First authorize the identity
console.log("Authorizing identity...");
const child = spawn("dfx", [
  "canister",
  "--network",
  "ic",
  "call",
  "http_server_test",
  "authorize",
  `(principal "${testIdentity.getPrincipal().toText()}")`,
]);

child.stdout.on("data", (data) => {
  console.log(`Authorization success: ${data}`);
});

child.stderr.on("data", (data) => {
  console.error(`Authorization error: ${data}`);
});

// Only proceed with upload after authorization
child.on("close", (code) => {
  if (code === 0) {
    uploadAssets();
  }
});

async function uploadAssets() {
  const agent = new HttpAgent({
    host: HOST,
    identity: testIdentity
  });

  const assetManager = new AssetManager({
    canisterId,
    agent,
  });

  // First clear existing assets
  console.log("Clearing existing assets...");
  await assetManager.clear();

  const assets = [];
  fs.readdirSync(path.join(__dirname, "src/assets")).forEach((file) => {
    assets.push([file, fs.readFileSync(path.join(__dirname, "src/assets", file))]);
  });

  console.log(`Uploading ${assets.length} files...`);
  
  for (const [name, file] of assets) {
    const key = await assetManager.store(file, { fileName: name });
    const asset = await assetManager.get(key);
    console.log(`Uploaded ${name}, size: ${asset.length} bytes`);
  }
}