// 首页：视频播放控制逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 基础视频播放控制
  document.querySelectorAll('.btn-play').forEach(video => {
    video.addEventListener('play', () => {
      const carousel = new bootstrap.Carousel(document.querySelector('#videoCarousel'));
      carousel.pause();
    });
  });
});