// pages/structure/structure.js
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:'组织架构',
    text:'',
    content:'',
    list:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      text:options.text,
      content:'',
      list:''
    })
    this.list();
  },
  list:function(){
    var that = this;
    var pageNum = this.data.pageNum;
  var pageSize = this.data.pageSize;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/company/detail&id='+this.data.id,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        console.log(res.data.data)
        var info = res.data.data;
        info.content = info.content.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;" $1');
        this.setData({
          list:res.data.data,
          content:info.content
        })
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },
  sort:function(e){
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
    wx.setNavigationBarTitle({title: app.data.common_pages_title.structure02});
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