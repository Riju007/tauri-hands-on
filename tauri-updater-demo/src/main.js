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
});

// version code
