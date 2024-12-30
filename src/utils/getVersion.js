import { execSync } from "child_process";

export function getGitVersion() {
  try {
    // Get the latest tag using git describe
    const tag = execSync("git describe --tags").toString().trim();

    // Remove 'v' prefix if it exists
    return tag.startsWith("v") ? tag.slice(1) : tag;
  } catch (error) {
    console.error("Error getting git version:", error);
    // Log the full error for debugging
    console.error("Full error:", error.message);
    return "0.0.1";
  }
}
