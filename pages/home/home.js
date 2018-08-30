// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imagesType: "scaleToFill",
    //列表数据
    listdata: [],
    pageindex: '1',
    isHideLoadMore: false,
    isHideLoadMoreCompany: true
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getListDatas(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
    this.getListDatas(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getListDatas(this.data.pageindex)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getListDatas: function(index) {
    if (index == 1) {
      this.data.listdata = []
      this.data.pageindex = 1
      this.setData({
        isHideLoadMore: false,
        isHideLoadMoreCompany: true
      })
    }
    let that = this;
    wx.request({
      url: 'https://www.df5g.cn',
      method: 'POST',
      data: {
        method: 'house.list',
        offset: index,
        pagesize: '10'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.code == '200') {
          let olddata = that.data.listdata
          let olddatalength = olddata.length
          if (that.data.pageindex >= parseInt(res.data.data.count / 10)) {
            that.setData({
              isHideLoadMore: true,
              isHideLoadMoreCompany: false
            })
          } else {
            if (res.data.data.list.length > 0) {
              for (let i = 0; i < res.data.data.list.length; i++) {
                console.log(res.data.data.list[i])
                olddata[olddatalength + i] = res.data.data.list[i]
              }
              that.data.pageindex++
                that.setData({
                  listdata: olddata
                })
            }
          }
        } else {
          that.setData({
            isHideLoadMore: true,
            isHideLoadMoreCompany: false
          })
        }
      },
      fail: function(res) {
        that.setData({
          isHideLoadMore: true,
          isHideLoadMoreCompany: false
        })
      }
    })
  }
})