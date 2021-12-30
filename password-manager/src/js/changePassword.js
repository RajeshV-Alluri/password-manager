import { useRef } from 'react';
import {useParams} from 'react-router'

const ChangePassword = () => {
  const successGreen = '#20DF7F'
  const errorRed = '#e74c3c'
  
	const {passwordChangeToken} = useParams()

  const password = useRef('')
  const confirmPassword = useRef('')
  const passwordSpan= useRef('')
  const changePasswordSpan = useRef('')

  const submitChangePasswordForm = (e) => {
    
  console.log(passwordChangeToken)

    // Password Validation
    const validPassword = password.current.value.trim()
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(validPassword)) {
      passwordSpan.current.style.color = successGreen
    } else {
      passwordSpan.current.style.color = errorRed
      e.preventDefault()
    }

    // Passwords Match validation
    const validConfirmPassword = confirmPassword.current.value.trim()
    if (validPassword !== validConfirmPassword) {
      changePasswordSpan.current.style.visibility = "visible"
      e.preventDefault()
    } else {
        changePasswordSpan.current.style.visibility = "hidden"
    }
  }

  return(
    <div>
      <div class="register">
        <div class="heading">
          <button class="active active-single-only">Change Password</button>
        </div>

        <div className="activeForm">
          <form action={`http://localhost:5000/change-password/${passwordChangeToken}`} method="POST" class="changePasswordForm" onSubmit={submitChangePasswordForm}>
            <label for="password">New password</label>
            <input ref={password} type="password" id="password" name="password" maxlength="30"  />
            <span ref={passwordSpan}>Above 8 characters with mix of [a-z, A-Z, 0-9]</span>
            <label for="password">Confirm Password</label>
            <input ref={confirmPassword} class="confirm-password" type="password" id="password" name="confirm-password" maxlength="25" />
            <span class="confirm-password-span" ref={changePasswordSpan}>Passwords doesn't match.</span>
            <div class="submitPassword">
              <input type="submit" value="Submit" />
            </div>
          </form> 
        </div>
      </div>
    </div>
    
  )
}

export default ChangePassword;