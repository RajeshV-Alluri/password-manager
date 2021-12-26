const PageNotFound = () => {

	return (
		<div class="error-message-404">
			<h1>Page Not Found</h1>
			<div class="error-status">
				<h2><i class="bi bi-chevron-left"></i>Error /<i class="bi bi-chevron-right"></i></h2>
				<h3><i class="bi bi-chevron-left"></i>Status_Code = 404 /<i class="bi bi-chevron-right"></i></h3>
			</div>
			<div class="error-info">
				<p>Your expedition ends here.</p>
				<p>There’s no place like home, <a href="http://localhost:3000">Head Back To Home</a>.</p>
			</div>
		</div>
	)
}

export default PageNotFound