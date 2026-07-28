---
sidebar_position: 2
---

# Installing

## Requirements
- Minecraft 1.21 or 1.21.1
- [Fabric](https://fabricmc.net/use/installer/) or [NeoForge](https://neoforged.net/)
- [Architectury API](https://modrinth.com/mod/architectury-api) — **required**, and not bundled.
  The mod will refuse to start without it.
- On Fabric, [Fabric API](https://modrinth.com/mod/fabric-api) as well.

## Installation Steps
1. Install Fabric or NeoForge for Minecraft 1.21.1 if you haven't already.
2. Download the build matching your loader from
   [Modrinth](https://modrinth.com/mod/fixtures-and-footnotes) or
   [CurseForge](https://www.curseforge.com/minecraft/mc-mods/fixtures-and-footnotes) — the Fabric
   and NeoForge jars are published separately, so take the one for your loader.
3. Download Architectury API for the same loader (and Fabric API, on Fabric).
4. Stop your Minecraft instance/server if it is currently running.
5. Copy the jars into your `mods` folder.
6. Start Minecraft.

## Verification
Open the creative inventory and look for the **Fixtures & Footnotes** tab. If the mod loaded but
the tab is missing, something has gone wrong with registration — see
[Troubleshooting](./Troubleshooting.md).
