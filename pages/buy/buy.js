const app = getApp();
Page({
  data: {
    price_symbol: app.data.price_symbol,
    data_list_loding_status: 1,
    buy_submit_disabled_status: false,
    data_list_loding_msg: '',
    params: null,
    payment_list: [],
    goods_list: [],
    address: null,
    address_id: null,
    total_price: 0,
    user_note_value: '',
    is_first: 1,
    extension_data: [],
    payment_id: 0,
    common_order_is_booking: 0,
    common_site_type: 0,
    extraction_address: [],
    site_model: 0,
    buy_header_nav: [
      { name: "快递邮寄", value: 0 },
      { name: "自提点取货", value: 2 }
    ],

    // 优惠劵
    plugins_coupon_data: null,
    plugins_use_coupon_ids: [],
    plugins_choice_coupon_value: [],
    popup_plugins_coupon_status: false,
    popup_plugins_coupon_index: null,
    show:false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData:[],//下拉列表的数据
    index:0,//选择的下拉列表下标
    address_Name:'',
    warehouse_id:''
  },
  onLoad(params) {
    //params['data'] = '{"buy_type":"goods","goods_id":"1","stock":"1","spec":"[]"}';
    if((params.data || null) != null && app.get_length(JSON.parse(params.data)) > 0)
    {
      this.setData({ params: JSON.parse(params.data)});
        console.log(this.data.params)
      // 删除地址缓存
      wx.removeStorageSync(app.data.cache_buy_user_address_select_key);
    }
    wx.request({
      url: app.get_request_url("warehouse", "goods"),
      method: "get",
      data: '',
      dataType: "json",
      success: res => {
        var arr = [{'id':'','name':'请选择仓库'}];
        for(var i=0;i<res.data.data.length;i++){
          var obj = {};
          obj['id'] = res.data.data[i].id;
          obj['name'] = res.data.data[i].name;
          arr.push(obj)
        }
        console.log(arr)
        this.setData({
          selectData: arr,
         });
        console.log(this.data.selectData)
      },
      fail: () => {
        wx.hideLoading();
        app.showToast("服务器请求出错");
      }
    });
   
  },

  onShow() {
    this.init();
    this.setData({ is_first: 0 });
  },
// 点击下拉显示框
selectTap(){
  this.setData({
   show: !this.data.show
  });
  },
  // 点击下拉列表
  optionTap(e){
  let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
  this.setData({
   index:Index,
   show:!this.data.show,
   address_Name:this.data.selectData[Index],
   warehouse_id:this.data.selectData[Index].id,
  });
  console.log(this.data.warehouse_id)
  },
  // 获取数据列表
  init() {
    // 订单参数信息是否正确
    if (this.data.params == null) {
      this.setData({
        data_list_loding_status: 2,
        data_list_loding_msg: '订单信息有误',
      });
      wx.stopPullDownRefresh();
      return false;
    }

    // 本地缓存地址
    if(this.data.is_first == 0){
      console.log(1)
      var cache_address = wx.getStorageSync(app.data.cache_buy_user_address_select_key);
      if((cache_address || null) != null)
      {
        this.setData({
          address: cache_address,
          address_id: cache_address.id,
        });
      }
    }

    // 加载loding
    wx.showLoading({title: '加载中...'});
    this.setData({
      data_list_loding_status: 1
    });

    var data = this.data.params;
    data['address_id'] = this.data.address_id;
    data['payment_id'] = this.data.payment_id;
    data['site_model'] = this.data.site_model;
    wx.request({
      url: app.get_request_url("index", "buy"),
      method: "POST",
      data: this.request_data_coupon_merge(data),
      dataType: "json",
      success: res => {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.code == 0) {
          var data = res.data.data;
          if (data.goods_list.length == 0)
          {
            this.setData({data_list_loding_status: 0});
          } else {
            this.setData({
              goods_list: data.goods_list,
              total_price: data.base.actual_price,
              extension_data: data.extension_data || [],
              data_list_loding_status: 3,
              common_order_is_booking: data.common_order_is_booking || 0,
              common_site_type: data.common_site_type || 0,
              extraction_address: data.base.extraction_address || [],
              plugins_coupon_data: data.plugins_coupon_data || null,
            });

            // 优惠劵选择处理
            if ((data.plugins_coupon_data || null) != null)
            {
              var plugins_choice_coupon_value = [];
              for(var i in data.plugins_coupon_data)
              {
                var cupk = data.plugins_coupon_data[i]['warehouse_id'];
                if((data.plugins_coupon_data[i]['coupon_data']['coupon_choice'] || null) != null)
                {
                  plugins_choice_coupon_value[cupk] = data.plugins_coupon_data[i]['coupon_data']['coupon_choice']['coupon']['desc'];
                } else {
                  var coupon_count = (data.plugins_coupon_data[i]['coupon_data']['coupon_list'] || null) != null ? data.plugins_coupon_data[i]['coupon_data'].coupon_list.length : 0;
                  plugins_choice_coupon_value[cupk] = (coupon_count > 0) ? '可选优惠劵' + coupon_count + '张' : '暂无可用优惠劵';
                }
              }
              this.setData({ plugins_choice_coupon_value: plugins_choice_coupon_value });
            }

            // 地址
            this.setData({
              address: data.base.address || null,
              address_id: ((data.base.address || null) != null) ? data.base.address.id : null,
            });
            wx.setStorage({
              key: app.data.cache_buy_user_address_select_key,
              data: data.base.address || null,
            });

            // 支付方式
            this.payment_list_data(data.payment_list);
          }
        } else {
          this.setData({
            data_list_loding_status: 2,
            data_list_loding_msg: res.data.msg,
          });
          if (app.is_login_check(res.data, this, 'init')) {
            app.showToast(res.data.msg);
          }
        }
      },
      fail: () => {
        wx.stopPullDownRefresh();
        wx.hideLoading();
        this.setData({
          data_list_loding_status: 2,
          data_list_loding_msg: '服务器请求出错',
        });
        
        app.showToast("服务器请求出错");
      }
    });
  },

  // 请求参数合并优惠券参数
  request_data_coupon_merge(data) {
    var coupon_ids = this.data.plugins_use_coupon_ids;
    if((coupon_ids || null) != null && coupon_ids.length > 0)
    {
      for(var i in coupon_ids)
      {
        data['coupon_id_'+i] = coupon_ids[i];
      }
    }
    return data;
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.init();
  },

  // 用户留言事件
  bind_user_note_event(e) {
    this.setData({user_note_value: e.detail.value});
  },

  // 提交订单
  buy_submit_event(e) {
    // 表单数据
    var data = this.data.params;
    console.log(data)
    data['address_id'] = this.data.address_id;
    data['payment_id'] = this.data.payment_id;
    data['user_note'] = this.data.user_note_value;
    data['site_model'] = this.data.site_model;
    data['warehouse'] = this.data.warehouse_id;

    // 数据验证
    var validation = [];
    if (this.data.common_site_type == 0 || this.data.common_site_type == 2 || this.data.common_site_type == 4)
    {
      validation.push({ fields: 'address_id', msg: '请选择地址', is_can_zero: 1 });
    }
    if (this.data.common_order_is_booking != 1) {
      validation.push({ fields: 'payment_id', msg: '请选择支付方式' });
    }
    if (this.data.warehouse_id) {
     console.log('ppppppppp')
    }else{
      validation.push({ fields: 'warehouse', msg: '请选择仓库' });
    }

    if (app.fields_check(data, validation)) {
      // 加载loding
      wx.showLoading({title: '提交中...'});
      this.setData({ buy_submit_disabled_status: true });
      console.log(this.request_data_coupon_merge(data))
      wx.request({
        url: app.get_request_url("add", "buy"),
        method: "POST",
        data: this.request_data_coupon_merge(data),
        dataType: "json",
        success: res => {
          wx.hideLoading();
          if (res.data.code == 0) {
            if (res.data.data.order_status == 1) {
              wx.redirectTo({
                url: '/pages/user-order/user-order?is_pay=1&order_ids=' + res.data.data.order_ids.join(',')
              });
            } else {
              wx.redirectTo({url: '/pages/user-order/user-order'});
            }
          } else {
            app.showToast(res.data.msg);
            this.setData({ buy_submit_disabled_status: false });
          }
        },
        fail: () => {
          wx.hideLoading();
          this.setData({buy_submit_disabled_status: false});
          app.showToast("服务器请求出错");
        }
      });
    }
  },

  // 支付方式选择
  payment_event(e) {
    this.setData({ payment_id: e.currentTarget.dataset.value});
    this.payment_list_data(this.data.payment_list);
    this.init();
  },

  // 支付方式数据处理
  payment_list_data(data) {
    if (this.data.payment_id != 0) {
      for (var i in data) {
        if (data[i]['id'] == this.data.payment_id) {
          data[i]['selected'] = 'selected';
        } else {
          data[i]['selected'] = '';
        }
      }
    }
    this.setData({payment_list: data || []});
  },

  // 优惠劵弹层开启
  plugins_coupon_open_event(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      popup_plugins_coupon_status: true,
      popup_plugins_coupon_index: index,
    });
  },

  // 优惠劵弹层关闭
  plugins_coupon_close_event(e) {
    this.setData({ popup_plugins_coupon_status: false });
  },

  // 优惠劵选择
  plugins_coupon_use_event(e) {
    var wid = e.currentTarget.dataset.wid;
    var value = e.currentTarget.dataset.value;
    var temp = this.data.plugins_use_coupon_ids;
    // 是否已选择优惠券id
    if(temp.indexOf(value) == -1)
    {
      temp[wid] = value;
      this.setData({
        plugins_use_coupon_ids: temp,
        popup_plugins_coupon_status: false,
      });
      this.init();
    }
  },

  // 不使用优惠劵
  plugins_coupon_not_use_event(e) {
    var wid = e.currentTarget.dataset.wid;
    var temp = this.data.plugins_use_coupon_ids;
    temp[wid] = 0;
    this.setData({
      plugins_use_coupon_ids: temp,
      popup_plugins_coupon_status: false,
    });
    this.init();
  },

  // 地址选择事件
  address_event(e) {
    if (this.data.common_site_type == 0 || (this.data.common_site_type == 4 && this.data.site_model == 0))
    {
      wx.navigateTo({
        url: '/pages/user-address/user-address?is_back=1'
      });
    } else if (this.data.common_site_type == 2 || (this.data.common_site_type == 4 && this.data.site_model == 2))
    {
      wx.navigateTo({
        url: '/pages/extraction-address/extraction-address?is_back=1'
      });
    } else {
      app.showToast('当前模式不允许使用地址');
    }
  },

  // 销售+自提 模式选择事件
  buy_header_nav_event(e) {
    var value = e.currentTarget.dataset.value || 0;
    if (value != this.data.site_model)
    {
      // 数据设置
      this.setData({
        address: null,
        address_id: null,
        site_model: value,
      });

      // 删除地址缓存
      wx.removeStorageSync(app.data.cache_buy_user_address_select_key);

      // 数据初始化
      this.init();
    }
  },

  // 地图查看
  map_event(e) {
    var index = e.currentTarget.dataset.index || 0;
    var data = this.data.goods_list[index] || null;
    if (data == null)
    {
      app.showToast("地址有误");
      return false;
    }

    var lng = parseFloat(data.lng || 0);
    var lat = parseFloat(data.lat || 0);
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 18,
      name: data.name || data.alias || '',
      address: (data.province_name || '') + (data.city_name || '') + (data.county_name || '') + (data.address || ''),
    });
  },
});
