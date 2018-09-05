// pages/floors/floors.js
var base64 = require("../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    detail: '',
    isFold: true,
    isFoldParam: true,
    viewHightImg: false,
    viewHightBig: false,
    viewHightBigStatus: 0,
    loadingHidden: true,
    overview: '',
    landscape: '',
    longitude: '',
    latitude: '',
    markers: [],
    // polyline: [{
    //     points: [{
    //         longitude: 113.3245211,
    //         latitude: 23.10229
    //     }, {
    //         longitude: 113.324520,
    //         latitude: 23.21229
    //     }],
    //     color:"#FF0000DD",
    //     width: 2,
    //     dottedLine: true
    // }],
    // controls: [{
    //     id: 1,
    //     iconPath: '../images/floortail/icon_markb.png',
    //     position: {
    //         left: 0,
    //         top: 300 - 50,
    //         width: 50,
    //         height: 50
    //     },
    //     clickable: true
    // }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.showNavigationBarLoading()
    this.openLoading()
    let that = this
    let tempLat = '';
    wx.request({
      url: 'https://www.df5g.cn',
      method: 'POST',
      data: {
        method: 'house.gethouse',
        id: options.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.code == 200) {
          that.hideNavigationBarLoading()
          that.closeLoading()
          console.log(res.data.data)
          tempLat = res.data.data.latlng.split(",")
          let lo = tempLat[1]
          let la = tempLat[0]
          that.setData({
            detail: res.data.data,
            overview: res.data.data.overview,
            landscape: res.data.data.landscape.replace(/\s*/g, ""),
            longitude: lo,
            latitude: la,
            markers: [{
              iconPath: "../images/floortail/icon_marka.png",
              id: 0,
              latitude: la,
              longitude: lo,
              width: 32,
              height: 32,
              label: {
                content: res.data.data.floorName,
              }
            }]
          })
        }
        console.log(tempLat)
      },
      fail: function(res) {

      }
    })
    wx.request({
      url: 'https://www.df5g.cn',
      method: 'POST',
      data: {
        method: 'house.getAlbum',
        id: options.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.data.code == 200) {
          let tempPics = res.data.data.list
          let pics = [];
          if (tempPics.length > 0) {
            for (let i = 0; i < tempPics.length; i++) {
              let picsCount = pics.length
              if (tempPics[i].list.length > 0) {
                for (let j = 0; j < tempPics[i].list.length; j++) {
                  pics[picsCount + j] = tempPics[i].list[j].url
                }
              }
            }
          }
          that.setData({
            imgUrls: pics
          })
          //此处想灵活显示折叠按钮,但是由于接口请求有网络延时,用以下获取高度的方法效果不好
          // if (that.data.viewHightBigStatus == 0) {
          //     //通过定时0.3秒后检查楼盘介绍的文本折叠框 是否需要折叠按钮 ,此处运用到多个元素进行辅助比较
          //     setTimeout(() => {
          //         console.log(that.data.viewHightBigStatus+'aaaaaaaaaaaaa')
          //     //创建节点选择器
          //         let query = wx.createSelectorQuery()
          //         //选择id
          //         query.select('#viewHightOnlyCCC').boundingClientRect()
          //     query.exec(function(res) {
          //         //res就是 所有标签为mjltest的元素的信息 的数组
          //         // console.log(res);
          //         //取高度
          //         // console.log(res[0].height);
          //         let big = res[0].height
          //         //创建节点选择器
          //         let query1 = wx.createSelectorQuery()
          //         //获取折叠文本的高度
          //         query1.select('#viewHightOnly').boundingClientRect()
          //         query1.exec(function(res1) {
          //             if (res1[0].height) {
          //                 //取高度 判断是否需要 折叠按钮
          //                 if (big <= res1[0].height) {
          //                     that.setData({
          //                         viewHightImg: true
          //                     })
          //                 } else {
          //                     that.setData({
          //                         viewHightImg: false
          //                     })
          //                 }
          //                 //隐藏辅助高度比较元素
          //                 that.setData({
          //                     viewHightBig: true,
          //                     viewHightBigStatus:1
          //                 })
          //             }
          //         })
          //     })
          // }, 1500)
          // }

        }
      },
      fail: function(res) {
        console.log(res)
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    //由于网络请求有延时,这个方法可行,但是不好
    // if (that.data.viewHightBigStatus == 0) {
    //     //通过定时0.3秒后检查楼盘介绍的文本折叠框 是否需要折叠按钮 ,此处运用到多个元素进行辅助比较
    //     setTimeout(() => {
    //         console.log(that.data.viewHightBigStatus+"ssssssssssssss")
    //     //创建节点选择器
    //     let query = wx.createSelectorQuery()
    //     //选择id
    //     query.select('#viewHightOnlyCCC').boundingClientRect()
    //     query.exec(function(res) {
    //         //res就是 所有标签为mjltest的元素的信息 的数组
    //         // console.log(res);
    //         //取高度
    //         // console.log(res[0].height);
    //         let big = res[0].height
    //         //创建节点选择器
    //         let query1 = wx.createSelectorQuery()
    //         //获取折叠文本的高度
    //         query1.select('#viewHightOnly').boundingClientRect()
    //         query1.exec(function(res1) {
    //             if (res1[0].height) {
    //                 //取高度 判断是否需要 折叠按钮
    //                 if (big <= res1[0].height) {
    //                     that.setData({
    //                         viewHightImg: true
    //                     })
    //                 } else {
    //                     that.setData({
    //                         viewHightImg: false
    //                     })
    //                 }
    //                 //隐藏辅助高度比较元素
    //                 that.setData({
    //                     viewHightBig: true,
    //                     viewHightBigStatus:1
    //                 })
    //             }
    //         })
    //     })
    // }, 1300)
    // }

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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //图片点击事件
  imgYu: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 楼盘介绍文本折叠
   */
  showAll: function(e) {
    this.setData({
      isFold: !this.data.isFold,
    })
  },
  /**
   * 楼盘参数文本折叠
   */
  showAllisFoldParam: function(e) {
    this.setData({
      isFoldParam: !this.data.isFoldParam,
    })
  },
  //页面显示加载动画
  showNavigationBarLoading: function() {
    wx.showNavigationBarLoading()
  },
  //页面隐藏加载动画
  hideNavigationBarLoading: function() {
    wx.hideNavigationBarLoading()
  },
  openLoading: function() {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 3000
    });
  },
  closeLoading: function() {
    wx.hideToast()
  }
})