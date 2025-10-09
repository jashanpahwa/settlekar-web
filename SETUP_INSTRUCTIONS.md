# SettleKar Web - Setup Instructions

## Project Status
The project has been successfully converted from Create React App to Vite. The following changes have been made:

### ✅ Completed Fixes
1. **JSX File Extensions**: Converted all React component files from `.js` to `.jsx` extensions (required by Vite for JSX syntax)
2. **Main Entry Point**: Fixed `src/main.jsx` to import the correct App component
3. **Asset References**: Updated all logo image references from hardcoded paths to Vite's public asset handling (`/logo.png`)
4. **HTML Template**: Merged and updated the HTML template to use Vite's structure while preserving the app's metadata
5. **Routing Configuration**: Removed GitHub Pages basename for local development
6. **File Cleanup**: Removed duplicate HTML files and identified legacy Create React App files

### 🔧 Required Actions

#### 1. Install Missing Dependencies
The project is missing `react-router-dom`. Run this command:

```bash
npm install react-router-dom
```

#### 2. Optional: Clean Up Legacy Files
The following files are from the old Create React App setup and can be safely removed:
- `src/index.js` (old entry point)
- `src/App.js` (old version, replaced by `src/App.jsx`)
- `src/LandingPage.js` (old version, replaced by `src/LandingPage.jsx`)
- `src/PrivacyPolicy.js` (old version, replaced by `src/PrivacyPolicy.jsx`)
- `src/DeleteAccount.js` (old version, replaced by `src/DeleteAccount.jsx`)
- `src/NotFound.js` (old version, replaced by `src/NotFound.jsx`)
- `src/reportWebVitals.js` (Create React App specific)
- `src/setupTests.js` (testing setup, not currently used)
- `convert-to-jsx.bat` (helper script, no longer needed)

#### 3. Testing Dependencies (Optional)
If you want to run the existing test files, you'll need to install testing dependencies:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### 🚀 Running the Project

After installing the dependencies, you can start the development server:

```bash
npm run dev
```

The project should now work correctly with Vite!

### 📁 Project Structure
```
settlekar-web/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/            # Vite assets
│   ├── App.jsx            # Main app component (React Router)
│   ├── main.jsx           # Vite entry point
│   ├── index.css          # Global styles
│   ├── LandingPage.jsx    # Home page
│   ├── PrivacyPolicy.jsx  # Privacy policy page
│   ├── DeleteAccount.jsx  # Account deletion page
│   ├── NotFound.jsx       # 404 page
│   └── *.css              # Component styles
├── index.html             # Vite HTML template
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

### 🔍 Key Changes Made
- **JSX Extensions**: All React components now use `.jsx` extensions (required by Vite for JSX syntax)
- **Entry Point**: `src/main.jsx` now imports `src/App.jsx` (the actual app with routing)
- **Asset Handling**: All images now use Vite's public folder (`/logo.png` instead of hardcoded paths)
- **HTML Template**: Combined Create React App and Vite HTML templates
- **Routing**: Removed GitHub Pages basename for local development
- **Dependencies**: Identified missing `react-router-dom` dependency

### 🎯 Next Steps
1. Install `react-router-dom`: `npm install react-router-dom`
2. Run the development server: `npm run dev`
3. Test all routes: `/`, `/privacy-policy`, `/delete-account`
4. Optionally clean up legacy Create React App files
5. If deploying to GitHub Pages, add back the basename in `src/App.jsx`