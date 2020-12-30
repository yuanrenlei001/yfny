// pages/sort-detail/sort-detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    detail:null,
    img:null
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.detail();
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
        var result = res.data.data.content;
        const regex = new RegExp('<img');
        result = result.replace(/\<img/gi, '<img class="rich-img" ');
        that.setData({
          detail:res.data.data,
          img:result
        })
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