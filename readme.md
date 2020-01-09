# Blocks Program

Modern and smaller visual programming editor. Inspire by [blockly](https://github.com/google/blockly).

## TODO

- [x] Workspace
- [x] Block
- [x] BlockField
- [ ] fields
  - [x] BlockTextField
  - [x] BlockSlotField
  - [ ] BlockInputField
  - [ ] BlockDropdownField
- [x] Renderer
  - [x] Render lib
  - [x] Workspace
  - [x] Block
  - [ ] BlockField
    - [x] BlockTextField
    - [x] BlockSlotField
    - [ ] BlockInputField
    - [ ] BlockDropdownField
- [ ] CodeGenerator
  - [x] CodeGenerator
  - [ ] PythonGenerator
- [ ] parser
  - [ ] BlockJSONParser
- [ ] Docs

## Improvement

- [x] Make slot field connection can connect when block move.
- [ ] Cache block content size.
- [ ] Cache block position.
- [ ] Remove getbbox interface
- [ ] Extract block const options.

## Bugs

- [x] Update next block position when block shape changed.
- [ ] When the next connection of child connected and the parent block shape is not update.
- [ ] When the slot connection of child connected and the parent block move to wrong position.

## Some Explanation

`core` folder code is only store necessary data.

`renderer` is generate svg accord the data that store in `workspace` object.

`renderer` folder code only store ui data.
