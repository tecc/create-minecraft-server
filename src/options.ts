import chalk from "chalk";

export interface OptionDescription {
    option: string;
    description: string;
}

export const optionDescriptions: OptionDescription[] = [
    {
        option: "--aikar (-a)",
        description: `- Whether or not Aikar's optimized JVM startup flags will be used when creating the server's startup scripts. Learn more about what this does at Airplane's blog post regarding Aikar's startup flags: ${chalk.blue(
            "https://blog.airplane.gg/aikar-flags"
        )}
- Type: boolean
- Default: false`,
    },
    {
        option: "--build (-b)",
        description: `- Server software build to use. For example, a Paper Build ID, or a Fabric Loader version.
- Type: string
- Default: prompt
- Example values: 77, 444, 0.12.12, latest, prompt`,
    },
    {
        option: "--eula (-e)",
        description: `- Automatically creates a ${chalk.blueBright(
            "eula.txt"
        )} file.
- Type: boolean
- Default: false
- ${chalk.yellow(
            "By using this option, you acknowledge that you agree to the Minecraft EULA: https://www.minecraft.net/eula"
        )}`,
    },
    {
        option: "--force (-f)",
        description: `- ${chalk.red.bold(
            "Use at your own risk."
        )} Forces creation of the server in the specified directory even if it already exists. Intended to be used alongside the ${chalk.blueBright(
            "--name"
        )} option. Server creation will still fail if the target path is a file, rather than a directory. The contents of the directory are ${chalk.italic(
            "not"
        )} deleted by this mode, however files inside the directory will be replaced by the creation process.
- Type: boolean
- Default: false`,
    },
    {
        option: "--help (h)",
        description: `- Displays the help message for create-minecraft-server. All other options are ignored if this option is present.
- Type: boolean
- Default: false`,
    },
    {
        option: "--no-cache",
        description: `- Even if a cached version of the requested server jar is present, it will be re-downloaded and the cached jar will be replaced. ${chalk.bold(
            "You should do this if you want to update the Fabric Installer version used for a Fabric server!"
        )}
- Type: boolean
- Default: false`,
    },
    {
        option: "--name (-n)",
        description: `- Name to use for the created server directory.
- Type: string
- Default: server-(randomly generated ID)`,
    },
    {
        option: "--ram (-r)",
        description: `- The total amount of RAM to allocate to the server when creating the server's startup scripts.
- Type: string
- Default: 4g
- Example values: 4g, 512m, 2gb`,
    },
    {
        option: "--type (-t)",
        description: `- The Minecraft server software to use.
- Type: string
- Default: prompt
- Accepted values (as of v0.1.0): paper, vanilla, fabric, velocity, prompt`,
    },
    {
        option: "--version (-v)",
        description: `- The Minecraft version to use.
- Type: string
- Default: prompt
- Accepted values: (versions available from the chosen server software), latest, prompt`,
    },
];
