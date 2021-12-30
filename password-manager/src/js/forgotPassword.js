import { useState, useRef } from 'react'
import fetch from 'cross-fetch'


const ForgotPassword = () => {

	const [validEmail, setValidEmail] = useState(true)
	const [disableAttr, setDisableAttr] = useState(false)
	const [timer, setTimer] = useState(0)
	const email = useRef('')

	const sendEmail = () => {
		setValidEmail(true)
		const emailId = email.current.value.trim().toLowerCase()

		if(emailId)
		fetch(`http://localhost:5000/valid-email/${emailId}`)
			.then(res => res.json())
			.then(data => {
				if (! data.validEmail) {
					setValidEmail(true)
					setDisableAttr(true)
					fetch(`http://localhost:5000/forgot-password/send-mail/${emailId}`)
						.then(res => {console.log(res)})
						.catch(err => console.log(err))
		
						const timerInterval = setInterval(() => {
							setTimer(prevTimer => prevTimer + 1)
						}, 1000)
				
						setTimeout(() => {
							setDisableAttr(false)
							clearInterval(timerInterval)
							setTimer(0)
						}, 30000);
				} else {setValidEmail(false)}
			})
			.catch(err => console.log(err))
	}
	
	return(
		<div class="frame">
			<div class="solid-background">
				<span>Forgot Password?</span>
			</div>
			<p>Please enter your email address. We'll send you a mail with a link to change your password.</p>
			<div class="email">
				<label htmlFor="email" style={{color: "#e74c3c"}}>Enter Your Email</label>
				<input style={{width: "18em"}} ref={email} id="email" name="email" placeholder="rajesh.xyz@mail.com" maxlength="30" type="text" />
			</div>
			<button class='send-email' type='submit' disabled={disableAttr} style={disableAttr ? {cursor: "not-allowed"} : {cursor: "pointer"}} onClick={sendEmail}>Send Email</button>
			<span class="email-sent-info email-sent-timer" style={disableAttr ? {display: 'flex'} : {display: "none"}} >Email sent. Wait for {30 - timer} Secounds to try again.</span>
			<span class="valid-email-info" style={validEmail ? {display: 'none'} : {display: "flex"}}>Invalid Email</span>
		</div>
	)
}

export default ForgotPassword