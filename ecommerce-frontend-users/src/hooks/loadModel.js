import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Model() {


    const loadModel = (scene) => {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('../assets/flower_vase/scene.gltf', (model) => {
            console.log('Modelo cargado');
            scene.add(model.scene);
        }, (progreess) => {
            progreess.stopPropagation();
        }, (err) => {
            console.log(err);
        });
    }

    return { loadModel }

}