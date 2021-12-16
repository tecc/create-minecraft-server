import chalk from "chalk";
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { get as _get } from "https";
import { join, resolve, sep } from "path";
import type { Options } from "../structs";
import { createStartupFlags } from "./public";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export function colorBool(bool: boolean) {
    return bool ? chalk.green("Yes") : chalk.red("No");
}

export function createId() {
    let string = "";
    for (let i = 0; i < 8; i++) {
        string += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return string;
}

export function createServerPath(options: Options) {
    const dir = join(options.basePath, options.serverName);
    if (!isInsideDirectory(options.basePath, dir))
        return terminate(
            `Server name "${options.serverName}" escapes outside the base directory "${options.basePath}".\nPlease be careful when using "." or "/" in your server name.`
        );
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return dir;
}

export function downloadFile(url: string, path: string) {
    return new Promise<void>((res, rej) => {
        try {
            const stream = createWriteStream(path);
            _get(url, res => res.pipe(stream));
            stream.once("finish", () => res());
        } catch (e) {
            rej(e);
        }
    });
}

export function finished(dir: string) {
    console.log(
        chalk.gray(
            `Minecraft server files created in ${chalk.green(resolve(dir))}.`
        )
    );
}

export function get(url: string) {
    return new Promise<string>((res, rej) => {
        _get(url, response => {
            let data = "";
            response.on("data", chunk => (data += chunk));
            response.on("end", () => res(data));
            response.on("error", rej);
        });
    });
}

/** Check if one directory is equal to or inside of another directory. */
export function isInsideDirectory(base: string, target: string) {
    const absoluteBase = resolve(base),
        absoluteTarget = resolve(target);
    const absoluteTargetParts = absoluteTarget.split(sep);
    return absoluteBase
        .split(sep)
        .every((part, i) => absoluteTargetParts[i] === part);
}

/** Check if a string is a positive integer. */
export function isInteger(number: string) {
    return /^\d+$/.test(number);
}

/**
 * Parse a RAM amount, given a string such as 4g, 512m, 2gb.
 * @returns {number} The amount of memory (in megabytes) if valid, -1 otherwise.
 */
export function parseMemory(ram: string) {
    const matches = /^(\d+)((m|g)b?)$/g.exec(ram.toString().toLowerCase());
    if (!matches) return -1;
    try {
        return parseInt(matches[1]) * (matches[3] === "g" ? 1024 : 1);
    } catch {}
    return -1;
}

export function terminate(error: string): never {
    console.error("\n\n" + chalk.red.bold(error));
    process.exit(1);
}

export function usingCache() {
    console.log(
        chalk.gray(
            `Using a cached jar to create the server, to fetch a fresh jar instead use the ${chalk.yellow(
                "--no-cache"
            )} option.`
        )
    );
}

export function writeServerFiles(options: Options) {
    const dir = createServerPath(options);
    if (options.eula) {
        console.log(
            chalk.yellow(
                "The Accept EULA option was enabled. By using this option, you acknowledge that you agree to the Minecraft EULA: https://www.minecraft.net/eula"
            )
        );
        writeFileSync(join(dir, "eula.txt"), "eula=true");
    }
    const cmd = createStartupFlags(options);
    writeFileSync(join(dir, "start.sh"), cmd);
    writeFileSync(join(dir, "start.bat"), cmd);
}
