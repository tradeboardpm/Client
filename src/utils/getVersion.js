// src/utils/getVersion.js
import { execSync } from "child_process";

export function getGitVersion() {
  try {
    // First check if there are any tags
    const hasTag = execSync("git tag").toString().trim();

    if (!hasTag) {
      return "0.0.1"; // Return initial version if no tags exist
    }

    // Get the latest tag using git describe
    const tag = execSync(
      "git describe --tags $(git rev-list --tags --max-count=1)"
    )
      .toString()
      .trim();

    // Remove 'v' prefix if it exists
    return tag.startsWith("v") ? tag.slice(1) : tag;
  } catch (error) {
    console.error("Error getting git version:", error);
    // Log the full error for debugging
    console.error("Full error:", error.message);
    return "0.0.1";
  }
}
