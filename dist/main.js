"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const inquirer_1 = require("inquirer");
const path_1 = require("path");
const internal_1 = require("./utils/internal");
const public_1 = require("./utils/public");
__exportStar(require("./structs"), exports);
__exportStar(require("./utils/public"), exports);
async function createServer(options) {
    const { basePath, type: provider, serverName } = options, cache = path_1.join(__dirname, "..", ".cache"), out = path_1.join(basePath, serverName);
    if (!fs_1.existsSync(cache))
        fs_1.mkdirSync(cache, { recursive: true });
    if (!fs_1.lstatSync(cache).isDirectory())
        return internal_1.terminate(`Cache directory ${path_1.resolve(cache)} is not a directory.`);
    if (!internal_1.isInsideDirectory(options.basePath, out))
        return internal_1.terminate(`Server name "${options.serverName}" escapes outside the base directory "${options.basePath}".\nPlease be careful when using "." or "/" in your server name.`);
    if (fs_1.existsSync(out)) {
        if (!options.force)
            return internal_1.terminate(`Directory ${path_1.resolve(out)} already exists, server creation has been canceled to protect you from making a (huge) mistake.\nTo get around this protection, use the --force option.`);
        if (!fs_1.lstatSync(out).isDirectory())
            return internal_1.terminate(`Directory ${path_1.resolve(out)} already exists, and is not a directory.`);
    }
    const jarsPath = path_1.join(cache, "jar");
    if (!fs_1.existsSync(jarsPath))
        fs_1.mkdirSync(jarsPath, { recursive: true });
    const providerJarPath = path_1.join(jarsPath, provider.name.toLowerCase());
    if (!fs_1.existsSync(providerJarPath))
        fs_1.mkdirSync(providerJarPath, { recursive: true });
    if (!options.noCache &&
        options.version.toLowerCase() !== "latest" &&
        options.version.toLowerCase() !== "prompt" &&
        (!provider.builds ||
            (options.build.toLowerCase() !== "latest" &&
                options.build.toLowerCase() !== "prompt"))) {
        const path = path_1.join(providerJarPath, options.version, `${provider.builds ? options.build : "server"}.jar`);
        if (fs_1.existsSync(path)) {
            internal_1.usingCache();
            const dir = internal_1.createServerPath(options);
            internal_1.writeServerFiles(options);
            fs_1.copyFileSync(path, path_1.join(dir, "server.jar"));
            return internal_1.finished(dir);
        }
    }
    console.log(chalk_1.default.gray(`Fetching available versions of ${chalk_1.default.green(provider.name)}...`));
    const versions = await provider.fetchVersions();
    const version = options.version.toLowerCase() === "latest"
        ? versions[versions.length - 1]
        : versions.includes(options.version)
            ? options.version
            : (await inquirer_1.prompt({
                choices: [...versions.reverse()].map((build, idx) => ({
                    name: idx === 0 ? `${build} (latest)` : `${build}`,
                    short: `${build}`,
                    value: build,
                })),
                default: 0,
                message: `What ${provider.name} version do you want to use?`,
                name: "version",
                type: "list",
            })).version;
    const versionPath = path_1.join(providerJarPath, version);
    if (!fs_1.existsSync(versionPath))
        fs_1.mkdirSync(versionPath, { recursive: true });
    let build = "server";
    if (provider.builds) {
        console.log(chalk_1.default.gray(`Fetching available builds of ${chalk_1.default.green(`${provider.name} ${version}`)}...`));
        const builds = await provider.fetchBuilds(version);
        build =
            options.build === "latest"
                ? builds[builds.length - 1]
                : internal_1.isInteger(options.build)
                    ? parseInt(options.build)
                    : (await inquirer_1.prompt({
                        choices: [...builds.reverse()].map((build, idx) => ({
                            name: idx === 0 ? `${build} (latest)` : `${build}`,
                            short: `${build}`,
                            value: build,
                        })),
                        default: 0,
                        message: `What ${provider.buildName ??
                            `${provider.name} ${version} build`} do you want to use?`,
                        name: "build",
                        type: "list",
                    })).build;
        if (!builds.includes(build))
            return internal_1.terminate(`Unknown ${provider.name} ${version} build: ${build}`);
    }
    console.log(chalk_1.default.gray([
        "Creating Minecraft server with the following options:\n",
        `Accept EULA: ${internal_1.colorBool(options.eula)}`,
        `Allocated RAM: ${chalk_1.default.blueBright(public_1.minifyMemory(options.ram))}`,
        `Server Software: ${chalk_1.default.blueBright(provider.name)}`,
        `${provider.name} Version: ${chalk_1.default.blueBright(version)}`,
        ...(provider.builds
            ? [
                `${provider.buildName ??
                    `${provider.name} ${version} Build ID`}: ${chalk_1.default.blueBright(build)}`,
            ]
            : []),
        "",
    ].join("\n")));
    const cacheJarPath = path_1.join(providerJarPath, version, `${build}.jar`), serverPath = internal_1.createServerPath(options), outJarPath = path_1.join(serverPath, "server.jar");
    if (fs_1.existsSync(cacheJarPath) && !options.noCache)
        internal_1.usingCache();
    else {
        console.log(chalk_1.default.gray("Obtaining download URL..."));
        const url = await provider.getDownloadUrl(version, build);
        console.log(chalk_1.default.gray(`Downloading ${chalk_1.default.green(`${provider.name} ${version}`)} ${provider.builds ? `build ${chalk_1.default.green(build)} ` : ""}from ${chalk_1.default.green(url)}...`));
        await internal_1.downloadFile(url, cacheJarPath);
    }
    fs_1.copyFileSync(cacheJarPath, outJarPath);
    internal_1.writeServerFiles(options);
    internal_1.finished(serverPath);
}
exports.createServer = createServer;
