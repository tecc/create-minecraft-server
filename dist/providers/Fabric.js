"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fabric = exports.Fabric = void 0;
const internal_1 = require("../utils/internal");
class Fabric {
    constructor() {
        this.builds = true;
        this.buildName = "Fabric Loader Version";
        this.name = "Fabric";
        this.type = "Server";
    }
    async fetchBuilds() {
        const { loader, installer } = JSON.parse(await internal_1.get(`https://meta.fabricmc.net/v2/versions`));
        this.installerVersion = installer.find(install => install.stable)?.version;
        return loader.map(version => version.version).reverse();
    }
    async fetchVersions() {
        const { game, installer } = JSON.parse(await internal_1.get(`https://meta.fabricmc.net/v2/versions`));
        this.installerVersion = installer.find(install => install.stable)?.version;
        return game.map(version => version.version).reverse();
    }
    async getDownloadUrl(version, build) {
        if (!this.installerVersion)
            await this.fetchVersions();
        if (!this.installerVersion)
            throw new Error("Unable to find newest Fabric installer version.");
        return `https://meta.fabricmc.net/v2/versions/loader/${version}/${build}/${this.installerVersion}/server/jar`;
    }
}
exports.Fabric = Fabric;
exports.fabric = new Fabric();
