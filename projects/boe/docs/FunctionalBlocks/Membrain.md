---
sidebar_position: 3
---

# Membrain

An XP-storage block that passively pulls in nearby experience orbs.

## Storing XP
Any XP orb within 8 blocks that would otherwise head to a player instead homes in on a nearby
Membrain that isn't full and isn't currently redstone-powered. Storage caps at `membrainCapacity`
(8670 by default — 60 levels' worth). Every 5 levels of XP absorbed plays a small fanfare so you
can tell it's filling up. Looking at a Membrain shows an XP-bar overlay with its current fill and
level.

## Using stored XP
Right-click a Membrain with an item to try crafting with its stored XP — if the item and your XP
level match one of the Membrain's recipes and there's enough XP stored, it consumes the item and
XP and gives you the result. Known recipes include:
- Dead coral → the matching live coral (all 10 variants)
- Glass bottle → Experience Bottle
- Glass → Phantom Glass

## Releasing XP
Power a Membrain with redstone to have it slowly bleed its stored XP back out as orbs until you
cut power or it empties.

## Breaking it
Breaking a Membrain drops all its stored XP as orbs. If it held at least level 30's worth when
broken, nearby players get a small advancement for it.
