// pages/question/question.js
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    placeholder: '请选择',
    array: ['发电机', '充电器', '引擎动力', '其他'],
    objectArray: [
      {
        id: 0,
        name: '发电机'
      },
      {
        id: 1,
        name: '充电器'
      },
      {
        id: 2,
        name: '引擎动力'
      },
      {
        id: 3,
        name: '其他'
      }
    ],
 
    multiIndex: [0, 0, 0],
    date: '2016-09-01',
    time: '12:01',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    show:true,
    uploadImg:[],
    question1:null,
    question2:null,
    user:'',
    title:'',
    question_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      user:options.userid,
      title:options.title,
      question_id:options.id
    })

  },
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    console.log(imgs)
    if (imgs.length >= 3) {
      console.log(imgs)
      this.setData({
        lenMore: 1,
        show:false
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        var arr = that.data.uploadImg
        console.log(tempFilePaths)
        wx.uploadFile({   //微信封装的上传文件到服务器的API         
          url: 'https://www.yfnz2010.cn/index.php?s=/api/question/upload',  //域名+上传文件的请求接口        
          filePath: res.tempFilePaths[0],  // tempFilePath可以作为img标签的src属性显示图片 服务器图片的路径         
          name: 'file',  //上传到服务器的参数，自定义，我定义的是image        
           // header非必填项，具体作用见官方文档、          
            success(res) {  
              console.log(res.data)            
              var data = JSON.parse(res.data)
              arr.push(data.data.url)
              console.log(data) 
              // that.setData({              
              //   uploadImg: data.data.url
              //  })           
               console.log(that.data.uploadImg)         
             }        
            })  
          for (var i = 0; i < tempFilePaths.length; i++) {
            if (imgs.length >= 3) {
              that.setData({
                imgs: imgs,
                uploadImg: arr,
              });
              return false;
            } else {
              imgs.push(tempFilePaths[i]);
            }
          }
          // console.log(imgs);
          that.setData({
            imgs: imgs
          });
          setTimeout(function () {
            console.log()
            if(imgs.length>=3){
              that.setData({
                show: false,
              }); 
            }
          }, 500);
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    console.log(imgs)
    if(imgs.length<3){
      this.setData({
        show: true
      });
    }
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  bindTextAreaBlur2(e){
    console.log(e)
    this.setData({
     question2:e.detail.value
    })
  },
 upload(e){
   console.log(e)
  var user = app.get_user_info(this, "init");
  var that = this;
  if(user != false){
        var user_id = that.data.user;
        var title = that.data.title;
        var content = that.data.question2;
        var images = that.data.uploadImg.toString();
        var question_id = that.data.question_id
        var data =  {
          'user_id':user_id,
          'title':title,
          'content':content,
          'images':images,
          'question_id':question_id,
        }
    console.log(data)
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/question/addReply',
      method: 'POST',
      data:data ,
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log(res)
        app.showToast('发布成功','success');
        var page = getCurrentPages()  ;// 获取当前页面栈
        var beforePage = page[page.length - 2]; // 跳转页面的栈
          wx.navigateBack({
            success: function () {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
          })
      },
      fail: () => {
        wx.hideLoading();
        app.showToast('服务器请求出错');
      },
    });
  }
 },
 bindTextAreaBlur(e){
   this.setData({
    question1:e.detail.value
   })
 },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  clearFont() {
    this.setData({
      placeholder: ''
    })
  },
 
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})