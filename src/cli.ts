#!/usr/bin/env node
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  select,
  text,
} from "@clack/prompts";
import pc from "picocolors";

const PROJECT_NAME_RE =
  /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// `dist/cli.js` -> package root -> `template`.
const TEMPLATE_DIR = resolve(__dirname, "..", "template");

type PackageManager = "pnpm" | "npm" | "bun" | "yarn";

interface RunOptions {
  packageManager: PackageManager;
  projectName: string;
  skipGit: boolean;
  skipInstall: boolean;
  targetDir: string;
}

const cliArgs = parseArgs(process.argv.slice(2));

await main(cliArgs);

interface CliArgs {
  pm: PackageManager | undefined;
  skipGit: boolean;
  skipInstall: boolean;
  target: string | undefined;
}

function parseArgs(argv: string[]): CliArgs {
  const out: CliArgs = {
    target: undefined,
    pm: undefined,
    skipInstall: false,
    skipGit: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a) {
      continue;
    }
    if (a === "--no-install") {
      out.skipInstall = true;
    } else if (a === "--no-git") {
      out.skipGit = true;
    } else if (a === "--pm") {
      const next = argv[i + 1];
      if (isPackageManager(next)) {
        out.pm = next;
        i++;
      }
    } else if (a.startsWith("--pm=")) {
      const v = a.slice("--pm=".length);
      if (isPackageManager(v)) {
        out.pm = v;
      }
    } else if (!a.startsWith("-") && out.target === undefined) {
      out.target = a;
    }
  }
  return out;
}

function isPackageManager(v: string | undefined): v is PackageManager {
  return v === "pnpm" || v === "npm" || v === "bun" || v === "yarn";
}

async function main(args: CliArgs): Promise<void> {
  intro(pc.bold("create-md-computer"));

  const projectName = await promptForName(args.target);
  if (projectName === undefined) {
    return;
  }

  const targetDir = resolve(process.cwd(), projectName);
  if (ensureEmptyDir(targetDir)) {
    // user opted out
    return;
  }

  const packageManager = args.pm ?? (await promptForPackageManager());
  if (packageManager === undefined) {
    return;
  }

  scaffold({
    targetDir,
    projectName,
    packageManager,
    skipInstall: args.skipInstall,
    skipGit: args.skipGit,
  });

  outro(
    [
      pc.green("Done."),
      "",
      pc.bold("Next:"),
      `  cd ${projectName}`,
      `  ${packageManager} dev`,
      "",
      pc.dim(
        "(First dev run installs missing shadcn primitives — takes a few seconds.)"
      ),
    ].join("\n")
  );
}

async function promptForName(
  initial: string | undefined
): Promise<string | undefined> {
  if (initial && PROJECT_NAME_RE.test(initial)) {
    return initial;
  }
  const answer = await text({
    message: "Project name:",
    placeholder: "my-md-app",
    initialValue: initial,
    validate(value) {
      if (!value) {
        return "Project name is required.";
      }
      if (!PROJECT_NAME_RE.test(value)) {
        return "Use lowercase letters, digits, dashes, dots, or underscores.";
      }
    },
  });
  if (isCancel(answer)) {
    cancel("Cancelled.");
    return;
  }
  return answer;
}

async function promptForPackageManager(): Promise<PackageManager | undefined> {
  const answer = await select<PackageManager>({
    message: "Package manager:",
    initialValue: detectPackageManager(),
    options: [
      { value: "pnpm", label: "pnpm" },
      { value: "npm", label: "npm" },
      { value: "bun", label: "bun" },
      { value: "yarn", label: "yarn" },
    ],
  });
  if (isCancel(answer)) {
    cancel("Cancelled.");
    return;
  }
  return answer;
}

// Returns true if the user chose to abort because the dir wasn't usable.
function ensureEmptyDir(dir: string): boolean {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return false;
  }
  const entries = readdirSync(dir);
  if (entries.length === 0) {
    return false;
  }
  cancel(
    `Target directory ${pc.cyan(dir)} is not empty. Pick a different name or remove it first.`
  );
  return true;
}

function scaffold(opts: RunOptions): void {
  log.step(`Copying template to ${pc.cyan(opts.targetDir)}`);
  copyTemplate(TEMPLATE_DIR, opts.targetDir);
  substituteName(opts.targetDir, opts.projectName);

  if (opts.skipInstall) {
    log.step(`Skipping install — run \`${opts.packageManager} install\` later`);
  } else {
    log.step(`Installing dependencies with ${pc.cyan(opts.packageManager)}`);
    installDeps(opts.targetDir, opts.packageManager);
  }

  if (!opts.skipGit) {
    log.step("Initializing git repository");
    initGit(opts.targetDir);
  }
}

function copyTemplate(from: string, to: string): void {
  cpSync(from, to, {
    recursive: true,
    // npm strips .gitignore files from packed tarballs, so we ship `_gitignore`
    // and rename it on copy.
    filter(src) {
      return !src.endsWith("/.DS_Store");
    },
  });
  const underscoreGitignore = join(to, "_gitignore");
  if (existsSync(underscoreGitignore)) {
    renameSync(underscoreGitignore, join(to, ".gitignore"));
  }
}

function substituteName(dir: string, name: string): void {
  for (const file of ["package.json", "index.html", "README.md"]) {
    const path = join(dir, file);
    if (!existsSync(path)) {
      continue;
    }
    const original = readFileSync(path, "utf8");
    writeFileSync(path, original.replaceAll("{{name}}", name), "utf8");
  }
}

function installDeps(dir: string, pm: PackageManager): void {
  const installCmd = pm === "yarn" ? "yarn" : `${pm} install`;
  try {
    execSync(installCmd, { cwd: dir, stdio: "inherit" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.warn(
      `Install failed (${msg}). You can run \`${installCmd}\` manually inside ${dir}.`
    );
  }
}

function initGit(dir: string): void {
  try {
    execSync("git init", { cwd: dir, stdio: "ignore" });
    execSync("git add -A", { cwd: dir, stdio: "ignore" });
    execSync('git commit -m "Initial commit from create-md-computer"', {
      cwd: dir,
      stdio: "ignore",
    });
  } catch {
    // Non-fatal: user might not have git, or git config; just skip silently.
  }
}

function detectPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("pnpm")) {
    return "pnpm";
  }
  if (ua.startsWith("yarn")) {
    return "yarn";
  }
  if (ua.startsWith("bun")) {
    return "bun";
  }
  return "npm";
}
