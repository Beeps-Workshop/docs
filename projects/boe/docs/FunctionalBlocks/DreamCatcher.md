---
sidebar_position: 6
---

# Dream Catcher

Blocks phantoms from spawning nearby. Found in the Shelter.

## Placement
A wall-mounted block — it needs a solid block behind it and pops off if that support is removed.
It doesn't need power or anything else to work; placing it is enough.

## Effect
Any Phantom that would spawn within `dreamCatcherRange` blocks (80 by default) of a Dream Catcher
is prevented outright, and any Phantom that's already flying within range gets removed every couple
of seconds. See [Configuration](../Configuration.md#dreamcatcherrange).

This isn't limited to the End — a Dream Catcher works in whatever dimension you place it in.
