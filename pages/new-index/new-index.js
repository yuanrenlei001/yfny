// pages/new-index/new-index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  init(e) {
    var user = app.get_user_info(this, "init"),
      self = this;
      console.log(user)
    if (user != false) {
      console.log('**********************')
      // 用户未绑定用户则转到登录页面
      if (app.user_is_need_login(user)) {
        wx.showModal({
          title: '温馨提示',
          content: '绑定手机号码',
          confirmText: '确认',
          cancelText: '暂不',
          success: (result) => {
            wx.stopPullDownRefresh();
            if(result.confirm) {
              wx.navigateTo({
                url: "/pages/login/login?event_callback=init"
              });
            }
            self.setData({
              avatar: user.avatar || app.data.default_user_head_src,
              nickname: user.nickname || '用户名',
            });
          },
        });
      } else {
        var openid = app.data.isOpenid;
              var url = app.data.showDialog;
        var value = user.user_name_view;
        var _data = wx.getStorageSync('_data')
        var type = '';
        console.log(_data)
        if(value){
          getApp().data.isVip = '会员'
          self.setData({
            avatar: user.avatarurl || app.data.default_user_head_src,
            nickname: user.nickname || '用户名',
            vip:true
          });
        }else{
          getApp().data.isVip = '游客'
          self.setData({
            avatar: user.avatar || user.userInfo.avatarUrl,
            nickname: user.nickname || user.userInfo.nickName,
          });
        }
        wx.request({
          url: getApp().get_request_url('wechatuserinfo', 'user'),
          method: 'POST',
          data:{'openid':user.weixin_openid},
          dataType: 'json',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: (res) => {
            type = res.data.data.type
            if(getApp().data.isVip == '游客' || res.data.data.type == 1){
              if(url == 'index'){
                wx.navigateTo({
                  url: '../../pages/newpage/page',
                })
              }else if(url == 'store'){
                wx.switchTab({
                  url: '../../pages/index/index',
                })
              }else if(url == 'dz_service'){
                wx.navigateTo({
                  url: '../../pages/dz-service/dz-service'
                })
              }else if(url == 'zhibao'){
                wx.navigateTo({
                  url: '../../pages/zhibao/zhibao'
                })
              }else if(url == 'sort'){
                wx.navigateTo({
                  url: '../../pages/sort/sort'
                })
              }else if(url == 'news'){
                wx.navigateTo({
                  url: '../../pages/news/news'
                })
              }
            }else{
              if(url == 'index'){
                wx.switchTab({
                  url: '../../pages/index/index',
                })
              }else if(url == 'store'){
                wx.switchTab({
                  url: '../../pages/index/index',
                })
              }else if(url == 'dz_service'){
                wx.navigateTo({
                  url: '../../pages/dz-service/dz-service'
                })
              }else if(url == 'zhibao'){
                wx.navigateTo({
                  url: '../../pages/zhibao/zhibao'
                })
              }else if(url == 'sort'){
                wx.navigateTo({
                  url: '../../pages/sort/sort'
                })
              }else if(url == 'news'){
                wx.navigateTo({
                  url: '../../pages/news/news'
                })
              }
            }
          },
          fail: () => {
            wx.hideLoading();
            app.showToast('服务器请求出错');
          },
        });
        console.log(getApp().data.isVip)
        console.log(type)
        // self.get_data();
      }
    }
  },
  go_vip(e){
    var user = app.get_user_info(this, "init"),
      self = this;
      console.log(user)
      if (user != false) {
        var openid = app.data.isOpenid;
              var url = app.data.showDialog;
        var value = user.user_name_view;
        var _data = wx.getStorageSync('_data')
        var type = '';
        console.log(value)
        console.log(_data)
        if(value){
          wx.showModal({
            title: '温馨提示',
            content: '您已是会员！',
            confirmText: '确认',
            success: (result) => {
            },
          });
        }
        
      }
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

  },
  goUrl:function(type){
    // wx.navigateTo({
    //   url: '../../pages/index/index',
    // })
      var url = type.currentTarget.dataset.type
      getApp().data.showDialog = url;
      this.init()
      console.log(url)
  }
})