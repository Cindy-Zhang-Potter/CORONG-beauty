// technology.js - 技术解析页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化技术卡片交互
    initTechCards();
    
    // 添加图片懒加载
    initLazyLoading();
    
    // 添加平滑滚动效果
    initSmoothScroll();
});

// 技术卡片交互动画
function initTechCards() {
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        // 鼠标悬停效果增强
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        // 点击卡片可以查看详情（示例功能）
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return; // 不拦截链接和按钮点击
            }
            console.log('查看技术详情:', this.querySelector('h3').textContent);
        });
    });
}

// 图片懒加载（替换实际图片时使用）
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 回退方案
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// 平滑滚动效果
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 页面滚动时高亮当前可见的技术部分
function initScrollSpy() {
    const sections = document.querySelectorAll('section.card');
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}