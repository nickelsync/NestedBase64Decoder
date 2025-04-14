document.addEventListener('DOMContentLoaded', function() {
    // Main elements
    const decodeBtn = document.getElementById('decode-btn');
    const encodedInput = document.getElementById('encoded-input');
    const layersInput = document.getElementById('layers');
    const resultContainer = document.getElementById('result-container');
    const logsElement = document.getElementById('logs');
    const finalResultElement = document.getElementById('final-result');
    const linkDetector = document.getElementById('link-detector');
    const detectedLink = document.getElementById('detected-link');
    
    // QR scanner elements
    const startCameraBtn = document.getElementById('start-camera');
    const stopCameraBtn = document.getElementById('stop-camera');
    const scannerContainer = document.getElementById('scanner-container');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const scanResult = document.getElementById('scan-result');
    const scannedContent = document.getElementById('scanned-content');
    
    // Gallery elements
    const fileInput = document.getElementById('file-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const processImageBtn = document.getElementById('process-image');
    const cancelImageBtn = document.getElementById('cancel-image');
    
    // Example string - can be removed for production
    encodedInput.value = "VjFaV2IxVXdNVWhVYTJ4VlZrWndUbHBXVW5OamJHeHhVMnM1YkdFemFEQlhhMmhoWVZVeGRGVnVjRmhpUlRCNFdWY3hTbVZWTVVsWGJVWnBWa2QzTVZkWGVHOVViVkp6WTBWU1VGWXphRTVhVjNSaFUwWldWMVp1VG10TlZscFhXbFZhVTFkdFZuUlZhMnhWVFZaWk1GVnJXa3RXYXpGRlUyeGtWMVpVVmxoWGJGcHJUVVphUjJJelpHbFNNMUp2Vm0weE5GVnNWbkZTYkU1UFlYcEdXRll5TVc5V01rWnlVMnh3VlZac1NtaFZWM2hIWkZaT2MyRkdjR3hXUlZZMlZrUkdXazVYU2tkWGFscFNZa1Z3VTFSVVNtOVZNVkpGVkcxR2FsSnVRbHBYYTJONFlWVXdkMk5FUWxaU1JUVllXbGN4VDFKVk1WaFBWMFpYVFVad2VWWXllRzlUYkVKU1VGUXdQUT09";
    
    // QR Scanner Logic
    let videoStream = null;
    
    // Start camera when button is clicked
    startCameraBtn.addEventListener('click', function() {
        // Hide image preview if visible
        imagePreviewContainer.style.display = 'none';
        
        // Check if browser supports getUserMedia
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Start camera with video only
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(function(stream) {
                    videoStream = stream;
                    video.srcObject = stream;
                    video.setAttribute('playsinline', true); // required for iOS Safari
                    video.play();
                    scannerContainer.style.display = 'block';
                    scanResult.style.display = 'none';
                    
                    // Start scanning for QR codes
                    requestAnimationFrame(scanQRCode);
                })
                .catch(function(error) {
                    console.error("Error accessing camera: ", error);
                    alert("Could not access the camera. Please make sure you've granted permission.");
                });
        } else {
            alert("Sorry, your browser doesn't support camera access.");
        }
    });
    
    // Stop camera when button is clicked
    stopCameraBtn.addEventListener('click', function() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => {
                track.stop();
            });
            video.srcObject = null;
            scannerContainer.style.display = 'none';
        }
    });
    
    // Function to scan QR code from video feed
    function scanQRCode() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Set canvas dimensions to match video dimensions
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            
            // Draw current video frame to canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Get image data for QR code detection
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Attempt to detect QR code
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            
            // If QR code found
            if (code) {
                // Display the scanned content
                scannedContent.textContent = code.data;
                scanResult.style.display = 'block';
                
                // Set the scanned content to the input field
                encodedInput.value = code.data;
                
                // Stop the camera
                stopCameraBtn.click();
                
                // Optional: auto decode after scanning
                // decodeBtn.click();
                
                return;
            }
        }
        
        // Continue scanning if no QR code found and camera is still active
        if (videoStream && videoStream.active) {
            requestAnimationFrame(scanQRCode);
        }
    }
    
    // Gallery upload logic
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Stop camera if running
            if (videoStream) {
                stopCameraBtn.click();
            }
            
            // Create file reader to read the file
            const reader = new FileReader();
            
            // When file is loaded
            reader.onload = function(event) {
                // Display image preview
                imagePreview.src = event.target.result;
                imagePreviewContainer.style.display = 'block';
                scanResult.style.display = 'none';
            };
            
            // Read the file as Data URL
            reader.readAsDataURL(file);
        }
    });
    
    // Process QR code from uploaded image
    processImageBtn.addEventListener('click', function() {
        // Create a temporary canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Set canvas dimensions to match image dimensions
        tempCanvas.width = imagePreview.naturalWidth;
        tempCanvas.height = imagePreview.naturalHeight;
        
        // Draw image to canvas
        tempCtx.drawImage(imagePreview, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Get image data for QR code detection
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Attempt to detect QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        
        // Check if QR code was found
        if (code) {
            // Display the scanned content
            scannedContent.textContent = code.data;
            scanResult.style.display = 'block';
            
            // Set the scanned content to the input field
            encodedInput.value = code.data;
            
            // Hide image preview
            imagePreviewContainer.style.display = 'none';
            
            // Optional: auto decode after scanning
            // decodeBtn.click();
        } else {
            alert('No QR code found in the image. Please try another image.');
        }
    });
    
    // Cancel image preview
    cancelImageBtn.addEventListener('click', function() {
        imagePreviewContainer.style.display = 'none';
        fileInput.value = '';
    });
    
    // Decode button event
    decodeBtn.addEventListener('click', function() {
        const encoded = encodedInput.value.trim();
        const layers = parseInt(layersInput.value);
        
        if (!encoded) {
            alert('Please enter a base64 encoded string');
            return;
        }
        
        if (isNaN(layers) || layers < 1 || layers > 10) {
            alert('Please enter a valid number of layers (1-10)');
            return;
        }
        
        // Clear previous results
        logsElement.textContent = '';
        finalResultElement.textContent = '';
        linkDetector.style.display = 'none';
        resultContainer.style.display = 'block';
        
        // Decode the string
        const result = decodeMultipleBase64(encoded, layers);
        
        // Check if the result contains a URL
        if (isValidURL(result)) {
            linkDetector.style.display = 'block';
            detectedLink.innerHTML = `<a href="${result}" target="_blank">${result}</a>`;
        }
    });
    
    function decodeMultipleBase64(str, layers) {
        let result = str;
        addLog(`Starting to decode ${layers} layers of base64`);
        
        for (let i = 0; i < layers; i++) {
            try {
                result = atob(result);
                addLog(`Layer ${i+1} decoded: ${result}`);
            } catch (e) {
                addLog(`Error decoding at layer ${i+1}: ${e.message}`);
                break;
            }
        }
        
        finalResultElement.textContent = result;
        return result;
    }
    
    function addLog(message) {
        logsElement.textContent += message + '\n';
        logsElement.scrollTop = logsElement.scrollHeight;
    }
    
    function isValidURL(str) {
        // Simple URL validation
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }
});
