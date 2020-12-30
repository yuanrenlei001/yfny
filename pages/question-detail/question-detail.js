// pages/question-detail/question-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    detail:'',
    url:'https://www.yfnz2010.cn/',
    userid:'',
    plList:'',
    img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.loads();
  },
  loads:function(){
    var user = app.get_user_info(this, "init");
    console.log(user)
    var that = this;
    wx.request({
      url: getApp().get_request_url('wechatuserinfo', 'user'),
      method: 'POST',
      data:{'openid':user.weixin_openid},
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        console.log(res.data.data.id)
        that.setData({
          userid: res.data.data.id
        })
        that.detail()
    that.reply(this.data.userid)
        console.log(this.data.userid)
      },
      fail: () => {
        wx.hideLoading();
        app.showToast('服务器请求出错');
      },
    });
  },
  detail:function(){
    var that=this;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/question/detail&id='+this.data.id+'&user_id='+this.data.userid,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        that.setData({
          detail: res.data.data
        })
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },
  reply:function(id){
    var that=this;
    console.log(id)
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/question/reply&page=1&question_id='+this.data.id+'&user_id='+id,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        var list = res.data.data.data
        var arr = []
        for(var i=0;i<res.data.data.data.length;i++){
          var obj = {};
          if(res.data.data.data[i].images){
            var img = res.data.data.data[i].images.split(',');
            arr.push(img)
            res.data.data.data[i]['img'] = img
          }
        }
        
        // if(res.data.data.data.images !== ''){
        //     img = res.data.data.data.images.split(',')
        // }
        that.setData({
          plList: res.data.data.data,
          img:img
        })
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },
   // 预览图片
   previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.detail.images;
    var src = this.data.url
    var arr = []
    for(var i=0;i<imgs.length;i++){
        arr.push(src+imgs[i])
    }
    wx.previewImage({
      //当前显示图片
      current: arr[index],
      //所有图片
      urls: arr
    })
  },

  // 点赞
  zan(e){
    var data = {
      'type':'reply',
      'user_id':this.data.userid,
      'id':e.currentTarget.dataset.id,
    }
    var _data = wx.getStorageSync('_data');
    var that =this;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/question/like',
      method: 'POST',
      data:data ,
      dataType: 'json',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: (res) => {
        app.showToast('成功！','success');
        that.reply(this.data.userid);
      },
      fail: () => {
        wx.hideLoading();
        app.showToast('服务器请求出错');
      },
    });
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