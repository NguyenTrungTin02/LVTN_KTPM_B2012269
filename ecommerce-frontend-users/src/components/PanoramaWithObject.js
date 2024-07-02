
import React, { useState } from 'react';



import { Pannellum } from 'pannellum-react';




import useModel from '../hooks/useModel';
import Model from './Model';
import ModelContainer from './ModelContainer';
import defaultImage from '../assets/PanoramaInterior.png';
import { IoMdAdd } from "react-icons/io";

const PanoramaWithObject = ({ experience,setExperience }) => {
    const { isOpen, openModel, closeModel } = useModel();
    const [panoramaImage, setPanoramaImage] = useState(defaultImage);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [showRect, setShowRect] = useState(true); // State để điều khiển hiển thị của hình chữ nhật và nút

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPanoramaImage(imageUrl);
            setSelectedSpace({ image: imageUrl });
        } else {
            setPanoramaImage(defaultImage);
        }
    };

    const handleAddModel = () => {
        openModel();
        setShowRect(false); // Ẩn hình chữ nhật và nút khi nhấn vào "Thêm mô hình 3D"
    };

    const handleSelectSpace = () => {
        // Xử lý sự kiện khi người dùng chọn không gian
    };

    const handleSelectDifferentSpace = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    };

    const handleGoBack = () => {
        setShowRect(true); // Hiển thị lại hình chữ nhật và nút khi kết thúc chọn
        setExperience(null)
    };

    const handleModelClose = () => {
        setShowRect(true); // Hiển thị lại hình chữ nhật và nút khi đóng mô hình 3D
        closeModel();
    };

    return (
        <div style={{ position: 'relative'}}>
            <Pannellum
                width="100%"
                height="100vh"
                image={panoramaImage}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
                showZoomCtrl={false}
                showFullscreenCtrl={false}
            />

            {/* Container cho hình và nút */}
            {showRect && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', borderRadius: '5px', zIndex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Hình chữ nhật bao gồm hai hình và nút */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }}>
                        {/* Hình 1 */}
                        <img src={selectedSpace ? selectedSpace.image : defaultImage} alt="Selected Space" style={{ width: '100px', height: '100px', marginRight: '5px', cursor: 'pointer' }} onClick={handleSelectSpace} />
                        {/* Dấu cộng */}
                        <div style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #000', cursor: 'pointer', borderRadius: '5px', padding: '5px' }} onClick={handleSelectDifferentSpace}>
                            <IoMdAdd size={25} />
                            <div style={{ fontSize: '10px', textAlign: 'center' }}>Chọn phong cảnh khác</div>
                        </div>
                        {/* Input type="file" ẩn */}
                        <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </div>
                    
                           {/* Nút thêm mô hình 3D */}
                <button onClick={handleAddModel} style={{ width: '100%', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer', marginBottom: '5px' }}>Thêm mô hình 3D</button>
                
                {/* Nút quay về trang trước */}
                <button onClick={handleGoBack} style={{ width: '100%', backgroundColor: 'gray', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }}>Quay về trang trước</button>
                </div>
            )}

            {/* Model Container */}
            <Model isOpen={isOpen} close={handleModelClose}>
                {isOpen && <ModelContainer experience={experience} />}
            </Model>
        </div>
    );
};

export default PanoramaWithObject;
