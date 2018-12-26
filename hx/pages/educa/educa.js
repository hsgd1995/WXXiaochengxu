var app = getApp();
var util = require('../../utils/util.js');
var areaObjectArray = [];
var areaSonOjbectArray = []
var pageThis = null;
Page({
  data: {
    //学校介绍
    schoolContent:'',
    schoolImg:'',

    //学校
    objectArray: [],
    
    // 层次
    //kind: ['--请选择--', 'typeA', 'typeB', 'typeC'],
    objectKindArray: [],

    // 专业
    //profess: ['--请选择--', 'typeA', 'typeB', 'typeC'],
    objectProfessArray: [],
    
    // 区域
    //multiArray: [['--请选择--', '南宁', '北海', '梧州', '钦州', '贵港', '百色'], [' ']],
    // objectMultiArray: [
    //   [
    //     { id: 0, name: '--请选择--'},
    //     { id: 1, name: '南宁' },
    //     { id: 2, name: '北海' },
    //     { id: 3, name: '梧州' },
    //     { id: 4, name: '钦州' },
    //     { id: 5, name: '贵港' },
    //     { id: 6, name: '百色' }
    //   ],
      
    // ],
    objectMultiArray: [],
    
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
    pageThis = this;
    //请求服务器获取数据-学校数据
    wx.request({
      url: util.url +'/wxaccess/school/getAll',
      dataType:'json', 
      method:'get',
      success:function(res){
        console.log('res', res);
        console.log('school-res',res.data);
        that.setData({
          objectArray:res.data
        });
      }
    });
    
    //请求服务器获取数据-区域数据
    wx.request({
      url: util.url + '/wxaccess/area/getAll',
      dataType: 'json',
      method: 'get',
      success: function (res) {
        console.log('res', res);
        console.log('area-res', res.data);
        dealWithAreaArray(res.data);

      }
    });
    showView: (options.showView == "true" ? true : false)
  },
  
  // 学校
  bindPickerChange: function (e) {
    //根据选项，显示相应学校
    var index = e.detail.value;
    console.log('学校index',index);
    //当前选中的学校
    var school = this.data.objectArray[index];
    if (school.content != null || school.logoUrl!=null){
      this.setData({
        showView: false,
        index: e.detail.value,
        schoolContent: school.content,
        schoolImg: util.domain + school.logoUrl,
        //层次设为空
        objectKindArray: []
      });
    }else{
      this.setData({
        showView: true,
        schoolContent: '',
        schoolImg: '',
        index: e.detail.value,
       
        //层次设为空
        objectKindArray: []
      });
    }
   
    //防止this和wx.request的this冲突
    var that = this;
    //获取所选学校对应的层次
    wx.request({
      url: util.url + '/wxaccess/level/getBySchoolId',
      data: { schoolId: school.id},
      dataType: 'json',
      method: 'get',
      success: function (res) {
        console.log('res', res);
        console.log('level-res', res.data);
        //设置层次选择器的内容
        that.setData({
          objectKindArray: res.data,
          //专业选择去设为空
          objectProfessArray:[]
        });
      }
    });
  },

  // 层次选择器事件
  bindPickerChange2: function (e) {
    var index = e.detail.value;
    //当前选中的层次
    var level = this.data.objectKindArray[index];
    if (!level){
      return;
    }
    this.setData({
      index2: index
    });
    var that = this;
    //获取该层次下的专业
    wx.request({
      url: util.url + '/wxaccess/major/getByLevelId',
      data: { levelId: level.id },
      dataType: 'json',
      method: 'get',
      success: function (res) {
        console.log('res', res);
        console.log('major-res', res.data);
        that.setData({
          objectProfessArray:res.data,
        });
      }
    });

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

  //区域选择器选择事件
  bindMultiPickerChange: function (e) {
    console.log('1');
    console.log(e.detail.value);
    this.setData({ multiIndex: e.detail.value });
  },

  //区域选择器第一个下拉列表滚动事件
  bindMultiPickerColumnChange: function (e) {
    //debugger;
    console.log('2');
  
    var data = {
      objectMultiArray: this.data.objectMultiArray,
      multiIndex: this.data.multiIndex,
    }
    data.multiIndex[e.detail.column] = e.detail.value;
   
    switch (e.detail.column) {
      //选择器第一列
      case 0:
        //data.multiArray[1] = ['横县', '上林县', '宾阳县', '马山县', '隆安县', '武鸣县'];
        var first =  this.data.objectMultiArray[0]//选择器第一列
        var firstObj = first[e.detail.value];
        var second = areaSonOjbectArray[firstObj.id];//选择器第二列
        if (second==undefined){
          second = [];
        }
        areaObjectArray[1] = second; 
       
        data.objectMultiArray= areaObjectArray;
  
        data.multiIndex = [e.detail.value,0];
        break;
      //选择器第二列
      case 1:
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

    wx.navigateTo({
      url: '../ending/ending'
    })

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

/**
* 处理后台获取的区域数据
*/
function dealWithAreaArray(areaArray) {
  var parentAreaArray = new Array();
  var sonAreaArray = new Array();
  var sonAreaArray2 = null;
  for (var i = 0; i < areaArray.length; i++) {
    if (areaArray[i].parentId == 0) {
      parentAreaArray.push(areaArray[i]); 
    } else {
      if (sonAreaArray[areaArray[i].parentId] != null) {
        sonAreaArray[areaArray[i].parentId].push(areaArray[i]);
      } else {
        sonAreaArray2 = new Array();
        sonAreaArray2.push(areaArray[i]);
        sonAreaArray[areaArray[i].parentId] = sonAreaArray2;
      }
    }
  }
  console.log('parentAreaArray', parentAreaArray);
  console.log('sonAreaArray', sonAreaArray);
  //选择器第一列
  areaObjectArray.push(parentAreaArray);
  //选择器第二列
  areaObjectArray.push(sonAreaArray[parentAreaArray[0].id]);
  pageThis.setData({
    objectMultiArray: areaObjectArray,
    multiIndex: [0, 0]
  });
  //选择器第二列数组
  areaSonOjbectArray = sonAreaArray;
}