import { logIn } from "actions/auth";
import LogoWave from "assets/images/logo/logo_aveapp.png";
import Button from "components/common/Header/Button";
import LoadingView from "components/Spinner/LoadingView";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";

interface LoginProps {}

function Login() {
  const dispatch: any = useDispatch();
  const token = useSelector(({ auth }) => auth.token);
  const { register, handleSubmit } = useForm();
  const error = useSelector(({ auth }) => auth.login.error);
  const isChecking = useSelector(({ auth }) => auth.login.isChecking);

  const obSubmit = (data: any) => {
    dispatch(logIn(data));
    // dispatch({
    //   type: "SET_TOKEN_SUCCESS",
    // });
  };

  if (isChecking) {
    return <LoadingView />;
  }

  if (token) {
    return <Redirect to="/channel" />;
  }

  return (
    <LoginStyled className="login-view">
      <div className="login--box">
        <form onSubmit={handleSubmit(obSubmit)} className="login--box__form">
          <h1>Login</h1>
          <div className="form--inputs">
            <div className="form--inputs__input userid">
              <input
                {...register("userId")}
                type="text"
                placeholder="Enter the email"
              />
            </div>
            <div className="form--inputs__input password">
              <input
                {...register("userPassword")}
                type="password"
                placeholder="Enter the password"
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger small">{error.message}</div>
          )}

          <div className="btn-options">
            <Button
              type="submit"
              name="Login"
              className="btn-login"
              inputColor={isChecking ? "" : "primary"}
            ></Button>
          </div>
        </form>

        <div className="forgot-options">
          Did you haven't an account?<Link to="/register">Register</Link>
        </div>

        <div className="forgot-options">
          <Link to="/register">userid searching</Link>
          <Link to="/register">PW searching</Link>
        </div>

        <div className="footer-copyright">
          <img src={LogoWave} alt="" />
          <span>
            Copyright @ AVE APP.ALL RIGHTS RESERVED.TERMS OF SERVICE PRIVACY
            POLICY
          </span>
        </div>
      </div>
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login--box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login--box__form {
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    padding: 40px 40px;
    min-width: 480px;
    max-width: 480px;

    h1 {
      font-size: 26px;
      text-align: center;
      margin-bottom: 48px;
    }

    .form--inputs {
      width: 100%;
      border: 1px solid #e2e2e2;
      border-radius: 8px;

      input {
        width: 100%;
        border: none;
        min-height: 48px;
        padding: 0 10px;
      }

      &__input.userid {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: 1px solid #e2e2e2;

        input {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
      }

      &__input.password {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        input {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }

    .btn-options {
      text-align: right;
      margin-top: 60px;
      display: flex;
      justify-content: flex-end;

      .btn-login {
        color: #fff;
        padding: 10px 0;
        display: inline-block;
        min-width: 96px;
        max-height: 40px;
        border: none;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .forgot-options {
    text-align: center;
    padding: 20px 0;

    a {
      color: #707070;
      font-size: 14px;

      border-right: 1px solid #e2e2e2;
      margin-right: 16px;
      padding-right: 16px;

      &:last-child {
        margin-right: 0;
        border-right: none;
      }
    }
  }
  .footer-copyright {
    img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
    span {
      color: #707070;
      font-size: 14px;
    }
  }
`;

export default Login;
