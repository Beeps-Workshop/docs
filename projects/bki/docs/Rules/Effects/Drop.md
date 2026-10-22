# Drop
Determines the items that should still be dropped on death.
```yaml
effects:
  drop:
    mode: "PERCENTAGE"
    min: 10.0
    max: 25.0 # Between 10% and 25%
    filters:
      items:
        - "SHEARS"
        - "G:RESOURCES"
      slots:
        - "ALL"
      name:
        - '!Crate Key'
      lore:
        - '!Soulbound'
```
### mode
```yml
mode: "PERCENTAGE"
```
- `SIMPLE`: Drops a random amount of items between `min` and `max`.
- `PERCENTAGE`: Drops a percentage of items between `min` and `max` from the stack of items.
- `ALL`: Drops all items.

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
