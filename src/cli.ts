#!/usr/bin/env node
import arg from "arg";
import chalk from "chalk";
import { prompt } from "inquirer";
import { createServer } from "./main";
import { optionDescriptions } from "./options";
import type { Options } from "./structs";
import { createId, parseMemory, terminate } from "./utils/internal";
import { providers } from "./utils/public";

async function parseArgs(argv: string[]): Promise<Options> {
    const args = arg(
        {
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
        },
        {
            argv: argv.slice(2),
            permissive: true,
        }
    );
    if (args["--help"]) {
        console.log(
            [
                "",
                chalk.bgGreenBright.whiteBright.bold(
                    "Help for create-minecraft-server"
                ),
                "",
                optionDescriptions
                    .map(
                        desc =>
                            `${chalk.cyan(desc.option)}\n\n${chalk.gray(
                                desc.description
                            )}`
                    )
                    .join("\n\n"),
            ].join("\n")
        );
        return process.exit(0);
    }
    if (args["--ram"]?.toString().toLowerCase() === "prompt")
        delete args["--ram"];
    if (args["--type"]?.toLowerCase() === "prompt") delete args["--type"];
    return {
        aikar: args["--aikar"] ?? false,
        basePath: process.cwd(),
        build: args["--build"] ?? "prompt",
        eula: args["--eula"] ?? false,
        force: args["--force"] ?? false,
        noCache: args["--no-cache"] ?? false,
        ram: parseMemory(
            parseMemory(args["--ram"] ?? "prompt") !== -1
                ? args["--ram"]!
                : (
                      await prompt([
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
                              message:
                                  "How much RAM do you want to give the server?",
                              name: "ram",
                              type: "list",
                          },
                          {
                              askAnswered: true,
                              default: "4gb",
                              message:
                                  "Enter a custom amount of RAM to allocate. (Examples: 4gb, 512mb)",
                              name: "ram",
                              type: "input",
                              validate: ram => parseMemory(ram) !== -1,
                              when: ({ ram }) => parseMemory(ram) === -1,
                          },
                      ])
                  ).ram
        ),
        type:
            providers.find(
                provider =>
                    provider.name.toLowerCase() ===
                    args["--type"]?.toLowerCase()
            ) ??
            (
                await prompt({
                    choices: providers.map(provider => ({
                        name: `${provider.name} (${provider.type})`,
                        value: provider,
                    })),
                    default: 0,
                    message: "What server software do you want to use?",
                    name: "type",
                    type: "list",
                })
            ).type,
        serverName: args["--name"] ?? `server-${createId()}`,
        version: args["--version"] ?? "prompt",
    };
}

parseArgs(process.argv)
    .then(options => createServer(options))
    .catch(e => terminate(e.stack));
