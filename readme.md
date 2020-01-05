# Blocks Program

Visual programming editor. Inspire by [blockly](https://github.com/google/blockly).

## TODO

- [x] Workspace
- [x] Block
- [x] BlockField
- [ ] fields
  - [x] BlockTextField
  - [x] BlockSlotField
  - [ ] BlockDropdownField
- [ ] Renderer
  - [x] Render lib
  - [x] Workspace
  - [x] Block
  - [x] BlockField
- [ ] CodeGenerator
  - [x] CodeGenerator
  - [ ] PythonGenerator
- [ ] parser

  - [ ] BlockJSONParser

- [ ] Docs

## Some Explanation

`core` folder code is only store necessary data.

`renderer` is generate svg accord the data that store in `workspace` object.

`renderer` folder code only store ui data.
