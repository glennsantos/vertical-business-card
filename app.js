// Generate QR Code
document.addEventListener('DOMContentLoaded', function() {
    const contactData = {
        name: 'Michel Anderson',
        title: 'Social Media Blogger',
        email: 'michelleanderson@email.com',
        website: 'www.michelleanderson.com',
        phone: '+1 (678) 234 545 6785'
    };

    // Create vCard format for QR code
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
TITLE:${contactData.title}
EMAIL:${contactData.email}
URL:${contactData.website}
TEL:${contactData.phone}
END:VCARD`;

    // Generate QR Code
    QRCode.toCanvas(document.getElementById('qrcode'), vCardData, {
        width: 180,
        margin: 1,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
    }, function (error) {
        if (error) {
            console.error('QR Code generation failed:', error);
            // Fallback: create QR code with website URL
            QRCode.toCanvas(document.getElementById('qrcode'), contactData.website, {
                width: 180,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M'
            });
        }
    });
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Install prompt for PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Create install button if it doesn't exist
    if (!document.getElementById('installBtn')) {
        const btn = document.createElement('button');
        btn.id = 'installBtn';
        btn.textContent = 'Install App';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4a90e2;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
        `;
        document.body.appendChild(btn);
        
        btn.addEventListener('click', installApp);
    }
});

function installApp() {
    const installBtn = document.getElementById('installBtn');
    if (deferredPrompt && installBtn) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                installBtn.style.display = 'none';
            }
            deferredPrompt = null;
        });
    }
}

// Hide install button after successful installation
window.addEventListener('appinstalled', (evt) => {
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
});