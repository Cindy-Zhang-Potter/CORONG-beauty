// 产品详情页：购买按钮交互逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 购买按钮交互（弹窗提示 + 跳转Shopee）
  const buyBtn = document.querySelector('.btn-buy');
  if (buyBtn) {
    buyBtn.addEventListener('click', function() {
      // 弹出提示框：即将跳转至Shopee官方店铺
      alert('即将跳转至Shopee官方店铺，享受专属优惠券！');
      // 跳转至Shopee真实测试商品页（开发替换为实际链接）
      window.open('{{ Shopee官方店测试商品地址 }}', '_blank');
    });
  }
});