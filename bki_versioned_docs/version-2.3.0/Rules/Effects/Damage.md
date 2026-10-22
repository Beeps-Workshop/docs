# Damage
Determines how much durability damage items take on death.
```yaml
effects:
  damage:
    mode: "PERCENTAGE"
    min: 10.0
    max: 25.0 # Between 10% and 25%
    dont_break: true
    use_enchantments: true
    filters:
      items:
        - "SHEARS"
        - "G:RESOURCES"
      slots:
        - "ALL"
```
### mode
```yml
mode: "PERCENTAGE"
```
- `SIMPLE`: Damages for a random amount of durability points between `min` and `max`
- `PERCENTAGE`: Damages for a percentage of **_max_** durability between `min` and `max` for the stack
- `ALL`: Damages for a percentage of **_current_** durability between `min` and `max` for the stack

### min
```yml
min: 10.0
```
the minimum bounds for the operation

### max
```yml
max: 10.0
```
the max bounds for the operation

### dont_break
```yml
dont_break: true
```
If true, items will not be allowed to break from damage. Defaults to false.

### use_enchantments
```yml
use_enchantments: true
```
If true, the item's enchantments (like Unbreaking) will be taken into account when applying damage. Defaults to false.

### Filters:
```yml
filters:
  items:
    - "*"
    - "!G:EQUIPMENT"
  slots:
    - "ALL"
```

Allows you to make sure the effect only applies to certain items based on various criteria.
See [Filters](../Filters.md) for all filter options and more examples.
