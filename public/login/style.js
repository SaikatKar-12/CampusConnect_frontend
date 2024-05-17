const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = (()=>{
 loginForm.style.marginLeft = "-50%";
 loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
 loginForm.style.marginLeft = "0%";
 loginText.style.marginLeft = "0%";
});
signupLink.onclick = (()=>{
 signupBtn.click();
 return false;
});

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Function to handle form submission for login
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        const email = loginForm.querySelector('input[type="text"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        localStorage.setItem('username',email);
        // Prepare data for login
        const loginData = {
            email: email,
            password: password
        };

        // Send a POST request to the sign-in API
        fetch('http://localhost:3000/api/v1/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to sign in');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful login response here
            console.log('Login successful', data);
            token = data.data;
            localStorage.setItem('authToken', token);
            window.location.href = '../home/Home.html';
        })
        .catch(error => {
            // Handle login errors here
            console.error('Login failed', error);
            alert("login failed");
        });
    });

    // Function to handle form submission for signup
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        const email = signupForm.querySelector('input[type="text"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        const confirmPassword = signupForm.querySelector('input[type="password"][placeholder="Confirm Password"]').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            alert('Passwords do not match')
            return;
        }

        // Prepare data for signup
        const signupData = {
            email: email,
            password: password
        };
        console.log(signupData);
        // Send a POST request to the sign-up API
        fetch('http://localhost:3000/api/v1/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to sign up');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful signup response here
            console.log('Signup successful', data);
            alert("signup successfull");
        })
        .catch(error => {
            // Handle signup errors here
            console.error('Signup failed', error);
            alert("signup failed");
        });
    });
});
