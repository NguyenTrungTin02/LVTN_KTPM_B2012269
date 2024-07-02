// opencvWorker.js

import cv from 'opencv.js';

this.onmessage = (event) => {
    const { imageData } = event.data;

    // Chuyển dữ liệu hình ảnh sang ma trận OpenCV.js
    const mat = cv.matFromImageData(imageData);

    // Thực hiện xử lý hình ảnh tại đây (ví dụ: cắt nền, di chuyển vật thể, ...)

    // Chuyển đổi ma trận OpenCV.js trở lại dữ liệu hình ảnh Uint8ClampedArray
    const processedImageData = new ImageData(
        new Uint8ClampedArray(mat.data),
        mat.cols,
        mat.rows
    );

    // Gửi kết quả xử lý về main thread
    this.postMessage({ processedImageData });
};
