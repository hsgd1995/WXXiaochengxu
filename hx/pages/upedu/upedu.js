
var app = getApp();
//初始页码为1
var currentTabNo = 1;
Page({
  data: {
    currentTab: currentTabNo,
    indicatorDots: true
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    
    that.setData({
      currentTab: e.detail.current
    });
    //设置当前页码
    currentTabNo = e.detail.current;
  },
  
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      });
      //设置当前页码
      currentTabNo = e.detail.current;
    }
  },

  // 跳转
  educa: function() {
    console.log('当前页码',currentTabNo);
    
    wx.navigateTo({
      url: '../educa/educa?no=' + currentTabNo
    })
    
  }
})
