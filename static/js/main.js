// Authentication and Portal Navigation
document.addEventListener('DOMContentLoaded', function() {
   
    // Login Button Click Event
    document.getElementById('loginButton').addEventListener('click', function() {
        const phoneNumber = document.getElementById('loginPhone').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Basic validation
        if (!phoneNumber || !password) {
            alert('Please enter both phone number and password');
            return;
        }
        
        // Create login data object
        const loginData = {
            phone_number: phoneNumber,
            password: password
        };
        
        // Disable button during request
        const loginButton = this;
        const originalText = loginButton.textContent;
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        
        // Send POST request to Flask backend
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Login successful! Welcome ' + data.user.full_name);
                
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Clear form
                document.getElementById('loginPhone').value = '';
                document.getElementById('loginPassword').value = '';
                
                // Redirect to dashboard or home page
                 window.location.href = '/profile';
                console.log('Login successful, redirected to profile');
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('Login failed. Please check your connection and try again.');
        })
        .finally(() => {
            // Re-enable button
            loginButton.disabled = false;
            loginButton.textContent = originalText;
        });
    });
    
    // Register Button Click Event
    document.getElementById('registerButton').addEventListener('click', function() {
        const fullName = document.getElementById('registerName').value.trim();
        const phoneNumber = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Basic validation
        if (!fullName || !phoneNumber || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        
        if (!/^\d{10}$/.test(phoneNumber)) {
            alert('Phone number must be 10 digits');
            return;
        }
        
        // Create user data object
        const userData = {
            full_name: fullName,
            phone_number: phoneNumber,
            password: password
        };
        
        // Disable button during request
        const registerButton = this;
        const originalText = registerButton.textContent;
        registerButton.disabled = true;
        registerButton.textContent = 'Registering...';
        
        // Send POST request to Flask backend
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Registration successful! You can now login.');
                
                // Clear form
                document.getElementById('registerName').value = '';
                document.getElementById('registerPhone').value = '';
                document.getElementById('registerPassword').value = '';
                document.getElementById('registerConfirmPassword').value = '';
                
                // Auto-fill login form
                document.getElementById('loginPhone').value = phoneNumber;
                
                console.log('Registration successful:', data.user);
            } else {
                alert('Registration failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
            alert('Registration failed. Please check your connection and try again.');
        })
        .finally(() => {
            // Re-enable button
            registerButton.disabled = false;
            registerButton.textContent = originalText;
        });
    });
    
    // Optional: Add Enter key support
    document.getElementById('loginPhone').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginButton').click();
        }
    });
    
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginButton').click();
        }
    });
    
    document.getElementById('registerConfirmPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('registerButton').click();
        }
    });
    
    // Optional: Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
        console.log('User is already logged in:', JSON.parse(user));
        // You could automatically redirect to dashboard here
        // window.location.href = '/dashboard.html';
    }
});
function sayHello() {
    alert("Hello from main.js!");
}

console.log("main.js loaded successfully");


document.addEventListener('DOMContentLoaded', function () {
            // Toggle sidebar on mobile
            document.querySelector('.toggle-sidebar').addEventListener('click', function() {
                document.querySelector('.sidebar').classList.toggle('show');
               // alert('toggle working on mobile');
                console.log('mobile toggle working');
                   if (!toggle || !sidebar) {
        console.warn('Sidebar elements not found');
        return;
        
    }
     toggle.addEventListener('click', function () {
        sidebar.classList.toggle('show');
    });

            }
            );
            
            // Initialize tab functionality for auth page
            const triggerTabList = [].slice.call(document.querySelectorAll('#authTabs button'));
            triggerTabList.forEach(function(triggerEl) {
                const tabTrigger = new bootstrap.Tab(triggerEl);
                triggerEl.addEventListener('click', function(event) {
                    event.preventDefault();
                    tabTrigger.show();

                });
            });
});
        
            
            // Contribute Button Click Event
            document.getElementById('contributeButton').addEventListener('click', function() {
                const amount = document.getElementById('contributionAmount').value;
                const type = document.getElementById('contributionType').value;
                
                if (!amount || amount <= 0) {
                    alert('Please enter a valid amount');
                    return;
                }
                
                alert('When we all agree & integrate payment, this would process a payment of UGX ' + amount + ' to your ' + (type === 'savings' ? 'personal savings' : 'emergency fund') + '.');
            });
            
            // Loan Application Button Click Event
            document.getElementById('applyLoanButton').addEventListener('click', function() {
                const amount = document.getElementById('loanAmount').value;
                const term = document.getElementById('loanTerm').value;
                const purpose = document.getElementById('loanPurpose').value;
                
                if (!amount || amount <= 0) {
                    alert('Please enter a valid loan amount');
                    return;
                }
                
                if (!purpose.trim()) {
                    alert('Please enter the purpose of the loan');
                    return;
                }
                
                alert('We dont give out loans yet as a group. In the event that we commence, this would submit a loan application for UGX ' + amount + ' to be repaid over ' + term + ' months.');
            });
            
            // Setup member row click event for members table (will be populated later)
            document.getElementById('membersTable').addEventListener('click', function(e) {
                const row = e.target.closest('tr');
                if (row && row.dataset.memberId) {
                    showMemberDetails(row.dataset.memberId);
                }
            });
       
        
        // Function to switch between sections
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the selected section
            document.getElementById(sectionId).style.display = 'block';
            
            // Update active link in sidebar
            document.querySelectorAll('.sidebar .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.sidebar .nav-link[onclick="showSection('${sectionId}')"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Load section specific data if needed
            switch(sectionId) {
                case 'dashboard':
                    fetchDashboardData();
                    break;
                case 'my-account':
                    fetchAccountData();
                    break;
                case 'savings':
                    fetchSavingsData();
                    break;
                case 'loans':
                    fetchLoanData();
                    break;
                case 'minutes':
                    fetchMinutesData();
                    break;
                case 'gallery':
                    fetchGalleryData();
                    break;
                case 'members':
                    fetchMembersData();
                    break;
            }
        }
        
        // Show authentication page
        function showAuthPage() {alert('backend not active');}
        //     document.getElementById('authentication-page').style.display = 'flex';
        //     document.getElementById('portal-page').style.display = 'none';
        // }
        
        // Show portal page
        function showPortalPage() { alert('Backend not activated');}
        //     document.getElementById('authentication-page').style.display = 'none';
        //     document.getElementById('portal-page').style.display = 'block';
        //     showSection('dashboard');
        // }
        
     
        
       
        // Global variable to store user data
let currentUser = null;

// Function to load user profile data
async function loadUserProfile() {
    try {
        const response = await fetch('/api/profile');
        
        if (response.status === 401) {
            // Not logged in, redirect to login
            window.location.href = '/auth';
            return;
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        currentUser = await response.json();
        
        // Update UI with user data
        updateUIWithUserData(currentUser);
        
        // Also load other data (savings, transactions, etc.)
        loadDashboardData();
        loadSavingsData();
        loadLoansData();
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        showError('Failed to load user data. Please try again.');
    }
}

// Function to update UI with user data
function updateUIWithUserData(user) {
    // Update navbar
   // document.getElementById('userNameDisplay').textContent = user.full_name || 'User';
    
    // Update My Account section
    document.getElementById('accountFullName').textContent = user.full_name || 'N/A';
    document.getElementById('accountPhone').textContent = user.phone_number || 'N/A';
    document.getElementById('accountMemberSince').textContent = 
        user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';
    document.getElementById('accountMemberId').textContent = user.id || 'N/A';
     document.getElementById('accountStatus').textContent = user.status || 'N/A';
    
    // Update subscription status
    const statusElement = document.getElementById('accountSubscriptionStatus');
    const statusIndicator = document.getElementById('subscriptionStatusIndicator');
    
    if (user.status === 'active') {
        statusElement.textContent = 'Active';
        statusIndicator.style.backgroundColor = '#28a745';
        statusElement.style.color = '#28a745';
    } else if (user.status === 'inactive') {
        statusElement.textContent = 'Inactive';
        statusIndicator.style.backgroundColor = '#dc3545';
        statusElement.style.color = '#dc3545';
    } else {
        statusElement.textContent = 'Pending';
        statusIndicator.style.backgroundColor = '#ffc107';
        statusElement.style.color = '#ffc107';
    }
    
    // Set subscription details
    document.getElementById('accountSubscriptionDetails').textContent = 
        `Member since ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}`;
    
    // Update last updated time
    document.getElementById('accountLastUpdated').textContent = new Date().toLocaleDateString();
}

// Function to load dashboard data
async function loadDashboardData() {
    try {
        // Fetch savings data
        const savingsResponse = await fetch('/api/savings');
        const savingsData = await savingsResponse.json();
        
        // Update dashboard with savings data
        document.getElementById('totalSavingsDisplay').textContent = 
            `UGX ${savingsData.total_savings?.toLocaleString() || '0'}`;
        document.getElementById('emergencyFundDisplay').textContent = 
            `UGX ${savingsData.emergency_fund?.toLocaleString() || '0'}`;
        document.getElementById('accountTotalSavings').textContent = 
            `UGX ${savingsData.total_savings?.toLocaleString() || '0'}`;
        
        // Fetch recent transactions
        const transactionsResponse = await fetch('/api/transactions/recent');
        const transactions = await transactionsResponse.json();
        
        updateTransactionsTable(transactions);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Function to update transactions table
function updateTransactionsTable(transactions) {
    const tableBody = document.getElementById('recentTransactionsTable');
    
    if (!transactions || transactions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No transactions found</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.description}</td>
            <td><span class="badge bg-${transaction.type === 'contribution' ? 'success' : 'info'}">
                ${transaction.type}
            </span></td>
            <td class="text-end">UGX ${transaction.amount.toLocaleString()}</td>
        </tr>
    `).join('');
}

// Updated function to show member details
async function showMemberDetails(memberId) {
    const modal = new bootstrap.Modal(document.getElementById('memberDetailsModal'));
    modal.show();
    
    // Show loading state
    document.getElementById('memberDetailsContent').innerHTML = `
        <div class="text-center py-3">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading member details...</p>
        </div>
    `;
    
    try {
        // Fetch member details from API
        const response = await fetch(`/api/members/${memberId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch member details: ${response.status}`);
        }
        
        const member = await response.json();
        
        // Update modal with member data
        document.getElementById('memberDetailsContent').innerHTML = `
            <div class="text-center mb-3">
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                     class="profile-image mb-3" alt="Member">
                <h4>${member.full_name}</h4>
                <p class="text-muted">Member ID: ${member.id}</p>
            </div>
            <div class="row mb-2">
                <div class="col-4 text-muted">Phone:</div>
                <div class="col-8">${member.phone_number || 'N/A'}</div>
            </div>
            <div class="row mb-2">
                <div class="col-4 text-muted">Member Since:</div>
                <div class="col-8">${member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div class="row mb-2">
                <div class="col-4 text-muted">Status:</div>
                <div class="col-8">
                    <span class="badge bg-${member.status === 'active' ? 'success' : 'warning'}">
                        ${member.status}
                    </span>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-4 text-muted">Email:</div>
                <div class="col-8">${member.email || 'N/A'}</div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading member details:', error);
        document.getElementById('memberDetailsContent').innerHTML = `
            <div class="alert alert-danger">
                Failed to load member details: ${error.message}
            </div>
        `;
    }
}

// Function to handle contributions
document.getElementById('contributeButton')?.addEventListener('click', async function() {
    const amount = document.getElementById('contributionAmount').value;
    const type = document.getElementById('contributionType').value;
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    try {
        const response = await fetch('/api/contributions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                type: type
            })
        });
        
        if (response.ok) {
            alert('Contribution successful!');
            // Reload savings data
            loadSavingsData();
            loadDashboardData();
            // Clear form
            document.getElementById('contributionAmount').value = '';
        } else {
            const error = await response.json();
            alert(`Failed to make contribution: ${error.error}`);
        }
    } catch (error) {
        console.error('Error making contribution:', error);
        alert('Failed to make contribution. Please try again.');
    }
});

// Function to load savings data
async function loadSavingsData() {
    try {
        const response = await fetch('/api/savings');
        const savingsData = await response.json();
        
        // Update savings section
        document.getElementById('personalSavingsDisplay').textContent = 
            `UGX ${savingsData.personal_savings?.toLocaleString() || '0'}`;
        document.getElementById('savingsEmergencyFundDisplay').textContent = 
            `UGX ${savingsData.emergency_fund?.toLocaleString() || '0'}`;
        
        // Load contribution history
        const contributionsResponse = await fetch('/api/contributions');
        const contributions = await contributionsResponse.json();
        
        updateContributionsTable(contributions);
        
    } catch (error) {
        console.error('Error loading savings data:', error);
    }
}

// Function to update contributions table
function updateContributionsTable(contributions) {
    const tableBody = document.getElementById('contributionsTable');
    
    if (!contributions || contributions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No contributions found</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = contributions.map(contribution => `
        <tr>
            <td>${new Date(contribution.date).toLocaleDateString()}</td>
            <td>${contribution.type === 'savings' ? 'Personal Savings' : 'Emergency Fund'}</td>
            <td>${contribution.method || 'Manual'}</td>
            <td class="text-end">UGX ${contribution.amount.toLocaleString()}</td>
        </tr>
    `).join('');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Show the portal page (remove display: none from HTML)
    document.getElementById('portal-page').style.display = 'block';
    
    // Load user data
    loadUserProfile();
    
    // Set up sidebar toggle
    document.querySelector('.toggle-sidebar')?.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('show');
    });
    
    // Set up logout functionality
    document.getElementById('logoutButton')?.addEventListener('click', logout);
    document.getElementById('sidebarLogout')?.addEventListener('click', logout);
    
    // Initialize section switching
    initializeSectionSwitching();
});

// Function to handle logout
async function logout() {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/auth';
        }
    } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = '/auth';
    }
}

// Function to initialize section switching
function initializeSectionSwitching() {
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active class
            document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 576) {
                document.querySelector('.sidebar').classList.remove('show');
            }
        });
    });
}

// Function to show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        
        // Load section-specific data if needed
        switch(sectionId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'savings':
                loadSavingsData();
                break;
            case 'members':
                loadMembersList();
                break;
        }
    }
}

// Function to load members list
async function loadMembersList() {
    try {
        const response = await fetch('/api/members');
        const members = await response.json();
        
        updateMembersTable(members);
        
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

// Function to update members table
function updateMembersTable(members) {
    const tableBody = document.getElementById('membersTable');
    
    if (!members || members.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No members found</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = members.map(member => `
        <tr class="member-row" onclick="showMemberDetails(${member.id})">
            <td>${member.full_name}</td>
            <td>${member.id}</td>
            <td>${member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'}</td>
            <td>
                <span class="badge bg-${member.status === 'active' ? 'success' : 'warning'}">
                    ${member.status}
                </span>
            </td>
        </tr>
    `).join('');
}
        
        // // API Data Fetch Functions
        // function fetchDashboardData() {
        //     // These would be real API calls in the full version
            
        //     // Update summary cards
        //     setTimeout(() => {
        //         document.getElementById('totalSavingsDisplay').textContent = 'UGX 120,000';
        //         document.getElementById('emergencyFundDisplay').textContent = 'UGX 30,000';
        //         document.getElementById('subscriptionStatusDisplay').textContent = 'Active';
        //     }, 1000);
            
        //     // Update recent transactions
        //     setTimeout(() => {
        //         document.getElementById('recentTransactionsTable').innerHTML = `
        //             <tr>
        //                 <td>2023-11-15</td>
        //                 <td>Monthly Contribution</td>
        //                 <td><span class="badge bg-primary">Savings</span></td>
        //                 <td class="text-end">UGX 5,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-11-02</td>
        //                 <td>Emergency Fund</td>
        //                 <td><span class="badge bg-success">Deposit</span></td>
        //                 <td class="text-end">UGX 2,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-10-15</td>
        //                 <td>Monthly Contribution</td>
        //                 <td><span class="badge bg-primary">Savings</span></td>
        //                 <td class="text-end">UGX 5,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-09-30</td>
        //                 <td>Loan Repayment</td>
        //                 <td><span class="badge bg-warning text-dark">Payment</span></td>
        //                 <td class="text-end">UGX 8,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-09-15</td>
        //                 <td>Monthly Contribution</td>
        //                 <td><span class="badge bg-primary">Savings</span></td>
        //                 <td class="text-end">UGX 5,000</td>
        //             </tr>
        //         `;
        //     }, 1500);
        // }
        
        // function fetchAccountData() {
        //     setTimeout(() => {
        //         document.getElementById('accountFullName').textContent = 'aarons';
        //         document.getElementById('accountPhone').textContent = '+256 712 345 678';
        //         document.getElementById('accountMemberSince').textContent = 'January 2025';
        //         document.getElementById('accountMemberId').textContent = 'KHS2014-001';
        //         document.getElementById('accountSubscriptionStatus').textContent = 'Active';
        //         document.getElementById('subscriptionStatusIndicator').style.backgroundColor = '#28a745';
        //         document.getElementById('accountSubscriptionDetails').textContent = 'Your membership is active and in good standing. Next payment due: December 15, 2023';
        //         document.getElementById('accountTotalSavings').textContent = 'USh 120,000';
        //         document.getElementById('accountLastUpdated').textContent = 'November 15, 2023';
        //     }, 1000);
        // }
        
        // function fetchSavingsData() {
        //     // Update savings summary
        //     setTimeout(() => {
        //         document.getElementById('personalSavingsDisplay').textContent = 'UGX 120,000';
        //         document.getElementById('savingsEmergencyFundDisplay').textContent = 'UGX 30,000';
        //     }, 1000);
            
        //     // Update contribution history
        //     setTimeout(() => {
        //         document.getElementById('contributionsTable').innerHTML = `
        //             <tr>
        //                 <td>2023-11-15</td>
        //                 <td><span class="badge bg-primary">Personal Savings</span></td>
        //                 <td>M-Pesa</td>
        //                 <td class="text-end">UGX 5,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-11-02</td>
        //                 <td><span class="badge bg-success">Emergency Fund</span></td>
        //                 <td>Bank Transfer</td>
        //                 <td class="text-end">UGX 2,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-10-15</td>
        //                 <td><span class="badge bg-primary">Personal Savings</span></td>
        //                 <td>M-Pesa</td>
        //                 <td class="text-end">UGX 5,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-09-15</td>
        //                 <td><span class="badge bg-primary">Personal Savings</span></td>
        //                 <td>M-Pesa</td>
        //                 <td class="text-end">UGX 5,000</td>
        //             </tr>
        //             <tr>
        //                 <td>2023-08-15</td>
        //                 <td><span class="badge bg-primary">Personal Savings</span></td>
        //                 <td>M-Pesa</td>
        //                 <td class="text-end">UGX 5,000</td>
        //             </tr>
        //         `;
        //     }, 1500);
        // }
        
        // function fetchLoanData() {
        //     // Update loan eligibility
        //     setTimeout(() => {
        //         document.getElementById('loanEligibilityAmount').textContent = 'UGX 240,000';
        //         document.getElementById('loanEligibilityMessage').textContent = 'Based on your savings (UGX 120,000) and account history';
        //     }, 1000);
            
        //     // Update active loans
        //     setTimeout(() => {
        //         document.getElementById('activeLoansContainer').innerHTML = `
        //             <div class="card mb-3 border-primary">
        //                 <div class="card-body">
        //                     <div class="d-flex justify-content-between">
        //                         <h5 class="card-title">Active Loan</h5>
        //                         <span class="badge bg-primary">Active</span>
        //                     </div>
        //                     <p class="card-text">Original Amount: UGX 50,000</p>
        //                     <div class="row text-center mt-3">
        //                         <div class="col-4">
        //                             <p class="text-muted mb-0">Remaining</p>
        //                             <h5>UGX 32,000</h5>
        //                         </div>
        //                         <div class="col-4">
        //                             <p class="text-muted mb-0">Next Payment</p>
        //                             <h5>Dec 15, 2023</h5>
        //                         </div>
        //                         <div class="col-4">
        //                             <p class="text-muted mb-0">Monthly</p>
        //                             <h5>UGX 8,000</h5>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         `;
        //     }, 1200);
            
        //     // Update loan history
        //     setTimeout(() => {
        //         document.getElementById('loanHistoryTable').innerHTML = `
        //             <tr>
        //                 <td>2023-08-10</td>
        //                 <td>UGX 50,000</td>
        //                 <td>6 months</td>
        //                 <td><span class="badge bg-primary">Active</span></td>
        //                 <td class="text-end"><button class="btn btn-sm btn-outline-primary">View Details</button></td>
        //             </tr>
        //             <tr>
        //                 <td>2023-02-05</td>
        //                 <td>UGX 30,000</td>
        //                 <td>3 months</td>
        //                 <td><span class="badge bg-success">Completed</span></td>
        //                 <td class="text-end"><button class="btn btn-sm btn-outline-primary">View Details</button></td>
        //             </tr>
        //             <tr>
        //                 <td>2022-07-20</td>
        //                 <td>UGX 100,000</td>
        //                 <td>12 months</td>
        //                 <td><span class="badge bg-success">Completed</span></td>
        //                 <td class="text-end"><button class="btn btn-sm btn-outline-primary">View Details</button></td>
        //             </tr>
        //         `;
        //     }, 1500);
        // }
        
        // function fetchMinutesData() {
        //     setTimeout(() => {
        //         document.getElementById('minutesTable').innerHTML = `
        //             <tr>
        //                 <td>2023-11-05</td>
        //                 <td>November Monthly Meeting Minutes</td>
        //                 <td>420 KB</td>
        //                 <td class="text-end"><button class="btn btn-sm btn-primary"><i class="bi bi-download"></i> Download</button></td>
        //             </tr>
        //             <tr>
        //                 <td>2023-10-01</td>
        //                 <td>October Monthly Meeting Minutes</td>
        //                 <td>385 KB</td>
        //                 <td class="text-end"><button class="btn btn-sm btn-primary"><i class="bi bi-download"></i> Download</button></td>
        //             </tr>
        //             <tr>
        //                 <td>2023-09-03</td>
        //                 <td>September Monthly Meeting Minutes</td>
        //                 <td>410 KB</td>
        //                 <td class="text-end"><button class="btn btn-sm btn-primary"><i class="bi bi-download"></i> Download</button></td>
        //             </tr>
        //             <tr>
        //                 <td>2023-08-06</td>
        //                 <td>August Monthly Meeting Minutes</td>
        //                 <td>390 KB</td>
        //                 <td class="text-end"><button class="btn btn-sm btn-primary"><i class="bi bi-download"></i> Download</button></td>
        //             </tr>
        //             <tr>
        //                 <td>2023-07-02</td>
        //                 <td>July Monthly Meeting Minutes</td>
        //                 <td>405 KB</td>
        //                 <td class="text-end"><button class="btn btn-sm btn-primary"><i class="bi bi-download"></i> Download</button></td>
        //             </tr>
        //         `;
        //     }, 1000);
        // }
        
        // function fetchGalleryData() {
        //     setTimeout(() => {
        //         document.getElementById('galleryContainer').innerHTML = `
        //             <div class="col-md-4 col-6 gallery-item">
        //                 <img src="https://cdn.pixabay.com/photo/2015/11/06/15/13/internet-1029756_1280.jpg" class="img-fluid" alt="Team Meeting">
        //                 <div class="mt-2">
        //                     <h6>Annual General Meeting 2023</h6>
        //                     <p class="text-muted small">March 15, 2023</p>
        //                 </div>
        //             </div>
        //             <div class="col-md-4 col-6 gallery-item">
        //                 <img src="https://cdn.pixabay.com/photo/2017/07/31/11/44/laptop-2557576_1280.jpg" class="img-fluid" alt="WorUGXop">
        //                 <div class="mt-2">
        //                     <h6>Financial Literacy WorUGXop</h6>
        //                     <p class="text-muted small">February 22, 2023</p>
        //                 </div>
        //             </div>
        //             <div class="col-md-4 col-6 gallery-item">
        //                 <img src="https://cdn.pixabay.com/photo/2017/08/06/20/11/wedding-2596803_1280.jpg" class="img-fluid" alt="Community Event">
        //                 <div class="mt-2">
        //                     <h6>Community Service Day</h6>
        //                     <p class="text-muted small">January 28, 2023</p>
        //                 </div>
        //             </div>
        //             <div class="col-md-4 col-6 gallery-item">
        //                 <img src="https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg" class="img-fluid" alt="Executive Meeting">
        //                 <div class="mt-2">
        //                     <h6>Executive Committee Meeting</h6>
        //                     <p class="text-muted small">December 10, 2022</p>
        //                 </div>
        //             </div>
        //             <div class="col-md-4 col-6 gallery-item">
        //                 <img src="https://cdn.pixabay.com/photo/2016/03/09/09/22/workplace-1245776_1280.jpg" class="img-fluid" alt="Planning Session">
        //                 <div class="mt-2">
        //                     <h6>2023 Planning Session</h6>
        //                     <p class="text-muted small">November 26, 2022</p>
        //                 </div>
        //             </div>
        //             <div class="col-md-4 col-6 gallery-item">
        //                 <img src="https://cdn.pixabay.com/photo/2015/07/02/10/23/training-828741_1280.jpg" class="img-fluid" alt="Team Building">
        //                 <div class="mt-2">
        //                     <h6>Team Building Activity</h6>
        //                     <p class="text-muted small">October 15, 2022</p>
        //                 </div>
        //             </div>
        //         `;
        //     }, 1500);
        // }
        
        // function fetchMembersData() {
        //     setTimeout(() => {
        //         document.getElementById('membersTable').innerHTML = `
        //             <tr class="member-row" data-member-id="KHS2014-001">
        //                 <td>Arons</td>
        //                 <td>KHS2014-001</td>
        //                 <td>January 2014</td>
        //                 <td><span class="badge bg-success">Active</span></td>
        //             </tr>
        //             <tr class="member-row" data-member-id="KHS2014-002">
        //                 <td>Jane Smith</td>
        //                 <td>KHS2014-002</td>
        //                 <td>January 2014</td>
        //                 <td><span class="badge bg-success">Active</span></td>
        //             </tr>
        //             <tr class="member-row" data-member-id="KHS2014-003">
        //                 <td>Michael Johnson</td>
        //                 <td>KHS2014-003</td>
        //                 <td>February 2014</td>
        //                 <td><span class="badge bg-success">Active</span></td>
        //             </tr>
        //             <tr class="member-row" data-member-id="KHS2014-004">
        //                 <td>Sarah Williams</td>
        //                 <td>KHS2014-004</td>
        //                 <td>February 2014</td>
        //                 <td><span class="badge bg-warning text-dark">On Leave</span></td>
        //             </tr>
        //             <tr class="member-row" data-member-id="KHS2014-005">
        //                 <td>David Brown</td>
        //                 <td>KHS2014-005</td>
        //                 <td>March 2014</td>
        //                 <td><span class="badge bg-success">Active</span></td>
        //             </tr>
        //             <tr class="member-row" data-member-id="KHS2014-006">
        //                 <td>Emily Davis</td>
        //                 <td>KHS2014-006</td>
        //                 <td>March 2014</td>
        //                 <td><span class="badge bg-secondary">Inactive</span></td>
        //             </tr>
        //             <tr class="member-row" data-member-id="KHS2014-007">
        //                 <td>Robert Wilson</td>
        //                 <td>KHS2014-007</td>
        //                 <td>April 2014</td>
        //                 <td><span class="badge bg-success">Active</span></td>
        //             </tr>
        //             <tr class="member-row" data-member-id="KHS2014-008">
        //                 <td>Jennifer Taylor</td>
        //                 <td>KHS2014-008</td>
        //                 <td>April 2014</td>
        //                 <td><span class="badge bg-success">Active</span></td>
        //             </tr>
        //         `;
        //     }, 1000);
        // }
