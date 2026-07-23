---
sidebar_position: 2
---

# Membrane Bubble

A block that generates on the surface of the outer end isles — step on it to get launched.

## Launch
Stepping on an active Membrane Bubble launches you upward at `membraneBubbleLaunchVelocity`
(2.0 by default — roughly 40 blocks high), angled slightly by the direction you're looking. See
[Configuration](../Configuration.md#membranebubblelaunchvelocity).

While airborne you get a temporary elytra-style glide: no fall damage, and you'll glide rather
than plummet, until you land.

## Item entities
If an item entity carrying something "projectile-like" (an egg, snowball, ender pearl, XP bottle,
potion, arrow, trident, firework, etc.) lands on a bubble, it gets launched as that item's thrown
projectile form instead of just flying upward.

## Cooldown
After launching something, the bubble collapses (shorter hitbox, won't relaunch) for
`membraneBubbleCooldown` ticks (60 by default — 3 seconds), then pops back up.
