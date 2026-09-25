/* =========================================================
   DIGITALIEN
   MOTHERSHIP 3D HERO
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";



/* =========================================================
   ELEMENTS
========================================================= */

const canvas =
    document.getElementById("ufo-canvas");

const container =
    document.getElementById("ufo");

const loading =
    document.getElementById("ufo-loading");

const year = document.getElementById("year");

const menuToggle = document.querySelector(".menu-toggle");
const primaryMenu = document.getElementById("primary-menu");

if (year) {
    year.textContent = new Date().getFullYear();
}

if (menuToggle && primaryMenu) {
    const closeMenu = () => {
        menuToggle.classList.remove("is-open");
        primaryMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = primaryMenu.classList.toggle("is-open");
        menuToggle.classList.toggle("is-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    primaryMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) closeMenu();
    });
}

const projectTrack = document.querySelector(".project-track");

if (projectTrack) {
    let projectOffset = 0;
    let projectLastFrame = performance.now();

    const moveProjects = (now) => {
        const elapsed = Math.min((now - projectLastFrame) / 1000, 0.1);
        const loopWidth = projectTrack.scrollWidth / 2;
        const speed = window.innerWidth <= 760 ? 48 : 68;

        projectLastFrame = now;

        if (loopWidth > 0) {
            projectOffset -= speed * elapsed;

            if (Math.abs(projectOffset) >= loopWidth) {
                projectOffset += loopWidth;
            }

            projectTrack.style.transform = `translate3d(${projectOffset}px, 0, 0)`;
        }

        window.requestAnimationFrame(moveProjects);
    };

    window.requestAnimationFrame(moveProjects);
}



/* =========================================================
   SAFETY CHECK
========================================================= */

if (!canvas || !container) {

    console.error(
        "UFO canvas/container not found."
    );

    throw new Error(
        "UFO canvas/container not found."
    );
}



/* =========================================================
   SCENE
========================================================= */

const scene =
    new THREE.Scene();



/* =========================================================
   CAMERA
========================================================= */

const camera =
    new THREE.PerspectiveCamera(
        32,
        1,
        0.01,
        100
    );

camera.position.set(
    0,
    0,
    7
);



/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({

        canvas: canvas,

        alpha: true,

        antialias: true,

        powerPreference:
            "high-performance"

    });


renderer.setClearColor(
    0x000000,
    0
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    0.82;



/* =========================================================
   LIGHTING
========================================================= */

const ambient =
    new THREE.AmbientLight(
        0xffffff,
        1.15
    );

scene.add(ambient);



const key =
    new THREE.DirectionalLight(
        0xffffff,
        2.1
    );

key.position.set(
    5,
    7,
    8
);

scene.add(key);



const front =
    new THREE.DirectionalLight(
        0xffffff,
        0.75
    );

front.position.set(
    -4,
    2,
    7
);

scene.add(front);



const top =
    new THREE.DirectionalLight(
        0xffffff,
        0.8
    );

top.position.set(
    0,
    7,
    3
);

scene.add(top);



const rim =
    new THREE.DirectionalLight(
        0xffffff,
        1
    );

rim.position.set(
    -5,
    2,
    -5
);

scene.add(rim);



/* =========================================================
   MODEL GROUP
========================================================= */

const modelGroup =
    new THREE.Group();

scene.add(modelGroup);



/* =========================================================
   MOUSE
========================================================= */

const mouse = {

    x: 0,

    y: 0

};


const targetMouse = {

    x: 0,

    y: 0

};



/* =========================================================
   MOUSE MOVE
========================================================= */

window.addEventListener(
    "mousemove",
    (event) => {

        targetMouse.x =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        targetMouse.y =
            -(
                (
                    event.clientY /
                    window.innerHeight
                ) * 2 - 1
            );

    },
    {
        passive: true
    }
);



/* =========================================================
   TOUCH
========================================================= */

window.addEventListener(
    "touchmove",
    (event) => {

        if (
            !event.touches ||
            !event.touches.length
        ) {
            return;
        }


        const touch =
            event.touches[0];


        targetMouse.x =
            (
                touch.clientX /
                window.innerWidth
            ) * 2 - 1;


        targetMouse.y =
            -(
                (
                    touch.clientY /
                    window.innerHeight
                ) * 2 - 1
            );

    },
    {
        passive: true
    }
);



/* =========================================================
   MOUSE RESET
========================================================= */

window.addEventListener(
    "mouseleave",
    () => {

        targetMouse.x = 0;

        targetMouse.y = 0;

    }
);



/* =========================================================
   LOAD MODEL
========================================================= */

const loader =
    new GLTFLoader();


let mothership = null;
const modelOffset = new THREE.Vector3();


loader.load(

    "./assets/mothership.glb",


    /* =====================================================
       SUCCESS
    ====================================================== */

    (gltf) => {

        console.log(
            "✓ mothership.glb loaded"
        );


        mothership =
            gltf.scene;


        modelGroup.add(
            mothership
        );



        /* =================================================
           FIND MODEL BOUNDS
        ================================================== */

        const box =
            new THREE.Box3()
                .setFromObject(
                    mothership
                );


        const size =
            new THREE.Vector3();


        const center =
            new THREE.Vector3();


        box.getSize(size);

        box.getCenter(center);



        console.log(
            "Model size:",
            size
        );



        /* =================================================
           CENTER MODEL
        ================================================== */

        mothership.position.x =
            -center.x;


        mothership.position.y =
            -center.y;


        mothership.position.z =
            -center.z;

        modelOffset.copy(mothership.position);



        /* =================================================
           SCALE MODEL
        ================================================== */

        const largestDimension =
            Math.max(
                size.x,
                size.y,
                size.z
            );


        /*
           Change this number if
           you want the UFO larger/smaller.
        */

        const desiredSize =
            4.8;


        const scale =
            desiredSize /
            largestDimension;


        mothership.scale.setScalar(
            scale
        );



        /* =================================================
           MODEL ROTATION
        ================================================== */

        mothership.rotation.set(
            THREE.MathUtils.degToRad(4),
            THREE.MathUtils.degToRad(-10),
            THREE.MathUtils.degToRad(-4)
        );



        /* =================================================
           MATERIALS
        ================================================== */

        mothership.traverse(
            (object) => {

                if (
                    object.isMesh
                ) {

                    object.frustumCulled =
                        false;


                    const materials = Array.isArray(object.material)
                        ? object.material
                        : [object.material];

                    materials.filter(Boolean).forEach((material) => {
                        /* Remove only the dark diffuse texture. Keep the
                           remaining material detail maps for a clean finish. */
                        material.map = null;
                        material.color.set(0xffffff);

                        if (material.emissive) {
                            material.emissive.set(0x000000);
                        }

                        if (material.emissiveMap) {
                            material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
                            material.emissiveIntensity = 0.45;
                        }

                        material.needsUpdate = true;
                    });

                }

            }
        );



        /* =================================================
           HIDE LOADER
        ================================================== */

        if (loading) {

            loading.style.opacity =
                "0";


            setTimeout(
                () => {

                    loading.style.display =
                        "none";

                },
                500
            );

        }

    },


    /* =====================================================
       PROGRESS
    ====================================================== */

    (progress) => {

        if (
            progress.total
        ) {

            const percent =
                (
                    progress.loaded /
                    progress.total
                ) * 100;


            console.log(
                `Loading mothership: ${percent.toFixed(0)}%`
            );

        }

    },


    /* =====================================================
       ERROR
    ====================================================== */

    (error) => {

        console.error(
            "================================="
        );

        console.error(
            "MOTHERSHIP FAILED TO LOAD"
        );

        console.error(
            error
        );

        console.error(
            "Make sure the file exists at:"
        );

        console.error(
            "./assets/mothership.glb"
        );

        console.error(
            "================================="
        );


        if (loading) {

            loading.style.display =
                "none";

        }

    }

);



/* =========================================================
   RESIZE
========================================================= */

function resize() {

    const width =
        container.clientWidth;


    const height =
        container.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {
        return;
    }


    const pixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    renderer.setPixelRatio(
        pixelRatio
    );


    renderer.setSize(
        width,
        height,
        false
    );


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();

}


window.addEventListener(
    "resize",
    resize
);


resize();





/* =========================================================
   SCROLL FLIGHT — HERO -> SERVICES
========================================================= */

const servicesSection = document.getElementById("services");
const servicesHeading = servicesSection?.querySelector("h2");

let flightProgress = 0;
let targetFlightProgress = 0;
let ufoScrollLocked = false;
let ufoLandingScroll = 0;
let ufoIsAnchored = false;

function clamp01(value) {
    return Math.max(0, Math.min(1, value));
}

function getUfoBaseTop() {
    /* These values mirror the responsive `top` rules in styles.css.
       Reading CSS `top: 30%` with parseFloat returns 30, not 30% of the
       viewport, which was the reason the landing line was incorrect. */
    if (window.innerWidth <= 760) return window.innerHeight * 0.52;
    if (window.innerWidth <= 1100) return window.innerHeight * 0.36;

    return window.innerHeight * 0.30;
}

function getUfoStopScroll() {
    if (!servicesHeading) return 0;

    /* Land the centre of the UFO on the same horizontal line as the
       Services heading, instead of using a screen-size-only scroll value. */
    const headingRect = servicesHeading.getBoundingClientRect();
    const headingCenterInDocument =
        window.scrollY + headingRect.top + headingRect.height / 2;

    const ufoBaseTop = getUfoBaseTop();

    const landingShift = Math.min(window.innerHeight * 0.07, 56);
    const ufoLandingCenter =
        ufoBaseTop + container.clientHeight / 2 + landingShift;

    return Math.max(0, headingCenterInDocument - ufoLandingCenter);
}

function measureUfoLanding() {
    /* Capture one precise landing point. Do not recalculate it as the user
       scrolls, otherwise reveal transforms and layout rounding can let the
       model drift past the Services headline. */
    ufoLandingScroll = getUfoStopScroll();
}

function updateScrollFlight() {

    if (window.matchMedia("(max-width: 760px)").matches) {
        flightProgress = 0;
        container.classList.remove("ufo-locked", "is-hidden");
        container.style.position = "";
        container.style.top = "";
        container.style.setProperty("--flight-x", "0px");
        container.style.setProperty("--flight-y", "0px");
        container.style.setProperty("--ufo-scale", "1");
        container.style.setProperty("--ufo-tilt", "0deg");
        return;
    }
    if (!servicesSection) return;

    const stopScroll = ufoLandingScroll;

    /* HARD LOCK: after it lands in Services, no further scroll movement
       is applied to the UFO. */
    if (window.scrollY >= stopScroll) {
        ufoScrollLocked = true;
        flightProgress = 1;
        targetFlightProgress = 1;
        container.classList.add("ufo-locked");

        /* Turn the fixed UFO into an element anchored in Services. It keeps
           its landing position, then naturally scrolls out with that section
           instead of staying fixed over the About section or disappearing. */
        if (!ufoIsAnchored) {
            container.style.position = "absolute";
            container.style.top = `${stopScroll + getUfoBaseTop()}px`;
            ufoIsAnchored = true;
        }
        return;
    }

    /* Scrolling back UP unlocks the flight so it can return toward the hero. */
    ufoScrollLocked = false;
    ufoIsAnchored = false;
    container.style.position = "";
    container.style.top = "";
    container.classList.remove("ufo-locked");
    container.classList.remove("is-hidden");

    const flightDistance = Math.max(stopScroll, 1);
    targetFlightProgress = clamp01(
        window.scrollY / flightDistance
    );
}

function applyScrollFlight() {
    if (!ufoScrollLocked) {
        flightProgress +=
            (targetFlightProgress - flightProgress) * 0.09;
    } else {
        /* Never let scroll animation pull the UFO farther down. */
        flightProgress = 1;
    }

    /* Final position: centre-aligned with the Services title. */
    const x = -Math.min(window.innerWidth * 0.055, 80) * flightProgress;
    const y = Math.min(window.innerHeight * 0.07, 56) * flightProgress;

    const scale = 1 - 0.20 * flightProgress;
    const tilt = -5 * flightProgress;

    container.style.setProperty("--flight-x", `${x}px`);
    container.style.setProperty("--flight-y", `${y}px`);
    container.style.setProperty("--ufo-scale", scale.toFixed(3));
    container.style.setProperty("--ufo-tilt", `${tilt}deg`);

    requestAnimationFrame(applyScrollFlight);
}

window.addEventListener("scroll", updateScrollFlight, { passive: true });
window.addEventListener("resize", () => {
    measureUfoLanding();
    /* Re-anchor to the title's new responsive position when needed. */
    if (ufoScrollLocked) ufoIsAnchored = false;
    updateScrollFlight();
});
measureUfoLanding();
updateScrollFlight();

/* Font loading can slightly change the two-line heading height. Re-measure
   once it is final, before the visitor reaches the landing point. */
if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
        measureUfoLanding();
        updateScrollFlight();
    });
}
requestAnimationFrame(applyScrollFlight);


/* =========================================================
   SECTION REVEALS + ACTIVE NAVIGATION
========================================================= */

const revealItems = document.querySelectorAll(".reveal");
const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionReduced || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

const navLinks = [...document.querySelectorAll(".menu a:not(.menu-contact)")];
const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries.find((entry) => entry.isIntersecting);
            if (!visible) return;

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${visible.target.id}`
                );
            });
        },
        { rootMargin: "-40% 0px -52% 0px", threshold: 0 }
    );

    navSections.forEach((section) => navObserver.observe(section));
}


/* =========================================================
   ANIMATION
========================================================= */

const clock =
    new THREE.Clock();


let smoothMouseX = 0;

let smoothMouseY = 0;



/* =========================================================
   ANIMATION LOOP
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();



    /* =====================================================
       SMOOTH MOUSE
    ====================================================== */

    smoothMouseX +=
        (
            targetMouse.x -
            smoothMouseX
        ) * 0.055;


    smoothMouseY +=
        (
            targetMouse.y -
            smoothMouseY
        ) * 0.055;



    /* =====================================================
       UFO PARALLAX
    ====================================================== */

    const parallaxX =
        smoothMouseX * 18;


    const parallaxY =
        -smoothMouseY * 12;


    container.style.setProperty(
        "--mouse-x",
        `${parallaxX}px`
    );


    container.style.setProperty(
        "--mouse-y",
        `${parallaxY}px`
    );



    /* =====================================================
       MODEL
    ====================================================== */

    if (mothership) {


        /* ================================================
           FLOAT
        ================================================= */

        const floatY =
            Math.sin(
                time * 1.15
            ) * 0.07;


        const floatX =
            Math.sin(
                time * 0.7
            ) * 0.025;


        /* Keep the model's calculated centre: previously this animation
           overwrote it, which could make non-centred GLB files jump away. */
        mothership.position.y = modelOffset.y - floatY;
        mothership.position.x = modelOffset.x + floatX;



        /* ================================================
           CURSOR ROTATION
        ================================================= */

        const baseX =
            THREE.MathUtils.degToRad(4);


        const baseY =
            THREE.MathUtils.degToRad(-10);


        const baseZ =
            THREE.MathUtils.degToRad(-4);



        const targetRotationX =
            baseX -
            smoothMouseY * 0.16;


        const targetRotationY =
            baseY +
            smoothMouseX * 0.28;


        const targetRotationZ =
            baseZ -
            smoothMouseX * 0.08;



        mothership.rotation.x +=
            (
                targetRotationX -
                mothership.rotation.x
            ) * 0.045;


        mothership.rotation.y +=
            (
                targetRotationY -
                mothership.rotation.y
            ) * 0.045;


        mothership.rotation.z +=
            (
                targetRotationZ -
                mothership.rotation.z
            ) * 0.045;

    }



    /* =====================================================
       RENDER
    ====================================================== */

    renderer.render(
        scene,
        camera
    );

}


animate();
