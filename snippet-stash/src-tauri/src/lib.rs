use std::fs;
use std::path::{Path, PathBuf};

#[tauri::command]
fn save_snippet(name: String, content: String) {
    // 1. define a folder to store snippets (related to where the app runs)
    let folder_path: &Path = Path::new("snippets/riju");

    // 2. create the directory if it does not exists.
    // fs::create_dir_all is like `mkdir -p`
    if !folder_path.exists() {
        let _ = fs::create_dir_all(folder_path);
    }

    // 3. Construct the full file path
    // .join() is the os-agnostic way to combine paths (handles / vs \)
    let file_path: PathBuf = folder_path.join(name);

    // 4. write the file
    // logical flow: Try to write -> if error, print it
    match fs::write(file_path, content) {
        Ok(_) => println!("File saved successfully"),
        Err(e) => println!("Failed to save file: {}", e),
    }
}
#[tauri::command]
fn list_snippets() -> Vec<String> {
    let mut snippets = Vec::new();
    let folder_path = Path::new("snippets/riju");
    if folder_path.exists() {
        if let Ok(entries) = fs::read_dir(folder_path) {
            for entry in entries {
                if let Ok(entry) = entry {
                    if let Ok(name) = entry.file_name().into_string() {
                        snippets.push(name);
                    }
                }
            }
        }
    }
    snippets
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_snippet, list_snippets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
