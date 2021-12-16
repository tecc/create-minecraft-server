"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaperAPIProvider = void 0;
const internal_1 = require("../utils/internal");
class PaperAPIProvider {
    constructor(name, type, projectId) {
        this.name = name;
        this.type = type;
        this.projectId = projectId;
        this.builds = true;
    }
    async fetchBuilds(version) {
        const { builds } = JSON.parse(await internal_1.get(`https://papermc.io/api/v2/projects/${this.projectId}/versions/${version}`));
        return builds;
    }
    async fetchVersions() {
        const { versions } = JSON.parse(await internal_1.get(`https://papermc.io/api/v2/projects/${this.projectId}`));
        return versions;
    }
    async getDownloadUrl(version, build) {
        const { downloads: { application: { name }, }, } = JSON.parse(await internal_1.get(`https://papermc.io/api/v2/projects/${this.projectId}/versions/${version}/builds/${build}`));
        return `https://papermc.io/api/v2/projects/${this.projectId}/versions/${version}/builds/${build}/downloads/${name}`;
    }
}
exports.PaperAPIProvider = PaperAPIProvider;
