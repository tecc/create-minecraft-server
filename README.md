# create-minecraft-server

Quickly create Minecraft servers without hassle. No more scouring Minecraft server software websites for downloads, and then setting up your server by hand. create-minecraft-server (CMC) provides an easy-to-use interface for creating Minecraft servers.

## Installation

To use CMC without installing it beforehand, simply use `npx create-minecraft-server`, `npm init minecraft-server` or `yarn create minecraft-server`.

To install CMC globally for easy future re-use, use `npm i -g create-minecraft-server` or `yarn global add create-minecraft-server`.

Afterwards, CMC can be used via the `create-minecraft-server` or `cmc` commands. `cmc` will be used for all remaining demos.

## Usage

Simply running `cmc` will begin the creation process, prompting you to fill in certain values via an interactive wizard in the terminal, such as how much RAM to allocate to the server, what server software to use, what Minecraft version to use, and what build of the server software to use.

### Command Options

These options can be passed via the command line to activate special functionality, or to skip the prompts and use pre-defined values (great for automated environments!).

**--aikar**

-   Whether or not Aikar's optimized JVM startup flags will be used when creating the server's startup scripts. Learn more about what this does at [Airplane's blog post regarding Aikar's startup flags](https://blog.airplane.gg/aikar-flags).
-   Type: boolean
-   Default: false

**--build**

-   Server software build to use. For example, a Paper Build ID, or a Fabric Loader version.
-   Type: string
-   Default: prompt
-   Example values: 77, 444, 0.12.12, latest, prompt

**--eula**

-   Automatically creates a `eula.txt` file.
-   Type: boolean
-   Default: false
-   By using this option, you acknowledge that you agree to the [Minecraft EULA](https://www.minecraft.net/eula).

**--force**

-   **Use at your own risk.** Forces creation of the server in the specified directory even if it already exists. Intended to be used alongside the `--name` option. Server creation will still fail if the target path is a file, rather than a directory. The contents of the directory are _not_ deleted by this mode, however files inside the directory will be replaced by the creation process.
-   Type: boolean
-   Default: false

**--help**

-   Displays the help message for create-minecraft-server. All other options are ignored if this option is present.
-   Type: boolean
-   Default: false

**--name**

-   Name to use for the created server directory.
-   Type: string
-   Default: server-(randomly generated ID)

**--no-cache**

-   Even if a cached version of the requested server jar is present, it will be re-downloaded and the cached jar will be replaced. **You should do this if you want to update the Fabric Installer version used for a Fabric server!**
-   Type: boolean
-   Default: false

**--ram**

-   The total amount of RAM to allocate to the server when creating the server's startup scripts.
-   Type: string
-   Default: 4g
-   Example values: 4g, 512m, 2gb

**--type**

-   The Minecraft server software to use.
-   Type: string
-   Default: prompt
-   Accepted values (as of v0.1.0): paper, vanilla, fabric, velocity, prompt

**--version**

-   The Minecraft version to use.
-   Type: string
-   Default: prompt
-   Accepted values: (versions available from the chosen server software), latest, prompt

### Examples

**Using the latest version of Paper**

`cmc --ram 4g --type paper --version latest --build latest`

**Re-experiencing the 20w14infinite snapshot**

`cmc --ram 4g --type vanilla --version 20w14infinite`

**Creating a Velocity proxy and naming it "Proxy"**

`cmc --ram 1g --type velocity --version latest --build latest --name Proxy`
