import chalk from "chalk";
import { copyFileSync, existsSync, lstatSync, mkdirSync } from "fs";
import { prompt } from "inquirer";
import { join, resolve } from "path";
import type { Options } from "./structs";
import {
    colorBool,
    createServerPath,
    downloadFile,
    finished,
    isInsideDirectory,
    isInteger,
    terminate,
    usingCache,
    writeServerFiles,
} from "./utils/internal";
import { minifyMemory } from "./utils/public";

export * from "./structs";
export * from "./utils/public";

export async function createServer(options: Options) {
    const { basePath, type: provider, serverName } = options,
        cache = join(__dirname, "..", ".cache"),
        out = join(basePath, serverName);

    if (!existsSync(cache)) mkdirSync(cache, { recursive: true });
    if (!lstatSync(cache).isDirectory())
        return terminate(
            `Cache directory ${resolve(cache)} is not a directory.`
        );
    if (!isInsideDirectory(options.basePath, out))
        return terminate(
            `Server name "${options.serverName}" escapes outside the base directory "${options.basePath}".\nPlease be careful when using "." or "/" in your server name.`
        );
    if (existsSync(out)) {
        if (!options.force)
            return terminate(
                `Directory ${resolve(
                    out
                )} already exists, server creation has been canceled to protect you from making a (huge) mistake.\nTo get around this protection, use the --force option.`
            );
        if (!lstatSync(out).isDirectory())
            return terminate(
                `Directory ${resolve(
                    out
                )} already exists, and is not a directory.`
            );
    }

    const jarsPath = join(cache, "jar");
    if (!existsSync(jarsPath)) mkdirSync(jarsPath, { recursive: true });
    const providerJarPath = join(jarsPath, provider.name.toLowerCase());
    if (!existsSync(providerJarPath))
        mkdirSync(providerJarPath, { recursive: true });

    if (
        !options.noCache &&
        options.version.toLowerCase() !== "latest" &&
        options.version.toLowerCase() !== "prompt" &&
        (!provider.builds ||
            (options.build.toLowerCase() !== "latest" &&
                options.build.toLowerCase() !== "prompt"))
    ) {
        const path = join(
            providerJarPath,
            options.version,
            `${provider.builds ? options.build : "server"}.jar`
        );
        if (existsSync(path)) {
            usingCache();
            const dir = createServerPath(options);
            writeServerFiles(options);
            copyFileSync(path, join(dir, "server.jar"));
            return finished(dir);
        }
    }

    console.log(
        chalk.gray(
            `Fetching available versions of ${chalk.green(provider.name)}...`
        )
    );

    const versions = await provider.fetchVersions();
    const version =
        options.version.toLowerCase() === "latest"
            ? versions[versions.length - 1]
            : versions.includes(options.version)
            ? options.version
            : (
                  await prompt({
                      choices: [...versions.reverse()].map((build, idx) => ({
                          name: idx === 0 ? `${build} (latest)` : `${build}`,
                          short: `${build}`,
                          value: build,
                      })),
                      default: 0,
                      message: `What ${provider.name} version do you want to use?`,
                      name: "version",
                      type: "list",
                  })
              ).version;

    const versionPath = join(providerJarPath, version);
    if (!existsSync(versionPath)) mkdirSync(versionPath, { recursive: true });

    let build = "server";

    if (provider.builds) {
        console.log(
            chalk.gray(
                `Fetching available builds of ${chalk.green(
                    `${provider.name} ${version}`
                )}...`
            )
        );
        const builds = await provider.fetchBuilds(version);
        build =
            options.build === "latest"
                ? builds[builds.length - 1]
                : isInteger(options.build)
                ? parseInt(options.build)
                : (
                      await prompt({
                          choices: [...builds.reverse()].map((build, idx) => ({
                              name:
                                  idx === 0 ? `${build} (latest)` : `${build}`,
                              short: `${build}`,
                              value: build,
                          })),
                          default: 0,
                          message: `What ${
                              provider.buildName ??
                              `${provider.name} ${version} build`
                          } do you want to use?`,
                          name: "build",
                          type: "list",
                      })
                  ).build;
        if (!builds.includes(build))
            return terminate(
                `Unknown ${provider.name} ${version} build: ${build}`
            );
    }

    console.log(
        chalk.gray(
            [
                "Creating Minecraft server with the following options:\n",
                `Accept EULA: ${colorBool(options.eula)}`,
                `Allocated RAM: ${chalk.blueBright(minifyMemory(options.ram))}`,
                `Server Software: ${chalk.blueBright(provider.name)}`,
                `${provider.name} Version: ${chalk.blueBright(version)}`,
                ...(provider.builds
                    ? [
                          `${
                              provider.buildName ??
                              `${provider.name} ${version} Build ID`
                          }: ${chalk.blueBright(build)}`,
                      ]
                    : []),
                "",
            ].join("\n")
        )
    );

    const cacheJarPath = join(providerJarPath, version, `${build}.jar`),
        serverPath = createServerPath(options),
        outJarPath = join(serverPath, "server.jar");

    if (existsSync(cacheJarPath) && !options.noCache) usingCache();
    else {
        console.log(chalk.gray("Obtaining download URL..."));
        const url = await provider.getDownloadUrl(version, build);
        console.log(
            chalk.gray(
                `Downloading ${chalk.green(`${provider.name} ${version}`)} ${
                    provider.builds ? `build ${chalk.green(build)} ` : ""
                }from ${chalk.green(url)}...`
            )
        );
        await downloadFile(url, cacheJarPath);
    }
    copyFileSync(cacheJarPath, outJarPath);

    writeServerFiles(options);
    finished(serverPath);
}
