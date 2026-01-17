# Spin the Wheel

A VS Code extension that adds a fun, interactive "Spin the Wheel" visualization directly to your Activity Bar. Perfect for making random decisions, selecting the next person for standup, or just having a bit of fun while coding.

## Features

- **Integrated Activity Bar View**: Access the wheel instantly from the side bar without leaving your code.
- **Customizable Options**: Easily configure the items on the wheel using a simple text input.
- **Smart Validation**:
  - Automatically filters duplicate entries.
  - Requires a minimum of 2 options.
  - Supports up to 20 distinct options.
- **Visuals**:
  - Auto-generated distinct colors for each segment.
  - Smooth spinning animation with random results.
  - Clear result display after the spin completes.

## How to Use

1.  Click on the **Spin the Wheel** icon in the Activity Bar (it looks like a pie chart/wheel icon).
2.  In the input field provided, enter your options separated by commas (e.g., `Alice, Bob, Charlie, David`).
3.  The wheel will automatically update to reflect your valid inputs.
4.  Click the **SPIN** button!
5.  Watch the wheel rotate and wait for the result to appear.

## How to compile for VS Code market
```shell
vsce package
```

## Extension Settings

This extension currently does not provide global settings via `settings.json`. All configuration is done directly within the view's input field for quick, ephemeral decision making.

## Requirements

- VS Code version 1.101.0 or higher.
