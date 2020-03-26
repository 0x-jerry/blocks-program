# Blocks Program

Modern and easy extends visual programming editor. Inspire by [blockly](https://github.com/google/blockly).

## TODO

- [x] Workspace
- [x] Block
- [x] BlockField
- [x] fields
  - [x] BlockTextField
  - [x] BlockSlotField
  - [x] BlockInputField
  - [x] BlockDropdownField
- [x] Renderer
  - [ ] Scale Workspace
  - [x] Render lib
  - [x] Workspace
  - [x] Block
    - [ ] output Connection
  - [x] BlockField
    - [x] BlockTextField
    - [x] BlockSlotField
    - [x] BlockInputField
    - [x] BlockDropdownField
  - [ ] JSONParser
- [ ] CodeGenerator
  - [x] CodeGenerator
  - [ ] PythonGenerator
- [x] parser
  - [x] BlockJSONParser
- [ ] Document
- [ ] Toolbox

## Improvement

- [ ] Make area content infinite, fix break position motion when block move from edge to inner.
- [ ] Cache block content size.
- [ ] Cache block position.
- [ ] Remove getbbox interface
- [x] Extract block svg render options.

## Bugs

- [x] Update next block position when block shape changed.
- [x] Make slot field connection can connect when block move.
- [x] The parent block shape is not update when the next connection of child block connected.
- [x] The parent block move to wrong position When the slot connection of child block connected.

## Some Explanation

`core` folder code is only store necessary data.

`renderer` is generate svg accord the data that store in `workspace` object.

`renderer` folder code only store ui data.
