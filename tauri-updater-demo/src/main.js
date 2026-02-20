const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;
let versionBtn;
let versionData;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

async function get_version() {
  let version = await invoke("get_version");
  console.log(`Version is: ${version}`);
  versionData.textContent = version;
}

async function check_for_updates() {
  try {
    const { check } = window.__TAURI__.updater;
    
    const update = await check();
    
    if (update) {
      versionData.textContent = `Update available! 1.0.0 → ${update.version}`;
      
      if (confirm(`Update available: ${update.version}\nRelease date: ${update.date}\n\nInstall now?`)) {
        versionData.textContent = "Downloading and installing update...";
        await update.downloadAndInstall();
        
        versionData.textContent = "Update complete! Please restart the app.";
      }
    } else {
      versionData.textContent = `Already on latest version!`;
    }
  } catch (error) {
    console.error("Update check failed:", error);
    versionData.textContent = `Update check failed: ${error}`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
  versionBtn = document.querySelector("#version-button");
  versionData = document.querySelector("#version-data");
  versionBtn.addEventListener("click", (e) => {
    e.preventDefault();
    get_version();
  });
  document.querySelector("#update-button").addEventListener("click", (e) => {
    e.preventDefault();
    check_for_updates();
  });
});

// version code
