/**
 * poke-local-setup
 *
 * Boilerplate TypeScript/Node MCP server scaffold.
 *
 * Safety policy: destructive actions (delete, write, rm, rmdir, mv, cp, truncate,
 * chmod, chown, dd, redirection that overwrites files, etc.) are permission-gated.
 * Never execute them unless the user has explicitly confirmed the exact action.
 * If a command might destroy data, block it and ask for confirmation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT_DIR = process.cwd();

const DESTRUCTIVE_PATTERNS: RegExp[] = [
  /\brm\b/i,
  /\bdel\b/i,
  /\bdelete\b/i,
  /\brmdir\b/i,
  /\btruncate\b/i,
  /\bchown\b/i,
  /\bchmod\b/i,
  /\bdd\b/i,
  /\bmv\b/i,
  /\bcp\b/i,
  /\btee\b.*-a\b/i,
  /(^|\s)>\s*[^>]/,
  /(^|\s)>>\s*/,
];

function safeResolve(targetPath: string): string {
  const resolved = path.resolve(ROOT_DIR, targetPath);
  if (!resolved.startsWith(ROOT_DIR)) {
    throw new Error('Refusing to access paths outside the repository root.');
  }
  return resolved;
}

export function listFiles(directory = '.'): string[] {
  const target = safeResolve(directory);
  const entries = fs.readdirSync(target, { withFileTypes: true });
  return entries.map((entry) => (entry.isDirectory() ? entry.name + '/' : entry.name));
}

export function readFile(filePath: string): string {
  const target = safeResolve(filePath);
  return fs.readFileSync(target, 'utf8');
}

export interface RunTerminalCommandOptions {
  confirmedDestructiveAction?: boolean;
  cwd?: string;
  timeoutMs?: number;
}

function isDestructiveCommand(command: string): boolean {
  return DESTRUCTIVE_PATTERNS.some((pattern) => pattern.test(command));
}

export function runTerminalCommand(command: string, options: RunTerminalCommandOptions = {}): string {
  const { confirmedDestructiveAction = false, cwd = ROOT_DIR, timeoutMs = 30_000 } = options;

  // Permission gate: destructive actions must never run unless the user has explicitly
  // confirmed the exact action. This starter defaults to safe refusal.
  if (isDestructiveCommand(command) && !confirmedDestructiveAction) {
    throw new Error('Blocked: destructive actions are permission-gated and require explicit user confirmation.');
  }

  const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
  const args = process.platform === 'win32' ? ['/d', '/s', '/c', command] : ['-lc', command];

  return execFileSync(shell, args, { cwd, timeout: timeoutMs, encoding: 'utf8' }).toString();
}

// Boilerplate MCP-style tool registry. Wire these functions into your MCP server transport.
export const tools = {
  listFiles,
  readFile,
  runTerminalCommand,
};

if (import.meta.url === 'file://' + process.argv[1]) {
  console.log('poke-local-setup scaffold loaded. Wire this into your MCP transport before use.');
}
