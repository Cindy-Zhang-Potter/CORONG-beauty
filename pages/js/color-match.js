// 色号数据库（可根据实际产品修改）
const colorCodes = {
    "自然象牙白": ["N01 自然象牙白", [172, 140, 120]],
    "自然米色": ["N02 自然米色", [185, 155, 135]],
    "浅米色": ["L01 浅米色", [198, 170, 152]],
    "粉调一白": ["P01 粉调一白", [210, 165, 145]],
    "黄调二白": ["Y02 黄调二白", [190, 160, 130]],
    "健康小麦": ["W01 小麦色", [165, 130, 100]],
    "暖调自然": ["W02 暖调自然", [180, 145, 125]],
    "冷调粉白": ["C01 冷调粉白", [205, 170, 150]]
};

let uploadedImage = null;

// 初始化所有色号显示
function initColorGrid() {
    const container = document.getElementById('allColorsGrid');
    container.innerHTML = '';
    
    Object.entries(colorCodes).forEach(([name, [code, rgb]]) => {
        const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        const col = document.createElement('div');
        col.className = 'col-md-3 col-6';
        col.innerHTML = `
            <div class="card h-100">
                <div style="height: 60px; background-color: ${color}; border-radius: 6px 6px 0 0;"></div>
                <div class="card-body p-3 text-center">
                    <h6 class="card-title mb-1">${name}</h6>
                    <p class="card-text small text-muted mb-1">${code}</p>
                    <p class="card-text small">RGB: ${rgb[0]}, ${rgb[1]}, ${rgb[2]}</p>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// 文件上传处理
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showError('请选择图片文件（JPG/PNG格式）');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        uploadedImage = event.target.result;
        const previewImg = document.getElementById('previewImg');
        previewImg.src = uploadedImage;
        document.getElementById('imagePreview').style.display = 'block';
        document.getElementById('uploadArea').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// 分析图片
function analyzeImage() {
    if (!uploadedImage) return;
    
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('imagePreview').style.display = 'none';
    
    // 模拟进度条
    let progress = 0;
    const progressBar = document.getElementById('progressBar');
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            processImage();
        }
    }, 200);
}

// 处理图片
function processImage() {
    const img = new Image();
    img.onload = function() {
        // 创建Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // 获取图片数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 分析肤色（简化版）
        let totalR = 0, totalG = 0, totalB = 0;
        let pixelCount = 0;
        
        // 取样中间区域（假设人脸在中间）
        const startX = Math.floor(canvas.width * 0.3);
        const startY = Math.floor(canvas.height * 0.3);
        const endX = Math.floor(canvas.width * 0.7);
        const endY = Math.floor(canvas.height * 0.7);
        
        for (let y = startY; y < endY; y += 5) {
            for (let x = startX; x < endX; x += 5) {
                const index = (y * canvas.width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // 简单的肤色判断（RGB范围）
                if (r > 100 && r < 220 && g > 80 && g < 200 && b > 60 && b < 180) {
                    totalR += r;
                    totalG += g;
                    totalB += b;
                    pixelCount++;
                }
            }
        }
        
        if (pixelCount === 0) {
            showError('未能检测到有效肤色区域，请上传更清晰的人脸照片');
            document.getElementById('loadingSpinner').style.display = 'none';
            return;
        }
        
        // 计算平均肤色
        const avgR = Math.round(totalR / pixelCount);
        const avgG = Math.round(totalG / pixelCount);
        const avgB = Math.round(totalB / pixelCount);
        const skinColor = [avgR, avgG, avgB];
        
        // 匹配色号
        const match = findBestMatch(skinColor);
        
        // 显示结果
        displayResults(skinColor, match);
        document.getElementById('loadingSpinner').style.display = 'none';
    };
    img.src = uploadedImage;
}

// 查找最佳匹配
function findBestMatch(skinColor) {
    let bestMatch = null;
    let minDistance = Infinity;
    
    for (const [name, [code, color]] of Object.entries(colorCodes)) {
        // 计算欧氏距离
        const distance = Math.sqrt(
            Math.pow(skinColor[0] - color[0], 2) +
            Math.pow(skinColor[1] - color[1], 2) +
            Math.pow(skinColor[2] - color[2], 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = {
                name: name,
                code: code,
                color: color,
                distance: Math.round(distance * 100) / 100
            };
        }
    }
    
    return bestMatch;
}

// 显示结果
function displayResults(skinColor, match) {
    // 设置结果
    document.getElementById('colorName').textContent = match.name;
    document.getElementById('colorCode').textContent = match.code;
    document.getElementById('colorRgb').textContent = `(${match.color[0]}, ${match.color[1]}, ${match.color[2]})`;
    document.getElementById('skinRgb').textContent = `(${skinColor[0]}, ${skinColor[1]}, ${skinColor[2]})`;
    document.getElementById('distance').textContent = match.distance;
    
    // 设置色块
    const colorBlock = document.getElementById('colorBlock');
    const color = `rgb(${match.color[0]}, ${match.color[1]}, ${match.color[2]})`;
    colorBlock.style.backgroundColor = color;
    
    // 设置标题
    document.getElementById('colorBlockCaption').innerHTML = `
        <strong>${match.name}</strong> - ${match.code}<br>
        <small class="text-muted">点击色块可查看RGB值</small>
    `;
    
    // 显示结果区域
    document.getElementById('resultArea').style.display = 'block';
    
    // 初始化所有色号网格
    initColorGrid();
}

// 显示错误
function showError(message) {
    document.getElementById('errorMsg').textContent = message;
    document.getElementById('errorArea').style.display = 'block';
}

// 重置上传
function resetUpload() {
    document.getElementById('imageUpload').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('errorArea').style.display = 'none';
    uploadedImage = null;
}

// 页面初始化
function initColorMatchPage() {
    // 绑定文件上传事件
    document.getElementById('imageUpload').addEventListener('change', handleFileUpload);
    
    // 拖拽上传
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ff6b6b';
        uploadArea.style.backgroundColor = '#fff5f5';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = 'white';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = 'white';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.match('image.*')) {
            document.getElementById('imageUpload').files = files;
            const event = new Event('change');
            document.getElementById('imageUpload').dispatchEvent(event);
        }
    });
    
    // 初始化色号网格
    initColorGrid();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initColorMatchPage);