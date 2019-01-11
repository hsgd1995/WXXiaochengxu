var app = getApp();
var util = require('../../utils/util.js');
var areaObjectArray = [];
var areaSonOjbectArray = [];
//请求到的区域数据
var areaResponseData = null;
var pageThis = null;
var type = 1; //学历提升类型，默认为1
//父区域
var parentAreaArray = new Array();
//子区域
var sonAreaArray = new Array();

Page({
  data: {
    //学校介绍
    schoolContent: '',
    schoolImg: '',

    //学校初始数据
    objectArray: [{
      id: 0,
      name: '--请选择--'
    }],

    // 层次初始数据
    //kind: ['--请选择--', 'typeA', 'typeB', 'typeC'],
    objectKindArray: [{
      id: 0,
      levelName: '--请选择--'
    }],

    // 专业初始数据
    //profess: ['--请选择--', 'typeA', 'typeB', 'typeC'],
    objectProfessArray: [{
      id: 0,
      majorName: '--请选择--'
    }],

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
    index: 0, //学校
    index2: 0, //层次
    index3: 0, //专业
    multiIndex: [0, 0],

    // 弹出框的js
    hideModal: true,
    animationData: {},

    showView: true
  },
  //加载页面
  onLoad: function(options) {
    console.log('options',options);
    //设置页面头部标题
    var data = {};
    data.title = options.name;
    type = parseInt(options.id); 
    wx.setNavigationBarTitle({
      title: data.title,
    });
    //pageThis.request的this冲突
    pageThis = this;
    //请求服务器获取数据-学校数据
    wx.request({
      url: util.url + '/wxaccess/school/getAll',
      dataType: 'json',
      method: 'get',
      success: function(res) {
        console.log('res', res);
        console.log('school-res', res.data);
        //如果学校数组只有一条记录，即初始数据,则将请求到的数据追加到学校数组中
        if (pageThis.data.objectArray.length == 1) {
          var newSchoolArray = pageThis.data.objectArray.concat(res.data);
          //设置新数组设置到页面上
          pageThis.setData({
            objectArray: newSchoolArray
          });
        }
      }
    });

    //请求服务器获取数据-区域数据
    wx.request({
      url: util.url + '/wxaccess/area/getAll',
      dataType: 'json',
      method: 'get',
      success: function(res) {
        console.log('res', res);
        console.log('area-res', res.data);
        areaResponseData = res.data;
        dealWithAreaArray(res.data);

      }
    });
    showView: (options.showView == "true" ? true : false)
  },

  // 学校
  bindPickerChange: function(e) {
    //根据选项，显示相应学校
    var index = e.detail.value;
    console.log('学校index', index);
    //当前选中的学校
    var school = this.data.objectArray[index];
    if (school.content != null || school.logoUrl != null) {
      this.setData({
        showView: false,
        index: e.detail.value,
        schoolContent: school.content,
        schoolImg: util.domain + school.logoUrl,
        //层次设为初始数据
        objectKindArray: [{
          id: 0,
          levelName: '--请选择--'
        }]
      });
    } else {
      this.setData({
        showView: true,
        schoolContent: '',
        schoolImg: '',
        index: e.detail.value,

        //层次设为初始数据
        objectKindArray: [{
          id: 0,
          levelName: '--请选择--'
        }]
      });
    }

    //获取所选学校对应的层次
    wx.request({
      url: util.url + '/wxaccess/level/getBySchoolId',
      data: {
        schoolId: school.id
      },
      dataType: 'json',
      method: 'get',
      success: function(res) {
        console.log('res', res);
        console.log('level-res', res.data);
        var initLevelData = [{
          id: 0,
          levelName: '--请选择--'
        }];
        var newLevelData = initLevelData.concat(res.data);
        //设置层次选择器的内容
        pageThis.setData({
          objectKindArray: newLevelData,
          //专业选择去设为初始数据
          objectProfessArray: [{
            id: 0,
            majorName: '--请选择--'
          }]
        });
      }
    });
  },

  // 层次选择器事件
  bindPickerChange2: function(e) {
    var index = e.detail.value;
    //当前选中的层次
    var level = this.data.objectKindArray[index];
    if (!level) {
      return;
    }
    this.setData({
      index2: index
    });
    //获取该层次下的专业
    wx.request({
      url: util.url + '/wxaccess/major/getByLevelId',
      data: {
        levelId: level.id
      },
      dataType: 'json',
      method: 'get',
      success: function(res) {
        console.log('res', res);
        console.log('major-res', res.data);

        var initMojorData = [{
          id: 0,
          majorName: '--请选择--'
        }];
        var newMojorData = initMojorData.concat(res.data);
        pageThis.setData({
          objectProfessArray: newMojorData,
        });
      }
    });

  },

  //专业
  bindPickerChange3: function(e) {
    this.setData({
      index3: e.detail.value
    })
  },

  // 姓名
  getName: function(e) {
    var name = this.data.name;
    this.setData({
      name: e.detail.value
    })
  },

  // 手机
  getPhone: function(e) {
    var phone = this.data.phone;
    this.setData({
      phone: e.detail.value
    })
  },

  //区域选择器选择事件  
  bindMultiPickerChange: function(e) {
    console.log('1');
    console.log(e);
    console.log(e.detail.value);
    console.log(this.data.multiIndex);
    //this.setData({ multiIndex: this.data.multiIndex });
    if (e.detail.value[1] == null) {
      e.detail.value[1] = 0;
    }
    this.setData({
      multiIndex: e.detail.value
    });
  },

  //区域选择器下拉列表滚动事件
  bindMultiPickerColumnChange: function(e) {
 
    console.log('2');

    var data = {
      objectMultiArray: this.data.objectMultiArray,
      multiIndex: this.data.multiIndex,
    }

    console.log('区域选择器下拉列表滚动事件', e.detail.value);
    data.multiIndex[e.detail.column] = e.detail.value;

    switch (e.detail.column) {
      //选择器第一列
      case 0:
        //data.multiArray[1] = ['横县', '上林县', '宾阳县', '马山县', '隆安县', '武鸣县'];
        var first = this.data.objectMultiArray[0] //选择器第一列
        var firstObj = first[e.detail.value];
        var second = areaSonOjbectArray[firstObj.id]; //选择器第二列
        if (second == undefined) {
          second = [];
        }
        areaObjectArray[1] = second;

        data.objectMultiArray = areaObjectArray;

        data.multiIndex = [e.detail.value, 0];
        break;
        //选择器第二列
      case 1:
        break;
    }
    console.log('区域选择器下拉列表滚动事件', data);
    this.setData(data);
    console.log('this.data.multiIndex', this.data.multiIndex);
  },

  // 显示遮罩层
  showModal: function() {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation
    setTimeout(function() {
      //调用显示动画
      that.fadeIn();
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-in-out',
    })
    this.animation = animation
    that.fadeDown();
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 600) //先执行下滑动画，再隐藏模块
  },

  //动画集
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  fadeDown: function() {
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
  submit: function(e) {

    //wx.navigateTo({
    //  url: '../ending/ending'
    //})



    //数据校验
    // 获取学校
    var index = this.data.index; 
    //  学校
    var school = this.data.objectArray[index];

    if (!school || !school.id ) {

      wx.showModal({
        title: '消息提示',
        content: '请选择学校!!!',
      })
      return;
    }

    // 获取层次
    var index2 = this.data.index2; 
    var level = this.data.objectKindArray[index2];
    if (!level || !level.id) {
      wx.showModal({
        title: '消息提示',
        content: '请选择层次!!!',
      })
      return;
    }
    // 获取专业
    var index3 = this.data.index3; 
    var major = this.data.objectProfessArray[index3];
    if (!major || !major.id) {
      wx.showModal({
        title: '消息提示',
        content: '请选择专业!!!',
      })
      return;
    }


// 获取name
    var name = this.data.name; 
    if (!name) {
      wx.showModal({
        title: '消息提示',
        content: '请填写姓名!!!',
      })
      return;
    }

// 获取phone
    var phone = this.data.phone; 
    if (!phone) {
      wx.showModal({
        title: '消息提示',
        content: '请填写联系方式!!!',
      })
      return;
    }
    if (!util.checkMobile(phone)) {
      wx.showModal({
        title: '消息提示',
        content: '请填写正确格式的联系方式!!!',
      });
      return;
    }

  // 获取区域   
    var index4 = this.data.multiIndex;  
   
    var areaId = 0;
    //获取区域id
    if (getAreaIdByMultiIndex(this.data.multiIndex)) {
      areaId = getAreaIdByMultiIndex(this.data.multiIndex);
    }

    if (!areaId) {
      wx.showModal({
        title: '消息提示',
        content: '请填写区域!!!',
      })
      return;
    }
    wx.request({
      url: util.url + '/wxaccess/promotion/add',
      data: {
        name: name, //姓名
        phone: phone, //联系方式 
        schoolId: school.id, //学校id
        levelId: level.id, //层次id
        majorId: major.id, //专业id
        type: type, //类型,
        areaId: areaId
      },
      dataType: 'json',
      method: 'get',
      success: function(res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            //区域名
            var areaName = '';
            for (var i = 0; i < areaResponseData.length;i++){
              if (areaId == areaResponseData[i].id){
                areaName = areaResponseData[i].name;
              }
            }

            wx.navigateTo({
              url: '../ending/ending?areaId=' + areaId + '&areaName=' + areaName
            })
          }
        });
      },
      fail:function(res){
        console.log('提交报名信息失败');
        wx.showModal({
          title: '错误提示',
          content: '提交信息失败，服务器异常!!!',
        })
      }
    });

  },

})

/**
 * 处理后台获取的区域数据
 */
function dealWithAreaArray(areaArray) {

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

/**
 * 根据区域选择器的序号获取区域id
 */
function getAreaIdByMultiIndex(multiIndex) {
  var areaId = 0;
  var parent = parentAreaArray[multiIndex[0]];
  var sonArray = sonAreaArray[parent.id];
  var son = null;
  if (sonArray) {
    son = sonArray[multiIndex[1]];
  }
  console.log(son);
  if (son != null && son.id) {
    areaId = son.id;
  } else {
    areaId = parent.id;
  }
  return areaId;
}