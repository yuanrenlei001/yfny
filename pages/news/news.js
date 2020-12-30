// pages/news/news.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.setNavigationBarTitle({title: app.data.common_pages_title.news});
    this.setData({
      page:1
    })
    this.init();
  },
  init:function(){
    var that = this;
    var page = this.data.page;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/article/getList&category_id=29&page='+page,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        that.setData({
          list:res.data.data.data,
          page:that.data.page+1
        })
        console.log(res.data.data)
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },
  add(){
    var that = this;
    var page = this.data.page;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/article/getList&category_id=29&page='+page,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        var lists=  res.data.data.data
        that.setData({
          list:that.data.list.concat(lists),
          page:that.data.page+1
        })
        console.log(res.data.data)
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
    this.add();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})