# ACC Three.js Demo

A web-based 3D viewer using [Three.js](https://threejs.org/) and 3DGS / LCCRender to visualize Sydney office interior and show ACC issues as annotations interactively.

Gaussian Splat Showcase Video (Click to see HQ):
[![Watch the video](https://github.com/user-attachments/assets/bd3458b0-1b81-4836-83e3-5e994b7cb176)](https://devcon2023.s3.us-west-2.amazonaws.com/img/3DGS-showcase1080p.mp4)


## Features

- **3D Model Rendering:** Loads and displays 3DGS / LCC model using Three.js.
- **Interactive Camera:** Move around the scene with WASD+QE keys and mouse orbit controls.
- **Dynamic Issue Markers:** Fetches and displays issue markers from a backend `/issues` endpoint (server.mjs)
- **Label Rendering:** Uses CSS2DRenderer for clean, interactive marker labels.

## Getting Started

Walkthrough Video (Click to see HQ):
[![Watch the video](https://github.com/user-attachments/assets/c343bc56-8888-4b4c-b85c-5029cfa1b3e9)](https://devcon2023.s3.us-west-2.amazonaws.com/img/xgrids-code-walkthrough.mp4)


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
   Now you have a server that serves `/issues` endpoint and the static front-end three.js web pages
   ```sh
   node server.mjs
   ```
   > _Or use your preferred method to serve the backend._

4. **Open the app:**
   Visit [http://localhost:3000/three.html](http://localhost:3000/three.html) in your browser.

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
│                         # (Front End Code)
├── three.html            # main webpage
├── app.js                # three.js app code 
├── sdk/
│   └── lcc-0.4.0.js      # LCCRender SDK to render gaussian splats in three.js
│
│
│
│                         # (Server Code)
├── server.mjs            # Example backend server that calls APS Issues API using 3LO (Node.js, ES modules)
└── auth.mjs              # SSA secure service account auth code to generate 3LO access token
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

- **Environment Variables:**  
  Use a `.env` file.  Rename the `example.env' and fill in the blanks.

## License

MIT

---

**Maintained by:** [Michael Beale - Autodesk] 
