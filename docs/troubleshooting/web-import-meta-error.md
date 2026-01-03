# Web Build Error: "Cannot use 'import.meta' outside a module"

## Problem

When running `npx expo start --web`, the app fails to load in the browser with:

```
Uncaught SyntaxError: Cannot use 'import.meta' outside a module
```

The error appears at a specific line in `entry.bundle` (e.g., `entry.bundle:117228`).

## Cause

**Zustand's ESM version** uses `import.meta.env` for environment detection:

```javascript
if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && ...)
```

Metro's web bundler doesn't support `import.meta`, causing a syntax error at parse time.

## Solution

In `metro.config.js`, force zustand to use its CommonJS version on web:

```javascript
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // zustand ESM uses import.meta.env - force CommonJS version
    if (moduleName === 'zustand') {
      return {
        filePath: path.resolve(__dirname, 'node_modules/zustand/index.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'zustand/middleware') {
      return {
        filePath: path.resolve(__dirname, 'node_modules/zustand/middleware.js'),
        type: 'sourceFile',
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};
```

## Debugging Tip

When you see an `import.meta` error with a line number, fetch the bundle and check that exact line:

```powershell
# Download bundle and check the offending line
Invoke-WebRequest -Uri 'http://localhost:8081/node_modules/expo-router/entry.bundle?platform=web' -OutFile bundle.txt
(Get-Content bundle.txt)[LINE_NUMBER - 3..LINE_NUMBER + 3]
```

This immediately reveals which package is causing the issue.
