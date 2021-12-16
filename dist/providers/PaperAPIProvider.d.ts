import type { CraftServerProvider } from "../structs";
export declare class PaperAPIProvider implements CraftServerProvider {
    name: string;
    type: string;
    private projectId;
    builds: boolean;
    constructor(name: string, type: string, projectId: string);
    fetchBuilds(version: string): Promise<number[]>;
    fetchVersions(): Promise<string[]>;
    getDownloadUrl(version: string, build: string): Promise<string>;
}
