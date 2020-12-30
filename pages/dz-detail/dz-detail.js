// pages/dz-detail/dz-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    user_id:null,
    sort:null,
    ffname:null,
    ffaddress:null,
    ffphone:null,
    ffzzpz:null,
    ffzzmj:null,
    ffmj:null,
    ffysl:null,
    fftime:null,
    trname:null,
    traddress:null,
    trspecies:null,
    trarea:null,
    trtake_time:null,
    zndname:null,
    zndphone:null,
    zndaddress:null,
    zndindustry:null,
    zndquota:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var user = app.get_user_info(this, "init");
    var that = this;
    if(user != false){
      var _data = wx.getStorageSync('_data')
      wx.request({
        url: getApp().get_request_url('wechatuserinfo', 'user'),
        method: 'POST',
        data:{'openid':user.weixin_openid},
        dataType: 'json',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          console.log(res)
          var user_id = res.data.data.id;
          that.setData({
            user_id:user_id
          })
        },
        fail: () => {
          wx.hideLoading();
          app.showToast('服务器请求出错');
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({title: app.data.common_pages_title.dz_detail});
    this.detail()
  },
  detail(){
    var that = this;
    var id = this.data.id
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/article/detail&id='+id,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        console.log(res.data.data)
        that.setData({
          detail:res.data.data
        })
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },

  ffname:function(e){this.setData({ffname:e.detail.value})},
  ffaddress:function(e){this.setData({ffaddress:e.detail.value})},
  ffphone:function(e){this.setData({ffphone:e.detail.value})},
  ffzzpz:function(e){this.setData({ffzzpz:e.detail.value})},
  ffzzmj:function(e){this.setData({ffzzmj:e.detail.value})},
  ffmj:function(e){this.setData({ffmj:e.detail.value})},
  ffysl:function(e){this.setData({ffysl:e.detail.value})},
  fftime:function(e){this.setData({fftime:e.detail.value})},

  // 土壤
  trname:function(e){this.setData({trname:e.detail.value})},
  traddress:function(e){this.setData({traddress:e.detail.value})},
  trspecies:function(e){this.setData({trspecies:e.detail.value})},
  trarea:function(e){this.setData({trarea:e.detail.value})},
  trtake_time:function(e){this.setData({trtake_time:e.detail.value})},

// 助农贷
zndname:function(e){this.setData({zndname:e.detail.value})},
zndphone:function(e){this.setData({zndphone:e.detail.value})},
zndaddress:function(e){this.setData({zndaddress:e.detail.value})},
zndindustry:function(e){this.setData({zndindustry:e.detail.value})},
zndquota:function(e){this.setData({zndquota:e.detail.value})},

  // 飞防 提交
  ffadd:function(){
    var data = {
      'name':this.data.ffname,
      'address':this.data.ffaddress,
      'mobile':this.data.ffphone,
      'species':this.data.ffzzpz,
      'area':this.data.ffzzmj,
      'flying_area':this.data.ffmj,
      'water':this.data.ffysl,
      'appointment':this.data.fftime,
      'user_id':this.data.user_id,
      'type':3
    }
    console.log(data)
    var that = this;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/apply/add',
      method: "post",
      data:data,
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        if(res.data.code == 0){
          app.showToast("申请已提交！",'success');
        }else{
          app.showToast(res.data.msg);
        }
        
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
    
  },
    // 土壤 提交
    tradd:function(){
      var data = {
        'name':this.data.trname,
        'address':this.data.traddress,
        'species':this.data.trspecies,
        'area':this.data.trarea,
        'take_time':this.data.trtake_time,
        'user_id':this.data.user_id,
        'type':2
      }
      console.log(data)
      var that = this;
      wx.request({
        url: 'https://www.yfnz2010.cn/index.php?s=/api/apply/add',
        method: "post",
        data:data,
        dataType: "json",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: res => {
          wx.stopPullDownRefresh();
          if(res.data.code == 0){
            app.showToast("申请已提交！",'success');
          }else{
            app.showToast(res.data.msg);
          }
        },
        fail: () => {
          wx.stopPullDownRefresh();
          app.showToast("服务器请求出错");
        }
      });
      
    },
    // 助农贷 提交
    zndadd:function(){
      var data = {
        'name':this.data.zndname,
        'address':this.data.zndaddress,
        'mpobile':this.data.zndphone,
        'industry':this.data.zndindustry,
        'quota':this.data.zndquota,
        'user_id':this.data.user_id,
        'type':1
      }
      console.log(data)
      var that = this;
      wx.request({
        url: 'https://www.yfnz2010.cn/index.php?s=/api/apply/add',
        method: "post",
        data:data,
        dataType: "json",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: res => {
          wx.stopPullDownRefresh();
          if(res.data.code == 0){
            app.showToast("申请已提交！",'success');
          }else{
            app.showToast(res.data.msg);
          }
        },
        fail: () => {
          wx.stopPullDownRefresh();
          app.showToast("服务器请求出错");
        }
      });
      
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