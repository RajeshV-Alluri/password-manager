import { useEffect, useState, useRef } from 'react'; 
import {Link} from 'react-router-dom'

const Register = () => {

  const successGreen = '#20DF7F'
  const errorRed = '#e74c3c'

  const [active, setActivator] = useState('sign-in')
  const [showPassword, setShowPassword] = useState('hidden')
  const [isValidEmail, setIsValidEmail] = useState('valid')
  const [validLoginCredentials, setValidLoginCredentials] = useState(true)

  const handleSignInForm = () => {setActivator('sign-in')}
  const handleSignUpForm = () => {setActivator('sign-up')}

  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const verifyPassword = useRef('');

  const loginEmail = useRef('')
  const loginPassword = useRef('')

  const handleClick = () => {
    if (showPassword === 'hidden') {
      setShowPassword('show')
    } else {
      setShowPassword('hidden')
    }
  } 

  const checkSignUpValidation = (e) => {

    // First Name Validation
    if (firstName.current.children[0].value.trim() === '' || firstName.current.children[0].value.trim().length < 2) {
      firstName.current.children[1].style.color = errorRed
      e.preventDefault()
    } else {
      firstName.current.children[1].style.color = successGreen
    }

    // Last Name Validation
    if (lastName.current.children[0].value.trim() === '' || lastName.current.children[0].value.trim().length < 2) {
      lastName.current.children[1].style.color = errorRed
      e.preventDefault()
    } else {
      lastName.current.children[1].style.color = successGreen
    }

    // Email Validation
    const validEmail = email.current.children[1].value.trim()
    // eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(validEmail)) {
      email.current.children[2].style.color = successGreen
    } else {
      email.current.children[2].style.color = errorRed
      e.preventDefault()
    }

    // Password Validation
    const validPassword = password.current.children[1].value.trim()
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(validPassword)) {
      password.current.children[2].style.color = successGreen
    } else {
      password.current.children[2].style.color = errorRed
      e.preventDefault()
    }

    // Re-entry Password validation
    const reEntryPassword = verifyPassword.current.children[1].value.trim()
    if (validPassword !== reEntryPassword) {
      verifyPassword.current.children[2].style.visibility = "visible"
      e.preventDefault()
    } else {
        verifyPassword.current.children[2].style.visibility = "hidden"
    }

    // Check if email is already in use
    if (validEmail) {
      fetch(`http://localhost:5000/valid-email/${validEmail}`)
        .then(res => res.json())
        .then(data => {
          data.validEmail ? setIsValidEmail('valid') : setIsValidEmail('invalid')
        })
        .catch(err => console.log(err))

      if (isValidEmail === 'invalid') {
        e.preventDefault()
      }
    }

  }

  const login = (e) => {
    e.preventDefault()
    setValidLoginCredentials(true)

    const data = {
      loginEmail: loginEmail.current.value,
      loginPassword: loginPassword.current.value
    }

    fetch('http://localhost:5000/valid-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (! data.loginCredentials) {
          setValidLoginCredentials(false)
          e.preventDefault()
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {}, [active])

  return(
    <div>
      <div class="register">
        <div class="heading">
          <button onClick={handleSignInForm} className={`${active === 'sign-in' ? 'active' : 'non-active'}`}>Sign In</button>
          <button onClick={handleSignUpForm} className={`${active === 'sign-up' ? 'active' : 'non-active'}`}>Sign Up</button>
        </div>

        <div className={`${active === 'sign-in' ? "sign-in activeForm": 'deactive'}`}>
          <form action="http://localhost:5000/login" method="POST" onSubmit={login}>
            <label for="email">Email</label>
            <input ref={loginEmail} type="text" id="email" name="email" placeholder="rajesh.xyz@mail.com" maxlength="30"  />
            <label for="password">Password</label>
            <input ref={loginPassword} type={`${showPassword === 'show' ? 'text' : 'password'}`} id="password" name="password" maxlength="25" />
            <i className={`bi bi-eye${showPassword === 'hidden' ? '-slash' : ''}`} onClick={handleClick}></i>
            <span class="login-message" style={
              validLoginCredentials ? {visibility: "hidden"} : {visibility: "visible"}
              }>Invalid Email/Password.</span>
            <div class="submit">
              <input type="submit" value="Sign In" />
              <span><Link to='/forgot-password'>Forgot Password?</Link></span>
            </div>
          </form> 
        </div>
        <div className={`${active === 'sign-up' ? "sign-up activeForm": 'deactive'}`}>
          <form method="post" action="http://www.localhost:5000/register" onSubmit={checkSignUpValidation}>
            <div className="name">
              <div ref={firstName}>
                <input type="text" name="firstname" placeholder="Rajesh" maxlength="20"/>
                <span>Required</span>
              </div>
              <div ref={lastName}>
                <input type="text" name="lastname" placeholder="Alluri" maxlength="20"/>
                <span>Required</span>
              </div>
            </div>
            <div ref={email}>
              <label for="email">Email</label>
              <input type="text" id="text" name="email" placeholder="rajesh.xyz@mail.com" maxlength="30"/>
              <span>Required</span>
            </div>
            <div ref={password}>
              <label for="password">Password</label>
              <input type="password" id="password" name="password" maxlength="30"/>
              <span>Above 8 characters with mix of [a-z, A-Z, 0-9]</span>
            </div>
            <div ref={verifyPassword}>
              <label for="password-check">Confirm Password</label>
              <input type="password" id="password-check" name="verify-password" maxlength="30"/>
              <span className="verifyPassword">Passwords doesn't match</span>
              <span class="message" style={
              isValidEmail === 'valid' ? {display: "none"} : {display: "flex"}
              }>Email has already been taken.</span>
            </div>
            <div class="submit">
              <input type="submit" value="Sign Up" />
            </div>
          </form> 
        </div>
      </div>
    </div>
    
  )
}

export default Register;