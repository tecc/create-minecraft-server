import { fabric } from "../providers/Fabric";
import { paper } from "../providers/Paper";
import { vanilla } from "../providers/Vanilla";
import { velocity } from "../providers/Velocity";
import type { CraftServerProvider, Options } from "../structs";

export const providers: CraftServerProvider[] = [
    paper,
    vanilla,
    fabric,
    velocity,
];

export function createStartupFlags(options: Options) {
    const { aikar, ram } = options;
    if (aikar)
        return `java -Xms${minifyMemory(
            Math.floor(ram / 4)
        )} -Xmx${minifyMemory(
            ram
        )} -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:InitiatingHeapOccupancyPercent=15 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -Dlog4j2.formatMsgNoLookups=true -jar server.jar nogui`;
    return `java -Xms${minifyMemory(Math.floor(ram / 4))} -Xmx${minifyMemory(
        ram
    )} -Dlog4j2.formatMsgNoLookups=true -jar server.jar nogui`;
}

/** If a given amount of memory (in megabytes) is divisible by a standard amount of memory (in gigabytes), returns the memory string in gigabytes, and in megabytes otherwise. */
export function minifyMemory(ram: number) {
    return ram >= 1024 && ram % 1024 === 0 ? `${ram / 1024}G` : `${ram}M`;
}
