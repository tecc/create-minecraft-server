import type { CraftServerProvider } from "../structs";
import { get } from "../utils/internal";

export class PaperAPIProvider implements CraftServerProvider {
    public builds = true;

    constructor(
        public name: string,
        public type: string,
        private projectId: string
    ) {}

    async fetchBuilds(version: string) {
        const { builds } = JSON.parse(
            await get(
                `https://papermc.io/api/v2/projects/${this.projectId}/versions/${version}`
            )
        ) as { builds: number[] };
        return builds;
    }

    async fetchVersions() {
        const { versions } = JSON.parse(
            await get(`https://papermc.io/api/v2/projects/${this.projectId}`)
        ) as { versions: string[] };
        return versions;
    }

    async getDownloadUrl(version: string, build: string) {
        const {
            downloads: {
                application: { name },
            },
        } = JSON.parse(
            await get(
                `https://papermc.io/api/v2/projects/${this.projectId}/versions/${version}/builds/${build}`
            )
        ) as { downloads: { application: { name: string } } };
        return `https://papermc.io/api/v2/projects/${this.projectId}/versions/${version}/builds/${build}/downloads/${name}`;
    }
}
