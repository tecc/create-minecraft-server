"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vanilla = exports.Vanilla = void 0;
const internal_1 = require("../utils/internal");
class Vanilla {
    constructor() {
        this.builds = false;
        this.name = "Vanilla";
        this.type = "Server";
        this.versionMetaUrls = new Map();
    }
    fetchBuilds() {
        throw new Error("This server platform doesn't have multiple builds per version.");
    }
    async fetchVersions() {
        const { versions } = JSON.parse(await internal_1.get(`https://launchermeta.mojang.com/mc/game/version_manifest.json`));
        this.versionMetaUrls.clear();
        const versionList = versions.map(version => {
            this.versionMetaUrls.set(version.id, version.url);
            return version.id;
        });
        return versionList.reverse();
    }
    async getDownloadUrl(version) {
        if (!this.versionMetaUrls.has(version))
            await this.fetchVersions();
        if (!this.versionMetaUrls.has(version))
            throw new Error("Invalid version");
        return JSON.parse(await internal_1.get(this.versionMetaUrls.get(version))).downloads.server.url;
    }
}
exports.Vanilla = Vanilla;
exports.vanilla = new Vanilla();
