 Nested Base64 Decoder

A modern web application that allows you to decode multiple layers of base64 encoded strings with QR code scanning support.

## Features

- **Elegant Black & White Design**: Clean, professional interface with a modern monochrome aesthetic
- **Multi-layer Base64 Decoding**: Decode up to 10 layers of nested base64 encoding
- **QR Code Scanner**: Scan QR codes containing base64 strings directly using your device's camera
- **URL Detection**: Automatic detection and linking of URLs in decoded results
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Detailed Logs**: View step-by-step decoding process for each layer

## Use Cases

- Decode nested base64 strings in security research
- Scan and decode QR codes containing encrypted data
- Investigate encoded content in forensic analysis
- Teaching tool for understanding base64 encoding
- Quickly decode data without installing specialized software

## How to Use

1. **Scan a QR Code**: Click "Start Camera" to use your device's camera to scan a QR code, or select "Choose from Gallery" to upload an image containing a QR code
2. **Enter Base64 String**: Paste a base64 encoded string directly into the text area
3. **Set Layers**: Specify how many layers of base64 encoding to decode (1-10)
4. **Decode**: Click the "Decode" button to process the string
5. **View Results**: See the decoding logs and final decoded content

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks)
- Uses [jsQR](https://github.com/cozmo/jsQR) library for QR code detection
- Mobile-friendly responsive design
- Efficient processing even for deeply nested encodings

## Installation

No installation required! This is a client-side application that runs entirely in your browser.

### Option 1: Visit the Live Demo

Access the live application at: [https://nickelsync.github.io/NestedBase64Decoder/](https://nickelsync.github.io/NestedBase64Decoder/)

### Option 2: Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/base64-decoder.git
   ```

2. Open `index.html` in your web browser.

## Browser Compatibility

- Chrome (recommended for best camera support)
- Firefox
- Safari
- Edge

## Privacy

This application runs entirely in your browser. Your data never leaves your device, making it safe for processing sensitive information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [jsQR](https://github.com/cozmo/jsQR) for QR code detection
- Inspired by the need for a simple, elegant base64 decoder with QR capabilities
