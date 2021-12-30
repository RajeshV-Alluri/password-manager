import {useParams} from 'react-router-dom'
import { useState } from 'react'
import fetch from 'cross-fetch'


const Verification = () => {
	const {verificationToken} = useParams()
	const [disableAttr, setDisableAttr] = useState(false)
	const [timer, setTimer] = useState(0)

	const sendEmail = () => {

		if (verificationToken !== "verify") {
			setDisableAttr(true)

			fetch(`http://localhost:5000/verification/resend-email/${verificationToken}`)
				.then(res => res.json())
				.then(data => {
					if (data.verified) {
						window.open('http://localhost:3000', "_self")
					}
				})
				.catch(err => console.log(err))
	
			const timerInterval = setInterval(() => {
				setTimer(prevTimer => prevTimer + 1)
			}, 1000)
	
			setTimeout(() => {
				setDisableAttr(false)
				clearInterval(timerInterval)
				setTimer(0)
			}, 30000);
		}
	}
	
	return(
		<div class="frame">
			<div class="solid-background">
				<span>Verify your email address</span>
			</div>
			<h6>You're one step away</h6>
			<p>Please confirm your email address. A verification email has been sent to your email address. Follow the process given in the mail to start using PASSWORD MANAGER.</p>
			<button type='submit' disabled={disableAttr} style={disableAttr ? {cursor: "not-allowed"} : {cursor: "pointer"}} onClick={sendEmail}>Resend Email</button>
			<span class="email-sent-info" style={disableAttr ? {visibility: 'visible'} : {visibility: "hidden"}} >Email sent. Wait for {30 - timer} Secounds to try again.</span>
		</div>
	)
}

export default Verification