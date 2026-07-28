---
sidebar_position: 5
---

# Troubleshooting
:::info
this section is a work in progress and will be expanded over time
:::

## The game won't start
By far the most common cause is a missing **Architectury API**. It's a required dependency and
isn't bundled into the mod, so the loader refuses to start without it. Grab the build matching
your loader.

On Fabric you also need **Fabric API**.

## I downloaded the wrong jar
Fabric and NeoForge builds are published as separate files. A NeoForge jar in a Fabric instance
simply won't be seen, and vice versa. Check the filename — it says `fabric` or `neoforge`.

## A planter won't place
Planters only mount on **walls**. Aiming at the floor or a ceiling does nothing. Storage Nets are
similarly fussy: the small one is ceiling-only, the large one wall-only.

## Two Storage Nets won't sit next to each other
That's expected. The wall-mounted Storage Net is wider than a block, so two on adjacent blocks
would overlap. Leave a block between them.
