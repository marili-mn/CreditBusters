
class Api {
    constructor() {
        this.baseUrl = 'https://creditsbuster.onrender.com/api';
        this.token = localStorage.getItem('accessToken');
    }

    async _fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: email,
                password: password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.token = data.access_token;
        localStorage.setItem('accessToken', this.token);
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('accessToken');
    }

    async register(userData) {
        return this._fetch('/user/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async requestPasswordReset(email) {
        return this._fetch('/user/password-reset-request/', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async verifyResetCode(email, resetCode) {
        return this._fetch('/user/verify-reset-code/', {
            method: 'POST',
            body: JSON.stringify({ email, reset_code: resetCode }),
        });
    }

    async resetPassword(email, resetCode, newPassword) {
        return this._fetch('/user/reset-password/', {
            method: 'POST',
            body: JSON.stringify({ email, reset_code: resetCode, new_password: newPassword }),
        });
    }

    async getUser(userId) {
        return this._fetch(`/user/${userId}/`);
    }

    async getCredits() {
        return this._fetch('/credits/');
    }

    async createCredit(creditData) {
        return this._fetch('/credits/', {
            method: 'POST',
            body: JSON.stringify(creditData),
        });
    }
    
    async getPymes() {
        return this._fetch('/pyme/');
    }
    
    async updateCreditStatus(creditId, status) {
        return this._fetch(`/admin/credits/${creditId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }
}
