---
sidebar_position: 4
---

# Configuration

Beep's Other End ships a server config file at `config/beepsotherend-server.toml`, generated the
first time the mod loads. Please take care when editing this file, as it may become corrupted if
you use invalid TOML formatting.

### dreamCatcherRange
```toml
dreamCatcherRange = 80
```
Block radius within which the Dream Catcher prevents phantom spawns. Range: `1`–`256`.

### membrainCapacity
```toml
membrainCapacity = 8670
```
Maximum XP that can be stored in a Membrain block (`8670` = 60 levels). Range: `100`–`100000`.

### membraneBubbleLaunchVelocity
```toml
membraneBubbleLaunchVelocity = 2.0
```
Upward launch velocity of the Membrane Bubble (`2.0` launches roughly 40 blocks high). Range:
`0.5`–`5.0`.

### membraneBubbleCooldown
```toml
membraneBubbleCooldown = 60
```
Ticks before a Membrane Bubble can launch again (`60` = 3 seconds). Range: `20`–`200`.
