import type { CraftServerProvider } from "../structs";
export declare class Fabric implements CraftServerProvider {
    builds: boolean;
    buildName: string;
    name: string;
    type: string;
    private installerVersion?;
    fetchBuilds(): Promise<string[]>;
    fetchVersions(): Promise<string[]>;
    getDownloadUrl(version: string, build: string): Promise<string>;
}
export declare const fabric: Fabric;
