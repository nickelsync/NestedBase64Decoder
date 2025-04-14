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
    
    // QR scanner variables
    let videoStream = null;
    
    // Clear the example string - will be filled only after scanning
    encodedInput.value = "";
    
    // Start camera when button is clicked
    startCameraBtn.addEventListener('click', function() {
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
            
            try {
                // Attempt to detect QR code
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });
                
                // If QR code found
                if (code) {
                    console.log("QR Code detected:", code.data);
                    
                    // Display the scanned content
                    scannedContent.textContent = code.data;
                    scanResult.style.display = 'block';
                    
                    // Set the scanned content to the input field
                    encodedInput.value = code.data;
                    
                    // Stop the camera
                    if (videoStream) {
                        videoStream.getTracks().forEach(track => {
                            track.stop();
                        });
                        video.srcObject = null;
                        scannerContainer.style.display = 'none';
                    }
                    
                    // Ensure we immediately perform the decode
                    setTimeout(() => {
                        performDecode(code.data);
                    }, 500);
                    
                    return;
                }
            } catch (error) {
                console.error("Error in QR scanning:", error);
            }
        }
        
        // Continue scanning if no QR code found and camera is still active
        if (videoStream && videoStream.active) {
            requestAnimationFrame(scanQRCode);
        }
    }
    
    // No gallery logic needed
    
    // Standalone function to perform the decoding
    function performDecode(encodedString) {
        const layers = parseInt(layersInput.value);
        
        if (!encodedString) {
            alert('No base64 encoded string provided');
            return;
        }
        
        if (isNaN(layers) || layers < 1 || layers > 10) {
            // Default to 5 layers if invalid
            layersInput.value = 5;
        }
        
        // Clear previous results
        logsElement.textContent = '';
        finalResultElement.textContent = '';
        linkDetector.style.display = 'none';
        resultContainer.style.display = 'block';
        
        // Decode the string
        console.log("Starting decode with string:", encodedString);
        const result = decodeMultipleBase64(encodedString, parseInt(layersInput.value));
        
        // Check if the result contains a URL
        if (isValidURL(result)) {
            linkDetector.style.display = 'block';
            detectedLink.innerHTML = `<a href="${result}" target="_blank">${result}</a>`;
        }
        
        // Scroll to the results
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Decode button event
    decodeBtn.addEventListener('click', function() {
        const encoded = encodedInput.value.trim();
        performDecode(encoded);
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
            '(\\#[-a-z\\d_]*)?, 'i'); // fragment locator
        return pattern.test(str);
    }
});
