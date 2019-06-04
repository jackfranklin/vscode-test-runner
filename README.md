# vscode-test-runner README

## Features

Smartly run your application's test at the press of a button. Can detect which command to run and remember your previous test runs so it's easy to execute them again.

### Supported test runners

#### JS

- Jest (for extensions: `.js`, `.jsx`, `.ts`, `.tsx`)

#### Ruby

- RSpec

## Commands

Note that _no keybindings are provided out the box_, so you have to define your own.

The commands available are:

- `vsCodeTestRunner.testWholeFile`: run all the tests in the current file
- `vsCodeTestRunner.testLineNumber`: run the tests based on the current line number. Not all runners support this. For example, RSpec does, Jest does not.

We also have some commands for hiding and destroying the terminal that vsCodeTestRunner creates:

- `vsCodeTestRunner.destroyTerminal`: completely destroys the terminal that it created. Note that you pay a small cost to create one of these, so you usually don't want to do this that often.
- `vsCodeTestRunner.hideTerminal`: this hides the terminal, but doesn't destroy it. This is normally what you want.

## Release Notes

### 0.1.1

- Allow the Jest runner to test TS files too.

### 0.1.0

- First version.
