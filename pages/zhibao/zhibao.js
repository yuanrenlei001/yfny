// pages/zhibao/zhibao.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    active:'all',
    pageNum:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
    pageNum:1,
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
    wx.setNavigationBarTitle({title: app.data.common_pages_title.zhibao});
    this.setData({
      active:'all',
        pageNum:1,
    })
    this.init();
  },
  init:function(){
    var that = this;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/question/index&page='+that.data.pageNum,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        that.setData({
          list: res.data.data.data,
          pageNum:that.data.pageNum+1
        }),
        console.log(that.data.pageNum)
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },
  sort:function(e){
    var type = e.currentTarget.dataset.type
    this.setData({
      active:e.currentTarget.dataset.type,
      pageNum:1,
    })
    if(type == 'all'){
      this.init();
    }else if(type == 'question'){
      this.myQuestion();

    }else if(type == 'reply'){
      this.myReply();
    }
  },
  question:function(){
    var user = app.get_user_info(this, "init"),
      self = this;
      console.log(user)
      if (user != false) {
          wx.navigateTo({
            url: '../../pages/question/question',
          })
      }

  },
  // 我的回答
  myQuestion(){
    var user = app.get_user_info(this, "init"),
    self = this;
    console.log(user)
    if (user != false) {
      var value = user.user_name_view;
      var type = '';
      if(value){
        var _data = wx.getStorageSync('_data')
    wx.request({
      url: getApp().get_request_url('wechatuserinfo', 'user'),
      method: 'POST',
      data:{'openid':user.weixin_openid},
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        // if(res.data.code =='-500'){
        //   if(app.is_login_check(res.data, this, 'get_data'))
        //   {
        //     app.showToast(res.data.msg);
        //   }
        // }else{
          let userid = res.data.data.id;
          wx.request({
            url: 'https://www.yfnz2010.cn/index.php?s=/api/question/reply&page='+self.data.pageNum+'&user_id='+userid,
            method: 'get',
            data:{} ,
            dataType: 'json',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: (res) => {
              self.setData({
                list: res.data.data.data,
                pageNum:self.data.pageNum+1
              })
            },
            fail: () => {
              wx.hideLoading();
              app.showToast('服务器请求出错');
            },
          });
        // }
        
      },
      fail: () => {
        wx.hideLoading();
        app.showToast('服务器请求出错');
      },
    });
  }
      }
  },
  // 我的提问
  myReply:function(){
    var user = app.get_user_info(this, "init"),
    self = this;
    console.log(user)
    if (user != false) {
      var value = user.user_name_view;
      var _data = wx.getStorageSync('_data')
      var type = '';
      if(value){
        var _data = wx.getStorageSync('_data')
        console.log(_data)
    wx.request({
      url: getApp().get_request_url('wechatuserinfo', 'user'),
      method: 'POST',
      data:{'openid':user.weixin_openid},
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        var user_id = res.data.data.id;
        wx.request({
          url: 'https://www.yfnz2010.cn/index.php?s=/api/question/index&page='+self.data.pageNum+'&user_id='+user_id,
          method: 'get',
          data:{} ,
          dataType: 'json',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: (res) => {
            console.log(res.data.data.data)
            self.setData({
              list: res.data.data.data,
              pageNum:self.data.pageNum+1
            })
          },
          fail: () => {
            wx.hideLoading();
            app.showToast('服务器请求出错');
          },
        });
      },
      fail: () => {
        wx.hideLoading();
        app.showToast('服务器请求出错');
      },
    });
  }
      }
  },
  addinit:function(){
    var that = this;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/question/index&page='+that.data.pageNum,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        that.setData({
          list: that.data.list.concat(res.data.data.data),
          pageNum:that.data.pageNum+1
        }),
        console.log(that.data.pageNum)
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },
  addmyQuestion:function(){
    var user = app.get_user_info(this, "init"),
    self = this;
    console.log(user)
    if (user != false) {
      var value = user.user_name_view;
      var _data = wx.getStorageSync('_data')
      var type = '';
      if(value){
        var _data = wx.getStorageSync('_data')
    wx.request({
      url: getApp().get_request_url('wechatuserinfo', 'user'),
      method: 'POST',
      data:{'openid':user.weixin_openid},
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        var user_id = res.data.data.id;
        wx.request({
          url: 'https://www.yfnz2010.cn/index.php?s=/api/question/reply&page='+self.data.pageNum+'&reply_user='+user_id,
          method: 'get',
          data:{} ,
          dataType: 'json',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: (res) => {
            self.setData({
              list: self.data.list.concat(res.data.data.data),
              pageNum:self.data.pageNum+1
            })
          },
          fail: () => {
            wx.hideLoading();
            app.showToast('服务器请求出错');
          },
        });
      },
      fail: () => {
        wx.hideLoading();
        app.showToast('服务器请求出错');
      },
    });
  }
      }
  },
  addmyReply:function(){
    var user = app.get_user_info(this, "init"),
    self = this;
    console.log(user)
    if (user != false) {
      var value = user.user_name_view;
      var _data = wx.getStorageSync('_data')
      var type = '';
      if(value){
        var _data = wx.getStorageSync('_data')
    wx.request({
      url: getApp().get_request_url('wechatuserinfo', 'user'),
      method: 'POST',
      data:{'openid':user.weixin_openid},
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        var user_id = res.data.data.id;
        wx.request({
          url: 'https://www.yfnz2010.cn/index.php?s=/api/question/index&page='+self.data.pageNum+'&user_id='+user_id,
          method: 'get',
          data:{} ,
          dataType: 'json',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: (res) => {
            console.log(res.data.data.data)
            self.setData({
              list: self.data.list.concat(res.data.data.data),
              pageNum:self.data.pageNum+1
            })
          },
          fail: () => {
            wx.hideLoading();
            app.showToast('服务器请求出错');
          },
        });
      },
      fail: () => {
        wx.hideLoading();
        app.showToast('服务器请求出错');
      },
    });
  }
      }
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
    var type = this.data.active
    if(type == 'all'){
      this.addinit();
    }else if(type == 'question'){
      this.addmyQuestion();

    }else if(type == 'reply'){
      this.addmyReply();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})