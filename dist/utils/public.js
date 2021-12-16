"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minifyMemory = exports.createStartupFlags = exports.providers = void 0;
const Fabric_1 = require("../providers/Fabric");
const Paper_1 = require("../providers/Paper");
const Vanilla_1 = require("../providers/Vanilla");
const Velocity_1 = require("../providers/Velocity");
exports.providers = [
    Paper_1.paper,
    Vanilla_1.vanilla,
    Fabric_1.fabric,
    Velocity_1.velocity,
];
function createStartupFlags(options) {
    const { aikar, ram } = options;
    if (aikar)
        return `java -Xms${minifyMemory(Math.floor(ram / 4))} -Xmx${minifyMemory(ram)} -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:InitiatingHeapOccupancyPercent=15 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -Dlog4j2.formatMsgNoLookups=true -jar server.jar nogui`;
    return `java -Xms${minifyMemory(Math.floor(ram / 4))} -Xmx${minifyMemory(ram)} -Dlog4j2.formatMsgNoLookups=true -jar server.jar nogui`;
}
exports.createStartupFlags = createStartupFlags;
function minifyMemory(ram) {
    return ram >= 1024 && ram % 1024 === 0 ? `${ram / 1024}G` : `${ram}M`;
}
exports.minifyMemory = minifyMemory;
