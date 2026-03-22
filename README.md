# PixelPress — Photo Resize & Print Studio

A lightweight, fully client-side web application for resizing photos and preparing them for printing. No server, no backend, no data uploaded anywhere — everything runs in your browser.

---

## Features

### Upload
- Drag and drop or click to upload
- Supports JPG, PNG, WebP, HEIC, and most other image formats
- Displays original filename, dimensions, and file size instantly

### Crop & Rotate
- Rotate in 90° steps (left, right, 180°)
- Fine rotation slider from -45° to +45° for straightening photos
- Interactive drag-to-crop directly on the preview image
- Apply or cancel crop before committing
- Reset all transforms back to the original at any time

### Resize Options
Three modes to choose from:

| Mode | Description |
|------|-------------|
| Presets | Passport (35×45mm), US Visa (51×51mm), ID Card, Indian Visa, 4×6, 5×7 |
| Custom | Enter any width × height in mm, cm, inches, or pixels |
| File Size | Compress the image to a target KB/MB limit |

Fit modes:
- **Crop to Fill** — fills the target size, cropping excess
- **Fit Inside** — letterboxes the image within the target size
- **Stretch** — stretches to exactly fill the target (may distort)

Lock aspect ratio toggle available in Custom mode.

### Background
- White, Black, Light Red, Light Blue presets
- Transparent (automatically forces PNG output)
- Custom color via color picker
- Background updates live in the preview without re-applying

### Output Options
- **Format:** JPG or PNG
- **Quality:** Max (300 DPI), High, Medium, Low
- **Delivery mode:**
  - Single image download (JPG or PNG)
  - Print Sheet (PDF) with multiple copies

### Print Sheet (PDF)
- Choose paper size: A4, Letter, A3
- Set number of copies (auto-arranged in a grid)
- Control spacing/margin between photos
- Add a border around each photo (width, color)
- Output is 300 DPI print-ready

---

## How to Use

1. **Upload** your photo by dragging it onto the upload zone or clicking to browse
2. **Crop & Rotate** if needed using the transform tools
3. **Choose a resize preset** or enter custom dimensions
4. **Select a background color** and fit mode
5. Click **Apply & Preview** to see the result
6. **Choose output format** (JPG/PNG) and delivery mode (single or print sheet)
7. **Download** your image or PDF

---

## Technical Details

| Property | Value |
|----------|-------|
| Output resolution | 300 DPI |
| Processing | 100% client-side (Canvas API) |
| PDF generation | jsPDF (loaded from CDN) |
| Dependencies | None (except jsPDF via CDN) |
| Framework | Vanilla HTML/CSS/JS |
| File size | Single `.html` file (~60KB) |

### Transparency
Transparent background is only supported in PNG format. When you select transparent background, the app automatically switches the output format to PNG. The checkerboard pattern you see in the preview is for visual reference only — it is **not** included in the exported file.

### File Size Estimation
The estimated file size shown is computed by actually encoding the canvas to the selected format and quality, then measuring the real byte length — not a rough formula. What you see is what you get.

---

## Browser Support

Works in all modern browsers: Chrome, Firefox, Safari, Edge. No plugins or extensions required.

---

## Privacy

No data ever leaves your device. Images are processed entirely in the browser using the Canvas API. Nothing is uploaded to any server.

---

## Known Limitations

- HEIC files may not load in Firefox (limited browser support for HEIC)
- Transparent backgrounds export as PNG only (JPG does not support transparency)
- Very large images (50MP+) may be slow to process

---

## Credits

Built with [jsPDF](https://github.com/parallax/jsPDF) for PDF generation.  
Fonts: DM Serif Display, DM Mono, Sora via Google Fonts.
