export interface Options {
    /** Whether or not Aikar's optimized JVM startup flags will be used when creating the server's startup scripts. */
    aikar: boolean;
    /** The path where the Minecraft server will be created. */
    basePath: string;
    /** Server software build to use. Defaults to the latest build. */
    build: string;
    /** Creates a `eula.txt` file. */
    eula: boolean;
    /** Forces creation of the server in the specified directory even if it already exists. */
    force: boolean;
    /** Even if a cached version of the requested server jar is present, it will be re-downloaded and the cached jar will be replaced. **You should do this if you want to update the Fabric Installer version used for a Fabric server!** */
    noCache: boolean;
    /** The total amount of RAM to allocate to the server when creating the server's startup scripts. */
    ram: number;
    /** Name to use for the created server directory. */
    serverName: string;
    /** The Minecraft server software to use. */
    type: CraftServerProvider;
    /** The Minecraft version to use. Defaults to the latest Minecraft version available. */
    version: string;
}

/** Represents a Minecraft server provider, providing wrappers around its APIs and options. */
export interface CraftServerProvider {
    /** If `true`, this server provider offers multiple builds for a single Minecraft version. */
    builds: boolean;
    /** An optional name to use for builds for this server platform. For example, "Paper Build ID", "Fabric Loader Version". */
    buildName?: string;
    /** Gets the download URL for a given Minecraft version (with optional build ID for supported server software types). */
    getDownloadUrl:
        | ((version: string) => Promise<string>)
        | ((version: string, build: string) => Promise<string>);
    fetchBuilds(version: string): Promise<(string | number)[]>;
    fetchVersions(): Promise<string[]>;
    name: string;
    type: string;
}
