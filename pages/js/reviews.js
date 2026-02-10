// 测评页：筛选和购买按钮逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 核心：筛选功能
  document.querySelector('#filterBtn').addEventListener('click', function() {
    const country = document.querySelector('#countryFilter').value;
    const skin = document.querySelector('#skinFilter').value;
    const product = document.querySelector('#productFilter').value;
    // 拼接筛选参数，跳转至筛选后测评页
    let filterUrl = '/reviews/filter';
    const params = [];
    if (country) params.push(`country=${country}`);
    if (skin) params.push(`skin=${skin}`);
    if (product) params.push(`product=${product}`);
    if (params.length > 0) filterUrl += `?${params.join('&')}`;
    // 跳转筛选结果页
    location.href = filterUrl;
  });

  // 测评视频购买按钮：弹窗+跳转Shopee
  document.querySelectorAll('.btn-video-buy').forEach(btn => {
    btn.addEventListener('click', function() {
      alert('即将跳转至Shopee官方店铺，享受测评专属优惠！');
      window.open('{{ Shopee官方店测试链接 }}', '_blank');
    });
  });
});