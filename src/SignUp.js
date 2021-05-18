import React from 'react';
import axios from 'axios';
import Subject from './components/Subject';
import './SignUp.css';
import hufs_logo from './hufs_logo.png';

//import { Link } from 'react-router-dom';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'singUp',
      name: '',
      studentNum: '',
      userId: '',
      phoneNum: '',
      pw: '',
      pwCheck: '',
      chkStudentNum: '',
      chkPhone: '',
      chkId: '',
      chkPw: '',
      chkPw2: '',
    };
  }
  handleSignUpValue = (key) => (e) => {
    if (key === 'name') {
      this.setState({ [key]: e.target.value });
    }   

    //여기서 유효성 검사를 한다.
    // 2. key가 학번인 경우 => 학번 형식을 맞춰야 하고, 중복된 학번이 존재하면 안된다. (이미 회원가입 되어있다는 의미이므로)
    // 2-1. 학번 형식이 맞지 않으면 => 올바른 학번 형식이 아닙니다. 출력
    // 2-2. 학번 형식이 맞으면
    //      2-2-1. 중복 검사 => 이미 있는 학번이면 이미 존재하는 학번입니다. 출력하고 올바른 학번 입력할 때까지 break
    //      2-2-2.         => 없는 학번이면 통과!
    if (key === 'studentNum') {
      var numReg = /^[0-9]{,9}$/;
      var studentNum = e.target.value;
      this.setState({ [key]: studentNum });

      if (studentNum > 0 && false === numReg.test(studentNum)) {
        this.setState({ chkStudentNum: "올바른 학번 형식이 아닙니다."});
      }  else {
        axios({
          method: 'POST',
          //url: 'http://localhost:4000/users/signup/StudentNum', //모든 학번 형식을 잘 갖춰서 작성해 주었을 때, check StudentNum API를 통해 중복 검사를 한다.
          data: { studentNum: e.target.value }
        })
        .then((res) => {
          if (res.data !== null) {
            this.setState({ chkStudentNum: '이미 가입된 학번입니다.' });
          }   else {
                this.setState({ chkStudentNum: ''});
                this.setState({ [key]: studentNum });
              }
        })
        .catch((err) => {
          console.error(err);
        });
      }
    }

    // 3. key가 전화번호인 경우 => 학번과 같은 과정으로 중복 회원가입을 검사한다.
    if (key === 'phoneNum') {
      var phoneReg = /^[0-9\b -]{0,13}$/; 
      var phoneNum = e.target.value;
      if (phoneNum.length > 0 && false === phoneReg.test(phoneNum)) {
        this.setState({ chkPhone: '올바른 전화번호 형식이 아닙니다.' });
      }  else {
        axios({
          method: 'POST',
          //url: 'http://localhost:4000/users/signup/checkPhone',
          data: { phoneNum: e.target.value }
        })
        .then((res) => {
          if (res.data !== null) {
            this.setState({ chkPhone: '이미 가입된 전화번호입니다.' });
          }  else {
              this.setState({ chkPhone: ''});
              this.setState({ [key]: phoneNum });
            }
        })
        .catch((err) => {
          console.error(err);
        });
      }
    }

    //4. key가 userId인 경우, => 글자수는 4자~12자이며, 숫자/소문자만을 포함해야 한다.
    if (key === 'userId') {
      var idReg = /^[A-Za-z0-9+]{4,12}$/; 
      var userId = e.target.value;
      if (userId.length > 0 && false === idReg.test(userId)) {
        this.setState({ chkId: '아이디는 4자 이상이어야 하며, 숫자/소문자만을 포함해야 합니다.'});
      } else {
          this.setState({ chkId: '' });
          this.setState({ [key]: e.target.value });
      }
    }

    //5. key가 pw인 경우, => 8자 이상이어야 하고, 숫자/대문자/소문자/특수문자를 모두 포함해야 한다.
    if (key === 'pw') {
      var pwReg = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
      var pw = e.target.value;
      if (pw.length > 0 && false === pwReg.test(pw)) {
        this.setState({
          chkPw: '비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.',
        });
      } else {
        this.setState({ chkPw: '' });
        this.setState({ [key]: e.target.value });
      }
    }

    //6. key가 pwCheck인 경우 => 앞선 this.state.password와 같아야한다.
    if (key === 'pwCheck') {
      var pwCheck = e.target.value;
      if (pwCheck.length > 0 && this.state.pw !== pwCheck) {
        this.setState({ chkPw2: '비밀번호가 일치하지 않습니다.' });
      } else {
        this.setState({ chkPw2: '' });
        this.setState({ [key]: e.target.value });
      }
    }
  };

  handleSignUpButton = () => {
  	// 제출하기(회원가입) 버튼을 누르면 이 event가 발생
    // 이 버튼은 서버에 회원가입을 요청 후 로그인 페이지로 리다이렉트 해줌
    // 이미 회원가입이 되어 있는 경우, 학번 유효성 검사에서 걸러지므로 따로 확인 필요없음.
    axios({
      method: 'POST',
      //url: 'http://localhost:4000/users/signup',
      data: {
        name: this.state.name,
        studentNum: this.studenNum,
        phoneNum: this.phoneNum,
        userId: this.userId,
        pw: this.state.pw
      },
    })
      .then((res) => {
        //200(OK), 201(Created)
        // this.props.history.push('/users/login');
        console.log('회원가입 완료');
        window.alert("가입이 완료되었습니다.");
      })
      .catch((err) => {
        //500(err)
        console.error(err);
      });
  };
  render() {
    const { history } = this.props;
    return (
      <div>
        <div className="header">
          <a href='메인'><img alt="hufs-logo" className="logo" src={hufs_logo}/></a>

          <a href='로그인'>
          <button className="Login">
            로그인
          </button>
          </a>
        </div>
        
        <Subject
          onChangePage={function(){
          this.setState({mode: 'signUp'});
        }.bind(this)}>
        </Subject>
    
        <ul>
            <label htmlFor="name">
              <div>이름</div>
              <input type="text" name="name" placeholder=' ex) 홍길동' onChange={this.handleSignUpValue('name')}></input>
            </label>
          
          
            <label htmlFor="student number">
              <div>학번</div>
              <input type="text" name="studentNum" placeholder=' ex) 202112345' onChange={this.handleSignUpValue('studentNum')}></input>
              <div>{this.state.chkStudentNum}</div>
            </label>
          
          
            <label htmlFor="phone number">
              <div>전화번호</div>
              <input type="tel" name="phoneNum" placeholder=' "-" 제외 ex) 01012345678' onChange={this.handleSignUpValue('phoneNum')}></input>
              <div>{this.state.chkPhone}</div>
            </label>
          
    
            <label htmlFor="user ID">
              <div>아이디</div>
              <input type="text" name="userId" placeholder=' 영어/숫자 (4글자~12글자)' onChange={this.handleSignUpValue('userId')}></input>
              <div>{this.state.chkId}</div>
            </label>
          
        
            <label htmlFor="password">
              <div>비밀번호</div>
              <input type="password" name="pw" placeholder=' 영어/숫자/특수문자 모두 포함 (8글자~15글자)' onChange={this.handleSignUpValue('pw')}></input>
              <div>{this.state.chkPw}</div>
            </label>
          

            <label htmlFor="password check" onChange={this.handleSignUpValue('pwCheck')}>
              <div>비밀번호 확인</div>
              <input type="password" name="pw2" placeholder=' 영어/숫자/특수문자 모두 포함 (8글자~15글자)'></input>
              <div>{this.state.chkPw2}</div>
            </label>
        </ul>

        <div>
          <button className="Submit"
            onClick= {(e) => {
              e.preventDefault();
              {
                this.handleSignUpButton();
              }
            }}>
            가입하기
          </button>
        </div>
      </div>
    );
  }
}

// export default withRouter(SignUp);
export default SignUp;