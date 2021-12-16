#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arg_1 = __importDefault(require("arg"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = require("inquirer");
const main_1 = require("./main");
const options_1 = require("./options");
const internal_1 = require("./utils/internal");
const public_1 = require("./utils/public");
async function parseArgs(argv) {
    const args = arg_1.default({
        "--aikar": Boolean,
        "--build": String,
        "--eula": Boolean,
        "--force": Boolean,
        "--help": Boolean,
        "--name": String,
        "--no-cache": Boolean,
        "--ram": String,
        "--type": String,
        "--version": String,
        "-a": "--aikar",
        "-b": "--build",
        "-e": "--eula",
        "-f": "--force",
        "-h": "--help",
        "-n": "--name",
        "-r": "--ram",
        "-t": "--type",
        "-v": "--version",
    }, {
        argv: argv.slice(2),
        permissive: true,
    });
    if (args["--help"]) {
        console.log([
            "",
            chalk_1.default.bgGreenBright.whiteBright.bold("Help for create-minecraft-server"),
            "",
            options_1.optionDescriptions
                .map(desc => `${chalk_1.default.cyan(desc.option)}\n\n${chalk_1.default.gray(desc.description)}`)
                .join("\n\n"),
        ].join("\n"));
        return process.exit(0);
    }
    if (args["--ram"]?.toString().toLowerCase() === "prompt")
        delete args["--ram"];
    if (args["--type"]?.toLowerCase() === "prompt")
        delete args["--type"];
    return {
        aikar: args["--aikar"] ?? false,
        basePath: process.cwd(),
        build: args["--build"] ?? "prompt",
        eula: args["--eula"] ?? false,
        force: args["--force"] ?? false,
        noCache: args["--no-cache"] ?? false,
        ram: internal_1.parseMemory(internal_1.parseMemory(args["--ram"] ?? "prompt") !== -1
            ? args["--ram"]
            : (await inquirer_1.prompt([
                {
                    default: 3,
                    choices: [
                        {
                            name: "512mb (proxy server)",
                            short: "512mb",
                            value: "512mb",
                        },
                        {
                            name: "1gb (small test server)",
                            short: "1gb",
                            value: "1gb",
                        },
                        {
                            name: "2gb (most versions before 1.13)",
                            short: "2gb",
                            value: "2gb",
                        },
                        {
                            name: "4gb (minimum recommended memory for 1.13+)",
                            short: "4gb",
                            value: "4gb",
                        },
                        {
                            name: "8gb (for larger servers)",
                            short: "8gb",
                            value: "8gb",
                        },
                        {
                            name: "Custom",
                            short: "Custom",
                            value: "-1",
                        },
                    ],
                    message: "How much RAM do you want to give the server?",
                    name: "ram",
                    type: "list",
                },
                {
                    askAnswered: true,
                    default: "4gb",
                    message: "Enter a custom amount of RAM to allocate. (Examples: 4gb, 512mb)",
                    name: "ram",
                    type: "input",
                    validate: ram => internal_1.parseMemory(ram) !== -1,
                    when: ({ ram }) => internal_1.parseMemory(ram) === -1,
                },
            ])).ram),
        type: public_1.providers.find(provider => provider.name.toLowerCase() ===
            args["--type"]?.toLowerCase()) ??
            (await inquirer_1.prompt({
                choices: public_1.providers.map(provider => ({
                    name: `${provider.name} (${provider.type})`,
                    value: provider,
                })),
                default: 0,
                message: "What server software do you want to use?",
                name: "type",
                type: "list",
            })).type,
        serverName: args["--name"] ?? `server-${internal_1.createId()}`,
        version: args["--version"] ?? "prompt",
    };
}
parseArgs(process.argv)
    .then(options => main_1.createServer(options))
    .catch(e => internal_1.terminate(e.stack));
