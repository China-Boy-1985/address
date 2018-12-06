<template>
  <div class="index">
    <div class="no-data" v-show="dataList.length < 1">暂无数据</div>
    <ul id="address-container" class="address-container" v-show="dataList.length > 0">
      <li class="address" v-for="(data, $index) in dataList" :key="$index">
        <div class="robot">
            <div class="item" v-for="(item, $childIndex) in data.addrNodes" :key="$childIndex">
              <ul>
                <li>
                  <div class="area">【{{item.name}}】 <span>{{item.content}}</span> </div>
                  <span  v-show="item.voice" :class="{'icons': true}" title="播放" @click.stop="play($event, item)"></span>
                </li>
              </ul>
            </div>
        </div>
        <div class="form">
          <el-form :model="data.address" status-icon ref="address" label-width="100px" class="demo-ruleForm" :label-position="labelPosition" :hide-required-asterisk="true">
            <el-form-item class="from-group" style="width:90px;" label="省" prop="prov" :rules="{required: true, message: '省不能为空', trigger: 'blur'}">
              <el-input v-model="data.address.prov"></el-input>
            </el-form-item>
            <el-form-item class="from-group" style="width:90px;" label="市" prop="city" :rules="{required: true, message: '市不能为空', trigger: 'blur'}">
              <el-input v-model="data.address.city"></el-input>
            </el-form-item>
            <el-form-item class="from-group" label="区" prop="adname">
              <el-input v-model="data.address.adname"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="location" :rules="{required: true, message: '详细地址不能为空', trigger: 'blur'}">
               <el-input type="textarea" v-model="data.address.location"></el-input>
            </el-form-item>
            <el-form-item style="text-align:right;">
              <!-- <el-button plain  @click="copy(data.address)">复制</el-button> -->
              <el-button type="primary" @click.stop="submitForm($index, 'address')">提交<span v-show="data.resttime !== 0">({{data.resttime}}s)</span></el-button>
            </el-form-item>
          </el-form>
        </div>
      </li>
    </ul>
    <div id="map-container" v-show="dataList.length > 0"></div>
    <div class="search" v-show="dataList.length > 0">
      <el-input
        placeholder="请输入内容"
        v-model="address"
        clearable>
      </el-input>
      <el-button type="primary" icon="el-icon-search" @click.stop="search()">搜索</el-button>
    </div>
    <div id="panel" v-show="dataList.length > 0"></div> <!-- @click="copyAddress($event)"  -->
    <!-- 其它内容 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>实时数据连接断开，请重新加载页面</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="loadingPage()">加载</el-button>
      </span>
    </el-dialog>
    <audio id="player" src="" controls="controls" preload="auto" hidden></audio>
    <audio id="remind" src="" controls="controls" preload="auto" autoplay hidden></audio>
 </div>
</template>
<script>
  import IO from 'server/IO'
  export default {
    data() {
      return {
        dialogVisible: false,
        commitState: false,
        webSocket: null,
        labelPosition: 'top',
        intervalObject: null,
        dataList: [],
        list: [],
        placeSearch: null,
        address: '',
        mapList: []
      }
    },
    methods: {
      handleClose () {
        this.dialogVisible = false
      },
      loadingPage () {
        window.location.reload()
      },
      play (e, item) {
        let audio = document.getElementById('player')
        audio.src = item.voice
        let className = e.target.className
        let players = document.querySelectorAll('.pause')
        if (players.length > 0) {
          players.forEach((player) => {
            player.className = 'icons'
          })
        }
        if (className.indexOf('pause') > -1) {
          e.target.className = 'icons'
          audio.pause()
        } else {
          e.target.className = 'icons pause'
          audio.play()
        }
        audio.onended = function() {
          e.target.className = 'icons'
        }
      },
      copyAddress (e) {
        let select = document.getElementsByClassName('selected')[1]
        if (select) {
          let index = Number.parseInt(select.firstChild.innerText) - 1
          let data = this.mapList[index]
          let text = data.name + data.address
          console.log(text)
          const input = document.createElement('input')
          input.style.position = 'fixed'
          input.style.opacity = 0
          input.value = text
          document.body.appendChild(input)
          input.select()
          document.execCommand('Copy')
          document.body.removeChild(input)
          this.$message({
            duration: 2000,
            message: '复制成功！'
          });
        }
      },
      copy (data) {
        let text = data.prov + data.city + data.adname + data.location
        const input = document.createElement('input')
        input.style.position = 'fixed'
        input.style.opacity = 0
        input.value = text
        document.body.appendChild(input)
        input.select()
        document.execCommand('Copy')
        document.body.removeChild(input)
        this.$message({
          duration: 2000,
          message: '复制成功！'
        });
      },
      submitForm(index, formName) {
        let _this = this
        this.$refs[formName][index].validate((valid) => {
          if (valid) {
            let address = _this.dataList[index]
            _this.save(address)
          } else {
            return false
          }
        })
      },
      save (data, type) {
        this.commitState = true
        let param = {
          action: 'submit',
          data : {
            calluuid: data.calluuid,
            address:{
              prov: data.address.prov,
              city: data.address.city,
              adname: data.address.adname,
              location: data.address.location
            }
          }
        }
        console.log(type+ '类型不提交到服务端')
        this.createNewList(data)
        if (!type) {
          this.webSocket.send(JSON.stringify(param))
        }
      },
      createNewList (data) {
        let deleteIndex = null
        if (this.dataList.length > 1) {
          for (let index = 0; index < this.dataList.length; index++) {
            const address = this.dataList[index];
            if (data.calluuid === address.calluuid) {
              deleteIndex = index
              break
            }
          }
          this.dataList.splice(deleteIndex, 1)
          window.localStorage.setItem('list', JSON.stringify(this.dataList)) 
        } else {
          this.dataList = []
          window.localStorage.removeItem('list')
        }
      },
      createInterval () {
        //定时数据推送
        let _this = this
        _this.intervalObject = setInterval(() => {
          _this.dataList.forEach((data) => {
            if (_this.dataList.length === 0) {
              window.localStorage.removeItem('list')
              _this.clearIntervals()
            } else {
              if (data.resttime === 0) {
                _this.save(data, 'interval')
              } else {
                data.resttime -= 1
              }
            }
          })
          window.localStorage.setItem('list', JSON.stringify(_this.dataList)) 
        }, 1000)
      },
      clearIntervals () {
        clearInterval(this.intervalObject)
      },
      warning () {
        let remind = document.getElementById('remind')
        remind.muted = false
        remind.autoplay = false
        remind.src= '../../../static/call.mp3'
        remind.autoplay = true
      },
      mapTool () {
        let _this = this
        if (_this.dataList.length > 0) {
          let data = _this.dataList[0].address
          let map = new AMap.Map("map-container", {
            resizeEnable: true
          })
          map.plugin(["AMap.ToolBar"], function() {
            map.addControl(new AMap.ToolBar({
              offset :new AMap.Pixel(30,10),
              position : 'RT'
            }));
          })
          if(location.href.indexOf('&guide=1')!==-1){
            map.setStatus({scrollWheel:false})
          }
          AMap.service(["AMap.PlaceSearch"], function() {
            //构造地点查询类
            _this.placeSearch = new AMap.PlaceSearch({ 
                pageSize: 5, // 单页显示结果条数
                pageIndex: 1, // 页码
                city: data.prov, // 兴趣点城市
                citylimit: true,  //是否强制限制在设置的城市内搜索
                map: map, // 展现结果的地图实例
                panel: "panel", // 结果列表将在此容器中进行展示。
                autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            })
            //关键字查询
            _this.address = data.prov + data.city + data.adname + data.location
            _this.search()
          })
        }
      },
      search () {
        let _this = this
        this.mapList = []
        this.placeSearch.search(this.address, function(status, result) {
          if(result && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
            _this.mapList = result.poiList.pois
            console.log(_this.mapList)
          }
        })
      }
    },
    mounted () {
      let _this = this
      _this.clearIntervals()
      let cacheData = JSON.parse(window.localStorage.getItem('list'))
      if (cacheData) {
        _this.dataList = []
        _this.dataList = cacheData
        _this.createInterval()
        _this.warning()
        _this.mapTool()
      }
      IO.get('../../../static/config.json').then((response) => {
        let configIp = response.ip
        let userId = this.$route.params.id
        const webSocket = new WebSocket('ws://'+configIp+'/ws/'+userId)
        _this.webSocket = webSocket
        webSocket.onopen = () => {
            console.log('连接成功,准备进行推送数据获取...');
        }
        webSocket.onerror = () => {
          console.log('连接失败！');
          _this.dialogVisible = true
        }
        webSocket.onclose = () => {
          console.log('连接关闭！');
          _this.dialogVisible = true
        } 
        webSocket.onmessage = (event)=> {
          let data = JSON.parse(event.data)
          _this.list = data.data
          if (data.action === 'load' && _this.commitState) {
            this.$message({
              type: 'success',
              duration: 2000,
              message: '保存成功！'
            });
            _this.commitState = false
          } 
          if (data.action === 'error') {
            this.$message.error('保存失败');
          }
          if (_this.list && _this.list.length > 0) {
            _this.clearIntervals()
            if (data.action === 'load') {
              _this.warning()
              //实时数据获取
              console.log(`获取到推送数据${_this.list.length}条...`);
              for (let index = 0; index < _this.list.length; index++) {
                const item = _this.list[index];
                _this.dataList.push(item)
              }
            } else {
              //实时数据更新
              console.log(`获取到推送更新数据${_this.list.length}条...`);
              for (let index = 0; index < _this.list.length; index++) {
                const item = _this.list[index];
                _this.dataList.forEach((data, index) =>{
                  if (data.calluuid === item.calluuid) {
                    data.addrNodes = item.addrNodes
                    _this.$set(_this.dataList[index], data)
                  }
                })
              }
            }
            _this.mapTool()
            _this.createInterval()
          } else {
            if (_this.dataList.length < 1) {
              _this.clearIntervals()
            }
            console.log('未获取到推送数据...');
          }
        }
      })
    },
    destroyed () {
      window.localStorage.removeItem('list')
      this.webSocket.close()
      this.clearIntervals()
    }
  }
</script>
<style lang="less">
.index {
  position: relative;
  padding: 20px;
  height: calc(100% - 98px);
  min-height: 550px;
  overflow-y: auto;
  .no-data {
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #999999;
  }
  .address-container {
    display: inline-block;
    width: 360px;
    height: 100%;
    .address {
      width: 360px;
      height: 100%;
      min-height: 635px;
      margin-right:15px;
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 2px 2px 2px #ccc;
    }
  }
  .robot {
    height: 350px;
    padding: 10px 20px 10px 20px;
    overflow-y: auto;
  }
  .item {
    display: inline-block;
    ul {
      width: 300px; // 设置固定宽度
      padding: 10px;
      margin-bottom: 5px;
      border-radius: 4px;
      background-color: #eceef0;
      li {
        position: relative;
        display: flex;
        font-size: 14px;
        font-weight: bold;
        &:first-child {
          line-height: 20px;
        }
      }
    }
    .area {
      flex: 1;
      font-size: 14px;
      color: #999999;
      span {
        color: #000000;
      }
    }
    .icons {
      width: 24px;
      height: 24px;
      background-image: url('../../../static/image/icons.png');
      background-position: 0 0;
      cursor: pointer;
    }
    .pause {
      background-position: -24px 0;
    }
    .copy {
      background-position: -48px 0;
    }
  }
  .form {
    padding: 0 20px;
    border-top: 1px solid #ebebeb; 
    .from-group {
      display: inline-block;
      width: 130px;
      margin-bottom: 10px;
    }
    label {
      padding: 0px;
      line-height: 30px;
      color: #999999;
    }
    input {
      color: #333333;
      font-size: 14px;
    }
    textarea {
      height: 80px;
      resize: none;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
    }
    .el-button {
      min-width: 110px;
    }
    /* 控制验证样式 */
    .el-input__suffix {
      display: none;
    }
    .el-form-item.is-success .el-input__inner, 
    .el-form-item.is-success .el-textarea__inner {
      border-color: #dcdfe6;
    }
    .el-form-item.is-success .el-input__inner:focus, 
    .el-form-item.is-success .el-textarea__inner:focus {
      border-color: #409EFF;
    }
  }
  #map-container {
    position: absolute;
    top: 20px;
    left: 400px;
    right: 20px;
    bottom: 20px;
    width: calc(100% - 420px);
    box-shadow: 2px 2px 2px #ccc;
    .amap_lib_placeSearch .poibox .poi-info  p {
      display: none;
    }
  }
  #panel {
    position: absolute;
    background-color: #ffffff;
    max-height: 90%;
    overflow-y: auto;
    top: 80px;
    left: 410px;
    width: 350px;
    box-shadow: 2px 2px 2px #999999;
    .amap_lib_placeSearch .poibox .poi-title {
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      .poi-more {
        display: none;
      }
    }
    .amap_lib_placeSearch .poibox .poi-info {
      .poi-tel {
        display: none;
      }
    }
  }
  .search {
    position: absolute;
    top: 30px;
    left: 410px;
    width: 650px;
    height: 40px;
    line-height: 40px;
    display: flex;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 2px 2px 2px #999999;
    .el-input input{
      flex: 1;
      border: 0px;
      outline: none;
    }
  }
}
.index::-webkit-scrollbar, .robot::-webkit-scrollbar {
  width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.index::-webkit-scrollbar-thumb, .robot::-webkit-scrollbar-thumb{/*滚动条里面小方块*/
  border-radius: 6px;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.2);
  background: #ccc;
}
.index::-webkit-scrollbar-track, .robot::-webkit-scrollbar-track{/*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 5px;
  background: #EDEDED;
}
</style>
