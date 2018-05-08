//注册结果页面
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

class Result extends Component {
  constructor(props) {
    super(props);
    this.openApp = this.openApp.bind(this);
  }
  openApp() {
    window.location.href = "ybjf://open.ybjf";
    window.setTimeout(function() {
      var ua = navigator.userAgent;

      if (
        ua.toLowerCase().match(/MicroMessenger/i) === "micromessenger" &&
        ua.indexOf("Android") > -1
      ) {
        window.location.href =
          "http://a.app.qq.com/o/simple.jsp?pkgname=com.huadizg.ybjf&channel=0002160650432d595942&fromcase=60001";
      } else {
        if (ua.indexOf("Android") > -1 || ua.indexOf("Linux") > -1) {
          window.location.href =
            "http://download.yingbeizg.com/app/app-release-yingbeijf.apk";
        } else if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          //android终端或者uc浏览器
          window.location.href =
            "https://itunes.apple.com/us/app/ying-bei-jin-fu/id1187177219?l=zh&ls=1&mt=8";
        }
      }
    }, 2000);
  }
  render() {
  const { location } = this.props


    return (
      <div>
      <Helmet>
        <title>下载</title>
      </Helmet>

      <div className="result">
        {location.state && location.state.isRegister ? (
          <p>
            此手机号码已注册 <br /> 请前往APP登录
          </p>
        ) : (
          <p>
            恭喜你获得<strong>&nbsp;888&nbsp;</strong>红包 <br /> 请前往APP查看
          </p>
        )}
        <input type="button" className="go-to-app" onClick={this.openApp} />
      </div>
      </div>
    );
  }
}

export default Result;