# Retrac Launcher

A modern, beautiful launcher for Retrac built with Tauri, React, and TypeScript.

![Retrac Logo](src-tauri/icons/icon.png)

## 🎨 Features

- **Modern UI**: Clean, minimalist design with emerald green accents
- **Discord Authentication**: Secure login via Discord OAuth
- **Real-time Stats**: Track your gameplay statistics and progress
- **News & Updates**: Stay informed with the latest Retrac news
- **Cross-platform**: Built with Tauri for native performance

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Rust** (latest stable) - [Install via rustup](https://rustup.rs/)
- **Visual Studio Build Tools** (Windows only) - Required for Tauri
  - Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
  - Install "Desktop development with C++" workload

### Verify Installation

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Rust version
rustc --version

# Check Cargo version
cargo --version
```

## 🚀 Installation

1. **Clone the repository** (or navigate to the project folder)
   ```powershell
   cd C:\Users\gabpl\Downloads\retrac\launcher3
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

   This will install all required Node.js packages including:
   - React & React DOM
   - Tauri
   - TailwindCSS
   - Framer Motion
   - React Router
   - And more...

## 🛠️ Development

### Run in Development Mode

Start the development server with hot-reload:

```powershell
npx tauri dev
```

This will:
- Start the Vite development server on `http://localhost:1420`
- Compile the Rust backend
- Launch the application window
- Enable hot-reload for instant updates

### Development Tips

- **Hot Reload**: Changes to React components will auto-reload
- **Rust Changes**: Require restarting `npx tauri dev`
- **Config Changes**: Changes to `tauri.conf.json` require restart

## 🧪 Testing

### Run Tests

```powershell
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting

```powershell
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Type Checking

```powershell
# Check TypeScript types
npm run type-check
```

## 📦 Building for Production

### Build the Application

Create a production build:

```powershell
npm run tauri build
```

This will:
1. Build the optimized React frontend
2. Compile the Rust backend in release mode
3. Create an installer in `src-tauri/target/release/bundle/`

### Build Output

After building, you'll find:
- **MSI Installer**: `src-tauri/target/release/bundle/msi/Retrac_2.1.2_x64_en-US.msi`
- **Executable**: `src-tauri/target/release/Retrac.exe`

### Build for Different Targets

```powershell
# Build MSI installer (default)
npm run tauri build

# Build portable executable
npm run tauri build -- --bundles portable
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server only |
| `npx tauri dev` | Start full development environment |
| `npm run build` | Build frontend only |
| `npm run tauri build` | Build complete application |
| `npm run lint` | Check code quality |
| `npm run type-check` | Validate TypeScript types |

## 📁 Project Structure

```
launcher3/
├── src/                          # React source code
│   ├── components/              # React components
│   │   ├── core/               # Core components (Frame, etc.)
│   │   ├── navigation/         # Navigation components
│   │   └── routes/             # Page components
│   ├── wrapper/                # State management (Zustand)
│   ├── import/                 # Shared UI components
│   ├── main.tsx                # React entry point
│   └── main.css                # Global styles
├── src-tauri/                   # Rust/Tauri backend
│   ├── src/                    # Rust source code
│   ├── icons/                  # Application icons
│   ├── Cargo.toml              # Rust dependencies
│   └── tauri.conf.json         # Tauri configuration
├── public/                      # Static assets
├── package.json                 # Node.js dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # TailwindCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🎨 Customization

### Change Accent Color

Edit `src/main.css`:

```css
--ACCENT: #10b981; /* Emerald Green */
--ACCENT-VIBRANT: #34d399;
```

### Update Application Icon

Replace files in `src-tauri/icons/` with your custom icons:
- `icon.png` - Main icon (512x512 recommended)
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon

### Modify Window Settings

Edit `src-tauri/tauri.conf.json`:

```json
{
  "app": {
    "windows": [{
      "width": 1100,
      "height": 720,
      "resizable": false
    }]
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Cannot find module" errors**
```powershell
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue: Rust compilation errors**
```powershell
# Solution: Update Rust toolchain
rustup update
```

**Issue: Build fails on Windows**
- Ensure Visual Studio Build Tools are installed
- Restart your terminal after installation

**Issue: Port 1420 already in use**
```powershell
# Solution: Kill the process using the port
npx kill-port 1420
```

### Getting Help

- Check the [Tauri Documentation](https://tauri.app/)
- Visit the [React Documentation](https://react.dev/)
- Review [Vite Documentation](https://vitejs.dev/)

## 📝 Version History

### Version 2.1.2 (Current)
- ✨ Redesigned UI with emerald green theme
- 🎨 Simplified navigation and cleaner aesthetics
- 🖼️ Updated to use local icon assets
- 🔒 Disabled update checker for development
- ⚡ Performance improvements

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is proprietary software for Retrac.

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI powered by [React](https://react.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ for the Retrac community**
