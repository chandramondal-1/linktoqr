// Chandra — customization.js (Content Builders, Style Presets, Brand Logos, Analytics, API Docs)
(() => {
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    window.Chandra = window.Chandra || {};

    const state = window.Chandra.state;

    // A collection of built-in SVG icons encoded as URI strings. Crisp vectors, offline compatible.
    const brandSvgIcons = {
        facebook: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512' fill='%231877f2'><path d='M80 299.3V256H12v-54.7h68v-39.7c0-67.4 41.2-104 101.2-104 28.8 0 53.5 2.1 60.7 3v70.4h-41.7c-32.7 0-39 15.5-39 38.3V201h78l-10.2 54.7h-67.8v190.3H80z'/></svg>`,
        "x-twitter": `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%230f172a'><path d='M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z'/></svg>`,
        instagram: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' fill='%23e1306c'><path d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM402.5 344.2c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-135.8 9s-106.3 2.7-135.8-9c-19.7-7.9-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-135.8s-2.7-106.3 9-135.8c7.9-19.7 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 135.8-9s106.3-2.7 135.8 9c19.7 7.9 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 135.8s2.7 106.3-9 135.8z'/></svg>`,
        whatsapp: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' fill='%2325d366'><path d='M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z'/></svg>`,
        youtube: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512' fill='%23ff0000'><path d='M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.537V175.185l142.739 81.217-142.739 81.218z'/></svg>`,
        spotify: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512' fill='%231db954'><path d='M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.7c-4.2 0-7.6-1.3-10.2-3.8-38.2-23.3-86.2-28.5-143-15.6-8.3 1.9-16.5-3.2-18.4-11.5-1.9-8.3 3.2-16.5 11.5-18.4 62-14.1 115.5-8.3 158.4 17.8 7.2 4.4 9.6 13.7 5.2 21-2.4 3.7-6.7 10.5-11.9 10.5zm31.1-68c-5.2 0-9.6-1.9-12.8-5.1-43.9-27.1-110.8-34.9-163.6-19-10.2 3.2-20.7-2.9-23.9-13.1-3.2-10.2 2.9-20.7 13.1-23.9 60.5-18.2 134.6-9.1 185.1 22.1 8.6 5.4 11.2 16.5 6.1 25.1-3.3 5.4-8.8 13.9-14 13.9zm2.4-70.4c-52.6-31.2-139.7-34.1-190.2-18.8-15.9 4.8-32.6-4.1-37.4-20.1-4.8-15.9 4.1-32.6 20.1-37.4 58-17.6 154.4-14.1 214.6 21.6 14.3 8.5 19 26.9 10.5 41.2-4.5 7.8-12.1 13.5-17.6 13.5z'/></svg>`,
        linkedin: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' fill='%230a66c2'><path d='M100.28 448H7.4V148.9h92.88zm-46.44-340.77c-29.7 0-53.8-24.1-53.8-53.8s24.1-53.8 53.8-53.8 53.8 24.1 53.8 53.8-24.1 53.8-53.8 53.8zM448 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z'/></svg>`,
        telegram: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512' fill='%23229ed9'><path d='M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4.1 20.7 2.5 16.8 20.3z'/></svg>`,
        discord: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='%235865f2'><path d='M524.531 69.836a300.25 300.25 0 0 0 -73.072-22.508c-.295-.008-.601.077-.768.349a205.8 205.8 0 0 0 -8.966 18.283a277.67 277.67 0 0 0 -137.45 0a205.8 205.8 0 0 0 -9.052-18.283c-.167-.272-.473-.357-.768-.349a300.25 300.25 0 0 0 -73.072 22.508c-.08.011-.15.054-.203.116C73.348 143.608 44.449 262.723 54.4 380.007c.005.059.035.113.08.156c49.569 36.31 99.41 58.536 148.468 73.84c.29.09.596-.019.779-.263a210.5 210.5 0 0 0 31.298-50.787c.107-.206.008-.453-.193-.531a198.8 198.8 0 0 1 -28.374-13.435c-.218-.113-.231-.423-.027-.553c1.921-1.442 3.823-2.923 5.642-4.444c.088-.073.193-.099.29-.07c97.098 44.331 202.164 44.331 298.118 0c.102-.029.207-.003.295.07c1.822 1.521 3.725 3.002 5.642 4.444c.203.13.19.44-.027.553a198.8 198.8 0 0 1 -28.374 13.435c-.201.078-.3.325-.193.531c7.227 16.035 17.702 33.09 31.298 50.787c.183.244.489.353.779.263c49.117-15.304 98.903-37.53 148.468-73.84c.045-.043.075-.097.08-.156c12.28-132.894-16.713-251.272-87.114-310.055c-.053-.062-.123-.105-.203-.116zM224.237 325.223c-17.7 0-32.34-16.147-32.34-35.918c0-19.77 14.349-35.918 32.34-35.918c17.99 0 32.631 16.148 32.631 35.918c0 19.771-14.35 35.918-32.631 35.918zm191.526 0c-17.7 0-32.34-16.147-32.34-35.918c0-19.77 14.349-35.918 32.34-35.918c17.99 0 32.631 16.148 32.631 35.918c0 19.771-14.35 35.918-32.631 35.918z'/></svg>`,
        paypal: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512' fill='%23003087'><path d='M111.4 295.9c-3.5 19.2-17.4 35.3-37.5 35.3H48.5L88 96h109.8c38.3 0 62.4 18 56.4 56.4-5.4 35.3-27.1 56.4-62.4 56.4h-54.7l-25.7 87.1zM368 152.4c0 86.8-63.5 138.9-152.4 138.9h-64.8l-18.7 63.5-35.3 120.4c-2.8 9.5-11.4 16.8-21.3 16.8h-48c-7.9 0-14.3-6.4-14.3-14.3V464c0-7.9 6.4-14.3 14.3-14.3H64c20 0 33.9-16.1 37.4-35.3L137.7 172c3.5-19.2 17.4-35.3 37.5-35.3h64.8c89 0 128 43.1 128 115.7z'/></svg>`,
        google: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 512' fill='%23ea4335'><path d='M473.3 256c0-17-1.7-33.8-4.9-50H244v95.1h129c-5.5 30-22.3 55.4-47.5 72.5v60.1h76.8c44.9-41.4 71-102.5 71-177.7zM244 480c64.8 0 119.2-21.5 159-58.4l-76.8-60.1c-21.3 14.3-48.6 22.8-82.2 22.8-63.2 0-116.7-42.7-135.8-100H30.5v61.8C70.3 404.3 151.2 480 244 480zM108.2 284.3c-4.8-14.3-7.6-29.6-7.6-45.5s2.8-31.2 7.6-45.5V131.5H30.5C11.1 170.2 0 213.2 0 258.8s11.1 88.6 30.5 127.3l77.7-61.8zM244 114.9c35.2 0 66.8 12.1 91.7 36l68.7-68.7c-41.4-38.6-95.6-62.2-160.4-62.2C151.2 20 70.3 95.7 30.5 177.3l77.7 61.8c19.1-57.3 72.6-100 135.8-100z'/></svg>`,
        bitcoin: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23f7931a'><path d='M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM376.16 200.75c4.71-31.41-19.16-48.31-51.77-59.58l10.58-42.44-25.82-6.43-10.3 41.31c-6.79-1.69-13.78-3.29-20.73-4.86l10.38-41.6-25.82-6.43-10.58 42.44c-5.61-1.28-11.08-2.54-16.38-3.87l0.04-0.18-35.62-8.89-6.87 27.58s19.17 4.39 18.77 4.67c10.46 2.61 12.34 9.53 12.02 15.03l-12.04 48.27c0.72 0.18 1.66 0.45 2.69 0.88l-2.73-0.68-16.87 67.65c-1.28 3.19-4.52 7.97-11.83 6.15 0.36 0.52-18.77-4.68-18.77-4.68l-12.83 29.58 33.62 8.38c6.25 1.57 12.37 3.2 18.36 4.75l-10.7 42.92 25.81 6.43 10.59-42.48c7.05 1.92 13.9 3.75 20.6 5.49l-10.54 42.27 25.82 6.43 10.7-42.95c44.11 8.35 77.24 4.98 91.19-34.9 11.25-32.12-0.56-50.65-23.76-62.66 16.89-3.9 29.58-15 32.91-37.9zm-58.74 82.59c-8 32.14-62.15 14.77-79.7 10.39l14.48-58.07c17.55 4.38 73.34 13.06 65.22 47.68zm8.02-83c-7.29 29.27-52.4 14.41-67.04 10.75l13.11-52.61c14.64 3.66 61.32 10.53 53.93 41.86z'/></svg>`,
        wifi: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512' fill='%230072ff'><path d='M320 400A48 48 0 1 0 320 496a48 48 0 1 0 0 -96zM151 231c5.3 5.3 12.3 8 19.3 8s14-2.7 19.3-8c43.6-43.6 101.6-67.6 163.4-67.6s119.8 24 163.4 72c10.7 10.7 27.9 10.7 38.6 0s10.7-27.9 0-38.6C441.4 143.1 382.7 112 320 112S198.6 143.1 144.3 197.4C140.3 201.4 140.3 220.3 151 231zm-96-96C121.3 68.7 217.4 32 320 32s198.7 36.7 265 103C595.7 145.7 613 145.7 623.7 135s10.7-27.9 0-38.6C542.4 15.1 435.3-16 320-16S97.6 15.1 16.3 96.4C5.6 107.1 5.6 124.3 16.3 135S43.6 145.7 55 135zM247.3 327.3c10.7 10.7 27.9 10.7 38.6 0 18.8-18.8 43.8-29.2 70.4-29.2s51.6 10.4 70.4 29.2c10.7 10.7 27.9 10.7 38.6 0s10.7-27.9 0-38.6c-29.1-29.1-67.8-45.1-109-45.1s-79.9 16-109 45.1C236.6 299.4 236.6 316.6 247.3 327.3z'/></svg>`,
        phone: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%2310b981'><path d='M493.4 376.6l-112-96c-13.6-11.7-34.5-9.3-45.3 5.3l-28.7 38.9c-29.2-16-52.9-39.7-68.9-68.9l38.9-28.7c14.6-10.8 17-31.7 5.3-45.3l-96-112c-10.8-12.6-29.9-15.1-43.6-5.8L73 118.7c-36.9 27.7-49.3 78.4-28.3 120.4 47.9 95.8 126.1 174 221.9 221.9 42 21 92.7 8.6 120.4-28.3l54.5-72.7c9.3-13.7 6.8-32.8-5.8-43.6z'/></svg>`,
        envelope: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%236366f1'><path d='M464 64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM48 96h416c8.8 0 16 7.2 16 16v18.7L256 262.2 32 130.7V112c0-8.8 7.2-16 16-16zm416 320H48c-8.8 0-16-7.2-16-16V167.3l213.9 123.6c5.7 3.3 12.5 3.3 18.2 0L480 167.3V400c0 8.8-7.2 16-16 16z'/></svg>`
    };

    // 12 Visual presets configuration mappings
    const visualPresets = [
        {
            id: "sunset",
            title: "Sunset Glow",
            tag1: "Gradient", tag2: "Extra Rounded",
            foreColorMode: "linear",
            fgColor1: "#ec4899", fgColor2: "#f97316", fgGradAngle: 45,
            bgColorMode: "solid", bgColor1: "#ffffff",
            dotStyle: "extra-rounded", cornerStyle: "extra-rounded", cornerDotStyle: "dot",
            customEyes: false
        },
        {
            id: "cyber",
            title: "Cyber Neon",
            tag1: "Dark Theme", tag2: "Glow",
            foreColorMode: "linear",
            fgColor1: "#00f2fe", fgColor2: "#4facfe", fgGradAngle: 90,
            bgColorMode: "solid", bgColor1: "#070a13",
            dotStyle: "classy", cornerStyle: "outward-curve", cornerDotStyle: "rounded",
            customEyes: true, eyeFrameColor: "#00f2fe", eyeBallColor: "#4facfe"
        },
        {
            id: "gold",
            title: "Luxury Gold",
            tag1: "Elegance", tag2: "Diamond",
            foreColorMode: "linear",
            fgColor1: "#c5a880", fgColor2: "#533a1c", fgGradAngle: 135,
            bgColorMode: "solid", bgColor1: "#0a0a0a",
            dotStyle: "classy", cornerStyle: "square", cornerDotStyle: "square",
            customEyes: false
        },
        {
            id: "ocean",
            title: "Ocean Breeze",
            tag1: "Fresh", tag2: "Gradients",
            foreColorMode: "linear",
            fgColor1: "#06b6d4", fgColor2: "#3b82f6", fgGradAngle: 30,
            bgColorMode: "solid", bgColor1: "#ffffff",
            dotStyle: "rounded", cornerStyle: "rounded", cornerDotStyle: "rounded",
            customEyes: false
        },
        {
            id: "forest",
            title: "Forest Moss",
            tag1: "Nature", tag2: "Organic",
            foreColorMode: "solid",
            fgColor1: "#14532d",
            bgColorMode: "solid", bgColor1: "#f0fdf4",
            dotStyle: "dots", cornerStyle: "extra-rounded", cornerDotStyle: "dot",
            customEyes: false
        },
        {
            id: "bubblegum",
            title: "Candy Pop",
            tag1: "Pastel", tag2: "Rounded",
            foreColorMode: "linear",
            fgColor1: "#ff007f", fgColor2: "#7f00ff", fgGradAngle: 60,
            bgColorMode: "solid", bgColor1: "#fff0f6",
            dotStyle: "extra-rounded", cornerStyle: "rounded", cornerDotStyle: "dot",
            customEyes: false
        },
        {
            id: "spotify",
            title: "Spotify Green",
            tag1: "Sleek", tag2: "Tech",
            foreColorMode: "solid",
            fgColor1: "#1db954",
            bgColorMode: "solid", bgColor1: "#121212",
            dotStyle: "rounded", cornerStyle: "rounded", cornerDotStyle: "dot",
            customEyes: true, eyeFrameColor: "#ffffff", eyeBallColor: "#1db954"
        },
        {
            id: "slate",
            title: "Slate Clean",
            tag1: "Corporate", tag2: "Square",
            foreColorMode: "solid",
            fgColor1: "#334155",
            bgColorMode: "solid", bgColor1: "#f8fafc",
            dotStyle: "square", cornerStyle: "square", cornerDotStyle: "square",
            customEyes: false
        },
        {
            id: "minimal",
            title: "Classic Mono",
            tag1: "Default", tag2: "High Contrast",
            foreColorMode: "solid",
            fgColor1: "#05070d",
            bgColorMode: "solid", bgColor1: "#ffffff",
            dotStyle: "square", cornerStyle: "square", cornerDotStyle: "square",
            customEyes: false
        },
        {
            id: "cherry",
            title: "Cherry Bloom",
            tag1: "Soft", tag2: "Warm",
            foreColorMode: "linear",
            fgColor1: "#f43f5e", fgColor2: "#fda4af", fgGradAngle: 120,
            bgColorMode: "solid", bgColor1: "#fff5f5",
            dotStyle: "rounded", cornerStyle: "inward-curve", cornerDotStyle: "rounded",
            customEyes: false
        },
        {
            id: "halloween",
            title: "Spooky Orange",
            tag1: "Dark", tag2: "Festive",
            foreColorMode: "solid",
            fgColor1: "#ff6a00",
            bgColorMode: "solid", bgColor1: "#111111",
            dotStyle: "classy-rounded", cornerStyle: "inward-curve", cornerDotStyle: "square",
            customEyes: true, eyeFrameColor: "#ff6a00", eyeBallColor: "#ffffff"
        },
        {
            id: "midnight",
            title: "Midnight Blue",
            tag1: "Contrast", tag2: "Glow",
            foreColorMode: "linear",
            fgColor1: "#2563eb", fgColor2: "#0284c7", fgGradAngle: 45,
            bgColorMode: "solid", bgColor1: "#030712",
            dotStyle: "classy-rounded", cornerStyle: "extra-rounded", cornerDotStyle: "rounded",
            customEyes: true, eyeFrameColor: "#ffffff", eyeBallColor: "#2563eb"
        }
    ];

    // Helper: Escape tags for HTML strings
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Dynamic field markup generators for each action type
    const fieldTemplates = {
        url: () => `
            <div class="field">
                <label for="f_url">Website URL Address</label>
                <input type="url" id="f_url" placeholder="https://example.com" value="https://chandra.studio" />
            </div>
        `,
        text: () => `
            <div class="field">
                <label for="f_text">Plain Text Message</label>
                <textarea id="f_text" rows="3" placeholder="Type text here...">Welcome to Chandra Studio! Customize, scan, and print.</textarea>
            </div>
        `,
        wifi: () => `
            <div class="field">
                <label for="f_wifi_ssid">WiFi SSID (Network Name)</label>
                <input type="text" id="f_wifi_ssid" placeholder="My Home WiFi" value="FreeWiFi" />
            </div>
            <div class="field">
                <label for="f_wifi_pass">Network Password</label>
                <input type="password" id="f_wifi_pass" placeholder="Network password" value="password123" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_wifi_enc">Security Type</label>
                    <select id="f_wifi_enc">
                        <option value="WPA" selected>WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Unsecured (None)</option>
                    </select>
                </div>
                <div class="field toggle-field">
                    <label for="f_wifi_hidden" class="toggle-container">
                        <input type="checkbox" id="f_wifi_hidden" />
                        <span class="toggle-slider"></span>
                        Hidden SSID
                    </label>
                </div>
            </div>
        `,
        email: () => `
            <div class="field">
                <label for="f_email_to">Recipient Email Address</label>
                <input type="email" id="f_email_to" placeholder="hello@company.com" value="info@example.com" />
            </div>
            <div class="field">
                <label for="f_email_sub">Subject Line</label>
                <input type="text" id="f_email_sub" placeholder="Inquiry" value="Hello from Chandra User" />
            </div>
            <div class="field">
                <label for="f_email_body">Pre-filled Email Body</label>
                <textarea id="f_email_body" rows="3" placeholder="Type email details here...">Thanks for creating a great QR generator!</textarea>
            </div>
        `,
        phone: () => `
            <div class="field">
                <label for="f_phone">Telephone Number</label>
                <input type="text" id="f_phone" placeholder="+1234567890" value="+18005550199" />
            </div>
        `,
        sms: () => `
            <div class="field">
                <label for="f_sms_phone">Recipient Mobile Number</label>
                <input type="text" id="f_sms_phone" placeholder="+1234567890" value="+18005550199" />
            </div>
            <div class="field">
                <label for="f_sms_msg">SMS Message Content</label>
                <textarea id="f_sms_msg" rows="2" placeholder="Send me a text...">Interested in the properties. Please text details.</textarea>
            </div>
        `,
        whatsapp: () => `
            <div class="field">
                <label for="f_wa_phone">WhatsApp Mobile (with Country Code)</label>
                <input type="text" id="f_wa_phone" placeholder="15551234567" value="18005550199" />
                <span class="hint">Numbers only. Do not include spaces or symbols.</span>
            </div>
            <div class="field">
                <label for="f_wa_msg">Default Message Payload</label>
                <textarea id="f_wa_msg" rows="2" placeholder="Hi there...">Hello, I scanned your QR code and want to connect!</textarea>
            </div>
        `,
        vcard: () => `
            <div class="two-col">
                <div class="field">
                    <label for="f_vc_first">First Name</label>
                    <input type="text" id="f_vc_first" value="Alex" />
                </div>
                <div class="field">
                    <label for="f_vc_last">Last Name</label>
                    <input type="text" id="f_vc_last" value="Morgan" />
                </div>
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_vc_org">Company</label>
                    <input type="text" id="f_vc_org" value="Creative Labs" />
                </div>
                <div class="field">
                    <label for="f_vc_title">Job Title</label>
                    <input type="text" id="f_vc_title" value="Director of Design" />
                </div>
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_vc_mobile">Cell Phone</label>
                    <input type="text" id="f_vc_mobile" value="+15551234" />
                </div>
                <div class="field">
                    <label for="f_vc_email">Work Email</label>
                    <input type="email" id="f_vc_email" value="alex@creativelabs.io" />
                </div>
            </div>
            <div class="field">
                <label for="f_vc_url">Company Website URL</label>
                <input type="url" id="f_vc_url" value="https://creativelabs.io" />
            </div>
            <div class="field">
                <label for="f_vc_note">Short Note</label>
                <input type="text" id="f_vc_note" value="Feel free to reach out!" />
            </div>
        `,
        event: () => `
            <div class="field">
                <label for="f_ev_title">Event Title</label>
                <input type="text" id="f_ev_title" value="Creative Product Launch" />
            </div>
            <div class="field">
                <label for="f_ev_loc">Location</label>
                <input type="text" id="f_ev_loc" value="Metropolitan Center, NY" />
            </div>
            <div class="field">
                <label for="f_ev_desc">Description Details</label>
                <input type="text" id="f_ev_desc" value="Exclusive reveal of our next-gen dynamic systems." />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_ev_start">Start Time</label>
                    <input type="date" id="f_ev_start" value="2026-06-25" />
                </div>
                <div class="field">
                    <label for="f_ev_end">End Time</label>
                    <input type="date" id="f_ev_end" value="2026-06-26" />
                </div>
            </div>
        `,
        social: () => `
            <div class="field">
                <label for="f_so_brand">Choose Platform</label>
                <select id="f_so_brand">
                    <option value="instagram" selected>Instagram</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="telegram">Telegram</option>
                </select>
            </div>
            <div class="field">
                <label for="f_so_username" id="f_so_label">Username / Handle</label>
                <input type="text" id="f_so_username" placeholder="username" value="chandra" />
            </div>
        `,
        crypto: () => `
            <div class="field">
                <label for="f_cr_currency">Select Cryptocurrency</label>
                <select id="f_cr_currency">
                    <option value="bitcoin" selected>BTC (Bitcoin)</option>
                    <option value="ethereum">ETH (Ethereum)</option>
                    <option value="solana">SOL (Solana)</option>
                </select>
            </div>
            <div class="field">
                <label for="f_cr_address">Wallet Address</label>
                <input type="text" id="f_cr_address" placeholder="Address..." value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_cr_amount">Amount (Optional)</label>
                    <input type="number" id="f_cr_amount" placeholder="0.05" step="0.0001" />
                </div>
                <div class="field">
                    <label for="f_cr_msg">Message/Memo (Optional)</label>
                    <input type="text" id="f_cr_msg" placeholder="Payment reference" />
                </div>
            </div>
        `,
        paypal: () => `
            <div class="field">
                <label for="f_pp_email">PayPal Merchant Email</label>
                <input type="email" id="f_pp_email" placeholder="merchant@paypal.com" value="donations@example.com" />
            </div>
            <div class="field">
                <label for="f_pp_type">Payment Type</label>
                <select id="f_pp_type">
                    <option value="_donations" selected>Donations</option>
                    <option value="_xclick">Buy Now / Purchases</option>
                </select>
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_pp_name">Item Name / Project</label>
                    <input type="text" id="f_pp_name" value="OpenSource Support" />
                </div>
                <div class="field">
                    <label for="f_pp_amount">Fixed Amount</label>
                    <input type="number" id="f_pp_amount" value="10" />
                </div>
            </div>
            <div class="field">
                <label for="f_pp_currency">Currency Code</label>
                <select id="f_pp_currency">
                    <option value="USD" selected>USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                </select>
            </div>
        `,
        zoom: () => `
            <div class="field">
                <label for="f_zm_id">Zoom Meeting ID</label>
                <input type="text" id="f_zm_id" placeholder="123 456 7890" value="8885550123" />
            </div>
            <div class="field">
                <label for="f_zm_pass">Meeting Passcode</label>
                <input type="password" id="f_zm_pass" placeholder="Password" value="zoomPass" />
            </div>
        `,
        spotify: () => `
            <div class="field">
                <label for="f_sp_url">Spotify Track / Artist Link</label>
                <input type="url" id="f_sp_url" placeholder="https://open.spotify.com/track/..." value="https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva" />
            </div>
        `,
        maps: () => `
            <div class="field">
                <label for="f_mp_query">Search Address or Coordinates</label>
                <input type="text" id="f_mp_query" placeholder="Times Square, NYC or 40.758,-73.985" value="Times Square, NYC" />
            </div>
        `,
        upi: () => `
            <div class="field">
                <label for="f_upi_id">UPI ID / VPA</label>
                <input type="text" id="f_upi_id" placeholder="yourname@upi" value="merchant@upi" />
                <span class="hint">e.g. name@okaxis, name@paytm, 9876543210@ybl</span>
            </div>
            <div class="field">
                <label for="f_upi_name">Payee Name</label>
                <input type="text" id="f_upi_name" placeholder="Merchant Name" value="My Store" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_upi_amount">Amount (₹)</label>
                    <input type="number" id="f_upi_amount" placeholder="0.00" step="0.01" value="" />
                </div>
                <div class="field">
                    <label for="f_upi_note">Note / Description</label>
                    <input type="text" id="f_upi_note" placeholder="Payment note" value="" />
                </div>
            </div>
        `,
        phonepe: () => `
            <div class="field">
                <label for="f_ppe_upiid">PhonePe UPI ID / VPA</label>
                <input type="text" id="f_ppe_upiid" placeholder="yourname@ybl" value="merchant@ybl" />
                <span class="hint">PhonePe VPAs typically end in @ybl or @ibl</span>
            </div>
            <div class="field">
                <label for="f_ppe_name">Payee Name</label>
                <input type="text" id="f_ppe_name" placeholder="Business Name" value="My Business" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_ppe_amount">Amount (₹)</label>
                    <input type="number" id="f_ppe_amount" placeholder="0.00" step="0.01" value="" />
                </div>
                <div class="field">
                    <label for="f_ppe_note">Transaction Note</label>
                    <input type="text" id="f_ppe_note" placeholder="e.g. Order #1001" value="" />
                </div>
            </div>
        `,
        googlepay: () => `
            <div class="field">
                <label for="f_gpy_upiid">Google Pay UPI ID / VPA</label>
                <input type="text" id="f_gpy_upiid" placeholder="yourname@okicici" value="merchant@okicici" />
                <span class="hint">GPay VPAs often end in @okicici, @oksbi, @okaxis</span>
            </div>
            <div class="field">
                <label for="f_gpy_name">Payee Name</label>
                <input type="text" id="f_gpy_name" placeholder="Merchant Name" value="My Shop" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_gpy_amount">Amount (₹)</label>
                    <input type="number" id="f_gpy_amount" placeholder="0.00" step="0.01" value="" />
                </div>
                <div class="field">
                    <label for="f_gpy_note">Payment Note</label>
                    <input type="text" id="f_gpy_note" placeholder="e.g. Invoice 202" value="" />
                </div>
            </div>
        `,
        paytm: () => `
            <div class="field">
                <label for="f_ptm_mobile">Paytm Registered Mobile / UPI ID</label>
                <input type="text" id="f_ptm_mobile" placeholder="9876543210 or name@paytm" value="9876543210@paytm" />
            </div>
            <div class="field">
                <label for="f_ptm_name">Payee Name</label>
                <input type="text" id="f_ptm_name" placeholder="Merchant / Person Name" value="My Shop" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_ptm_amount">Amount (₹)</label>
                    <input type="number" id="f_ptm_amount" placeholder="0.00" step="0.01" value="" />
                </div>
                <div class="field">
                    <label for="f_ptm_note">Note</label>
                    <input type="text" id="f_ptm_note" placeholder="Payment purpose" value="" />
                </div>
            </div>
        `,
        bhim: () => `
            <div class="field">
                <label for="f_bhm_upiid">BHIM UPI ID / VPA</label>
                <input type="text" id="f_bhm_upiid" placeholder="yourname@upi" value="user@upi" />
                <span class="hint">Works with all BHIM-UPI supported bank apps</span>
            </div>
            <div class="field">
                <label for="f_bhm_name">Payee Name</label>
                <input type="text" id="f_bhm_name" placeholder="Merchant Name" value="Merchant" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_bhm_amount">Amount (₹)</label>
                    <input type="number" id="f_bhm_amount" placeholder="0.00" step="0.01" value="" />
                </div>
                <div class="field">
                    <label for="f_bhm_note">Remark</label>
                    <input type="text" id="f_bhm_note" placeholder="Payment remark" value="" />
                </div>
            </div>
        `,
        amazonpay: () => `
            <div class="field">
                <label for="f_apay_upiid">Amazon Pay UPI ID</label>
                <input type="text" id="f_apay_upiid" placeholder="yourname@apl" value="merchant@apl" />
                <span class="hint">Amazon Pay VPAs typically end in @apl</span>
            </div>
            <div class="field">
                <label for="f_apay_name">Payee Name</label>
                <input type="text" id="f_apay_name" placeholder="Merchant Name" value="My Store" />
            </div>
            <div class="two-col">
                <div class="field">
                    <label for="f_apay_amount">Amount (₹)</label>
                    <input type="number" id="f_apay_amount" placeholder="0.00" step="0.01" value="" />
                </div>
                <div class="field">
                    <label for="f_apay_note">Payment Note</label>
                    <input type="text" id="f_apay_note" placeholder="e.g. Order payment" value="" />
                </div>
            </div>
        `
    };

    // Compiles fields inputs to standard string formats
    function compileFieldsToPayload() {
        const type = $("#qrTypeSelect").value;
        const getVal = (id) => $(id) ? $(id).value.trim() : "";

        switch (type) {
            case "url":
                return getVal("#f_url") || "https://chandra.studio";
            case "text":
                return getVal("#f_text") || "";
            case "wifi": {
                const ssid = getVal("#f_wifi_ssid") || "WiFi";
                const pass = getVal("#f_wifi_pass");
                const enc = getVal("#f_wifi_enc");
                const hidden = $("#f_wifi_hidden")?.checked || false;
                // WIFI:T:WPA;S:SSID;P:PASSWORD;H:false;;
                return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`;
            }
            case "email": {
                const to = getVal("#f_email_to");
                const sub = encodeURIComponent(getVal("#f_email_sub"));
                const body = encodeURIComponent(getVal("#f_email_body"));
                return `mailto:${to}?subject=${sub}&body=${body}`;
            }
            case "phone":
                return `tel:${getVal("#f_phone")}`;
            case "sms":
                return `SMSTO:${getVal("#f_sms_phone")}:${getVal("#f_sms_msg")}`;
            case "whatsapp": {
                const phone = getVal("#f_wa_phone").replace(/[^0-9]/g, "");
                const msg = encodeURIComponent(getVal("#f_wa_msg"));
                return `https://wa.me/${phone}?text=${msg}`;
            }
            case "vcard": {
                const f = getVal("#f_vc_first");
                const l = getVal("#f_vc_last");
                const org = getVal("#f_vc_org");
                const title = getVal("#f_vc_title");
                const mob = getVal("#f_vc_mobile");
                const email = getVal("#f_vc_email");
                const url = getVal("#f_vc_url");
                const note = getVal("#f_vc_note");

                return `BEGIN:VCARD\nVERSION:3.0\nN:${l};${f};;;\nFN:${f} ${l}\nORG:${org}\nTITLE:${title}\nTEL;TYPE=CELL:${mob}\nEMAIL;TYPE=PREF,INTERNET:${email}\nURL:${url}\nNOTE:${note}\nEND:VCARD`;
            }
            case "event": {
                const title = getVal("#f_ev_title");
                const loc = getVal("#f_ev_loc");
                const desc = getVal("#f_ev_desc");
                const start = getVal("#f_ev_start").replace(/-/g, "");
                const end = getVal("#f_ev_end").replace(/-/g, "");

                return `BEGIN:VEVENT\nSUMMARY:${title}\nLOCATION:${loc}\nDESCRIPTION:${desc}\nDTSTART:${start}T090000Z\nDTEND:${end}T180000Z\nEND:VEVENT`;
            }
            case "social": {
                const brand = getVal("#f_so_brand");
                const user = getVal("#f_so_username");
                if (brand === "youtube") return `https://youtube.com/@${user}`;
                if (brand === "instagram") return `https://instagram.com/${user}`;
                if (brand === "twitter") return `https://x.com/${user}`;
                if (brand === "tiktok") return `https://tiktok.com/@${user}`;
                if (brand === "linkedin") return `https://linkedin.com/in/${user}`;
                if (brand === "telegram") return `https://t.me/${user}`;
                return user;
            }
            case "crypto": {
                const curr = getVal("#f_cr_currency");
                const addr = getVal("#f_cr_address");
                const amt = getVal("#f_cr_amount");
                const msg = getVal("#f_cr_msg");
                
                let query = "";
                if (amt) query += `amount=${amt}`;
                if (msg) query += `${query ? "&" : ""}message=${encodeURIComponent(msg)}`;
                
                return `${curr}:${addr}${query ? "?" + query : ""}`;
            }
            case "paypal": {
                const email = getVal("#f_pp_email");
                const pType = getVal("#f_pp_type");
                const name = encodeURIComponent(getVal("#f_pp_name"));
                const amt = getVal("#f_pp_amount");
                const curr = getVal("#f_pp_currency");
                return `https://www.paypal.com/cgi-bin/webscr?cmd=${pType}&business=${email}&item_name=${name}&amount=${amt}&currency_code=${curr}`;
            }
            case "zoom": {
                const id = getVal("#f_zm_id").replace(/\s/g, "");
                const pwd = getVal("#f_zm_pass");
                return `https://zoom.us/j/${id}?pwd=${pwd}`;
            }
            case "spotify":
                return getVal("#f_sp_url");
            case "maps":
                return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getVal("#f_mp_query"))}`;
            case "upi": {
                const uid = getVal("#f_upi_id");
                const uname = encodeURIComponent(getVal("#f_upi_name"));
                const uamt = getVal("#f_upi_amount");
                const unote = encodeURIComponent(getVal("#f_upi_note"));
                let upiUrl = `upi://pay?pa=${uid}&pn=${uname}&cu=INR`;
                if (uamt) upiUrl += `&am=${uamt}`;
                if (unote) upiUrl += `&tn=${unote}`;
                return upiUrl;
            }
            case "phonepe": {
                const ppid = getVal("#f_ppe_upiid");
                const ppname = encodeURIComponent(getVal("#f_ppe_name"));
                const ppamt = getVal("#f_ppe_amount");
                const ppnote = encodeURIComponent(getVal("#f_ppe_note"));
                let ppUrl = `upi://pay?pa=${ppid}&pn=${ppname}&cu=INR`;
                if (ppamt) ppUrl += `&am=${ppamt}`;
                if (ppnote) ppUrl += `&tn=${ppnote}`;
                return ppUrl;
            }
            case "googlepay": {
                const gpid = getVal("#f_gpy_upiid");
                const gpname = encodeURIComponent(getVal("#f_gpy_name"));
                const gpamt = getVal("#f_gpy_amount");
                const gpnote = encodeURIComponent(getVal("#f_gpy_note"));
                let gpUrl = `upi://pay?pa=${gpid}&pn=${gpname}&cu=INR`;
                if (gpamt) gpUrl += `&am=${gpamt}`;
                if (gpnote) gpUrl += `&tn=${gpnote}`;
                return gpUrl;
            }
            case "paytm": {
                const ptid = getVal("#f_ptm_mobile");
                const ptname = encodeURIComponent(getVal("#f_ptm_name"));
                const ptamt = getVal("#f_ptm_amount");
                const ptnote = encodeURIComponent(getVal("#f_ptm_note"));
                let ptUrl = `upi://pay?pa=${ptid}&pn=${ptname}&cu=INR`;
                if (ptamt) ptUrl += `&am=${ptamt}`;
                if (ptnote) ptUrl += `&tn=${ptnote}`;
                return ptUrl;
            }
            case "bhim": {
                const bhid = getVal("#f_bhm_upiid");
                const bhname = encodeURIComponent(getVal("#f_bhm_name"));
                const bhamt = getVal("#f_bhm_amount");
                const bhnote = encodeURIComponent(getVal("#f_bhm_note"));
                let bhUrl = `upi://pay?pa=${bhid}&pn=${bhname}&cu=INR`;
                if (bhamt) bhUrl += `&am=${bhamt}`;
                if (bhnote) bhUrl += `&tn=${bhnote}`;
                return bhUrl;
            }
            case "amazonpay": {
                const apid = getVal("#f_apay_upiid");
                const apname = encodeURIComponent(getVal("#f_apay_name"));
                const apamt = getVal("#f_apay_amount");
                const apnote = encodeURIComponent(getVal("#f_apay_note"));
                let apUrl = `upi://pay?pa=${apid}&pn=${apname}&cu=INR`;
                if (apamt) apUrl += `&am=${apamt}`;
                if (apnote) apUrl += `&tn=${apnote}`;
                return apUrl;
            }
            default:
                return "https://chandra.studio";
        }
    }

    // Restore template inputs based on payload elements (e.g. WiFi parsing)
    function loadPayloadToTemplate(type, payload) {
        // Wait a render tick so template is DOM loaded
        setTimeout(() => {
            const setVal = (id, val) => { if ($(id)) $(id).value = val; };
            const check = (id, val) => { if ($(id)) $(id).checked = !!val; };

            switch (type) {
                case "url":
                    setVal("#f_url", payload);
                    break;
                case "text":
                    setVal("#f_text", payload);
                    break;
                case "wifi": {
                    const match = payload.match(/WIFI:T:(\w+);S:([^;]*);P:([^;]*);H:([^;]*);;/);
                    if (match) {
                        setVal("#f_wifi_enc", match[1]);
                        setVal("#f_wifi_ssid", match[2]);
                        setVal("#f_wifi_pass", match[3]);
                        check("#f_wifi_hidden", match[4] === "true");
                    }
                    break;
                }
                case "email": {
                    const match = payload.match(/mailto:([^?]*)\?subject=([^&]*)&body=(.*)/);
                    if (match) {
                        setVal("#f_email_to", match[1]);
                        setVal("#f_email_sub", decodeURIComponent(match[2]));
                        setVal("#f_email_body", decodeURIComponent(match[3]));
                    }
                    break;
                }
                case "phone":
                    setVal("#f_phone", payload.replace("tel:", ""));
                    break;
                case "sms": {
                    const parts = payload.replace("SMSTO:", "").split(":");
                    if (parts.length >= 2) {
                        setVal("#f_sms_phone", parts[0]);
                        setVal("#f_sms_msg", parts.slice(1).join(":"));
                    }
                    break;
                }
                case "whatsapp": {
                    const phoneMatch = payload.match(/wa\.me\/([^?]*)/);
                    const msgMatch = payload.match(/\?text=(.*)/);
                    if (phoneMatch) setVal("#f_wa_phone", phoneMatch[1]);
                    if (msgMatch) setVal("#f_wa_msg", decodeURIComponent(msgMatch[1]));
                    break;
                }
                case "vcard": {
                    const getLine = (tag) => {
                        const m = payload.match(new RegExp(`${tag}:(.*)`));
                        return m ? m[1] : "";
                    };
                    const nameParts = getLine("N").split(";");
                    setVal("#f_vc_first", nameParts[1] || "");
                    setVal("#f_vc_last", nameParts[0] || "");
                    setVal("#f_vc_org", getLine("ORG"));
                    setVal("#f_vc_title", getLine("TITLE"));
                    setVal("#f_vc_mobile", getLine("TEL;TYPE=CELL"));
                    setVal("#f_vc_email", getLine("EMAIL;TYPE=PREF,INTERNET"));
                    setVal("#f_vc_url", getLine("URL"));
                    setVal("#f_vc_note", getLine("NOTE"));
                    break;
                }
                case "event": {
                    const getLine = (tag) => {
                        const m = payload.match(new RegExp(`${tag}:(.*)`));
                        return m ? m[1] : "";
                    };
                    setVal("#f_ev_title", getLine("SUMMARY"));
                    setVal("#f_ev_loc", getLine("LOCATION"));
                    setVal("#f_ev_desc", getLine("DESCRIPTION"));
                    // Restore date fields YYYYMMDD
                    const startRaw = getLine("DTSTART").split("T")[0];
                    const endRaw = getLine("DTEND").split("T")[0];
                    if (startRaw.length === 8) {
                        setVal("#f_ev_start", `${startRaw.slice(0,4)}-${startRaw.slice(4,6)}-${startRaw.slice(6,8)}`);
                    }
                    if (endRaw.length === 8) {
                        setVal("#f_ev_end", `${endRaw.slice(0,4)}-${endRaw.slice(4,6)}-${endRaw.slice(6,8)}`);
                    }
                    break;
                }
                case "social": {
                    if (payload.includes("youtube.com")) {
                        setVal("#f_so_brand", "youtube");
                        setVal("#f_so_username", payload.split("@")[1] || "");
                    } else if (payload.includes("instagram.com")) {
                        setVal("#f_so_brand", "instagram");
                        setVal("#f_so_username", payload.split("instagram.com/")[1] || "");
                    } else if (payload.includes("x.com")) {
                        setVal("#f_so_brand", "twitter");
                        setVal("#f_so_username", payload.split("x.com/")[1] || "");
                    } else if (payload.includes("tiktok.com")) {
                        setVal("#f_so_brand", "tiktok");
                        setVal("#f_so_username", payload.split("@")[1] || "");
                    } else if (payload.includes("linkedin.com")) {
                        setVal("#f_so_brand", "linkedin");
                        setVal("#f_so_username", payload.split("in/")[1] || "");
                    } else if (payload.includes("t.me")) {
                        setVal("#f_so_brand", "telegram");
                        setVal("#f_so_username", payload.split("t.me/")[1] || "");
                    }
                    break;
                }
                case "upi":
                case "phonepe":
                case "googlepay":
                case "paytm":
                case "bhim":
                case "amazonpay": {
                    // Parse UPI URI: upi://pay?pa=ID&pn=NAME&am=AMT&tn=NOTE&cu=INR
                    const paMatch = payload.match(/[?&]pa=([^&]*)/);
                    const pnMatch = payload.match(/[?&]pn=([^&]*)/);
                    const amMatch = payload.match(/[?&]am=([^&]*)/);
                    const tnMatch = payload.match(/[?&]tn=([^&]*)/);
                    const paVal = paMatch ? decodeURIComponent(paMatch[1]) : "";
                    const pnVal = pnMatch ? decodeURIComponent(pnMatch[1]) : "";
                    const amVal = amMatch ? decodeURIComponent(amMatch[1]) : "";
                    const tnVal = tnMatch ? decodeURIComponent(tnMatch[1]) : "";
                    const prefixMap = {
                        upi: "#f_upi",
                        phonepe: "#f_ppe",
                        googlepay: "#f_gpy",
                        paytm: "#f_ptm",
                        bhim: "#f_bhm",
                        amazonpay: "#f_apay"
                    };
                    const idField = type === "paytm" ? "_mobile" : "_upiid";
                    const p = prefixMap[type];
                    setVal(`${p}${idField}`, paVal);
                    setVal(`${p}_name`, pnVal);
                    setVal(`${p}_amount`, amVal);
                    setVal(`${p}_note`, tnVal);
                    break;
                }
            }
        }, 100);
    }

    // Toggle fields based on platform
    function updatePlatformsLabel() {
        const brand = $("#f_so_brand");
        const userLabel = $("#f_so_label");
        if (!brand || !userLabel) return;
        
        const plat = brand.value;
        if (plat === "youtube") {
            userLabel.textContent = "Channel Handle (@name)";
        } else if (plat === "linkedin" || plat === "facebook") {
            userLabel.textContent = "Profile Username / Slug";
        } else {
            userLabel.textContent = "Username / Handle";
        }
    }

    // Load vector brand logos as data URLs
    function loadPresetLogoBrand(brandName) {
        let dataUrl;
        if (brandName === "chandra") {
            dataUrl = "logo.png";
        } else {
            const svgContent = brandSvgIcons[brandName];
            if (!svgContent) return;
            dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
        }
        state.logoDataUrl = dataUrl;

        // Populate controls
        $("#logoPreviewImg").src = dataUrl;
        $("#logoControlPanel").hidden = false;
        
        window.Chandra.sounds?.play("success");
        window.Chandra.showToast(`Preset brand logo [${brandName.toUpperCase()}] added!`, "success");
        
        // Auto boost size and clearing defaults
        $("#logoSizeSlider").value = 22;
        $("#logoSizeVal").textContent = "22%";
        $("#logoBackgroundEraser").checked = true;

        window.Chandra.qr.triggerRender();
    }

    // Set custom visual preset config variables
    function applyDesignPreset(presetId) {
        const preset = visualPresets.find(p => p.id === presetId);
        if (!preset) return;

        // Apply styles to inputs
        $("#dotStyle").value = preset.dotStyle;
        $("#cornerStyle").value = preset.cornerStyle;
        $("#cornerDotStyle").value = preset.cornerDotStyle;

        // Foreground
        $("#foreColorMode").value = preset.foreColorMode;
        $("#fgColor1").value = preset.fgColor1;
        if (preset.foreColorMode !== "solid") {
            $("#fgColor2").value = preset.fgColor2;
            $("#fgGradAngle").value = preset.fgGradAngle;
            $("#fgGradAngleVal").textContent = `${preset.fgGradAngle}°`;
        }

        // Background
        $("#bgColorMode").value = preset.bgColorMode;
        $("#bgColor1").value = preset.bgColor1;
        if (preset.bgColorMode !== "solid" && preset.bgColorMode !== "transparent") {
            $("#bgColor2").value = preset.bgColor2;
        }

        // Custom individual eyes
        $("#customEyesToggle").checked = preset.customEyes;
        $("#customEyeColorsContainer").hidden = !preset.customEyes;
        if (preset.customEyes) {
            $("#eyeFrameColor").value = preset.eyeFrameColor;
            $("#eyeBallColor").value = preset.eyeBallColor;
        }

        // Dispatch triggers
        $("#foreColorMode").dispatchEvent(new Event("change"));
        $("#bgColorMode").dispatchEvent(new Event("change"));
        $("#customEyesToggle").dispatchEvent(new Event("change"));

        window.Chandra.sounds?.play("preset");
        window.Chandra.showToast(`Applied preset style [${preset.title}]`, "success");

        // Re-render
        window.Chandra.qr.triggerRender(true);
    }

    // Reset Studio settings to blank defaults
    function resetStudioInputs() {
        $("#dotStyle").value = "square";
        $("#cornerStyle").value = "square";
        $("#cornerDotStyle").value = "square";
        $("#qrEcc").value = "M";

        $("#foreColorMode").value = "solid";
        $("#fgColor1").value = "#05070d";
        $("#bgColorMode").value = "solid";
        $("#bgColor1").value = "#ffffff";

        $("#customEyesToggle").checked = false;
        $("#customEyeColorsContainer").hidden = true;

        // Remove custom logo
        state.logoDataUrl = null;
        $("#logoUploadInput").value = "";
        $("#logoControlPanel").hidden = true;

        // Remove frame
        $("#frameStyleSelect").value = "none";
        $("#frameControlsContainer").hidden = true;

        // Reset dynamic field values to standard
        const type = $("#qrTypeSelect").value;
        loadPayloadToTemplate(type, type === "url" ? "https://chandra.studio" : "");

        window.Chandra.sounds?.play("error");
        window.Chandra.showToast("All configurations reset", "info");
    }

    // Drag and drop logo binders
    function setupLogoDropzone() {
        const zone = $("#logoDragZone");
        const fileInput = $("#logoUploadInput");
        
        if (!zone || !fileInput) return;

        zone.addEventListener("click", () => fileInput.click());

        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add("drag-active");
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("drag-active");
        });

        const loadFile = (file) => {
            if (!file) return;
            if (!/image\/(png|jpeg|svg\+xml)/i.test(file.type)) {
                window.Chandra.showToast("Invalid file format. Upload PNG, JPG, or SVG.", "error");
                window.Chandra.sounds?.play("error");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                state.logoDataUrl = reader.result;
                $("#logoPreviewImg").src = reader.result;
                $("#logoControlPanel").hidden = false;
                
                window.Chandra.sounds?.play("success");
                window.Chandra.showToast("Logo image uploaded successfully!", "success");
                window.Chandra.qr.triggerRender();
            };
            reader.readAsDataURL(file);
        };

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("drag-active");
            if (e.dataTransfer.files.length) {
                loadFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length) {
                loadFile(fileInput.files[0]);
            }
        });

        $("#btnRemoveLogo")?.addEventListener("click", () => {
            state.logoDataUrl = null;
            fileInput.value = "";
            $("#logoControlPanel").hidden = true;
            window.Chandra.sounds?.play("click");
            window.Chandra.showToast("Logo removed", "info");
            window.Chandra.qr.triggerRender();
        });
    }

    // Dynamic QR Redirect Simulation & Chart.js Metrics
    let analyticsTimelineChart = null;
    let analyticsDevicesChart = null;

    const mockStats = {
        scans: 0,
        uniques: 0,
        lastTime: "N/A"
    };

    function initAnalyticsChart() {
        const timelineCanvas = document.getElementById("scansTimelineChart");
        const deviceCanvas = document.getElementById("scansDeviceChart");
        
        if (!timelineCanvas || !deviceCanvas) return;

        // Render dummy line chart for scans
        if (!analyticsTimelineChart) {
            analyticsTimelineChart = new Chart(timelineCanvas, {
                type: "line",
                data: {
                    labels: ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
                    datasets: [{
                        label: "Simulated Scans Over Time",
                        data: [12, 19, 3, 5, 2, 3, mockStats.scans],
                        borderColor: "#0072ff",
                        tension: 0.3,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        // Render device distribution pie chart
        if (!analyticsDevicesChart) {
            analyticsDevicesChart = new Chart(deviceCanvas, {
                type: "doughnut",
                data: {
                    labels: ["iPhone Mobile", "Android Mobile", "Desktop/Tablet"],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: ["#00c6ff", "#0072ff", "#8e2de2"]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    // Simulate scanning trigger increments metrics
    function triggerSimulatedScan() {
        mockStats.scans += 1;
        if (Math.random() > 0.4) mockStats.uniques += 1;
        mockStats.lastTime = new Date().toLocaleTimeString();

        // Update indicators
        $("#statTotalScans").textContent = mockStats.scans;
        $("#statUniqueUsers").textContent = mockStats.uniques;
        $("#statLastScanned").textContent = mockStats.lastTime;

        // Animate charts values
        if (analyticsTimelineChart) {
            const data = analyticsTimelineChart.data.datasets[0].data;
            data[data.length - 1] = mockStats.scans;
            analyticsTimelineChart.update();
        }

        window.Chandra.sounds?.play("success");
        
        // Show simulated redirection result alert
        const destination = $("#dynamicDestInput").value || "https://original-link.com";
        window.Chandra.showToast(`Simulated Scan! Routed via short-URL to: ${destination}`, "success");
    }

    // developer Api Snippets generator logic
    function renderApiCodeSnippets() {
        const lang = window.Chandra.state.selectedApiLang || "curl";
        const codeBlock = $("#apiCodeBlock");
        if (!codeBlock) return;

        const payload = encodeURIComponent(compileFieldsToPayload());
        const options = window.Chandra.qr.getFinalOptions();
        
        let code = "";
        
        if (lang === "curl") {
            code = `curl -X POST "https://api.chandra.studio/v1/create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": "${payload}",
    "size": 400,
    "style": "${options.dotsOptions.type}",
    "eye_frame": "${options.cornersSquareOptions.type}",
    "color_foreground": "${options.dotsOptions.color || '#0072ff'}"
  }'`;
        } else if (lang === "js") {
            code = `// Embedded Javascript API request
fetch("https://api.chandra.studio/v1/create", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    data: "${payload}",
    size: 400,
    style: "${options.dotsOptions.type}",
    color_foreground: "${options.dotsOptions.color || '#0072ff'}"
  })
})
.then(res => res.blob())
.then(imageBlob => {
  const qrUrl = URL.createObjectURL(imageBlob);
  document.getElementById("qr").src = qrUrl;
});`;
        } else if (lang === "python") {
            code = `# Python API client implementation
import requests

url = "https://api.chandra.studio/v1/create"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "data": "${payload}",
    "size": 400,
    "style": "${options.dotsOptions.type}"
}

response = requests.post(url, json=data, headers=headers)
with open("chandra.png", "wb") as f:
    f.write(response.content)
print("QR Code generated successfully!")`;
        } else if (lang === "go") {
            code = `// Go Vector QR Generation snippet
package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"io"
	"os"
)

func main() {
	postBody, _ := json.Marshal(map[string]interface{}{
		"data":  "${payload}",
		"size":  400,
		"style": "${options.dotsOptions.type}",
	})
	responseBody := bytes.NewBuffer(postBody)

	req, _ := http.NewRequest("POST", "https://api.chandra.studio/v1/create", responseBody)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()

	out, _ := os.Create("chandra.png")
	defer out.Close()
	io.Copy(out, resp.Body)
}`;
        }

        codeBlock.textContent = code;
    }

    // Tab entry binds
    function initDynamicTabBindings() {
        // Platform handle change
        $("#dynamicFieldsContainer").addEventListener("change", (e) => {
            if (e.target.id === "f_so_brand") {
                updatePlatformsLabel();
            }
        });

        // Trigger code snippets re-render when help tab selected
        $("#navHelp").addEventListener("click", () => {
            window.Chandra.state.selectedApiLang = "curl";
            renderApiCodeSnippets();
        });

        const apiButtons = [
            { id: "#btnApiLangCurl", lang: "curl" },
            { id: "#btnApiLangJs", lang: "js" },
            { id: "#btnApiLangPython", lang: "python" },
            { id: "#btnApiLangGo", lang: "go" }
        ];

        apiButtons.forEach(btn => {
            $(btn.id)?.addEventListener("click", () => {
                apiButtons.forEach(b => $(b.id).classList.remove("active"));
                $(btn.id).classList.add("active");
                window.Chandra.state.selectedApiLang = btn.lang;
                renderApiCodeSnippets();
                window.Chandra.sounds?.play("click");
            });
        });

        // Update dynamic short url routing
        $("#btnSaveDynamicTarget")?.addEventListener("click", () => {
            const dest = $("#dynamicDestInput").value;
            window.Chandra.sounds?.play("success");
            window.Chandra.showToast(`Dynamic target redirected to: ${dest}`, "success");
        });

        $("#btnSimulateScan")?.addEventListener("click", triggerSimulatedScan);

        $("#btnResetAnalyticsStats")?.addEventListener("click", () => {
            mockStats.scans = 0;
            mockStats.uniques = 0;
            mockStats.lastTime = "N/A";
            $("#statTotalScans").textContent = "0";
            $("#statUniqueUsers").textContent = "0";
            $("#statLastScanned").textContent = "N/A";
            
            if (analyticsTimelineChart) {
                analyticsTimelineChart.data.datasets[0].data = [12, 19, 3, 5, 2, 3, 0];
                analyticsTimelineChart.update();
            }

            window.Chandra.sounds?.play("error");
            window.Chandra.showToast("Metrics reset", "info");
        });

        // Physical Sizing Calculator inputs
        const runCalculator = () => {
            const dist = Number($("#calcDistanceInput").value) || 1.5;
            const angle = $("#calcSurfaceAngle").value;
            
            // Sizing calculation formula: distance / 10
            let cm = dist * 10;
            if (angle === "skewed") {
                cm *= 1.5; // add 50% buffer
            }

            $("#calcOutputCm").textContent = `${cm.toFixed(1)} cm`;
            $("#calcOutputCm2").textContent = `${cm.toFixed(1)} cm`;
        };

        $("#calcDistanceInput")?.addEventListener("input", runCalculator);
        $("#calcSurfaceAngle")?.addEventListener("change", runCalculator);
        runCalculator();
    }

    // Populate Presets Grid
    function renderPresetsGallery() {
        const grid = $(".presets-gallery-grid");
        if (!grid) return;

        grid.innerHTML = "";
        visualPresets.forEach(preset => {
            const card = document.createElement("div");
            card.className = "preset-card";
            card.setAttribute("data-preset-id", preset.id);

            const title = document.createElement("h3");
            title.className = "preset-card__title";
            title.textContent = preset.title;

            // Generate mini static preview vector for the preset card
            const prev = document.createElement("div");
            prev.className = "preset-card__preview";
            
            const tags = document.createElement("div");
            tags.className = "preset-card__tags";
            tags.innerHTML = `
                <span class="tag">${preset.tag1}</span>
                <span class="tag">${preset.tag2}</span>
            `;

            card.appendChild(prev);
            card.appendChild(title);
            card.appendChild(tags);

            grid.appendChild(card);

            // Render preset mock visual onto preview box (crisp vector)
            const tempOpts = {
                width: 130,
                height: 130,
                data: "https://chandra.studio",
                margin: 4,
                dotsOptions: { type: preset.dotStyle, color: preset.fgColor1 },
                backgroundOptions: { color: preset.bgColor1 },
                cornersSquareOptions: { type: preset.cornerStyle, color: preset.customEyes ? preset.eyeFrameColor : preset.fgColor1 },
                cornersDotOptions: { type: preset.cornerDotStyle, color: preset.customEyes ? preset.eyeBallColor : preset.fgColor1 }
            };
            
            if (preset.foreColorMode !== "solid") {
                tempOpts.dotsOptions.gradient = {
                    type: preset.foreColorMode,
                    colorStops: [{ offset: 0, color: preset.fgColor1 }, { offset: 1, color: preset.fgColor2 }]
                };
            }

            const miniQR = new QRCodeStyling(tempOpts);
            miniQR.append(prev);

            // Binds click select
            card.addEventListener("click", () => {
                applyDesignPreset(preset.id);
                // Redirect back to studio
                $("#navStudio").click();
            });
        });
    }

    // Setup input dynamic rendering binders
    function setupDynamicTypeSelect() {
        const select = $("#qrTypeSelect");
        const container = $("#dynamicFieldsContainer");

        if (!select || !container) return;

        const updateFields = () => {
            const type = select.value;
            const tempFunc = fieldTemplates[type] || fieldTemplates.url;
            container.innerHTML = tempFunc();

            // Setup listeners on new dynamic inputs to render immediately
            container.querySelectorAll("input, select, textarea").forEach(input => {
                const eventType = input.type === "color" || input.type === "range" ? "input" : "change";
                input.addEventListener("input", () => {
                    window.Chandra.qr.triggerRender();
                    renderApiCodeSnippets();
                });
                
                // Add keyup checks for immediate typing
                if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
                    input.addEventListener("keyup", () => {
                        window.Chandra.qr.triggerRender();
                        renderApiCodeSnippets();
                    });
                }
            });

            // Update platforms sub-labels
            if (type === "social") {
                updatePlatformsLabel();
            }

            window.Chandra.qr.triggerRender(true);
            renderApiCodeSnippets();
        };

        select.addEventListener("change", updateFields);
        updateFields(); // Trigger initial
    }

    // Watermark, JSON imports / exports config profiles
    function setupSettingsImportExport() {
        // Export profile
        $("#btnExportDesignSettings")?.addEventListener("click", () => {
            const opts = window.Chandra.qr.getFinalOptions();
            const rawJson = JSON.stringify(opts, null, 2);
            
            const blob = new Blob([rawJson], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = "chandra_profile.json";
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            window.Chandra.sounds?.play("success");
            window.Chandra.showToast("Branding profile exported!", "success");
        });

        // Import profile
        const fileInput = $("#btnImportDesignSettings");
        fileInput?.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsed = JSON.parse(e.target.result);
                    // Load payload mock configuration
                    window.Chandra.qr.loadFromSavedConfig({
                        type: "url",
                        payload: parsed.data || "https://chandra.studio",
                        config: e.target.result
                    });
                    
                    window.Chandra.sounds?.play("success");
                    window.Chandra.showToast("Branding profile imported successfully!", "success");
                } catch (err) {
                    window.Chandra.sounds?.play("error");
                    window.Chandra.showToast("Invalid JSON profile configuration.", "error");
                }
            };
            reader.readAsText(file);
        });

        // Frame visibility triggers
        $("#frameStyleSelect")?.addEventListener("change", (e) => {
            const hasFrame = e.target.value !== "none";
            $("#frameControlsContainer").hidden = !hasFrame;
        });
    }

    // Expose dynamic payloads getter
    window.Chandra.customization = {
        getActivePayload: compileFieldsToPayload,
        loadPresetLogoBrand: loadPresetLogoBrand,
        resetStudioInputs: resetStudioInputs,
        initAnalyticsChart: initAnalyticsChart,
        loadPayloadToTemplate: loadPayloadToTemplate
    };

    // Initialize
    document.addEventListener("DOMContentLoaded", () => {
        setupDynamicTypeSelect();
        setupLogoDropzone();
        renderPresetsGallery();
        initDynamicTabBindings();
        setupSettingsImportExport();
    });

})();
