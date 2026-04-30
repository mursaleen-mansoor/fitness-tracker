const testLogin = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@fitness.com',
                password: 'admin123'
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Login successful:", data.role, data.email);
        } else {
            console.error("Login failed:", data.message);
        }
    } catch (error) {
        console.error("Login error:", error.message);
    }
};

testLogin();
