// src/utils/getVersion.js
import { execSync } from "child_process";

export function getGitVersion() {
  try {
    // Get the short hash of the latest commit
    const shortHash = execSync("git rev-parse --short HEAD").toString().trim();

    // Get the latest tag (if any)
    let tag = "";
    try {
      tag = execSync("git describe --tags --abbrev=0").toString().trim();
    } catch (e) {
      tag = "0.1.0"; // Default if no tags exist
    }

    // Get commit count since last tag
    const commitCount = execSync("git rev-list HEAD --count").toString().trim();

    // Combine tag and commit count
    return `${tag}-${commitCount}-${shortHash}`;
  } catch (error) {
    console.error("Error getting git version:", error);
    return "unknown";
  }
}

