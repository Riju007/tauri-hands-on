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
    const { available, currentVersion, latestVersion } = await check();

    if (available) {
      versionData.textContent = `Update available! ${currentVersion} → ${latestVersion}`;

      // Ask user if they want to install
      if (confirm(`Update available: ${latestVersion}\nCurrent: ${currentVersion}\n\nInstall now?`)) {
        const { download, install } = window.__TAURI__.updater;

        versionData.textContent = "Downloading update...";
        await download();

        versionData.textContent = "Installing update...";
        await install();

        versionData.textContent = "Update installed! Restarting...";
      }
    } else {
      versionData.textContent = `Already on latest version: ${currentVersion}`;
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
