// import {invoke} from "@tauri-apps/api/core";
const { invoke } = window.__TAURI__.core;

// 1. select dom element
const fileNameInput = document.getElementById("filename-input");
const contentInput = document.getElementById("content-input");
const saveBtn = document.getElementById("save-btn");
const snippetList = document.getElementById("snippet-list")

// 2. Define the function to fetch and display snippets
async function loadSnippets() {
    // call the rust command
    // Rust returns a Vec<String>, which becomes a JS array
    const snippets = await invoke("list_snippets");

    // clear the current list to avoid duplicate
    snippetList.innerHTML = "";

    // loop through the array and create list items
    snippets.forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;

        // Styling hint: make it look clickable 
        li.style.cursor = "pointer";
        li.style.padding = "5px";

        snippetList.appendChild(li);
    });
}
// 3. add the click listener
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

    // refresh the list immediately after saving
    loadSnippets();
})

// 4. Load the list when app starts
loadSnippets();