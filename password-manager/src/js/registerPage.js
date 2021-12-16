import '../css/main.min.css';
import { useEffect, useState, useRef } from 'react'; 
import {useNavigate} from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const successGreen = '#20DF7F'
  const errorRed = '#e74c3c'

  const [active, setActivator] = useState('sign-in')
  const [showPassword, setShowPassword] = useState('hidden')
  const [message, setMessage] = useState('')

  const handleSignInForm = () => {setActivator('sign-in')}
  const handleSignUpForm = () => {setActivator('sign-up')}

  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const verifyPassword = useRef('');

  const handleClick = () => {
    if (showPassword === 'hidden') {
      setShowPassword('show')
    } else {
      setShowPassword('hidden')
    }
  } 

  const checkSignUpValidation = (e) => {
    e.preventDefault()
    let validForm = false
    setMessage('')

    // First Name Validation
    if (firstName.current.children[0].value.trim() === '' || firstName.current.children[0].value.trim().length < 2) {
      firstName.current.children[1].style.color = errorRed
      e.preventDefault()
      validForm = false
    } else {
      firstName.current.children[1].style.color = successGreen
      validForm = true
    }

    // Last Name Validation
    if (lastName.current.children[0].value.trim() === '' || lastName.current.children[0].value.trim().length < 2) {
      lastName.current.children[1].style.color = errorRed
      e.preventDefault()
      validForm = false
    } else {
      lastName.current.children[1].style.color = successGreen
    }

    // Email Validation
    const validEmail = email.current.children[1].value.trim()
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(validEmail)) {
      email.current.children[2].style.color = successGreen
    } else {
      email.current.children[2].style.color = errorRed
      validForm = false
      e.preventDefault()
    }

    // Password Validation
    const validPassword = password.current.children[1].value.trim()
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(validPassword)) {
      password.current.children[2].style.color = successGreen
    } else {
      password.current.children[2].style.color = errorRed
      validForm = false
      e.preventDefault()
    }

    // Re-entry Password validation
    const reEntryPassword = verifyPassword.current.children[1].value.trim()
    if (validPassword !== reEntryPassword) {
      verifyPassword.current.children[2].style.visibility = "visible"
      validForm = false
      e.preventDefault()
    } else {
        verifyPassword.current.children[2].style.visibility = "hidden"
    }

    // Post Registration Form to Backend
    if (validForm) {
      const registerForm = {
        firstname: firstName.current.children[0].value.replace(/\s/g, ""),
        lastname: lastName.current.children[0].value.replace(/\s/g, ""),
        email: email.current.children[1].value.replace(/\s/g, "").toLowerCase(),
        password: password.current.children[1].value.replace(/\s/g, "")
      }
  
      fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerForm)
        })
        .then(res => res.json())
        .then(data => {
          if (data.redirect && data.redirectTo === '/') {
            setMessage(data.message)
          }
        })
        .catch(err => console.log(err))
    }
  }

  console.log(message)

  useEffect(() => {}, [active])

  return(
    <div>
      <div class="register">
        <div class="heading">
          <button onClick={handleSignInForm} className={`${active === 'sign-in' ? 'active' : 'non-active'}`}>Sign In</button>
          <button onClick={handleSignUpForm} className={`${active === 'sign-up' ? 'active' : 'non-active'}`}>Sign Up</button>
        </div>

        <div className={`${active === 'sign-in' ? "sign-in activeForm": 'deactive'}`}>
          <form action="#">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="rajesh.xyz@mail.com" maxlength="30"  />
            <label for="password">Password</label>
            <input type={`${showPassword === 'show' ? 'text' : 'password'}`} id="password" name="password" maxlength="25" />
            <i className={`bi bi-eye${showPassword === 'hidden' ? '-slash' : ''}`} onClick={handleClick}></i>
            {/* <span></span> */}
            <div class="submit">
              <input type="submit" value="Sign In" />
              <span><a href="#">Forgot Password?</a></span>
            </div>
          </form> 
        </div>
        <div className={`${active === 'sign-up' ? "sign-up activeForm": 'deactive'}`}>
          <form method="POST" onSubmit={checkSignUpValidation}>
            <div className="name">
              <div ref={firstName}>
                <input type="text" name="fname" placeholder="First Name" />
                <span>Required</span>
              </div>
              <div ref={lastName}>
                <input type="text" name="lname" placeholder="Last Name" />
                <span>Required</span>
              </div>
            </div>
            <div ref={email}>
              <label for="email">Email</label>
              <input type="text" id="text" name="email" placeholder="rajesh.xyz@mail.com" />
              <span>Required</span>
            </div>
            <div ref={password}>
              <label for="password">Password</label>
              <input type="password" id="password" name="password" />
              <span>Above 8 characters with mix of [a-z, A-Z, 0-9]</span>
            </div>
            <div ref={verifyPassword}>
              <label for="password-check">Re-enter Password</label>
              <input type="password" id="password-check" name="password" />
              <span className="verifyPassword">Passwords doesn't match</span>
              <span class="message" style={{color: errorRed}}>{message}</span>
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