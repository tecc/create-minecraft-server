import type { CraftServerProvider } from "../structs";
export declare class Vanilla implements CraftServerProvider {
    builds: boolean;
    name: string;
    type: string;
    private versionMetaUrls;
    fetchBuilds(): Promise<never[]>;
    fetchVersions(): Promise<string[]>;
    getDownloadUrl(version: string): Promise<string>;
}
export declare const vanilla: Vanilla;
