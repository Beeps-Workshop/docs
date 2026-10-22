# Filters
Some effects, like [Drop](Effects/Drop.md) and [Damage](Effects/Damage.md), accept a `filters` section. Filters let you make sure the effect only applies to certain items based on various criteria.
```yaml
filters:
  items:
    - "*"
    - "!G:EQUIPMENT"
  slots:
    - "HOTBAR"
    - "INVENTORY"
  name:
    - '!Crate Key'
  lore:
    - '!Soulbound'
```
An item has to pass **every** filter you set for the effect to apply to it. Any filter you leave out matches everything.

## Items
```yaml
items:
  - "SHEARS"
  - "G:RESOURCES"
```
A List of items that are affected by this effect.
Defaults to all items.

Supports [Resource Lists](../Types/ResourceLists.md) for item groups, as well as:

| Value     | Meaning                                                    |
|-----------|------------------------------------------------------------|
| `*`       | Every item                                                 |
| `!<item>` | Removes an item or group from the list, e.g. `!G:WEAPONS`  |

### Order matters
The list is read from top to bottom, and each entry adds to or removes from what came before it.
- `*` replaces the whole list with every item, so anything above it is thrown away.
- `!` can only remove items that were already added above it.

```yaml
# Correct: start with everything, then remove equipment
items:
  - "*"
  - "!G:EQUIPMENT"
```
```yaml
# Wrong: the * comes last and adds equipment right back
items:
  - "!G:EQUIPMENT"
  - "*"
```
```yaml
# Wrong: nothing was added yet, so nothing is removed.
# The list ends up empty, which means "all items"!
items:
  - "!G:EQUIPMENT"
```

## Slots
```yaml
slots:
  - "ALL"
```
A list of slots that are affected by this effect.
Defaults to all slots.

Supports [Slot Lists](../Types/SlotLists.md) for slot groups.

:::warning
Slots do **not** support `!` to remove slots, entries like `!ARMOR` are invalid. List the slots you want instead, e.g. `HOTBAR` and `INVENTORY` to leave out armor and offhand.
:::

## Name
```yaml
name:
  - '!Crate Key'
```
A String or list of strings for item names that the affected item must have. Supports `!` to negate the filter.

## Lore
```yaml
lore:
  - 'Dropped on death'
```
A String or list of strings for item lore lines that the affected item must have. Supports `!` to negate the filter.

## Examples

### Everything except equipment
Affects every item, except armor, tools and weapons.
```yaml
filters:
  items:
    - "*"
    - "!G:EQUIPMENT"
```

### All resources except netherite
Groups can be removed from other groups too.
```yaml
filters:
  items:
    - "G:RESOURCES"
    - "!G:NETHERITE"
```

### Tools, but not the fishing rod
Single items can be removed from a group.
```yaml
filters:
  items:
    - "G:TOOLS"
    - "!FISHING_ROD"
```

### Everything in the hotbar except weapons
Combine item and slot filters, the item must pass both.
```yaml
filters:
  items:
    - "*"
    - "!G:WEAPONS"
  slots:
    - "HOTBAR"
```

### Everything outside of the armor slots, except crate keys
Since slots can't be negated, list the slots you do want.
```yaml
filters:
  slots:
    - "HOTBAR"
    - "INVENTORY"
    - "OFFHAND"
  name:
    - '!Crate Key'
```
