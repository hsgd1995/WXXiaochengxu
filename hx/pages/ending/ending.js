var util = require('../../utils/util.js');
var pageThis = null;
Page({

  data: {
    tacherList: [],
    areaName:'',
    message:'',
    // 弹出框的js
    hideModal: true,
    animationData: {}  //这个未解之谜
  },
  //加载页面
  onLoad: function (options) {
    pageThis = this;
    console.log(options.areaId);
    console.log(options.areaName);
    this.setData({
      areaName: options.areaName
    });
   
    var tacherList = new Array();
    wx.request({
      url: util.url+'/wxaccess/teacher/getTeacherByAreaId',
      data: { areaId: options.areaId}, 
      dataType: 'json',
      method: 'get',
      success:function(res){
        var message = '';
        tacherList = res.data; 
        if(res.data.length<1){
          message='该区域没有老师';
        }
        pageThis.setData({ 
          tacherList: tacherList,
          message: message
        });
      }
    })

    

  },

  // 显示遮罩层
  showModal: function () {
    
    var that = this;
    that.setData({
      hideModal: false,
    })
    var animation = wx.createAnimation({
      duration: 400,
      //动画的效果 默认值是linear
      timingFunction: 'ease-in-out',
    })
    this.animation = animation
    setTimeout(function () {
      //调用显示动画
      that.fadeIn();
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation
    that.fadeDown();
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 600)//先执行下滑动画，再隐藏模块
  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  fadeDown: function () {
    this.animation.translateY(600).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  educa: function() {
    wx.navigateBack({
      //返回上一页，默认为1
      delta: 1  
    })
  }
})