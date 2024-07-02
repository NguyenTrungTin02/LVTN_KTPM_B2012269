import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls
import '../styles/modal.css';



const ModelContainer = ({experience}) => {
    const mountRef = useRef(null);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 30);
    const renderer = new THREE.WebGLRenderer({ alpha: true, powerPreference: 'high-performance', precision: 'lowp', animation: true });
    let modelGroup;
    const controls = useRef(new OrbitControls(camera, renderer.domElement)); // Create an instance of OrbitControls

    useEffect(() => {
        const currentRef = mountRef.current;
        createScene();
        initRenderer(currentRef);
        animate();
        currentRef.appendChild(renderer.domElement);
        window.addEventListener('resize', handleWindowResize);

        controls.current.update(); // Update OrbitControls
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    const handleWindowResize = () => {
        const { clientWidth, clientHeight } = mountRef.current;
        renderer.setSize(clientWidth, clientHeight);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    };

    const createScene = () => {
        const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.8);
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        camera.position.set(0, 0, 20);
        scene.add(ambientLight);
        scene.add(pointLight);
        scene.add(camera);

        // Load 3D model
        const loader = new GLTFLoader();
        loader.load(
            experience,
            (gltf) => {
                modelGroup = gltf.scene;
                scene.add(modelGroup);
            },
            undefined,
            (error) => {
                console.error('Error loading 3D model:', error);
            }
        );
    };

    const initRenderer = (currentRef) => {
        const { clientWidth, clientHeight } = currentRef;
        renderer.setSize(clientWidth, clientHeight);
    };

    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);

        controls.current.update(); // Update OrbitControls
    };

    return <div className='container3d' ref={mountRef}></div>;
};

export default ModelContainer;
