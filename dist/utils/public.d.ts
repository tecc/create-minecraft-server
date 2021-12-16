import type { CraftServerProvider, Options } from "../structs";
export declare const providers: CraftServerProvider[];
export declare function createStartupFlags(options: Options): string;
export declare function minifyMemory(ram: number): string;
