// src/utils/getVersion.js
import { execSync } from "child_process";

export function getGitVersion() {
  try {
    // Get just the latest tag
    let tag = "";
    try {
      tag = execSync("git describe --tags --abbrev=0").toString().trim();
      // Remove 'v' prefix if it exists
      return tag.startsWith("v") ? tag.slice(1) : tag;
    } catch (e) {
      return "0.1.0"; // Default if no tags exist
    }
  } catch (error) {
    console.error("Error getting git version:", error);
    return "unknown";
  }
}
