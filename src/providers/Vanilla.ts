import type { CraftServerProvider } from "../structs";
import { get } from "../utils/internal";

export class Vanilla implements CraftServerProvider {
    public builds = false;
    public name = "Vanilla";
    public type = "Server";
    private versionMetaUrls = new Map<string, string>();

    fetchBuilds(): Promise<never[]> {
        throw new Error(
            "This server platform doesn't have multiple builds per version."
        );
    }

    async fetchVersions() {
        const { versions } = JSON.parse(
            await get(
                `https://launchermeta.mojang.com/mc/game/version_manifest.json`
            )
        ) as { versions: any[] };
        this.versionMetaUrls.clear();
        const versionList = versions.map(version => {
            this.versionMetaUrls.set(version.id, version.url);
            return version.id as string;
        });
        return versionList.reverse();
    }

    async getDownloadUrl(version: string) {
        if (!this.versionMetaUrls.has(version)) await this.fetchVersions();
        if (!this.versionMetaUrls.has(version))
            throw new Error("Invalid version");
        return (
            JSON.parse(await get(this.versionMetaUrls.get(version)!)) as {
                downloads: { server: { url: string } };
            }
        ).downloads.server.url;
    }
}

export const vanilla = new Vanilla();
