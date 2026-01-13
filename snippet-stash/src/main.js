// import {invoke} from "@tauri-apps/api/core";
const { invoke } = window.__TAURI__.core;

// 1. select dom element
const fileNameInput = document.getElementById("filename-input");
const contentInput = document.getElementById("content-input");
const saveBtn = document.getElementById("save-btn");

// 2. add the click listener
saveBtn.addEventListener("click", async () => {
    const name = fileNameInput.value;
    const content = contentInput.value;

    // 3. call the rust backend
    // The first argument "save_snippet" matches the function name is lib.rs
    // the second argument is an object where keys match the rust arguments
    await invoke("save_snippet", {name: name, content: content});

    // optional: clear the inputs to show it "worked"
    console.log("Sent to rust!");
    fileNameInput.value = "";
    contentInput.value = "";
})
