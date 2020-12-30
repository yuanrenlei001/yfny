const app = getApp();
Page({
  data: {
    params: null,
    user: null,
    mobile: null,
    verify_submit_text: '获取验证码',
    verify_loading: false,
    verify_disabled: false,
    form_submit_loading: false,
    verify_time_total: 60,
    temp_clear_time: null,
    name:null,
    password:null
  },

  /**
   * 页面加载初始化
   */
  onLoad(option) {
    // 设置用户信息
    this.setData({
      params: option,
      user: app.get_user_cache_info() || null
    });
console.log(app.get_user_cache_info() || null)
    // 标题设置
    wx.setNavigationBarTitle({ title: (this.data.user == null) ? '授权用户信息' : '手机绑定' });
  },

  /**
   * 登录授权事件
   */
  get_user_info_event(e) {
    if(this.data.name == null){
      app.showToast("账号不对！");
    }else if(this.data.password == null){
      app.showToast("密码不对！");
    }else{
      this.user_auth_code(e.detail,this.data.name,this.data.password);
    }
  },

  /**
   * 用户授权
   * auth_data  授权数据
   */
  user_auth_code(auth_data) {
    if ((auth_data.encryptedData || null) != null && (auth_data.iv || null) != null) {
      app.user_auth_vip_login(this, 'user_auth_back_event', auth_data,this.data.name,this.data.password);
    } else {
      app.showToast("授权失败");
    }
  },

  /**
   * 授权返回事件
   */
  user_auth_back_event() {
    var user = app.get_user_cache_info();
    this.setData({user: user || null});
    if (app.user_is_need_login(user) == false)
    {
       // wx.navigateBack();
       console.log(user)
       var page = getCurrentPages()  ;// 获取当前页面栈
 
 var beforePage = page[page.length - 2]; // 跳转页面的栈
 console.log(beforePage)
 wx.navigateBack({
     success: function () {
       beforePage.onLoad(); // 执行前一个页面的onLoad方法
 
    }
 
 })
    }
  },

  bind_name(e)
  {
    this.setData({name: e.detail.value});
  },
  bind_password(e)
  {
    this.setData({password: e.detail.value});
  },




  /**
   * 输入手机号码事件
   */
  bind_key_input(e)
  {
    this.setData({mobile: e.detail.value});
  },

  /**
   * 短信验证码发送
   */
  verify_send()
  {
    // 数据验证
    var validation = [{fields: 'mobile', msg: '请填写手机号码'}];
    if(app.fields_check(this.data, validation))
    {
      // 网络请求
      var self = this;
      wx.showLoading({title: '发送中...'});
      this.setData({verify_submit_text: '发送中', verify_loading: true, verify_disabled: true});

      wx.request({
        url: app.get_request_url('regverifysend', 'user'),
        method: 'POST',
        data: {mobile: this.data.mobile},
        dataType: 'json',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          wx.hideLoading();
          if(res.data.code == 0)
          {
            this.setData({verify_loading: false});
            var temp_time = this.data.verify_time_total;
            this.data.temp_clear_time = setInterval(function()
            {
              if(temp_time <= 1)
              {
                clearInterval(self.data.temp_clear_time);
                self.setData({verify_submit_text: '获取验证码', verify_disabled: false});
              } else {
                temp_time--;
                self.setData({verify_submit_text: '剩余 '+temp_time+' 秒'});
              }
            }, 1000);
          } else {
            this.setData({verify_submit_text: '获取验证码', verify_loading: false, verify_disabled: false});
            
            app.showToast(res.data.msg);
          }
        },
        fail: () => {
          wx.hideLoading();
          this.setData({verify_submit_text: '获取验证码', verify_loading: false, verify_disabled: false});

          app.showToast("服务器请求出错");
        }
      });
    }
  },

  /**
   * 表单提交
   */
  formSubmit(e)
  {
    // 邀请人参数
    var params = wx.getStorageSync(app.data.cache_launch_info_key) || null;  

    // 数据验证
    var validation = [
      {fields: 'mobile', msg: '请填写手机号码'},
      {fields: 'verify', msg: '请填写验证码'},
      {fields: 'weixin_openid', msg: '授权id不能为空'}
    ];
    e.detail.value['weixin_openid'] = this.data.user.weixin_openid;
    e.detail.value['nickname'] = this.data.user.nickname;
    e.detail.value['avatar'] = this.data.user.avatar;
    e.detail.value['province'] = this.data.user.province;
    e.detail.value['city'] = this.data.user.city;
    e.detail.value['gender'] = this.data.user.gender;
    e.detail.value['weixin_unionid'] = this.data.user.weixin_unionid || '';
    e.detail.value['app_type'] = 'weixin';
    e.detail.value['referrer'] = (params == null) ? (this.data.user.referrer || 0) : (params.referrer || 0);
    if(app.fields_check(e.detail.value, validation))
    {
      wx.showLoading({title: '处理中...'});
      this.setData({form_submit_loading: true});

      // 网络请求
      wx.request({
        url: app.get_request_url('reg', 'user'),
        method: 'POST',
        data: e.detail.value,
        dataType: 'json',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: (res) => {
          wx.hideLoading();

          if(res.data.code == 0 && (res.data.data || null) != null)
          {
            clearInterval(this.data.temp_clear_time);
            app.showToast(res.data.msg, 'success');
            
            wx.setStorage({
              key: app.data.cache_user_info_key,
              data: res.data.data
            });
            
            var event_callback = this.data.params.event_callback || null;
            setTimeout(function()
            {
              // 触发回调函数
              if(event_callback != null)
              {
                getCurrentPages()[getCurrentPages().length-2][event_callback]();
              }
              wx.navigateBack();
            }, 1000);
          } else {
            this.setData({form_submit_loading: false});
            
            app.showToast(res.data.msg);
          }
        },
        fail: () => {
          wx.hideLoading();
          this.setData({form_submit_loading: false});

          app.showToast("服务器请求出错");
        }
      });
    }
  }

});
