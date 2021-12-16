"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeServerFiles = exports.usingCache = exports.terminate = exports.parseMemory = exports.isInteger = exports.isInsideDirectory = exports.get = exports.finished = exports.downloadFile = exports.createServerPath = exports.createId = exports.colorBool = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const https_1 = require("https");
const path_1 = require("path");
const public_1 = require("./public");
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
function colorBool(bool) {
    return bool ? chalk_1.default.green("Yes") : chalk_1.default.red("No");
}
exports.colorBool = colorBool;
function createId() {
    let string = "";
    for (let i = 0; i < 8; i++) {
        string += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return string;
}
exports.createId = createId;
function createServerPath(options) {
    const dir = path_1.join(options.basePath, options.serverName);
    if (!isInsideDirectory(options.basePath, dir))
        return terminate(`Server name "${options.serverName}" escapes outside the base directory "${options.basePath}".\nPlease be careful when using "." or "/" in your server name.`);
    if (!fs_1.existsSync(dir))
        fs_1.mkdirSync(dir, { recursive: true });
    return dir;
}
exports.createServerPath = createServerPath;
function downloadFile(url, path) {
    return new Promise((res, rej) => {
        try {
            const stream = fs_1.createWriteStream(path);
            https_1.get(url, res => res.pipe(stream));
            stream.once("finish", () => res());
        }
        catch (e) {
            rej(e);
        }
    });
}
exports.downloadFile = downloadFile;
function finished(dir) {
    console.log(chalk_1.default.gray(`Minecraft server files created in ${chalk_1.default.green(path_1.resolve(dir))}.`));
}
exports.finished = finished;
function get(url) {
    return new Promise((res, rej) => {
        https_1.get(url, response => {
            let data = "";
            response.on("data", chunk => (data += chunk));
            response.on("end", () => res(data));
            response.on("error", rej);
        });
    });
}
exports.get = get;
function isInsideDirectory(base, target) {
    const absoluteBase = path_1.resolve(base), absoluteTarget = path_1.resolve(target);
    const absoluteTargetParts = absoluteTarget.split(path_1.sep);
    return absoluteBase
        .split(path_1.sep)
        .every((part, i) => absoluteTargetParts[i] === part);
}
exports.isInsideDirectory = isInsideDirectory;
function isInteger(number) {
    return /^\d+$/.test(number);
}
exports.isInteger = isInteger;
function parseMemory(ram) {
    const matches = /^(\d+)((m|g)b?)$/g.exec(ram.toString().toLowerCase());
    if (!matches)
        return -1;
    try {
        return parseInt(matches[1]) * (matches[3] === "g" ? 1024 : 1);
    }
    catch { }
    return -1;
}
exports.parseMemory = parseMemory;
function terminate(error) {
    console.error("\n\n" + chalk_1.default.red.bold(error));
    process.exit(1);
}
exports.terminate = terminate;
function usingCache() {
    console.log(chalk_1.default.gray(`Using a cached jar to create the server, to fetch a fresh jar instead use the ${chalk_1.default.yellow("--no-cache")} option.`));
}
exports.usingCache = usingCache;
function writeServerFiles(options) {
    const dir = createServerPath(options);
    if (options.eula) {
        console.log(chalk_1.default.yellow("The Accept EULA option was enabled. By using this option, you acknowledge that you agree to the Minecraft EULA: https://www.minecraft.net/eula"));
        fs_1.writeFileSync(path_1.join(dir, "eula.txt"), "eula=true");
    }
    const cmd = public_1.createStartupFlags(options);
    fs_1.writeFileSync(path_1.join(dir, "start.sh"), cmd);
    fs_1.writeFileSync(path_1.join(dir, "start.bat"), cmd);
}
exports.writeServerFiles = writeServerFiles;
