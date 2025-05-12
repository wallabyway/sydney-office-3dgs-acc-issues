# ACC Three.js Demo

A web-based 3D viewer using [Three.js](https://threejs.org/) and 3DGS / LCCRender to visualize Sydney office interior and show ACC issues as annotations interactively.

## Features

- **3D Model Rendering:** Loads and displays 3DGS / LCC model using Three.js.
- **Interactive Camera:** Move around the scene with WASD+QE keys and mouse orbit controls.
- **Dynamic Issue Markers:** Fetches and displays issue markers from a backend `/issues` endpoint (server.mjs)
- **Label Rendering:** Uses CSS2DRenderer for clean, interactive marker labels.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/acc-three-demo.git
   cd acc-three-demo
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the backend server:**
   (Make sure you have a server that serves `/issues` and the LCC data file)
   ```sh
   node server.mjs
   ```
   > _Or use your preferred method to serve the backend._

4. **Start a static file server for the frontend:**
   ```sh
   npx serve .
   ```
   _Or use any static server of your choice._

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Move Camera:**  
  - `W`/`A`/`S`/`D`: Forward/Left/Backward/Right  
  - `Q`/`E`: Up/Down  
  - Mouse: Orbit and pan

- **Markers:**  
  Markers are fetched from the `/issues` endpoint and displayed in the 3D scene.

## Project Structure

```
.
├── app.js                # Main Three.js application
├── sdk/
│   └── lcc-0.4.0.js      # LCCRender SDK
├── server.mjs            # Example backend server (Node.js, ES modules)
├── public/
│   └── ...               # Static assets (if any)
└── README.md
```

## Customization

- **Issue Markers:**  
  The backend `/issues` endpoint should return a JSON array of objects:
  ```json
  [
    {
      "id": "Issue #20",
      "position": { "x": 0.3, "y": 6.85, "z": 1.7 },
      "title": "Paint-job problem"
    },
    ...
  ]
  ```

- **LCC Data Path:**  
  Update the `dataPath` in `app.js` to point to your LCC file.

## Troubleshooting

- **Module Import Errors:**  
  Ensure your import map or static server is correctly configured to serve Three.js and its examples.

- **CORS Issues:**  
  Make sure your backend server allows requests from your frontend origin.

- **Environment Variables:**  
  If you use a `.env` file, configure your `launch.json` or use a library like `dotenv` as needed.

## License

MIT

---

**Maintained by:** [Your Name or Organization] 
