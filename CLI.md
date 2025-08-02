# DevcN UI CLI

A command-line interface for adding components from the DevcN UI Design Registry to your React projects.

## Installation

You don't need to install the CLI globally. Use it directly with `npx`:

```bash
npx devcn-ui add button
```

## Usage

### Add Components

Add a single component:
```bash
npx devcn-ui add button
```

Add multiple components:
```bash
npx devcn-ui add button card dialog
```

### Help

Show help information:
```bash
npx devcn-ui --help
```

### Version

Show version information:
```bash
npx devcn-ui --version
```

## Available Components

Visit [https://devcn-ui.dedevs.com](https://devcn-ui.dedevs.com) to browse all available components.

## How It Works

The CLI uses the [shadcn/ui CLI](https://ui.shadcn.com) under the hood to install components from our registry. It:

1. Fetches the component configuration from our registry
2. Downloads the component files
3. Installs any required dependencies
4. Adds the component to your project

## Requirements

- Node.js 18 or higher
- A React project with Tailwind CSS
- Internet connection

## Troubleshooting

### Component Not Found
If you get a "component not found" error, make sure:
- The component name is spelled correctly
- The component exists in our registry
- You have an internet connection

### Permission Errors
If you encounter permission errors, try:
- Running with `sudo` (not recommended)
- Using a Node version manager like `nvm`
- Checking your npm permissions

### Network Issues
If you're behind a corporate firewall:
- Check your proxy settings
- Ensure access to `registry.npmjs.org` and `devcn-ui.dedevs.com`

## Development

### Building the CLI

```bash
npm run build:cli
```

### Testing Locally

```bash
npm run test:cli
```

### Publishing

```bash
# Patch version (0.0.1 → 0.0.2)
npm run publish:patch

# Minor version (0.0.1 → 0.1.0)
npm run publish:minor

# Major version (0.0.1 → 1.0.0)
npm run publish:major
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the CLI locally
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.
