// pages/structure/structure.js
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:'组织架构',
    id:'',
    list:'',
    text:'',
    total:'',
    pageNum:1,
    pageSize:20,
    hasMoreData: true,
    message:'正在加载数据...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      text:options.text,
      total:'',
    })
    this.list();
  },
  list:function(){
    var that = this;
    var pageNum = this.data.pageNum;
  var pageSize = this.data.pageSize;
    wx.request({
      url: 'https://www.yfnz2010.cn/index.php?s=/api/company/getlist&society_id='+this.data.id+'&page='+pageNum,
      method: "get",
      data: {},
      dataType: "json",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: res => {
        wx.stopPullDownRefresh();
        console.log(res.data.data)
        this.setData({
          list:res.data.data.data,
          total:res.data.data.total,
          pageNum:that.data.pageNum+1,
          hasMoreData:true
        })
      },
      fail: () => {
        wx.stopPullDownRefresh();
        app.showToast("服务器请求出错");
      }
    });
  },
    // 加载更多
addList(){
  var pageNum = this.data.pageNum;
  var pageSize = this.data.pageSize;
  var that = this;
  console.log(pageNum)
  wx.request({
    url: 'https://www.yfnz2010.cn/index.php?s=/api/company/getlist&society_id='+this.data.id+'&page='+pageNum,
    method: "get",
    data: {},
    dataType: "json",
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: res => {
      wx.stopPullDownRefresh();
      var list = res.data.data.data;
      // var arr = []
      // for(var i=0;i<list.length;i++){
      //     arr.push(list[i])
      // }
      // that.showLists.push(arr)
      that.setData({
        list:that.data.list.concat(list),
        pageNum:that.data.pageNum+1,
        hasMoreData:true
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
    if (this.data.hasMoreData) {
      this.addList();
    } else {
        wx.showToast({
            title: '没有更多数据',
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})