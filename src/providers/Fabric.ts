import type { CraftServerProvider } from "../structs";
import { get } from "../utils/internal";

export class Fabric implements CraftServerProvider {
    public builds = true;
    public buildName = "Fabric Loader Version";
    public name = "Fabric";
    public type = "Server";
    private installerVersion?: string;

    async fetchBuilds() {
        const { loader, installer } = JSON.parse(
            await get(`https://meta.fabricmc.net/v2/versions`)
        ) as {
            loader: { version: string }[];
            installer: { version: string; stable: boolean }[];
        };
        this.installerVersion = installer.find(
            install => install.stable
        )?.version;
        return loader.map(version => version.version).reverse();
    }

    async fetchVersions() {
        const { game, installer } = JSON.parse(
            await get(`https://meta.fabricmc.net/v2/versions`)
        ) as {
            game: { version: string }[];
            installer: { version: string; stable: boolean }[];
        };
        this.installerVersion = installer.find(
            install => install.stable
        )?.version;
        return game.map(version => version.version).reverse();
    }

    async getDownloadUrl(version: string, build: string) {
        if (!this.installerVersion) await this.fetchVersions();
        if (!this.installerVersion)
            throw new Error("Unable to find newest Fabric installer version.");
        return `https://meta.fabricmc.net/v2/versions/loader/${version}/${build}/${this.installerVersion}/server/jar`;
    }
}

export const fabric = new Fabric();
