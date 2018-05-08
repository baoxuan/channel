import React, { Component } from 'react';

import { Helmet } from 'react-helmet';
import {
  withRouter 
} from "react-router-dom";

import axios from "axios";
import exclamation from "../images/exclamation.png";
import env from "../config/env";
import { getURLParams } from '../common/util';

const telReg = /^1[3-9][0-9]\d{8}$/i;
const picCodeReg = /^[A-Za-z0-9]{4}$/i;
const seconds = 120;

//弹窗组件
function Alert(props) {
  return (
    <div className="alert-wrap">
      <div className="alert">
        <img src={exclamation} alt="iamge" />
        <p>{props.msg}</p>
      </div>
    </div>
  );
}


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBase64: "",
      canGetSmsCode: false,
      phoneValid: false,
      userPhone: "",
      seconds: seconds,
      sendSmsCodeSuccessful: false,
      showAlert: false,
      msg: "",
      checked: true,
      picCodeValid: false,
      channelCode:"",
    };
    this.getPicAuthCode = this.getPicAuthCode.bind(this);
    this.checkPhone = this.checkPhone.bind(this);
    this.checkPicCode = this.checkPicCode.bind(this);
    this.sendSmsCode = this.sendSmsCode.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.checkIfUserExistedAndSendSmsCode = this.checkIfUserExistedAndSendSmsCode.bind(
      this
    );
    this.checkContract = this.checkContract.bind(this);
  }

  //获取图片验证码
  getPicAuthCode() {
    const self = this;
    const data = "source=wap";
    axios({
      url: `${
        env[env.current].url
      }/server-nn-mobile-gateway/user/graphicsCodeResp`,
      data: data,
      withCredentials: true,
      method: "post"
    })
      .then(res => {
        self.setState({
          imageBase64: res.data.body.data.imageBytes
        });
        // console.log(res);
      })
      .catch(err => {
        // console.log(err);
      });
  }
  //发送手机验证码
  sendSmsCode() {
    const self = this;
    const data = `phoneNo=${self.state.userPhone}&busCode=REG&ticket=${
      self.state.userTicket
    }&source=wap`;
    axios({
      url: `${env[env.current].url}/server-nn-mobile-gateway/user/sendVerCode`,
      data: data,
      method: "post",
      withCredentials: true
    })
      .then(res => {
        console.log(res);
        const data = res.data;
        if (data.respStatus === "SUCCESS") {
          //短信发送成功
          self.setState({
            sendSmsCodeSuccessful: true,
            canGetSmsCode: false
          });

          self.showPop("短信验证码发送成功", 1500);
          self.interval = setInterval(() => self.tick(), 1000);
        } else {
          self.showPop(data.errorMsgCn, 1500);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  //展示弹窗信息
  showPop(msg, inter) {
    const interval = inter || 1500;
    const self = this;
    this.setState({
      msg: msg,
      showAlert: true
    });
    this.alertTimer = setTimeout(function() {
      self.setState({
        showAlert: false,
        msg: ""
      });
      clearTimeout(self.alertTimer);
    }, interval);
  }

  //重新获取验证码倒计时
  tick() {
    if (this.state.seconds !== 0) {
      this.setState(prevState => ({
        seconds: prevState.seconds - 1
      }));
    } else {
      clearInterval(this.interval);
      this.setState({
        seconds: seconds,
        sendSmsCodeSuccessful: false,
        canGetSmsCode: true
      });
    }
  }
  //用户注册
  registerUser() {
    const telReg = /^1[3-9][0-9]\d{8}$/i;
    const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/i;
    const picCodeReg = /^[A-Za-z0-9]{4}$/i;
    const smsAuthCodeReg = /^[0-9]{4}$/i;
    const checked = this.state.checked;
    const smsAuthCode = this.refs.smsAuthCode.value;
    const userPhone = this.refs.userPhone.value;
    const picAuthCode = this.refs.picAuthCode.value;
    const userPassword = this.refs.userPassword.value;
    // console.log(telReg);
    if (telReg.test(userPhone)) {
      if (picCodeReg.test(picAuthCode)) {
        if (smsAuthCodeReg.test(smsAuthCode)) {
          if (passwordReg.test(userPassword)) {
            if (checked) {
              this.sendRegisterRequest();
            } else {
              this.showPop("请勾选同意《平台注册服务协议》");
            }
          } else {
            this.showPop("密码格式不正确");
          }
        } else {
          this.showPop("短信验证码格式不正确");
        }
      } else {
        this.showPop("图片验证码不正确");
      }
    } else {
      this.showPop("用户手机号格式不正确");
    }
  }
  sendRegisterRequest() {
    const self = this;
    const userPwd = this.refs.userPassword.value;
    const imageVerCode = this.refs.picAuthCode.value;
    const smsAuthCode = this.refs.smsAuthCode.value;
    const data = `phoneNo=${
      self.state.userPhone
    }&userPwd=${userPwd}&code=${smsAuthCode}&imageVerCode=${imageVerCode}&userType=0&source=wap&ticket=${
      self.state.userTicket}&channelCode=${self.state.channelCode
    }`;
    axios({
      url: `${env[env.current].url}/server-nn-mobile-gateway/user/webReg`,
      method: "post",
      withCredentials: true,
      data: data
    })
      .then(res => {
        const data = res.data;
        if (data.respStatus === "SUCCESS") {
          this.props.history.push({
            pathname: '/result',
            state: { isRegister: 0 },
          })
        } else {
          this.showPop(data.errorMsgCn);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  //获取用户ticket
  getUserTicket() {
    const self = this;
    axios({
      url: `${
        env[env.current].url
      }/server-nn-mobile-gateway/user/getTicket?phoneNo=${
        self.state.userPhone
      }&source='wap'`,
      method: "get",
      withCredentials: true
    })
      .then(res => {
        console.log(res);
        if (res.data.respStatus === "SUCCESS") {
          self.setState({
            userTicket: res.data.ticket
          });
          self.sendSmsCode();
        } else {
          console.log("failed");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  //校验用户是否存在并发送验证码
  checkIfUserExistedAndSendSmsCode() {
    const self = this;
    const data = `phoneNo=${self.state.userPhone}&source='wap'`;

    axios({
      url: `${env[env.current].url}/server-nn-mobile-gateway/user/isNewUserExt`,
      data: data,
      method: "post",
      withCredentials: true
    })
      .then(res => {
        console.log(res);
        res.data.body.data.isRegister === "0"
          ? self.getUserTicket()
          :  this.props.history.push({
            pathname: '/result',
            state: { isRegister: 1 },
          })
      })
      .catch(err => {
        console.log(err);
      });
  }

  //校验手机号
  checkPhone(e) {
    const userPhone = e.target.value;
    console.log(userPhone);
    if (telReg.test(userPhone)) {
      if (this.state.picCodeValid) {
        this.setState({
          phoneValid: true,
          userPhone: userPhone,
          canGetSmsCode: true
        });
      } else {
        this.setState({
          phoneValid: true,
          userPhone: userPhone,
          canGetSmsCode: false
        });
      }
    } else {
      this.setState({ phoneValid: false, canGetSmsCode: false });
    }
  }

  //校验图片验证码
  checkPicCode(e) {
    console.log("pic code", e.target.value);
    if (picCodeReg.test(e.target.value)) {
      if (this.state.phoneValid) {
        this.setState({ canGetSmsCode: true, picCodeValid: true });
      } else {
        this.setState({ canGetSmsCode: false, picCodeValid: true });
      }
    } else {
      this.setState({ picCodeValid: false, canGetSmsCode: false });
    }
  }

  //勾选同意协议
  checkContract() {
    this.setState({
      checked: !this.state.checked
    });
  }

  componentDidMount() {
    this.getPicAuthCode();
    const channelCode = getURLParams("channelCode");
    this.setState({
      channelCode
    })
  }

  render() {
    console.log("this.state.phoneValid"+this.state.phoneValid);
    console.log("this.state.picCodeValid:"+this.state.picCodeValid);
    return (
      <div>
      <Helmet>
        <title>注册</title>
      </Helmet>
        <div className="bg">
          <div className="mobile-num">
            <input
              type="text"
              placeholder="输入手机号"
              autoComplete="off"
              maxLength="11"
              onChange={this.checkPhone}
              ref="userPhone"
            />
          </div>
          <div className="pic-code row">
            <input
              ref="picAuthCode"
              type="text"
              placeholder="输入图形验证码"
              autoComplete="off"
              maxLength="4"
              onChange={this.checkPicCode}
            />
            <img
              src={`data:image/png;base64,${this.state.imageBase64}`}
              alt=""
              onClick={this.getPicAuthCode}
            />
          </div>
          <div className="row row-3">
            <input
              ref="smsAuthCode"
              type="text"
              placeholder="输入短信验证码"
              className="sms-code"
              autoComplete="off"
              maxLength="4"
            />
            <input
              type="button"
              value={
                this.state.sendSmsCodeSuccessful
                  ? `${this.state.seconds}S`
                  : "获取验证码"
              }
              disabled={
                this.state.canGetSmsCode
                  ? this.state.sendSmsCodeSuccessful ? true : false
                  : true
              }
              className={
                this.state.canGetSmsCode
                  ? this.state.sendSmsCodeSuccessful
                    ? "get-sms-code"
                    : "active get-sms-code"
                  : "get-sms-code"
              }
              onClick={this.checkIfUserExistedAndSendSmsCode}
            />
          </div>
          <div className="password row">
            <input
              type="password"
              placeholder="设置登录密码"
              autoComplete="off"
              ref="userPassword"
              maxLength="20"
              minLength="8"
            />
            <p className="tip">密码由8-20位数字和字母组成</p>
          </div>
          <div className="row row-5">
            {/* <input type="checkbox" id="checkBox" className="checkbox" /> */}
            <span
              ref="checkBox"
              className="checkbox"
              onClick={this.checkContract}
            >
              {this.state.checked ? "√" : ""}
            </span>
            <span className="tip">
              我已经阅读并同意{" "}
              <a
                className="yellow"
                href={`${env[env.current].staticUrl}/contract/contract1.htm`}
              >
                {" "}
                《平台注册服务协议》
              </a>
            </span>
          </div>

          <div>
            <input
              type="button"
              className="register"
              onClick={this.registerUser}
            />
          </div>
        </div>
        {this.state.showAlert ? <Alert msg={this.state.msg} /> : null}
      </div>
    );
  }
}

export default withRouter(Home);
