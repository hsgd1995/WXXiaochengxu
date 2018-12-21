var app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    //学校介绍
    schoolContent:'',
    schoolImg:'',

    //学校
    objectArray: [],
    
    // 层次
    kind: ['--请选择--', 'typeA', 'typeB', 'typeC'],
    objectKindArray: [
      { id: 0, name: '--请选择--' },
      { id: 1, name: 'typeA' },
      { id: 2, name: 'typeB' },
      { id: 3, name: 'typeC' }
    ],

    // 专业
    profess: ['--请选择--', 'typeA', 'typeB', 'typeC'],
    objectProfessArray: [
      { id: 0, name: '--请选择--' },
      { id: 1, name: 'typeA' },
      { id: 2, name: 'typeB' },
      { id: 3, name: 'typeC' }
    ],
    
    // 区域
    multiArray: [['--请选择--', '南宁', '北海', '梧州', '钦州', '贵港', '百色'], [' ']],
    objectMultiArray: [
      [
        { id: 0, name: '--请选择--'},
        { id: 1, name: '南宁' },
        { id: 2, name: '北海' },
        { id: 3, name: '梧州' },
        { id: 4, name: '钦州' },
        { id: 5, name: '贵港' },
        { id: 6, name: '百色' }
      ],

      
    ],
    
    name: "",
    phone: "",
    index: 0,
    index2: 0,
    index3: 0,
    multiIndex: [0, 0],

    // 弹出框的js
    hideModal: true,
    animationData: {},
    
    showView: true
  },
  //加载页面
  onLoad: function (options) {
    //设置页面头部标题
    var data = util.getTextByPageNo(options.no);
    wx.setNavigationBarTitle({
      title: data.title,
    });
    //防止this和wx.request的this冲突
    var that = this;
    
    //请求服务器获取数据-学校数据
    wx.request({
      url: util.url +'/wxaccess/school/getAll',
      dataType:'json',
      method:'get',
      success:function(res){
        console.log('res', res);
        console.log('res',res.data);
        //设置页面上数据
        that.setData({
          objectArray: res.data
        });
      }
    });
    wx.request({
      url: util.url +'/wxaccess/area/getAll',
      dataType: 'json',
      method: 'get',
      success: function (res) {
        console.log('区域数据');
        console.log('res', res);
        console.log('res', res.data);
        
        //设置页面上数据
       
      }
    })
    
    showView: (options.showView == "true" ? true : false)
  },
  
  // 学校
  bindPickerChange: function (e) {
  

    //根据选项，显示相应学校
    var index = e.detail.value;
    var school = this.data.objectArray[index];
    this.setData({
      showView: false,
      index: e.detail.value,
      schoolContent: school.content,
      schoolImg: util.domain + school.logoUrl,
    })
    
  },

  // 层次
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
  },
  
  //专业
  bindPickerChange3: function (e) {
    this.setData({
      index3: e.detail.value
    })
  },

  // 姓名
  getName: function (e) {
    var name = this.data.name;
    this.setData({
      name: e.detail.value
    })
  },

  // 手机
  getPhone: function (e) {
    var phone = this.data.phone;
    this.setData({
      phone: e.detail.value
    })
  },

  //区域
  bindMultiPickerChange: function (e) {
    this.setData({ multiIndex: e.detail.value });
  },

  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
    }
    data.multiIndex[e.detail.column] = e.detail.value;
   
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = [' '];
            break;
          case 1:
            data.multiArray[1] = ['横县', '上林县', '宾阳县', '马山县', '隆安县', '武鸣县'];
            break;
          default:
            data.multiArray[1] = [' '];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 400,
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

  // 返回
  indexbtn: function() {
    wx.navigateTo({
      url: '../upedu/upedu'
    })
  },

  // 提交
  submit: function (e) {
    var name = this.data.name;  // 获取name
    var phone = this.data.phone;  // 获取phone
    var index = this.data.index;  // 获取学校
    var index2 = this.data.index2; // 获取层次
    var index3 = this.data.index3;  // 获取专业
    var index4 = this.data.multiIndex[0]; // 获取区域    

    // 数据校验
    if (index == "0" || index2 == "0" || index3 =="0" || name=="" || phone=="" || index4=="0") {
      wx.showModal({
        title: '提示',
        content: '请您输入完整信息！'
      })
    }else {
      wx.navigateTo({
        url: '../ending/ending'
      })
    }
  },
})