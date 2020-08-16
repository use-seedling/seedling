import { join } from "../../deps.ts";
import config from "../config/index.ts";

// Used for debugging and preventing multiple false attempts
// Should not be commited to source control
const statusFile = join(Deno.cwd(), `/.esbuild-debug.log`);

const installESBuild = async (): Promise<boolean> => {
  const version = "0.6.24";
  const os = Deno.build.os;
  let status = false;
  const commands = [
    [
      "curl",
      "-O",
      `https://registry.npmjs.org/esbuild-${os}-64/-/esbuild-${os}-64-${version}.tgz`,
    ],
    [
      "tar",
      "xf",
      `./esbuild-${os}-64-${version}.tgz`,
    ],
    [
      "rm",
      `./esbuild-${os}-64-${version}.tgz`,
    ],
  ];

  // Install ES Build
  try {
    // Run all commands
    for (let i = 0, len = commands.length; i < len; i++) {
      const proc = Deno.run({
        cmd: commands[i],
        stdout: "piped",
        stderr: "inherit",
      });

      await proc.status();
      await proc.output();
      proc.close();
    }

    status = true;
  } catch (e) {
    console.log("Unable to install ES Build");
  }

  // Make file to identiy that we attempted to install
  await Deno.writeTextFile(
    statusFile,
    `This file was created by Seedling, not ESBuild\n\nESBuild version ${version} was ${
      status ? "installed" : "not installed"
    } for ${os}.`,
  );

  return status;
};

// Checks if we can use ES Build
const useESBuild = async (): Promise<boolean> => {
  // Ensure we didn't invalidate with config
  if (!config.esbuild) return false;

  // Make sure we can run --allow-run
  const status = await Deno.permissions.query({ name: "run" });
  if (status.state === "granted") {
    const esBuildPath = join(
      Deno.cwd(),
      `/package/bin/esbuild${Deno.build.os === "windows" ? ".exe" : ""}`,
    );

    try {
      // Make sure file exists
      await Deno.lstat(esBuildPath);
      return true;
    } catch (e) {
      // Check if it was installed before
      return Deno.lstat(statusFile).then(() => {
        // File Exists
        return false;
      }).catch(async () => {
        // No installation, lets try and install
        return await installESBuild();
      });
    }
  }

  return false;
};

export { installESBuild, useESBuild };
