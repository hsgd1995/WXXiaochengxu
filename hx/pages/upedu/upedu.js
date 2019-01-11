var util = require('../../utils/util.js');
var app = getApp();
var pageThis = null;
var typeList = [];
var scrollViewNo = 1;
var swiperNo = 1;
var typeName = '';
Page({
  data: {
    scrollViewNo: scrollViewNo,
    swiperNo: swiperNo,
    typeName: '',
    typeList:[],
    indicatorDots: true
  },
  //加载页面
  onLoad: function (options) {
    pageThis = this;
   

    wx.request({
      url: util.url+'/wxaccess/type/geTypes',
      dataType: 'json',
      method: 'get',
      success: function (res) {
        console.log(res);
        //debugger;
        typeList = res.data;
        typeName = typeList[1].name; 
        pageThis.setData({
          typeList: res.data,
          typeName: typeName
        });
         
      }
    })

  },

  //滑动切换
  swiperTab: function (e) {
    //debugger;
    var currentNo = e.detail.current;
    typeName = typeList[currentNo].name;
    pageThis.setData({
      scrollViewNo: e.detail.current,
      typeName: typeName
    }); 
    //设置当前页码
    swiperNo = e.detail.current;
  },
  
  //点击切换
  clickTab: function (e) { 
//debugger;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var currentNo = e.target.dataset.current;
      typeName = typeList[currentNo].name;
      pageThis.setData({
        swiperNo: e.target.dataset.current,
        typeName: typeName
      });
      //设置当前页码
      scrollViewNo = e.target.dataset.current;
    }
  },

  // 跳转
  educa: function() {
    console.log('当前页码', scrollViewNo);
    //debugger;
    wx.navigateTo({
      url: '../educa/educa?id=' + typeList[scrollViewNo].id + '&name=' + typeList[scrollViewNo].name
    })
    
  }
})

