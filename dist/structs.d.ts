export interface Options {
    aikar: boolean;
    basePath: string;
    build: string;
    eula: boolean;
    force: boolean;
    noCache: boolean;
    ram: number;
    serverName: string;
    type: CraftServerProvider;
    version: string;
}
export interface CraftServerProvider {
    builds: boolean;
    buildName?: string;
    getDownloadUrl: ((version: string) => Promise<string>) | ((version: string, build: string) => Promise<string>);
    fetchBuilds(version: string): Promise<(string | number)[]>;
    fetchVersions(): Promise<string[]>;
    name: string;
    type: string;
}
