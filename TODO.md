# TODO — Chandra (PRD Implementation)

## Plan
1. Create project scaffold:
   - index.html
   - css/style.css, css/animations.css
   - js/app.js, js/qr-generator.js, js/customization.js, js/download.js
   - assets/ (placeholder for logo)
   - libs/ (qrcode.min.js placeholder note)
2. Implement UI:
   - Navbar, Hero, Left panel controls, Right panel preview, Footer
   - Responsive layout (mobile stacks panels)
3. Implement QR generation (vanilla JS + QRCode.js):
   - Real-time generation on URL/type/customization changes
   - Error correction support
   - Animated preview card (GSAP)
4. Implement customization controls:
   - QR color (preset + custom), background color
   - Gradient QR (preview + SVG/PNG rendering)
   - Dot style + corner style
   - Logo upload (center overlay)
   - QR size slider
5. Download features:
   - Download PNG
   - Download SVG
6. Dark mode toggle + animated transition
7. History (localStorage last 20 QRs) + UI list
8. Implement QR templates (Business/Restaurant/WiFi/Instagram/WhatsApp/YouTube/Email/vCard/Event/Email/WhatsApp)
9. Add floating shapes + hero animations + hover glow effects
10. Smoke test:
   - Generate QR, customize, download PNG/SVG, dark mode, history, templates

