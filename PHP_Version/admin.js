// --- UTILITY FOR LOCAL DATE STRING ---
function getLocalDateString(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// --- DATASETS (DEFAULT CONFIG) ---
const defaultFees = {
    "Graphic Design": 8000,
    "Basic Computer": 4000,
    "Spoken English": 5000
};

const defaultBatches = [
    { course: "Graphic Design", name: "GD-01", fee: 8000, discount: 1500, time: "09:00 AM - 10:30 AM", schedule: ["Sat", "Mon", "Wed"], startDate: "2026-06-01", endDate: "2026-08-31" },
    { course: "Graphic Design", name: "GD-02", fee: 8000, discount: 1000, time: "04:00 PM - 05:30 PM", schedule: ["Sun", "Tue", "Thu"], startDate: "2026-06-01", endDate: "2026-08-31" },
    { course: "Basic Computer", name: "BC-01", fee: 4000, discount: 500, time: "11:00 AM - 12:30 PM", schedule: ["Sat", "Mon", "Wed"], startDate: "2026-06-01", endDate: "2026-07-31" },
    { course: "Basic Computer", name: "BC-02", fee: 4000, discount: 0, time: "02:30 PM - 04:00 PM", schedule: ["Sun", "Tue", "Thu"], startDate: "2026-06-01", endDate: "2026-07-31" },
    { course: "Spoken English", name: "SE-01", fee: 5000, discount: 800, time: "11:00 AM - 12:30 PM", schedule: ["Sat", "Mon", "Wed"], startDate: "2026-06-01", endDate: "2026-07-31" },
    { course: "Spoken English", name: "SE-02", fee: 5000, discount: 0, time: "06:00 PM - 07:30 PM", schedule: ["Sun", "Tue", "Thu"], startDate: "2026-06-01", endDate: "2026-07-31" }
];

let students = [];
let settings = {};
let activeStudentForFees = null;
let dashboardDateRange = { type: 'today', start: null, end: null };
let studentsDateRange = { type: 'all', start: null, end: null };
let invoicesDateRange = { type: 'all', start: null, end: null };
let collectDueDateRange = { type: 'all', start: null, end: null };
let collectDueMonthFilter = 'all';
let collectDueCourseFilter = '';
let collectDueBatchFilter = '';
let bookStock = 0;
let batchStatusFilter = 'active'; // Filter state: 'active' or 'all'
let activeDashboardSubTab = 'registrations';
let isEditBatchMode = false;
let isInitialLoad = true;
let inquiries = [];
let tasks = [];
let inquiriesFilter = 'all';
let currentTaskFilter = 'all';
let currentTaskAssigneeFilter = 'all';
let activeBatchForEdit = null;
let explorerSelectedMonth = '';
let explorerSelectedBatchCourse = '';
let explorerSelectedBatch = '';


// --- DOM ELEMENTS ---
const authGate = document.getElementById('auth-gate');
const portalContent = document.getElementById('portal-content');
const authForm = document.getElementById('auth-form');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const toggleAuthPwd = document.getElementById('toggle-auth-pwd');

const navLogo = document.getElementById('sidebar-logo-img');
const authLogo = document.getElementById('auth-logo');

const logoutBtn = document.getElementById('logout-btn');
const adminThemeToggle = document.getElementById('admin-theme-toggle');
const activeTabTitle = document.getElementById('active-tab-title');
const activeTabSubtitle = document.getElementById('active-tab-subtitle');

// Tab Navigation Items
const sidebarItems = document.querySelectorAll('.sidebar-item');
const tabViews = document.querySelectorAll('.tab-view');

// Stats Elements
const statTotalStudents = document.getElementById('stat-total-students');
const statEarnings = document.getElementById('stat-earnings');
const statDues = document.getElementById('stat-dues');
const statCerts = document.getElementById('stat-certs');

// Data Lists
const recentEnrollmentsTbody = document.getElementById('recent-enrollments-tbody');
const studentsTbody = document.getElementById('students-tbody');
const invoicesTbody = document.getElementById('invoices-tbody');
const certsTbody = document.getElementById('certs-tbody');

// Searching & Filtering
const studentSearch = document.getElementById('student-search');
const filterCourse = document.getElementById('filter-course');
const filterStatus = document.getElementById('filter-status');
const invoiceSearch = document.getElementById('invoice-search');
const invoiceTypeFilter = document.getElementById('invoice-type-filter');
const certSearch = document.getElementById('cert-search');

// Student Form Modal
const studentModal = document.getElementById('student-modal');
const studentModalTitle = document.getElementById('student-modal-title');
const studentForm = document.getElementById('student-form');
const studentIdField = document.getElementById('student-id-field');
const studentCourse = document.getElementById('student-course');
const studentBatch = document.getElementById('student-batch');
const studentName = document.getElementById('student-name');
const studentPhone = document.getElementById('student-phone');
const studentFather = document.getElementById('student-father');
const studentMother = document.getElementById('student-mother');
const studentGuardianPhone = document.getElementById('student-guardian-phone');
const studentAddress = document.getElementById('student-address');
const studentFeeTotal = document.getElementById('student-fee-total');
const studentFeeDiscount = document.getElementById('student-fee-discount');
const studentFeeNet = document.getElementById('student-fee-net');
const studentFeePaid = document.getElementById('student-fee-paid');
const studentFinancialFields = document.getElementById('student-financial-fields');
const studentFormSubmitBtn = document.getElementById('student-form-submit-btn');

const adminAddStudentBtn = document.getElementById('admin-add-student-btn');
const dashboardAddStudentBtn = document.getElementById('dashboard-add-student-btn');

// Fees Billing Modal
const feesModal = document.getElementById('fees-modal');
const feesStudentName = document.getElementById('fees-student-name');
const feesStudentId = document.getElementById('fees-student-id');
const feesStudentCourse = document.getElementById('fees-student-course');
const feesTotalVal = document.getElementById('fees-total-val');
const feesPaidVal = document.getElementById('fees-paid-val');
const feesDueVal = document.getElementById('fees-due-val');
const paymentForm = document.getElementById('payment-form');
const paymentAmount = document.getElementById('payment-amount');
const feesLedgerTbody = document.getElementById('fees-ledger-tbody');
const waiveDuesSection = document.getElementById('waive-dues-section');
const waiveCourseSelect = document.getElementById('waive-course-select');
const waiveAmount = document.getElementById('waive-amount');
const waiveSubmitBtn = document.getElementById('waive-submit-btn');
const waiveAllBtn = document.getElementById('waive-all-btn');

// Settings Forms
const settingsDetailsForm = document.getElementById('settings-details-form');
const settingsPhone = document.getElementById('settings-phone');
const settingsAddress = document.getElementById('settings-address');
const settingsPriceGraphic = document.getElementById('settings-price-graphic');
const settingsPriceBasic = document.getElementById('settings-price-basic');
const settingsPriceEnglish = document.getElementById('settings-price-english');
const settingsLogoLight = document.getElementById('settings-logo-light');
const settingsLogoDark = document.getElementById('settings-logo-dark');

// Settings Batch Management Forms
const addBatchForm = document.getElementById('add-batch-form');
const batchCourseSelect = document.getElementById('batch-course-select');
const batchNameInput = document.getElementById('batch-name-input');
const batchFeeInput = document.getElementById('batch-fee-input');
const batchDiscountInput = document.getElementById('batch-discount-input');
const settingsBatchesTbody = document.getElementById('settings-batches-tbody');

const settingsPasswordForm = document.getElementById('settings-password-form');
const settingsAdminEmail = document.getElementById('settings-admin-email');
const settingsAdminRecoveryEmail = document.getElementById('settings-admin-recovery-email');
const settingsPwdCurrent = document.getElementById('settings-pwd-current');
const settingsPwdNew = document.getElementById('settings-pwd-new');

// Email Gateway Settings Elements
const settingsEmailForm = document.getElementById('settings-email-form');
const settingsEmailProvider = document.getElementById('settings-email-provider');
const emailjsFields = document.getElementById('emailjs-fields');
const settingsEmailjsPublicKey = document.getElementById('settings-emailjs-public-key');
const settingsEmailjsServiceId = document.getElementById('settings-emailjs-service-id');
const settingsEmailjsTemplateId = document.getElementById('settings-emailjs-template-id');

// Recovery Modal Elements
const forgotPwdLink = document.getElementById('forgot-pwd-link');
const forgotPwdModal = document.getElementById('forgot-pwd-modal');
const recoveryStep1 = document.getElementById('recovery-step-1');
const recoveryStep2 = document.getElementById('recovery-step-2');
const recoveryStep3 = document.getElementById('recovery-step-3');
const recoveryEmail = document.getElementById('recovery-email');
const recoveryBtnNext = document.getElementById('recovery-btn-next');
const recoveryEmailOption = document.getElementById('recovery-email-option');
const recoverySendEmailBtn = document.getElementById('recovery-send-email-btn');
const recoveryOtpContainer = document.getElementById('recovery-otp-container');
const recoveryOtp = document.getElementById('recovery-otp');
const maskedRecoveryEmail = document.getElementById('masked-recovery-email');
const recoveryVerifyBtn = document.getElementById('recovery-verify-btn');
const recoveryPwdNew = document.getElementById('recovery-pwd-new');
const recoveryPwdConfirm = document.getElementById('recovery-pwd-confirm');
const recoveryPwdError = document.getElementById('recovery-pwd-error');
const recoveryBtnSave = document.getElementById('recovery-btn-save');

// DB backup
const dbExportBtn = document.getElementById('db-export-btn');
const dbImportFile = document.getElementById('db-import-file');

const printZone = document.getElementById('print-zone');

// --- PORTAL INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 1. Load Local Database first (initializes settings.users database)
        loadDatabase();
    migrateLegacyStudentIds();

    // 2. Check Session Token (user permissions only)
    if (sessionStorage.getItem('ediz_admin_auth') === 'true') {
        unlockDashboard();
        const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user'));
        if (activeUser) applyUserPermissions(activeUser);
    }

    // 3. Setup Interface Theme
    const savedTheme = localStorage.getItem('ediz_theme') || 'light';
    applyTheme(savedTheme);

    // 4. Register Event Listeners
    setupAuthentication();
    setupTabSwitching();
    setupModals();
    setupDataOperations();
    setupSearchFilters();
    setupBatchesView();
    setupBatchModal();
    setupSmsFeature();
    setupEmailFeature();
    setupDashboardFilters();
    setupDueLookupFeature();
    setupBooksFeature();
    setupWhatsAppFeature();
    setupExportFeatures();
    setupDashboardSubTabs();
    setupDashboardSearch();
    setupStudentNotesFeature();
    setupRegistrationPage();
    defaultCollectorInputs();
    setupHandoverBoardFeature();
    setupDuesExplorerListeners();
    setupTeacherPayoutsFeature();

    // 5. New Requirements Listeners & Renders
    setupGlobalSearch();
    setupPageDateFilters();
    applyStudentIdAutoFormat(document.getElementById('student-id-field'));
    renderDashboardAlerts();
    setupMobileNav();
    initTableResponsiveObserver();
    setupBillingFormFeatures();

    // 6. Restore active tab after event handlers have been registered
    if (sessionStorage.getItem('ediz_admin_auth') === 'true') {
        let savedTab = localStorage.getItem('ediz_active_tab') || 'dashboard';
        const hash = window.location.hash.substring(1);
        if (hash) {
            const matchingTab = document.querySelector(`.sidebar-item[data-tab="${hash}"]`);
            if (matchingTab) {
                savedTab = hash;
            }
        }
        if (!hasTabAccess(savedTab)) {
            savedTab = 'dashboard';
            window.location.hash = 'dashboard';
        }
        const tabBtn = document.querySelector(`.sidebar-item[data-tab="${savedTab}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }
    } catch (error) {
        console.error("Initialization Error:", error);
        alert("Portal load error: " + error.message + "\nStack: " + error.stack);
    }
});

// --- AUTHENTICATION GATE ---
function setupAuthentication() {
    const authCredentialsSection = document.getElementById('auth-credentials-section');
    const authOtpSection = document.getElementById('auth-otp-section');
    const authOtpInput = document.getElementById('auth-otp');
    const otpError = document.getElementById('otp-error');
    const otpPhoneMasked = document.getElementById('otp-phone-masked');
    const authVerifyBtn = document.getElementById('auth-verify-btn');
    const authBackBtn = document.getElementById('auth-back-btn');

    let currentOtp = null;
    let pendingUser = null;

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailEl = document.getElementById('auth-email');
        const enteredEmail = emailEl ? emailEl.value.trim() : 'owner@ediz.com';
        const enteredPassword = authPassword.value;

        // Retrieve users from settings database
        let users = settings.users || [];
        let matchedUser = users.find(u => u.email === enteredEmail && u.password === enteredPassword);

        // Fallback check if credentials match owner@ediz.com and default adminPassword (or admin123)
        if (!matchedUser) {
            const defaultOwnerPass = settings.adminPassword || "admin123";
            if (enteredEmail === "owner@ediz.com" && enteredPassword === defaultOwnerPass) {
                matchedUser = {
                    id: "USER-1",
                    email: "owner@ediz.com",
                    password: defaultOwnerPass,
                    role: "Owner",
                    permissions: { canEdit: true, canDelete: true, canInvoice: true, canCert: true, canCreateBatch: true }
                };
            }
        }

        // If still not matched, fetch fresh database from server to update local storage
        if (!matchedUser) {
            try {
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const fetchUrl = isLocalhost ? 'database.json' : 'api.php';
                const res = await fetch(fetchUrl);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.settings) {
                        settings = data.settings;
                        localStorage.setItem('ediz_settings', JSON.stringify(settings));
                        users = settings.users || [];
                        matchedUser = users.find(u => u.email === enteredEmail && u.password === enteredPassword);
                    }
                }
            } catch (err) {
                console.warn("Failed to fetch fresh settings during login:", err);
            }
        }
        
        // Auto initialize settings users if missing
        if ((!settings.users || settings.users.length === 0) && matchedUser) {
            const defaultOwnerPass = settings.adminPassword || "admin123";
            settings.users = [
                { id: "USER-1", email: "owner@ediz.com", password: defaultOwnerPass, role: "Owner", permissions: { canEdit: true, canDelete: true, canInvoice: true, canCert: true, canCreateBatch: true } },
                { id: "USER-2", email: "staff@ediz.com", password: "staff123", role: "Staff", permissions: { canEdit: true, canDelete: false, canInvoice: true, canCert: false, canCreateBatch: false } }
            ];
            localStorage.setItem('ediz_settings', JSON.stringify(settings));
        }

        if (matchedUser) {
            authError.style.display = 'none';
            
            const targetPhone = matchedUser.phone || settings.phone;
            const hasSmsConfig = settings.smsConfig?.apiKey && settings.smsConfig?.senderId;

            // If SMS is configured and user/institute has a phone number, trigger OTP
            if (hasSmsConfig && targetPhone) {
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                currentOtp = otpCode;
                pendingUser = matchedUser;

                // Send OTP via SMS
                const otpMsg = `EDIZ IT Portal verification code: ${otpCode}. Valid for 3 minutes.`;
                sendGeneralSms(targetPhone, otpMsg, "Portal Login OTP Verification");

                // Mask the phone
                const maskPhone = (ph) => {
                    const s = String(ph || '').trim();
                    if (s.length < 6) return s;
                    return s.substring(0, 3) + '*****' + s.substring(s.length - 3);
                };
                if (otpPhoneMasked) {
                    otpPhoneMasked.innerText = maskPhone(targetPhone);
                }

                // Show OTP view
                if (authCredentialsSection) authCredentialsSection.style.display = 'none';
                if (authOtpSection) authOtpSection.style.display = 'block';
                if (authOtpInput) {
                    authOtpInput.value = '';
                    authOtpInput.focus();
                }
                if (otpError) otpError.style.display = 'none';
            } else {
                // Bypass OTP if SMS configuration or phone is missing
                completeLogin(matchedUser);
            }
        } else {
            authError.style.display = 'block';
            authPassword.value = '';
        }
    });

    function completeLogin(user) {
        sessionStorage.setItem('ediz_admin_auth', 'true');
        sessionStorage.setItem('ediz_active_user', JSON.stringify(user));
        unlockDashboard();
        applyUserPermissions(user);
        
        // Restore active tab
        const savedTab = localStorage.getItem('ediz_active_tab') || 'dashboard';
        const tabBtn = document.querySelector(`.sidebar-item[data-tab="${savedTab}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }

    if (authVerifyBtn) {
        authVerifyBtn.addEventListener('click', () => {
            const enteredOtp = authOtpInput ? authOtpInput.value.trim() : '';
            if (enteredOtp && enteredOtp === currentOtp) {
                if (otpError) otpError.style.display = 'none';
                completeLogin(pendingUser);
            } else {
                if (otpError) otpError.style.display = 'block';
                if (authOtpInput) {
                    authOtpInput.value = '';
                    authOtpInput.focus();
                }
            }
        });
    }

    if (authBackBtn) {
        authBackBtn.addEventListener('click', () => {
            currentOtp = null;
            pendingUser = null;
            if (authCredentialsSection) authCredentialsSection.style.display = 'block';
            if (authOtpSection) authOtpSection.style.display = 'none';
            authPassword.value = '';
            authPassword.focus();
        });
    }

    const devBypassBtn = document.getElementById('dev-bypass-btn');
    if (devBypassBtn && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        devBypassBtn.style.display = 'inline-flex';
        devBypassBtn.addEventListener('click', () => {
            const usersList = settings.users || [];
            const ownerUser = usersList.find(u => u.role === 'Owner') || {
                id: "USER-1",
                email: "owner@ediz.com",
                password: "admin123",
                role: "Owner",
                permissions: { canEdit: true, canDelete: true, canInvoice: true, canCert: true, canCreateBatch: true }
            };
            completeLogin(ownerUser);
        });
    }

    toggleAuthPwd.addEventListener('click', () => {
        const type = authPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        authPassword.setAttribute('type', type);
        toggleAuthPwd.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    });

    const handleLogout = () => {
        sessionStorage.removeItem('ediz_admin_auth');
        sessionStorage.removeItem('ediz_active_user');
        window.location.reload();
    };
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
}

    // Dues Waiving Listeners (Admins/Owners only)
    if (waiveSubmitBtn) {
        waiveSubmitBtn.addEventListener('click', () => {
            if (!activeStudentForFees) return;
            const selectId = waiveCourseSelect.value;
            const waiveVal = parseInt(waiveAmount.value);
            if (isNaN(waiveVal) || waiveVal <= 0) {
                alert("Please enter a valid positive waive amount.");
                return;
            }
            
            const record = students.find(s => s.id === selectId);
            if (!record) return;
            
            if (waiveVal > record.dueFee) {
                alert(`Error: You cannot waive more than the outstanding course due of ৳${record.dueFee.toLocaleString()}.`);
                return;
            }
            
            // Apply waive (convert due into discount)
            record.discountFee = (record.discountFee || 0) + waiveVal;
            record.netFee = (record.netFee !== undefined ? record.netFee : record.totalFee) - waiveVal;
            record.dueFee -= waiveVal;
            record.status = record.paidFee >= record.netFee ? 'Paid' : 'Partial';
            
            // Pushing waive invoice transaction
            if (!record.invoices) record.invoices = [];
            record.invoices.push({
                id: getNextInvoiceId(),
                date: getLocalDateString(),
                amount: 0,
                waivedAmount: waiveVal,
                paymentType: 'Dues Waived'
            });
            
            saveDatabase();
            renderPaymentModal(activeStudentForFees.id);
            alert(`৳${waiveVal.toLocaleString()} due amount waived successfully for ${record.course}.`);
        });
    }

    if (waiveAllBtn) {
        waiveAllBtn.addEventListener('click', () => {
            if (!activeStudentForFees) return;
            if (!confirm("Are you sure you want to waive all outstanding dues for this student? This will discount their dues to zero.")) return;
            
            const currentRegId = activeStudentForFees.registrationId;
            const allStudentRecords = students.filter(s => s.registrationId === currentRegId);
            
            let waivedTotal = 0;
            allStudentRecords.forEach(record => {
                if (record.dueFee > 0) {
                    const waiveVal = record.dueFee;
                    record.discountFee = (record.discountFee || 0) + waiveVal;
                    record.netFee = (record.netFee !== undefined ? record.netFee : record.totalFee) - waiveVal;
                    record.dueFee = 0;
                    record.status = 'Paid';
                    
                    if (!record.invoices) record.invoices = [];
                    record.invoices.push({
                        id: getNextInvoiceId(),
                        date: getLocalDateString(),
                        amount: 0,
                        waivedAmount: waiveVal,
                        paymentType: 'Dues Waived'
                    });
                    
                    waivedTotal += waiveVal;
                }
            });
            
            if (waivedTotal > 0) {
                saveDatabase();
                renderPaymentModal(activeStudentForFees.id);
                alert(`All outstanding dues (Total: ৳${waivedTotal.toLocaleString()}) have been waived successfully.`);
            } else {
                alert("Student has no outstanding dues to waive.");
            }
        });
    }

    // --- PASSWORD RECOVERY LOGIC ---
    let generatedOTP = '';
    let targetOwner = null;

    const maskEmail = (email) => {
        if (!email) return "";
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        const [user, domain] = parts;
        if (user.length <= 2) return `${user[0]}*@${domain}`;
        return `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
    };

    if (forgotPwdLink) {
        forgotPwdLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Reset recovery steps
            recoveryStep1.style.display = 'block';
            recoveryStep2.style.display = 'none';
            recoveryStep3.style.display = 'none';
            recoveryEmail.value = '';
            if (recoveryOtp) recoveryOtp.value = '';
            if (recoveryOtpContainer) recoveryOtpContainer.style.display = 'none';
            recoveryPwdNew.value = '';
            recoveryPwdConfirm.value = '';
            recoveryPwdError.style.display = 'none';
            generatedOTP = '';
            
            // Open modal
            forgotPwdModal.classList.add('active');
        });
    }

    // Step 1: Click Continue after entering email
    if (recoveryBtnNext) {
        recoveryBtnNext.addEventListener('click', () => {
            const email = recoveryEmail.value.trim().toLowerCase();
            const matchedAdmin = settings.users.find(u => u.email.toLowerCase() === email && (u.role === 'Owner' || u.role === 'Admin'));
            
            if (matchedAdmin) {
                targetOwner = matchedAdmin;
                
                // Show Step 2
                recoveryStep1.style.display = 'none';
                recoveryStep2.style.display = 'block';
                
                // Mask and display recovery email
                if (maskedRecoveryEmail) {
                    const recEmail = matchedAdmin.recoveryEmail || matchedAdmin.email;
                    maskedRecoveryEmail.innerText = maskEmail(recEmail);
                }
            } else {
                alert("Error: Admin Email not found.");
            }
        });
    }

    // Send Email OTP
    if (recoverySendEmailBtn) {
        recoverySendEmailBtn.addEventListener('click', () => {
            if (!targetOwner) return;
            const recEmail = targetOwner.recoveryEmail || targetOwner.email;
            
            // Generate 6-digit OTP
            generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
            
            recoverySendEmailBtn.disabled = true;
            recoverySendEmailBtn.innerText = "Sending Code...";

            const showSimulatedOTP = () => {
                recoverySendEmailBtn.disabled = false;
                recoverySendEmailBtn.innerText = "Resend Code";
                if (recoveryOtpContainer) recoveryOtpContainer.style.display = 'block';
                
                // Overlay/Alert popup for simulated OTP
                alert(`[SIMULATION MODE]\nA verification email has been simulated to: ${recEmail}\n\nYour 6-digit verification code is: ${generatedOTP}`);
            };

            const sendRealEmail = () => {
                const templateParams = {
                    to_email: recEmail,
                    otp_code: generatedOTP,
                    admin_name: "Ediz IT Admin"
                };

                emailjs.send(
                    settings.emailConfig.serviceId,
                    settings.emailConfig.templateId,
                    templateParams
                ).then(() => {
                    alert("A 6-digit verification code has been sent to your recovery email address.");
                    recoverySendEmailBtn.disabled = false;
                    recoverySendEmailBtn.innerText = "Resend Code";
                    if (recoveryOtpContainer) recoveryOtpContainer.style.display = 'block';
                }).catch((err) => {
                    console.error("EmailJS Error:", err);
                    alert("Error sending email via EmailJS. Falling back to Simulation Mode.");
                    showSimulatedOTP();
                });
            };

            const provider = settings.emailConfig?.provider || 'simulation';
            if (provider === 'emailjs') {
                const publicKey = settings.emailConfig?.publicKey;
                const serviceId = settings.emailConfig?.serviceId;
                const templateId = settings.emailConfig?.templateId;

                if (!publicKey || !serviceId || !templateId) {
                    alert("EmailJS is not fully configured in settings. Falling back to Simulation Mode.");
                    showSimulatedOTP();
                    return;
                }

                // Load EmailJS SDK dynamically if not loaded
                if (!window.emailjs) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
                    script.onload = () => {
                        emailjs.init(publicKey);
                        sendRealEmail();
                    };
                    script.onerror = () => {
                        console.error("Failed to load EmailJS SDK script.");
                        alert("Could not load EmailJS SDK. Falling back to Simulation Mode.");
                        showSimulatedOTP();
                    };
                    document.head.appendChild(script);
                } else {
                    emailjs.init(publicKey);
                    sendRealEmail();
                }
            } else {
                showSimulatedOTP();
            }
        });
    }

    // Step 2: Verify Identity (OTP Code)
    if (recoveryVerifyBtn) {
        recoveryVerifyBtn.addEventListener('click', () => {
            if (!targetOwner) return;
            
            const enteredOtp = recoveryOtp ? recoveryOtp.value.trim() : "";
            
            if (generatedOTP && enteredOtp === generatedOTP) {
                // Show Step 3
                recoveryStep2.style.display = 'none';
                recoveryStep3.style.display = 'block';
            } else {
                alert("Error: Invalid verification code.");
            }
        });
    }

    // Step 3: Save Password
    if (recoveryBtnSave) {
        recoveryBtnSave.addEventListener('click', () => {
            if (!targetOwner) return;
            
            const newPwd = recoveryPwdNew.value;
            const confirmPwd = recoveryPwdConfirm.value;
            
            if (!newPwd || !confirmPwd) {
                alert("Please fill in all password fields.");
                return;
            }
            
            if (newPwd !== confirmPwd) {
                if (recoveryPwdError) recoveryPwdError.style.display = 'block';
                return;
            }
            
            if (recoveryPwdError) recoveryPwdError.style.display = 'none';
            
            // Update password
            targetOwner.password = newPwd;
            settings.adminPassword = newPwd;
            saveDatabase();
            
            alert("Password reset successfully! You can now log in with your new password.");
            
            // Fill login form and close modal
            document.getElementById('auth-email').value = targetOwner.email;
            document.getElementById('auth-password').value = newPwd;
            
            forgotPwdModal.classList.remove('active');
        });
    }

function unlockDashboard() {
    authGate.classList.remove('active');
    authGate.style.display = 'none';
    portalContent.style.display = 'flex';
}

// --- THEME SYNC ---
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ediz_theme', theme);

    const lightLogoName = settings.lightLogo || 'Logo-03.png';
    const darkLogoName = settings.darkLogo || 'Logo-04.png';

    if (theme === 'dark') {
        if (adminThemeToggle) adminThemeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        if (navLogo) navLogo.src = darkLogoName;
        if (authLogo) authLogo.src = darkLogoName;
    } else {
        if (adminThemeToggle) adminThemeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        if (navLogo) navLogo.src = lightLogoName;
        if (authLogo) authLogo.src = lightLogoName;
    }
}

if (adminThemeToggle) {
    adminThemeToggle.addEventListener('click', () => {
        const curTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = curTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

function migrateAndGenerateRegistrationIds() {
    let regMap = new Map();
    let nextRegNum = 1001;

    // First pass: find existing max REG-XXXX serial
    students.forEach(s => {
        if (s.registrationId) {
            const match = s.registrationId.match(/^REG-(\d+)$/);
            if (match) {
                const val = parseInt(match[1], 10);
                if (val >= nextRegNum) {
                    nextRegNum = val + 1;
                }
            }
        }
    });

    // Second pass: assign REG-XXXX to any record lacking it, grouping by (name + normalizedPhone)
    let modified = false;
    students.forEach(s => {
        if (!s.registrationId) {
            const cleanName = (s.name || '').toLowerCase().trim().replace(/\s+/g, '');
            const cleanPhone = (s.phone || '').replace(/\D/g, '');
            const key = `${cleanName}-${cleanPhone}`;
            
            if (!regMap.has(key)) {
                regMap.set(key, `REG-${nextRegNum}`);
                nextRegNum++;
            }
            s.registrationId = regMap.get(key);
            modified = true;
        }
    });
    
    if (modified) {
        saveDatabase();
    }
}

function getNextRegistrationId() {
    let maxId = 1000;
    students.forEach(s => {
        if (s.registrationId) {
            const match = s.registrationId.match(/^REG-(\d+)$/);
            if (match) {
                const val = parseInt(match[1], 10);
                if (val > maxId) maxId = val;
            }
        }
    });
    return `REG-${maxId + 1}`;
}

// --- DATABASE ACCESS ---
function loadDatabase() {
    // Force reset to original unmigrated IDs from database_backup.js if not already done
    if (!localStorage.getItem('ediz_students_restored_v11') && window.migratedDatabase) {
        localStorage.setItem('ediz_students', JSON.stringify(window.migratedDatabase.students));
        localStorage.setItem('ediz_settings', JSON.stringify(window.migratedDatabase.settings));
        localStorage.setItem('ediz_students_restored_v11', 'true');
    }

    students = JSON.parse(localStorage.getItem('ediz_students')) || [];
    inquiries = JSON.parse(localStorage.getItem('ediz_inquiries')) || [];
    tasks = JSON.parse(localStorage.getItem('ediz_tasks')) || [];
    migrateAndGenerateRegistrationIds();
    bookStock = parseInt(localStorage.getItem('ediz_book_stock')) || 0;
    settings = JSON.parse(localStorage.getItem('ediz_settings')) || {
        adminPassword: 'admin123',
        phone: '01335530900',
        address: 'Jhawtola, Amin Tower, Comilla',
        lightLogo: 'Logo-03.png',
        darkLogo: 'Logo-04.png',
        courseFees: defaultFees,
        batches: defaultBatches,
        smsConfig: { apiKey: 'ulrt6uAxw1487sVzIYc6', senderId: 'Ediz It', welcomeTemplate: "Dear {student_name},\n\nCongratulations! Your admission to {course_name} (Batch: {batch_name}) has been confirmed.\n\nStudent ID: {student_id}\nClass Start: {start_date}\nTime: {class_time}\n\nEDIZ IT Institute\n📞 01335530900", autoSendWelcome: true },
        smsHistory: [],
        emailConfig: { provider: 'simulation', publicKey: '', serviceId: '', templateId: '' }
    };

    // Auto-update phone and address to the new defaults if they are set to old placeholder values
    if (settings.phone === '+880 1712-345678') {
        settings.phone = '01335530900';
    }
    if (settings.address === 'Jhautala, Comilla') {
        settings.address = 'Jhawtola, Amin Tower, Comilla';
    }
    // Auto-update logo files if they are set to old defaults
    if (settings.lightLogo === 'Logo-07.png') {
        settings.lightLogo = 'Logo-03.png';
    }
    if (settings.darkLogo === 'Logo-03.png') {
        settings.darkLogo = 'Logo-04.png';
    }

    if (!settings.courseFees) settings.courseFees = defaultFees;
    if (!settings.batches) settings.batches = defaultBatches;
    if (!settings.smsConfig) settings.smsConfig = { apiKey: 'ulrt6uAxw1487sVzIYc6', senderId: 'Ediz It', welcomeTemplate: "Dear {student_name},\n\nCongratulations! Your admission to {course_name} (Batch: {batch_name}) has been confirmed.\n\nStudent ID: {student_id}\nClass Start: {start_date}\nTime: {class_time}\n\nEDIZ IT Institute\n📞 01335530900", autoSendWelcome: true };
    if (!settings.smsHistory) settings.smsHistory = [];
    if (!settings.emailConfig) settings.emailConfig = { provider: 'simulation', publicKey: '', serviceId: '', templateId: '' };

    // Fill in default SMS Gateway Config if empty
    if (!settings.smsConfig.apiKey) {
        settings.smsConfig.apiKey = 'ulrt6uAxw1487sVzIYc6';
    }
    if (!settings.smsConfig.senderId) {
        settings.smsConfig.senderId = 'Ediz It';
    }
    if (!settings.smsConfig.welcomeTemplate || settings.smsConfig.welcomeTemplate.includes("https://edizit.com") || settings.smsConfig.welcomeTemplate.includes("Helpline: 01798926897")) {
        settings.smsConfig.welcomeTemplate = "Dear {student_name},\n\nCongratulations! Your admission to {course_name} (Batch: {batch_name}) has been confirmed.\n\nStudent ID: {student_id}\nClass Start: {start_date}\nTime: {class_time}\n\nEDIZ IT Institute\n📞 01335530900";
    }
    if (settings.smsConfig.autoSendWelcome === undefined) {
        settings.smsConfig.autoSendWelcome = true;
    }

    // Fill in missing properties for existing batches to ensure backward compatibility
    if (settings.batches) {
        settings.batches = settings.batches.map(b => {
            if (!b.time) b.time = "09:00 AM - 10:30 AM";
            if (!b.schedule) b.schedule = ["Sat", "Mon", "Wed"];
            if (!b.startDate) b.startDate = "2026-06-01";
            if (!b.endDate) b.endDate = b.course === "Graphic Design" ? "2026-08-31" : "2026-07-31";
            return b;
        });
    }

    // Load or initialize default user accounts
    if (!settings.users || settings.users.length === 0) {
        settings.users = [
            { 
                id: "USER-1", 
                email: "owner@ediz.com", 
                password: (settings.adminPassword || "admin123"), 
                role: "Owner", 
                permissions: { canEdit: true, canDelete: true, canInvoice: true, canCert: true, canCreateBatch: true },
                recoveryEmail: "owner@ediz.com"
            },
            { 
                id: "USER-2", 
                email: "staff@ediz.com", 
                password: "staff123", 
                role: "Staff", 
                permissions: { canEdit: true, canDelete: false, canInvoice: true, canCert: true, canCreateBatch: true } 
            }
        ];
    } else {
        const owner = settings.users.find(u => u.role === 'Owner') || settings.users[0];
        if (owner) {
            if (owner.recoveryEmail === undefined) {
                owner.recoveryEmail = owner.email || "owner@ediz.com";
            }
        }
    }

    // Ensure all users have the canCreateBatch permission flag set
    if (settings.users) {
        settings.users = settings.users.map(u => {
            if (!u.permissions) {
                u.permissions = { canEdit: true, canDelete: false, canInvoice: true, canCert: true, canCreateBatch: true };
            }
            if (u.permissions.canCreateBatch === undefined) {
                u.permissions.canCreateBatch = true;
            }
            return u;
        });
    }

    // Set configuration inputs
    settingsPhone.value = settings.phone;
    settingsAddress.value = settings.address;
    settingsPriceGraphic.value = settings.courseFees["Graphic Design"];
    settingsPriceBasic.value = settings.courseFees["Basic Computer"];
    settingsPriceEnglish.value = settings.courseFees["Spoken English"];
    settingsLogoLight.value = settings.lightLogo;
    settingsLogoDark.value = settings.darkLogo;

    if (settingsAdminEmail && settings.users && settings.users.length > 0) {
        const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user'));
        const dbUser = activeUser ? settings.users.find(u => u.email.toLowerCase() === activeUser.email.toLowerCase()) : null;
        const targetUser = dbUser || settings.users.find(u => u.role === 'Owner') || settings.users[0];

        settingsAdminEmail.value = targetUser.email || '';
        if (settingsAdminRecoveryEmail) settingsAdminRecoveryEmail.value = targetUser.recoveryEmail || targetUser.email || '';
    }

    if (settingsEmailProvider) {
        settingsEmailProvider.value = settings.emailConfig.provider || 'simulation';
        if (settingsEmailjsPublicKey) settingsEmailjsPublicKey.value = settings.emailConfig.publicKey || '';
        if (settingsEmailjsServiceId) settingsEmailjsServiceId.value = settings.emailConfig.serviceId || '';
        if (settingsEmailjsTemplateId) settingsEmailjsTemplateId.value = settings.emailConfig.templateId || '';
    }

    const settingsSmsApiKey = document.getElementById('settings-sms-api-key');
    const settingsSmsSenderId = document.getElementById('settings-sms-sender-id');
    const settingsSmsTemplate = document.getElementById('settings-sms-template');
    const settingsSmsAutoSend = document.getElementById('settings-sms-auto-send');
    if (settingsSmsApiKey) settingsSmsApiKey.value = settings.smsConfig?.apiKey || '';
    if (settingsSmsSenderId) settingsSmsSenderId.value = settings.smsConfig?.senderId || '';
    if (settingsSmsTemplate) settingsSmsTemplate.value = settings.smsConfig?.welcomeTemplate || '';
    if (settingsSmsAutoSend) settingsSmsAutoSend.checked = settings.smsConfig?.autoSendWelcome !== false;

    // Refresh UI Components
    refreshStats();
    renderAllLists();
    renderSettingsBatches();
    renderSettingsStaff();
    renderSettingsTeachers();
    renderSmsHistory();
    renderBooksTab();
    checkAndSendNextPaymentReminders();

    // Persist any defaulted settings to localStorage
    localStorage.setItem('ediz_settings', JSON.stringify(settings));

    // Try background sync with PHP server database
    syncWithServer();
}

function syncWithServer() {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const fetchUrl = isLocalhost ? 'database.json' : 'api.php';
    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) throw new Error("HTTP error");
            return response.json();
        })
        .then(data => {
            if (data && data.students) {
                students = data.students || [];
                migrateAndGenerateRegistrationIds();
                bookStock = data.bookStock || 0;
                settings = data.settings || settings;
                inquiries = data.inquiries || [];
                tasks = data.tasks || [];
                
                // Cache server data locally
                localStorage.setItem('ediz_students', JSON.stringify(students));
    localStorage.setItem('ediz_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('ediz_tasks', JSON.stringify(tasks));
                localStorage.setItem('ediz_book_stock', bookStock);
                localStorage.setItem('ediz_settings', JSON.stringify(settings));
                
                // Re-render components with live data
                refreshStats();
                renderAllLists();
                renderSettingsBatches();
                renderSettingsStaff();
                renderSettingsTeachers();
                renderSmsHistory();
                renderBooksTab();
                
                // Re-render Batches and Handover Board
                renderBatchesList(selectedCourseForBatches);
                renderHandoverBoard();
                
                // Re-render Inquiries and Tasks
                renderInquiries();
                renderTasks();
                checkInquiryReminders();

                if (activeBatchForRoster) {
                    renderBatchRoster(selectedCourseForBatches, activeBatchForRoster);
                }
                console.log("Database synchronized with Hostinger server.");
            }
            isInitialLoad = false;
        })
        .catch(err => {
            console.log("Offline mode or api.php not available. Using local cache:", err);
            isInitialLoad = false;
        });
}

function saveDatabase() {
    localStorage.setItem('ediz_students', JSON.stringify(students));
    localStorage.setItem('ediz_settings', JSON.stringify(settings));
    localStorage.setItem('ediz_book_stock', bookStock);
    localStorage.setItem('ediz_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('ediz_tasks', JSON.stringify(tasks));
    
    if (typeof isInitialLoad !== 'undefined' && isInitialLoad) {
        console.log("Skipping server write during initial database load/migration.");
        return;
    }
    
    refreshStats();
    renderAllLists();
    renderSettingsBatches();
    renderSettingsStaff();
    renderSettingsTeachers();
    renderSmsHistory();
    renderBooksTab();
    
    if (activeBatchForRoster) {
        renderBatchRoster(selectedCourseForBatches, activeBatchForRoster);
        const activeBatchInfoCard = document.getElementById('active-batch-info-card');
        if (activeBatchInfoCard && activeBatchInfoCard.style.display !== 'none') {
            selectActiveBatch(selectedCourseForBatches, activeBatchForRoster);
        }
    }

    // Sync database state to PHP server database
    const dbPayload = {
        students: students,
        settings: settings,
        bookStock: bookStock,
        inquiries: inquiries,
        tasks: tasks
    };
    
    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dbPayload)
    })
    .then(response => {
        if (!response.ok) throw new Error("HTTP error saving database");
        return response.json();
    })
    .then(res => {
        console.log("Database successfully synced to Hostinger server:", res);
    })
    .catch(err => {
        console.warn("Failed to sync database to Hostinger server:", err);
    });
}

function migrateLegacyStudentIds() {
    // Legacy student ID migration disabled. Preserving original database IDs.
    console.log("Legacy student ID migration disabled. Preserving original database IDs.");
}

function generateNextStudentId(course, studentsList, newlyCreated = []) {
    let prefix = "EDIZ";
    let prefixes = ["EDIZ"];
    if (course === "Graphic Design") {
        prefix = "GD";
        prefixes = ["GD", "EDIZ-GD"];
    } else if (course === "Basic Computer") {
        prefix = "BC";
        prefixes = ["BC", "EDIZ-BC"];
    } else if (course === "Spoken English") {
        prefix = "SE";
        prefixes = ["SE", "EDIZ-SE", "EDIZ-SP", "IP", "SP"];
    }

    let maxNum = 0;
    
    // Check in existing students
    studentsList.forEach(s => {
        if (!s.id) return;
        const isMatch = (s.course === course) || prefixes.some(p => s.id.startsWith(p + "-"));
        if (isMatch) {
            const parts = s.id.split('-');
            const lastPart = parts[parts.length - 1];
            const num = parseInt(lastPart, 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });

    // Check in newly created students in the current batch
    newlyCreated.forEach(s => {
        if (!s.id) return;
        const isMatch = (s.course === course) || prefixes.some(p => s.id.startsWith(p + "-"));
        if (isMatch) {
            const parts = s.id.split('-');
            const lastPart = parts[parts.length - 1];
            const num = parseInt(lastPart, 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });

    const nextNum = maxNum + 1;
    return `${prefix}-${nextNum}`;
}

function getInvoicePaymentType(student, invoice, index) {
    if (invoice.paymentType) return invoice.paymentType;
    if (invoice.amount === 200) return 'Book Payment';
    if (index === 0) return 'New Registration';
    return 'Due Collection';
}

function getNextInvoiceId() {
    const year = new Date().getFullYear();
    let maxNum = 0;
    students.forEach(s => {
        if (s.invoices) {
            s.invoices.forEach(inv => {
                const match = inv.id.match(/\d+$/);
                if (match) {
                    const num = parseInt(match[0], 10);
                    if (!isNaN(num) && num > maxNum) {
                        maxNum = num;
                    }
                }
            });
        }
    });
    const nextNum = maxNum + 1;
    return `INV-${year}-${String(nextNum).padStart(4, '0')}`;
}

function refreshStats() {
    const stats = getFilteredStats();
    statTotalStudents.innerText = stats.totalStudents;
    statEarnings.innerText = `৳${stats.earnings.toLocaleString()}`;
    statDues.innerText = `৳${stats.dues.toLocaleString()}`;
    statCerts.innerText = stats.certs;
    calculatePeriodEarnings();
}

// --- TAB ROUTING ---
function hasTabAccess(tabName) {
    if (tabName !== 'settings') return true;
    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user'));
    if (!curUser) return false;
    return curUser.role === 'Owner' || curUser.role === 'Admin';
}

function setupTabSwitching() {
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');
            
            // Close mobile drawer if active
            const sidebar = document.getElementById('sidebar');
            if (sidebar && window.innerWidth < 992) {
                sidebar.classList.remove('active');
            }
            
            if (!hasTabAccess(tabName)) {
                alert("Access Denied: You do not have permission to view Settings.");
                const activeTab = document.querySelector('.sidebar-item.active');
                if (activeTab) {
                    window.location.hash = activeTab.getAttribute('data-tab');
                } else {
                    window.location.hash = 'dashboard';
                }
                return;
            }
            
            // Toggle active sidebar item
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Save active tab in localStorage
            localStorage.setItem('ediz_active_tab', tabName);
            window.location.hash = tabName;

            // Toggle views
            tabViews.forEach(view => {
                view.style.display = 'none';
            });
            document.getElementById(`tab-${tabName}`).style.display = 'block';

            // Change header titles
            if (tabName === 'dashboard') {
                activeTabTitle.innerText = "Portal Dashboard";
                activeTabSubtitle.innerText = "Welcome back, administrator.";
            } else if (tabName === 'students') {
                activeTabTitle.innerText = "Student Registry";
                activeTabSubtitle.innerText = `View, manage and enroll students. Total Registered: ${students.length}`;
            } else if (tabName === 'batches') {
                activeTabTitle.innerText = "Batch Explorer";
                activeTabSubtitle.innerText = "Browse rosters by course and batch.";
                const activeCourseBtn = document.querySelector('.batch-course-btn.active');
                if (activeCourseBtn) {
                    const selectedCourse = activeCourseBtn.getAttribute('data-course');
                    renderBatchesList(selectedCourse);
                }
            } else if (tabName === 'invoices') {
                activeTabTitle.innerText = "Invoices Ledger";
                activeTabSubtitle.innerText = "Record of all fee collections.";
            } else if (tabName === 'certificates') {
                activeTabTitle.innerText = "Certificates Registry";
                activeTabSubtitle.innerText = "Award and print student graduation records.";
            } else if (tabName === 'books') {
                activeTabTitle.innerText = "Books Inventory";
                activeTabSubtitle.innerText = "Manage books stock, sales, and student allocation.";
                renderBooksTab();
            } else if (tabName === 'registration') {
                activeTabTitle.innerText = "New Admission Registration";
                activeTabSubtitle.innerText = "Register new students offline.";
                resetRegistrationPageForm();
            } else if (tabName === 'collect-due') {
                activeTabTitle.innerText = "Collect Outstanding Dues";
                activeTabSubtitle.innerText = "Search and collect outstanding dues from students.";
                updateCollectDueBatchDropdown();
                renderCollectDueTable();
            } else if (tabName === 'settings') {
                activeTabTitle.innerText = "System Configuration";
                activeTabSubtitle.innerText = "Manage fees, database backups, and details.";
            } else if (tabName === 'handover-board') {
                activeTabTitle.innerText = "Handover Verification Board";
                activeTabSubtitle.innerText = "Verify staff collections and reconcile desk funds.";
                renderHandoverBoard();
            } else if (tabName === 'inquiries') {
                activeTabTitle.innerText = "Admission Inquiries & Tasks";
                activeTabSubtitle.innerText = "Manage walk-in candidate leads, follow-up reminders, and manager tasks.";
                renderInquiries();
                renderTasks();
            } else if (tabName === 'teacher-payouts') {
                activeTabTitle.innerText = "Teacher Payouts Report";
                activeTabSubtitle.innerText = "Track and calculate teacher earnings based on net batch incomes.";
                renderTeacherPayouts();
            }
        });
    });

    // Listen for manual hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            if (!hasTabAccess(hash)) {
                alert("Access Denied: You do not have permission to view Settings.");
                window.location.hash = 'dashboard';
                return;
            }
            const matchingTab = document.querySelector(`.sidebar-item[data-tab="${hash}"]`);
            if (matchingTab && !matchingTab.classList.contains('active')) {
                matchingTab.click();
            }
        }
    });
}

// --- SYNC TABLES / UI RENDERS ---
function renderAllLists() {
    renderRecentDashboard();
    renderStudentsTable();
    renderInvoicesTable();
    renderCertificatesTable();
    renderCollectDueTable();
    
    // Render Inquiries and Tasks
    renderInquiries();
    renderTasks();
    checkInquiryReminders();
    renderTeacherPayouts();
    
    // Sync dashboard quick search if active
    const dbSearchInput = document.getElementById('dashboard-student-search');
    if (dbSearchInput && dbSearchInput.value) {
        dbSearchInput.dispatchEvent(new Event('input'));
    }
}

function renderRecentDashboard() {
    const stats = getFilteredStats();
    
    // Toggle Handover Verification sub-tab visibility based on user role
    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user'));
    const handoverTab = document.getElementById('handover-subtab');
    if (handoverTab) {
        if (curUser && (curUser.role === 'Owner' || curUser.role === 'Admin')) {
            handoverTab.style.display = 'block';
        } else {
            handoverTab.style.display = 'none';
            if (activeDashboardSubTab === 'handover') {
                activeDashboardSubTab = 'registrations';
                const regTabBtn = document.querySelector('.dashboard-sub-tab[data-subtab="registrations"]');
                if (regTabBtn) {
                    regTabBtn.className = "btn btn-primary btn-sm dashboard-sub-tab";
                    const otherTabs = document.querySelectorAll('.dashboard-sub-tab:not([data-subtab="registrations"])');
                    otherTabs.forEach(t => t.className = "btn btn-secondary btn-sm dashboard-sub-tab");
                }
                const targetView = document.getElementById('dashboard-view-registrations');
                if (targetView) targetView.style.display = 'block';
                const otherViews = document.querySelectorAll('.dashboard-table-view:not(#dashboard-view-registrations)');
                otherViews.forEach(v => v.style.display = 'none');
                
                const titleEl = document.getElementById('dashboard-list-title');
                if (titleEl) titleEl.innerText = "Recent Registrations";
            }
        }
    }

    if (activeDashboardSubTab === 'registrations') {
        const list = [...stats.studentsList].reverse();
        const displayList = dashboardDateRange.type === 'all' ? list.slice(0, 5) : list;
        const tbody = document.getElementById('recent-enrollments-tbody');
        if (!tbody) return;

        if (displayList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No registrations found for the selected range.</td></tr>`;
            return;
        }

        const canInvoice = curUser && (curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice));
        const canDelete = curUser && (curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canDelete));

        tbody.innerHTML = displayList.map(st => `
            <tr>
                <td><strong>${st.id}</strong></td>
                <td>${st.name}</td>
                <td>${st.course}</td>
                <td>${st.registrationDate}</td>
                <td><span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status === 'Partial' ? 'Payment Due' : st.status}</span></td>
                <td>
                    <div class="actions-cell">
                        ${canInvoice ? `<button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Payments"><i class="fa-solid fa-credit-card"></i></button>` : ''}
                        ${canDelete ? `<button class="btn btn-secondary btn-icon-only" style="color: var(--danger);" onclick="deleteStudent('${st.id}')" title="Delete Student"><i class="fa-solid fa-trash"></i></button>` : ''}
                        ${!canInvoice && !canDelete ? '---' : ''}
                    </div>
                </td>
            </tr>
        `).join('');

    } else if (activeDashboardSubTab === 'payments') {
        let allInvoices = [];
        students.forEach(st => {
            if (st.invoices) {
                st.invoices.forEach((inv, index) => {
                    allInvoices.push({
                        invId: inv.id,
                        studentId: st.id,
                        studentName: st.name,
                        date: inv.date,
                        amount: inv.amount,
                        studentObj: st,
                        rawInvoice: inv,
                        index: index
                    });
                });
            }
        });

        if (dashboardDateRange.type !== 'all') {
            const bounds = getDateRangeBounds(dashboardDateRange.type, dashboardDateRange.start, dashboardDateRange.end);
            const start = bounds.start;
            const end = bounds.end;

            allInvoices = allInvoices.filter(inv => {
                if (!inv.date) return false;
                const parsed = parseDateString(inv.date.split('T')[0]);
                if (!parsed) return false;
                if (start && parsed < start) return false;
                if (end && parsed > end) return false;
                return true;
            });
        }

        allInvoices.sort((a, b) => new Date(b.date.split('T')[0]) - new Date(a.date.split('T')[0]));
        const displayInvs = dashboardDateRange.type === 'all' ? allInvoices.slice(0, 5) : allInvoices;

        const tbody = document.getElementById('recent-payments-tbody');
        if (!tbody) return;

        if (displayInvs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No recent payments found for the selected range.</td></tr>`;
            return;
        }

        tbody.innerHTML = displayInvs.map(inv => {
            const pType = getInvoicePaymentType(inv.studentObj, inv.rawInvoice, inv.index);
            const badgeClass = pType === 'New Registration' ? 'badge-success' : (pType === 'Book Payment' ? 'badge-primary' : 'badge-warning');
            
            // Handover verification status badge
            let handoverStatusHtml = '';
            if (inv.rawInvoice.amount > 0 && inv.rawInvoice.paymentType !== 'Dues Waived') {
                const isVerified = inv.rawInvoice.receivedByAdmin !== false;
                handoverStatusHtml = isVerified 
                    ? `<span class="badge badge-success" style="font-size: 0.65rem; margin-top: 4px; display: inline-block; background-color: rgba(22, 163, 74, 0.1); color: var(--success); border: 1px solid var(--success);"><i class="fa-solid fa-check-double"></i> Received</span>`
                    : `<span class="badge badge-warning" style="font-size: 0.65rem; margin-top: 4px; display: inline-block; background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid #f59e0b;"><i class="fa-solid fa-clock"></i> Handover Pending</span>`;
            }

            return `
            <tr>
                <td>
                    <strong>${inv.invId}</strong>
                    ${handoverStatusHtml}
                </td>
                <td>${inv.studentId}</td>
                <td>${inv.studentName}</td>
                <td>${inv.date.split('T')[0]}</td>
                <td><span class="badge ${badgeClass}" style="font-size: 0.75rem;">${pType}</span></td>
                <td style="color: var(--success); font-weight: 600;">৳${inv.amount.toLocaleString()}</td>
                <td>
                    <button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${inv.studentId}')" title="Payments"><i class="fa-solid fa-credit-card"></i></button>
                </td>
            </tr>
            `;
        }).join('');

    } else if (activeDashboardSubTab === 'certificates') {
        let allCerts = [];
        students.forEach(st => {
            if (st.certified) {
                allCerts.push({
                    studentId: st.id,
                    studentName: st.name,
                    course: st.course,
                    certDate: st.certificateDate,
                    certId: `CERT-${st.id.replace(/-/g, '')}`
                });
            }
        });

        if (dashboardDateRange.type !== 'all') {
            const bounds = getDateRangeBounds(dashboardDateRange.type, dashboardDateRange.start, dashboardDateRange.end);
            const start = bounds.start;
            const end = bounds.end;

            allCerts = allCerts.filter(c => {
                if (!c.certDate) return false;
                const parsed = parseDateString(c.certDate);
                if (!parsed) return false;
                if (start && parsed < start) return false;
                if (end && parsed > end) return false;
                return true;
            });
        }

        allCerts.sort((a, b) => new Date(b.certDate) - new Date(a.certDate));
        const displayCerts = dashboardDateRange.type === 'all' ? allCerts.slice(0, 5) : allCerts;

        const tbody = document.getElementById('recent-certs-tbody');
        if (!tbody) return;

        if (displayCerts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No certificates issued for the selected range.</td></tr>`;
            return;
        }

        tbody.innerHTML = displayCerts.map(c => `
            <tr>
                <td><strong>${c.studentId}</strong></td>
                <td>${c.studentName}</td>
                <td>${c.course}</td>
                <td>${c.certDate}</td>
                <td style="color: var(--accent); font-weight: 600;">${c.certId}</td>
                <td>
                    <button class="btn btn-secondary btn-icon-only" onclick="printCertificate('${c.studentId}')" title="Print Certificate"><i class="fa-solid fa-print"></i></button>
                </td>
            </tr>
        `).join('');

    } else if (activeDashboardSubTab === 'handover') {
        let unverifiedInvs = [];
        students.forEach(st => {
            if (st.invoices) {
                st.invoices.forEach((inv, index) => {
                    // Only cash/money collections (amount > 0 and not 'Dues Waived')
                    if (inv.amount > 0 && inv.receivedByAdmin === false) {
                        unverifiedInvs.push({
                            invId: inv.id,
                            studentId: st.id,
                            studentName: st.name,
                            course: st.course,
                            date: inv.date,
                            amount: inv.amount,
                            collectedBy: inv.collectedBy || 'Staff',
                            studentObj: st,
                            rawInvoice: inv,
                            index: index
                        });
                    }
                });
            }
        });

        // Sort descending by date
        unverifiedInvs.sort((a, b) => new Date(b.date.split('T')[0]) - new Date(a.date.split('T')[0]));

        const tbody = document.getElementById('handover-verify-tbody');
        const pendingTotalEl = document.getElementById('handover-pending-total');
        if (!tbody) return;

        // Calculate total unverified amount
        const totalPendingAmount = unverifiedInvs.reduce((sum, inv) => sum + inv.amount, 0);
        if (pendingTotalEl) {
            pendingTotalEl.innerText = `৳${totalPendingAmount.toLocaleString()}`;
        }

        if (unverifiedInvs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">All staff payments have been verified and received. (কোনো অসংগৃহীত ক্যাশ বকেয়া নেই)</td></tr>`;
            return;
        }

        tbody.innerHTML = unverifiedInvs.map(inv => {
            return `
            <tr>
                <td>${inv.date.split('T')[0]}</td>
                <td><strong>${inv.invId}</strong></td>
                <td>
                    <div style="font-weight: 600;">${inv.studentName}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">ID: ${inv.studentId}</div>
                </td>
                <td>${inv.course}</td>
                <td style="font-weight: 700; color: var(--success);">৳${inv.amount.toLocaleString()}</td>
                <td>
                    <div style="font-weight: 500; color: var(--primary); font-size: 0.8rem;">${inv.collectedBy}</div>
                </td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="verifyHandover('${inv.studentId}', '${inv.invId}')" style="background-color: var(--success); border-color: var(--success); color: white; padding: 4px 8px; font-size: 0.75rem; border-radius: var(--radius-sm); font-weight: 600; white-space: nowrap; height: 32px;"><i class="fa-solid fa-check"></i> টাকা বুঝে পেয়েছি</button>
                </td>
            </tr>
            `;
        }).join('');
    }
}

window.verifyHandover = function(studentId, invoiceId) {
    const st = students.find(s => s.id === studentId);
    if (!st) return;
    
    let targetInv = null;
    let totalVerifiedAmount = 0;
    
    if (st.invoices) {
        st.invoices.forEach(inv => {
            if (inv.id === invoiceId) {
                inv.receivedByAdmin = true;
                targetInv = inv;
                totalVerifiedAmount += (inv.amount || 0);
            }
        });
    }
    
    if (!targetInv) return;
    
    saveDatabase();
    
    alert(`Handover verified for Student ID ${studentId} (Invoice #${invoiceId}). Received ৳${totalVerifiedAmount.toLocaleString()} from ${targetInv.collectedBy || 'Staff'}.`);
    
    // Send SMS Notification to staff if they have a phone number configured
    const staffEmail = targetInv.collectedBy;
    const staffUser = findCollectorUser(staffEmail);
    if (staffUser && staffUser.phone) {
        const staffMsg = `EDIZ IT: Sir/Admin has received the collected amount of ৳${totalVerifiedAmount.toLocaleString()} for student ${st.name} (Invoice: #${targetInv.id}). Verification confirmed.`;
        sendGeneralSms(staffUser.phone, staffMsg, "Staff Verification Alert");
    }
    
    renderRecentDashboard();
    renderHandoverBoard();
    refreshStats();
};

function renderStudentsTable() {
    const sQuery = studentSearch.value.toLowerCase().trim();
    const courseVal = filterCourse.value;
    const statusVal = filterStatus.value;

    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
    const canEdit = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canEdit);
    const canDelete = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canDelete);
    const canInvoice = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice);

    const cleanQuery = sQuery.replace(/\D/g, "");

    // Prioritize exact ID match
    const exactIdMatch = sQuery ? students.find(st => st.id.toLowerCase() === sQuery) : null;

    const filtered = exactIdMatch ? [exactIdMatch] : students.filter(st => {
        const cleanPhone = st.phone ? st.phone.replace(/\D/g, "") : "";
        const cleanGuardian = st.guardianPhone ? st.guardianPhone.replace(/\D/g, "") : "";

        // If query contains alphabetical letters, do not run numeric phone matches
        const hasLetters = /[a-z]/i.test(sQuery);

        const matchesSearch = !sQuery || 
                              st.id.toLowerCase().includes(sQuery) || 
                              st.name.toLowerCase().includes(sQuery) || 
                              (!hasLetters && cleanQuery && cleanPhone.includes(cleanQuery)) ||
                              (!hasLetters && cleanQuery && cleanGuardian.includes(cleanQuery)) ||
                              (st.batch && st.batch.toLowerCase().includes(sQuery));
        const matchesCourse = courseVal === "" || (st.course && st.course.includes(courseVal));
        const matchesStatus = statusVal === "" || st.status === statusVal;

        let matchesDate = true;
        if (studentsDateRange.type !== 'all') {
            const bounds = getDateRangeBounds(studentsDateRange.type, studentsDateRange.start, studentsDateRange.end);
            if (bounds.start || bounds.end) {
                const parsed = parseDateString(st.registrationDate);
                if (!parsed) {
                    matchesDate = false;
                } else {
                    if (bounds.start && parsed < bounds.start) matchesDate = false;
                    if (bounds.end && parsed > bounds.end) matchesDate = false;
                }
            }
        }

        return matchesSearch && matchesCourse && matchesStatus && matchesDate;
    });

    const activeTab = document.querySelector('.sidebar-item.active');
    const isStudentsTab = activeTab && activeTab.getAttribute('data-tab') === 'students';
    if (isStudentsTab && activeTabSubtitle) {
        activeTabSubtitle.innerText = `View, manage and enroll students. Total Registered: ${students.length}`;
    }

    const registryTotalEl = document.getElementById('student-registry-total');
    if (registryTotalEl) {
        let statusLabel = "";
        if (statusVal === "Paid") statusLabel = "Paid ";
        else if (statusVal === "Partial") statusLabel = "Payment Due ";
        else if (statusVal === "Unpaid") statusLabel = "Unpaid ";

        let courseLabel = "";
        if (courseVal) {
            courseLabel = courseVal + " ";
        }
        registryTotalEl.innerText = `Total ${statusLabel}${courseLabel}Students: ${filtered.length}`;
    }

    if (filtered.length === 0) {
        studentsTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No matching student records.</td></tr>`;
        return;
    }

    // Apply sorting selection (Default: Newest First)
    const sortVal = document.getElementById('sort-students')?.value || 'newest_first';
    const mapped = filtered.map(st => ({ st, originalIndex: students.indexOf(st) }));
    mapped.sort((a, b) => {
        if (sortVal === 'newest_first') {
            return b.originalIndex - a.originalIndex;
        } else if (sortVal === 'oldest_first') {
            return a.originalIndex - b.originalIndex;
        } else if (sortVal === 'id_desc') {
            return b.st.id.localeCompare(a.st.id);
        } else if (sortVal === 'id_asc') {
            return a.st.id.localeCompare(b.st.id);
        } else if (sortVal === 'date_desc') {
            const dateA = new Date(a.st.registrationDate || '1970-01-01');
            const dateB = new Date(b.st.registrationDate || '1970-01-01');
            if (dateB - dateA !== 0) return dateB - dateA;
            return b.originalIndex - a.originalIndex;
        } else if (sortVal === 'date_asc') {
            const dateA = new Date(a.st.registrationDate || '1970-01-01');
            const dateB = new Date(b.st.registrationDate || '1970-01-01');
            if (dateA - dateB !== 0) return dateA - dateB;
            return a.originalIndex - b.originalIndex;
        }
        return 0;
    });
    const sortedFiltered = mapped.map(item => item.st);

    studentsTbody.innerHTML = sortedFiltered.map(st => {
        const hasNextPay = st.nextPaymentDate ? true : false;
        let nextPayHtml = "";
        let isOverdue = false;
        if (hasNextPay && st.dueFee > 0) {
            const todayStr = getLocalDateString();
            isOverdue = st.nextPaymentDate <= todayStr;
            nextPayHtml = `<div style="font-size: 0.75rem; margin-top: 3px; font-weight: 600; color: ${isOverdue ? 'var(--danger)' : 'var(--success)'};">
                <i class="fa-solid fa-calendar-day"></i> Next Payment: ${st.nextPaymentDate} ${isOverdue ? '<span class="badge badge-danger" style="font-size: 0.6rem; padding: 1px 3px; margin-left: 2px;">Overdue</span>' : ''}
            </div>`;
        }
        const noteHtml = st.notes ? `<div style="font-size: 0.75rem; color: var(--accent); font-style: italic; margin-top: 3px;"><i class="fa-solid fa-sticky-note"></i> Note: ${st.notes}</div>` : '';
        const rowStyle = isOverdue ? 'background-color: rgba(239, 68, 68, 0.05); border-left: 4px solid var(--danger);' : '';

        return `
            <tr style="${rowStyle}">
                <td>
                    <strong>${st.id}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">Batch: ${st.batch || 'N/A'}</span>
                </td>
                <td>
                    <div style="font-weight: 600;">${st.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${st.address}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); font-style: italic;">
                        Parents: ${st.fatherName || 'N/A'} (F), ${st.motherName || 'N/A'} (M)
                    </div>
                    ${nextPayHtml}
                    ${noteHtml}
                </td>
                <td>
                    ${st.course}
                    ${st.takenBook ? `<br><span class="badge badge-success" style="font-size:0.65rem; padding: 1px 4px; margin-top: 2px; display: inline-block;">Book Taken</span>` : ''}
                </td>
                <td>
                    <div>Mob: <a href="tel:${st.phone}" style="color: var(--primary); font-weight: 600; text-decoration: underline;">${st.phone}</a></div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Grd: ${st.guardianPhone ? `<a href="tel:${st.guardianPhone}" style="color: inherit; text-decoration: underline;">${st.guardianPhone}</a>` : 'N/A'}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem;">Gross: ৳${st.totalFee}</div>
                    <div style="font-size: 0.8rem; color: var(--accent);">Disc: ৳${st.discountFee || 0}</div>
                    <div style="font-size: 0.8rem; font-weight: 600;">Net: ৳${st.netFee !== undefined ? st.netFee : st.totalFee}</div>
                    <div style="font-size: 0.85rem; color: var(--success); font-weight: 500;">Paid: ৳${st.paidFee}</div>
                    <div style="font-size: 0.85rem; color: var(--danger); font-weight: 600;">Due: ৳${st.dueFee}</div>
                </td>
                <td><span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status === 'Partial' ? 'Payment Due' : st.status}</span></td>
                <td>
                    <div class="actions-cell" style="display: flex; gap: 0.35rem; align-items: center;">
                        ${canInvoice && st.dueFee > 0 ? `<button class="btn btn-danger btn-sm" onclick="openPaymentModal('${st.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; white-space: nowrap; height: 32px; background-color: var(--danger); border-color: var(--danger); color: white; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-wallet"></i> Collect Due</button>` : ''}
                        <button class="btn btn-secondary btn-icon-only" onclick="openProfileModal('${st.id}')" title="View Full Profile" style="height: 32px; width: 32px;"><i class="fa-solid fa-eye"></i></button>
                        ${canInvoice && st.dueFee <= 0 ? `<button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Manage Fees" style="height: 32px; width: 32px;"><i class="fa-solid fa-wallet"></i></button>` : ''}
                        ${canEdit ? `<button class="btn btn-secondary btn-icon-only" onclick="openEditStudentModal('${st.id}')" title="Edit Student" style="height: 32px; width: 32px;"><i class="fa-solid fa-edit"></i></button>` : ''}
                        <button class="btn btn-secondary btn-icon-only" style="color: var(--accent); height: 32px; width: 32px;" onclick="openStudentNotesModal('${st.id}')" title="Add/Edit Note & Next Payment"><i class="fa-solid fa-note-sticky"></i></button>
                        ${canDelete ? `<button class="btn btn-secondary btn-icon-only" style="color: var(--danger); height: 32px; width: 32px;" onclick="deleteStudent('${st.id}')" title="Delete Student"><i class="fa-solid fa-trash"></i></button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderInvoicesTable() {
    updateInvoiceStats();
    const sQuery = invoiceSearch.value.toLowerCase().trim();
    const typeFilterVal = invoiceTypeFilter ? invoiceTypeFilter.value : 'all';
    
    // Flatten invoices
    let allInvoices = [];
    students.forEach(st => {
        if (st.invoices && st.invoices.length > 0) {
            st.invoices.forEach((inv, index) => {
                allInvoices.push({
                    invId: inv.id,
                    studentId: st.id,
                    studentName: st.name,
                    date: inv.date,
                    amount: inv.amount,
                    studentObj: st,
                    rawInvoice: inv,
                    index: index
                });
            });
        }
    });

    // Sort descending by Invoice ID (recently admitted/transactions first)
    allInvoices.sort((a, b) => b.invId.localeCompare(a.invId));

    const filtered = allInvoices.filter(inv => {
        const matchesSearch = inv.invId.toLowerCase().includes(sQuery) || 
                              inv.studentId.toLowerCase().includes(sQuery) || 
                              inv.studentName.toLowerCase().includes(sQuery);
        
        let matchesType = true;
        if (typeFilterVal !== 'all') {
            const pType = getInvoicePaymentType(inv.studentObj, inv.rawInvoice, inv.index);
            if (pType !== typeFilterVal) matchesType = false;
        }

        let matchesDate = true;
        if (invoicesDateRange.type !== 'all') {
            const bounds = getDateRangeBounds(invoicesDateRange.type, invoicesDateRange.start, invoicesDateRange.end);
            if (bounds.start || bounds.end) {
                const parsed = parseDateString(inv.date.split('T')[0]);
                if (!parsed) {
                    matchesDate = false;
                } else {
                    if (bounds.start && parsed < bounds.start) matchesDate = false;
                    if (bounds.end && parsed > bounds.end) matchesDate = false;
                }
            }
        }

        return matchesSearch && matchesType && matchesDate;
    });

    if (filtered.length === 0) {
        invoicesTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No invoices generated.</td></tr>`;
        return;
    }

    invoicesTbody.innerHTML = filtered.map(inv => {
        const pType = getInvoicePaymentType(inv.studentObj, inv.rawInvoice, inv.index);
        const badgeClass = pType === 'New Registration' ? 'badge-success' : (pType === 'Book Payment' ? 'badge-primary' : 'badge-warning');
        
        // Handover verification status badge
        let handoverStatusHtml = '';
        if (inv.rawInvoice.amount > 0 && inv.rawInvoice.paymentType !== 'Dues Waived') {
            const isVerified = inv.rawInvoice.receivedByAdmin !== false;
            handoverStatusHtml = isVerified 
                ? `<div class="badge badge-success" style="font-size: 0.65rem; margin-top: 4px; display: inline-block; background-color: rgba(22, 163, 74, 0.1); color: var(--success); border: 1px solid var(--success);"><i class="fa-solid fa-check-double"></i> Received</div>`
                : `<div class="badge badge-warning" style="font-size: 0.65rem; margin-top: 4px; display: inline-block; background-color: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid #f59e0b;"><i class="fa-solid fa-clock"></i> Handover Pending</div>`;
        }

        return `
        <tr>
            <td>
                <strong>${inv.invId}</strong>
                ${handoverStatusHtml}
            </td>
            <td>${inv.studentId}</td>
            <td>${inv.studentName}</td>
            <td>${inv.date}</td>
            <td><span class="badge ${badgeClass}" style="font-size: 0.75rem;">${pType}</span></td>
            <td>৳${inv.amount.toLocaleString()}</td>
            <td>
                <button class="btn btn-secondary btn-icon-only" onclick="printInvoice('${inv.studentId}', '${inv.invId}')" title="Print Invoice"><i class="fa-solid fa-print"></i></button>
            </td>
        </tr>
        `;
    }).join('');
}

function renderCertificatesTable() {
    const sQuery = certSearch.value.toLowerCase();

    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
    const canCert = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canCert);

    const filtered = students.filter(st => {
        return st.name.toLowerCase().includes(sQuery) || st.id.toLowerCase().includes(sQuery);
    });

    if (filtered.length === 0) {
        certsTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No records found.</td></tr>`;
        return;
    }

    certsTbody.innerHTML = filtered.map(st => `
        <tr>
            <td><strong>${st.id}</strong></td>
            <td>${st.name}</td>
            <td>${st.course}</td>
            <td>
                <span class="badge badge-${st.certified ? 'success' : 'secondary'}">
                    ${st.certified ? 'Graduated' : 'In Progress'}
                </span>
            </td>
            <td>${st.certified ? st.certificateDate : '---'}</td>
            <td>
                <div class="actions-cell">
                    ${st.certified ? 
                        `<button class="btn btn-secondary btn-icon-only" onclick="printCertificate('${st.id}')" title="Print Certificate"><i class="fa-solid fa-print"></i></button>
                         ${canCert ? `<button class="btn btn-secondary btn-icon-only" style="color: var(--danger);" onclick="toggleCertificate('${st.id}', false)" title="Revoke Certificate"><i class="fa-solid fa-xmark"></i></button>` : ''}` :
                        `${canCert ? `<button class="btn btn-primary" onclick="toggleCertificate('${st.id}', true)"><i class="fa-solid fa-check"></i> Award</button>` : '---'}`
                    }
                </div>
            </td>
        </tr>
    `).join('');
}

// --- MODALS ENGINE ---
function setupModals() {
    // Student Modals opening triggers
    const triggerStudentModal = (title, mode) => {
        studentModalTitle.innerText = title;
        studentForm.reset();
        studentIdField.value = "";
        
        const singleCourseGroup = document.getElementById('single-course-group');
        const multiCourseGroup = document.getElementById('multi-course-group');
        const courseDetailsContainer = document.getElementById('course-details-container');
        
        // Reset checkboxes and container
        document.querySelectorAll('.course-checkbox').forEach(cb => cb.checked = false);
        if (courseDetailsContainer) {
            courseDetailsContainer.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin: 0.5rem 0;">Please select at least one course track.</p>';
        }
        
        if (mode === 'add') {
            studentFinancialFields.style.display = 'grid';
            if (singleCourseGroup) singleCourseGroup.style.display = 'none';
            if (multiCourseGroup) multiCourseGroup.style.display = 'block';
            
            // Disable original required fields so they don't block submit validation
            studentCourse.disabled = true;
            studentBatch.disabled = true;
            studentCourse.removeAttribute('required');
            studentBatch.removeAttribute('required');
        } else {
            studentFinancialFields.style.display = 'none';
            if (singleCourseGroup) singleCourseGroup.style.display = 'block';
            if (multiCourseGroup) multiCourseGroup.style.display = 'none';
            
            studentCourse.disabled = true;
            studentBatch.disabled = true;
            studentCourse.setAttribute('required', 'required');
            studentBatch.setAttribute('required', 'required');
        }
        openModal(studentModal);
    };

    if (adminAddStudentBtn) {
        adminAddStudentBtn.addEventListener('click', () => {
            const tabBtn = document.querySelector('.sidebar-item[data-tab="registration"]');
            if (tabBtn) tabBtn.click();
        });
    }
    if (dashboardAddStudentBtn) {
        dashboardAddStudentBtn.addEventListener('click', () => {
            const tabBtn = document.querySelector('.sidebar-item[data-tab="registration"]');
            if (tabBtn) tabBtn.click();
        });
    }

    // Dynamic batch populate in student form select
    studentCourse.addEventListener('change', () => {
        updateStudentModalBatches(studentCourse.value, studentBatch);
    });

    studentBatch.addEventListener('change', () => {
        const course = studentCourse.value;
        const bName = studentBatch.value;
        const batches = settings.batches || defaultBatches;
        const matched = batches.find(b => b.course === course && b.name === bName);
        if (matched) {
            studentFeeTotal.value = matched.fee;
            studentFeeDiscount.value = matched.discount;
            recalculateStudentNetFee();
        }
    });

    studentFeeTotal.addEventListener('input', recalculateStudentNetFee);
    studentFeeDiscount.addEventListener('input', recalculateStudentNetFee);

    // Close buttons logic
    document.querySelectorAll('.modal-close, .modal-close-btn, .modal-backdrop').forEach(elem => {
        elem.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Escape Key close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // Initialize multi-course checkbox listeners
    setupMultiCourseListeners();
}

function openModal(modal) {
    if (modal) modal.classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    // Do not hide portal login window
    if (sessionStorage.getItem('ediz_admin_auth') !== 'true') {
        authGate.classList.add('active');
        authGate.style.display = 'flex';
    }
}

// --- DATA CRUD OPERATIONS ---
function setupDataOperations() {
    // Student Add/Edit Save
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = studentIdField.value;
        let newlyRegisteredStudentsArray = null;
        const name = studentName.value;
        const phone = studentPhone.value;
        const father = studentFather.value;
        const mother = studentMother.value;
        const guardian = studentGuardianPhone.value;
        const address = studentAddress.value;
        const course = studentCourse.value;
        const batchName = studentBatch.value;

        // Validation helpers
        function validateBDMobile(num) {
            if (!num) return false;
            const digits = num.replace(/\D/g, ''); // strip non-digits
            return /^01[3-9]\d{8}$/.test(digits);
        }

        // Clean numbers for comparison and validation
        const strippedPhone = phone.replace(/\D/g, '');
        const strippedGuardian = guardian.replace(/\D/g, '');

        if (!validateBDMobile(phone)) {
            alert("Please enter a valid 11-digit Bangladeshi mobile number for the student (e.g. 017xxxxxxxx).");
            return;
        }
        if (!validateBDMobile(guardian)) {
            alert("Please enter a valid 11-digit Bangladeshi mobile number for the guardian (e.g. 017xxxxxxxx).");
            return;
        }
        if (strippedPhone === strippedGuardian) {
            alert("Student Mobile Number and Guardian Mobile Number cannot be the same.");
            return;
        }
        if (!father.trim()) {
            alert("Father's Name is required.");
            return;
        }

        if (id) {
            // Edit existing student
            const targetStudent = students.find(s => s.id === id);
            if (targetStudent) {
                const currentRegId = targetStudent.registrationId;
                
                // Find all records that match the student's Registration ID
                const relatedRecords = students.filter(s => s.registrationId === currentRegId);
                
                // Track changes for Admin notification
                let changes = [];
                const first = targetStudent;
                if (first.name !== name) changes.push(`Name: '${first.name}' -> '${name}'`);
                if (first.phone !== phone) changes.push(`Phone: '${first.phone}' -> '${phone}'`);
                if (first.fatherName !== father) changes.push(`Father: '${first.fatherName || 'N/A'}' -> '${father}'`);
                if (first.motherName !== mother) changes.push(`Mother: '${first.motherName || 'N/A'}' -> '${mother}'`);
                if (first.guardianPhone !== guardian) changes.push(`Guardian: '${first.guardianPhone || 'N/A'}' -> '${guardian}'`);
                if (first.address !== address) changes.push(`Address: '${first.address || 'N/A'}' -> '${address}'`);
                
                // Check if batch changed (only for targetStudent since course is locked)
                const oldBatch = targetStudent.batch || '';
                const newBatch = batchName || '';
                let batchChanged = false;
                if (oldBatch !== newBatch) {
                    targetStudent.batch = newBatch;
                    changes.push(`Batch: '${oldBatch}' -> '${newBatch}'`);
                    batchChanged = true;
                }
                
                // Update all related records
                relatedRecords.forEach(s => {
                    s.name = name;
                    s.phone = phone;
                    s.fatherName = father;
                    s.motherName = mother;
                    s.guardianPhone = guardian;
                    s.address = address;
                });

                // If changes occurred, notify admin via SMS and register in Handover Board audit logs
                if (changes.length > 0) {
                    const collectorVal = document.getElementById('student-collector').value;
                    const editorName = collectorVal || JSON.parse(sessionStorage.getItem('ediz_active_user')).name || JSON.parse(sessionStorage.getItem('ediz_active_user')).username || 'System';
                    const changeLog = changes.join(', ');
                    
                    // Create audit log object
                    const auditLogId = "AUD-" + Date.now();
                    const auditRecord = {
                        id: auditLogId,
                        type: batchChanged ? 'Batch Transfer' : 'Profile Edit',
                        date: getLocalDateString(),
                        timestamp: Date.now(),
                        details: changeLog,
                        collectedBy: editorName,
                        receivedByAdmin: false,
                        studentId: targetStudent.id,
                        studentName: targetStudent.name,
                        course: targetStudent.course
                    };
                    
                    targetStudent.auditLogs = targetStudent.auditLogs || [];
                    targetStudent.auditLogs.push(auditRecord);
                    
                    const adminMsg = `EDIZ IT Alert: Student ${targetStudent.name} (${targetStudent.id}) details edited by ${editorName}. Changes: ${changeLog}`;
                    const adminPhone = "01798926897";
                    sendGeneralSms(adminPhone, adminMsg, "Admin Edit Notification");
                }
            }
        } else {
            // Add new offline student
            // Get selected courses and batches
            const checkedBoxes = Array.from(document.querySelectorAll('.course-checkbox:checked'));
            if (checkedBoxes.length === 0) {
                alert("Please select at least one course track.");
                return;
            }

            let courseDetailsList = [];
            let validationFailed = false;

            document.querySelectorAll('.course-detail-row').forEach(row => {
                const cName = row.getAttribute('data-course');
                const bSelect = row.querySelector('.course-batch-select');
                const bName = bSelect.value;

                if (!bName) {
                    alert(`Please select a batch for the course: ${cName}`);
                    validationFailed = true;
                    return;
                }

                let feeVal = parseFloat(row.querySelector('.course-fee-input').value) || 0;
                const discVal = parseFloat(row.querySelector('.course-discount-input').value) || 0;
                const paidVal = parseFloat(row.querySelector('.course-paid-input').value) || 0;
                
                const bookCb = row.querySelector('.course-book-checkbox');
                const takenBook = bookCb ? bookCb.checked : false;
                
                let netVal = feeVal - discVal;
                if (takenBook) {
                    netVal += 200;
                    feeVal += 200; // Include book in the total fee for this course
                }

                courseDetailsList.push({
                    course: cName,
                    batch: bName,
                    fee: feeVal,
                    discount: discVal,
                    net: netVal,
                    paid: paidVal,
                    takenBook: takenBook
                });
            });

            if (validationFailed) return;

            const totalPaid = courseDetailsList.reduce((sum, item) => sum + item.paid, 0);
            if (totalPaid <= 0) {
                alert("Initial paid amount must be greater than 0. Admission cannot be confirmed without payment.");
                return;
            }

            const todayStr = getLocalDateString();

            // 1. Generate shared Invoice ID & Registration ID
            const invId = getNextInvoiceId();
            const registrationId = getNextRegistrationId();

            // 2. Create separate student records (one per course)
            let newlyCreatedStudents = [];

            courseDetailsList.forEach((item, idx) => {
                const cName = item.course;
                const bName = item.batch;
                const feeVal = item.fee;
                const discVal = item.discount;
                const netVal = item.net;
                const coursePaid = item.paid;
                const courseDue = netVal - coursePaid;
                const takenBook = item.takenBook || false;

                // Generate prefix-based ID for this specific course track
                const studentId = generateNextStudentId(cName, students, newlyCreatedStudents);

                const status = coursePaid >= netVal ? 'Paid' : (coursePaid > 0 ? 'Partial' : 'Unpaid');

                const collectorVal = document.getElementById('student-collector').value;
                const selectedCollectorObj = findCollectorUser(collectorVal);
                const receivedByAdmin = false;

                let invoicesList = [];
                if (takenBook) {
                    if (coursePaid >= 200) {
                        invoicesList.push({
                            id: invId + "-B",
                            date: todayStr,
                            amount: 200,
                            paymentType: 'Book Payment',
                            collectedBy: collectorVal,
                            receivedByAdmin: receivedByAdmin
                        });
                        invoicesList.push({
                            id: invId,
                            date: todayStr,
                            amount: coursePaid - 200,
                            paymentType: 'New Registration',
                            collectedBy: collectorVal,
                            receivedByAdmin: receivedByAdmin
                        });
                    } else {
                        invoicesList.push({
                            id: invId + "-B",
                            date: todayStr,
                            amount: coursePaid,
                            paymentType: 'Book Payment',
                            collectedBy: collectorVal,
                            receivedByAdmin: receivedByAdmin
                        });
                    }
                } else {
                    invoicesList.push({
                        id: invId,
                        date: todayStr,
                        amount: coursePaid,
                        paymentType: 'New Registration',
                        collectedBy: collectorVal,
                        receivedByAdmin: receivedByAdmin
                    });
                }

                const newStObj = {
                    registrationId: registrationId,
                    id: studentId,
                    name: name,
                    phone: phone,
                    fatherName: father,
                    motherName: mother,
                    guardianPhone: guardian,
                    address: address,
                    course: cName,
                    batch: bName,
                    registrationDate: todayStr,
                    status: status,
                    totalFee: feeVal,
                    discountFee: discVal,
                    netFee: netVal,
                    paidFee: coursePaid,
                    dueFee: courseDue,
                    takenBook: takenBook,
                    nextPaymentDate: courseDue > 0 ? document.getElementById('student-next-payment-date').value : '',
                    invoices: invoicesList,
                    certified: false,
                    certificateDate: ''
                };

                students.push(newStObj);
                newlyCreatedStudents.push(newStObj);

                // Trigger Welcome SMS async dispatch for this course
                setTimeout(() => {
                    sendAutomatedWelcomeSms(newStObj);
                }, 500 + (idx * 200));
            });

            newlyRegisteredStudentsArray = newlyCreatedStudents;
        }

        saveDatabase();
        if (newlyRegisteredStudentsArray && newlyRegisteredStudentsArray.length > 0) {
            closeAllModals();
            showRegistrationSuccessModal(newlyRegisteredStudentsArray);

            // Send Admin Admission Notification SMS
            const adminPhone = "01798926897";
            const studentNames = newlyRegisteredStudentsArray[0].name;
            const courseInfos = newlyRegisteredStudentsArray.map(s => `${s.course} (${s.batch})`).join(', ');
            const totalNet = newlyRegisteredStudentsArray.reduce((sum, s) => sum + s.netFee, 0);
            const totalPaid = newlyRegisteredStudentsArray.reduce((sum, s) => sum + s.paidFee, 0);
            const totalDue = totalNet - totalPaid;
            const hasBook = newlyRegisteredStudentsArray.some(s => s.takenBook);
            
            let adminMsg = `Dear Admin, student ${studentNames} has enrolled in ${courseInfos}. Net Fee: ৳${totalNet}, Paid: ৳${totalPaid}, Due: ৳${totalDue}.`;
            if (hasBook) {
                const totalStock = bookStock;
                const basicComputerStudents = students.filter(s => s.course && s.course.includes("Basic Computer"));
                const booksSold = basicComputerStudents.filter(s => s.takenBook === true).length;
                const booksAvailable = Math.max(0, totalStock - booksSold);
                adminMsg += ` (Book Included. Remaining books in stock: ${booksAvailable})`;
            }
            sendGeneralSms(adminPhone, adminMsg, "Admin Admission Notification");
        } else {
            closeAllModals();
        }
    });

    // Settings Add Batch Trigger Modal
    const settingsCreateBatchBtn = document.getElementById('settings-create-batch-btn');
    if (settingsCreateBatchBtn) {
        settingsCreateBatchBtn.addEventListener('click', () => {
            openBatchModal();
        });
    }

    const batchesCreateBtn = document.getElementById('batches-create-btn');
    if (batchesCreateBtn) {
        batchesCreateBtn.addEventListener('click', () => {
            openBatchModal();
        });
    }

    // Save Billing Fees
    paymentForm.addEventListener('submit', (e) => {
        try {
            e.preventDefault();
            if (!activeStudentForFees) return;

            const amount = parseInt(paymentAmount.value);
            if (isNaN(amount) || amount <= 0) {
                alert("Please input a valid positive amount.");
                return;
            }

            const currentRegId = activeStudentForFees.registrationId;
            const allStudentRecords = students.filter(s => s.registrationId === currentRegId);
            const totalDueFee = allStudentRecords.reduce((sum, s) => sum + (s.dueFee || 0), 0);

        if (amount > totalDueFee) {
            alert(`Error: Student only has combined outstanding balance of ৳${totalDueFee.toLocaleString()}. You cannot collect more.`);
            return;
        }

        const mode = document.querySelector('input[name="allocation-mode"]:checked')?.value || 'auto';
        const newInvId = getNextInvoiceId();
        const currentDate = getLocalDateString();
        const nextPaymentDateVal = document.getElementById('payment-next-date').value;
        const collectorVal = document.getElementById('payment-collector').value;
        const receivedByAdmin = false;

        let appliedPayments = [];

        if (mode === 'manual') {
            const manualFieldsList = document.getElementById('manual-allocation-fields-list');
            const manualInputs = manualFieldsList ? manualFieldsList.querySelectorAll('.manual-course-allocation-input') : [];
            let totalAllocatedSum = 0;
            let allocations = [];

            manualInputs.forEach(inp => {
                const sId = inp.getAttribute('data-student-id');
                const val = parseInt(inp.value) || 0;
                const maxDue = parseInt(inp.getAttribute('data-max-due')) || 0;

                if (val > 0) {
                    if (val > maxDue) {
                        alert(`Allocation for ${sId} exceeds outstanding due fee.`);
                        return;
                    }
                    allocations.push({ sId, val });
                    totalAllocatedSum += val;
                }
            });

            if (totalAllocatedSum !== amount) {
                alert(`Error: Total allocated amount (৳${totalAllocatedSum.toLocaleString()}) does not match the payment amount (৳${amount.toLocaleString()}).`);
                return;
            }

            allocations.forEach(alloc => {
                const record = allStudentRecords.find(s => s.id === alloc.sId);
                if (record) {
                    record.paidFee += alloc.val;
                    record.dueFee -= alloc.val;
                    const targetNet = record.netFee !== undefined ? record.netFee : record.totalFee;
                    record.status = record.paidFee >= targetNet ? 'Paid' : 'Partial';

                    if (!record.invoices) record.invoices = [];
                    record.invoices.push({
                        id: newInvId,
                        date: currentDate,
                        amount: alloc.val,
                        paymentType: 'Due Collection',
                        collectedBy: collectorVal,
                        receivedByAdmin: receivedByAdmin
                    });

                    appliedPayments.push({
                        course: record.course,
                        id: record.id,
                        amount: alloc.val,
                        due: record.dueFee
                    });
                }
            });
        } else {
            // Auto Allocation Mode (Legacy Behavior)
            let remainingPayment = amount;

            const sortedRecordsForPayment = [...allStudentRecords].sort((a, b) => {
                if (a.id === activeStudentForFees.id) return -1;
                if (b.id === activeStudentForFees.id) return 1;
                return b.dueFee - a.dueFee;
            });

            sortedRecordsForPayment.forEach(record => {
                if (remainingPayment <= 0 || record.dueFee <= 0) return;

                const paymentShare = Math.min(remainingPayment, record.dueFee);

                record.paidFee += paymentShare;
                record.dueFee -= paymentShare;
                const targetNet = record.netFee !== undefined ? record.netFee : record.totalFee;
                record.status = record.paidFee >= targetNet ? 'Paid' : 'Partial';

                if (!record.invoices) record.invoices = [];
                record.invoices.push({
                    id: newInvId,
                    date: currentDate,
                    amount: paymentShare,
                    paymentType: 'Due Collection',
                    collectedBy: collectorVal,
                    receivedByAdmin: receivedByAdmin
                });

                appliedPayments.push({
                    course: record.course,
                    id: record.id,
                    amount: paymentShare,
                    due: record.dueFee
                });

                remainingPayment -= paymentShare;
            });
        }

        // Smart Next Payment Date System: update reminder date
        const totalRemainingCombinedDue = allStudentRecords.reduce((sum, s) => sum + (s.dueFee || 0), 0);
        allStudentRecords.forEach(record => {
            if (totalRemainingCombinedDue > 0) {
                if (nextPaymentDateVal) {
                    record.nextPaymentDate = nextPaymentDateVal;
                    // Reset reminder sent flag since a new date is selected
                    const todayStr = getLocalDateString();
                    if (nextPaymentDateVal > todayStr) {
                        delete record.lastReminderSentDate;
                    }
                }
            } else {
                delete record.nextPaymentDate;
                delete record.lastReminderSentDate;
            }
        });

        saveDatabase();
        paymentAmount.value = '';
        renderPaymentModal(activeStudentForFees.id);

        const coursePaymentDetails = appliedPayments.map(p => `${p.course} (Paid: ৳${p.amount.toLocaleString()}, Due: ৳${p.due.toLocaleString()})`).join(', ');
        const totalCombinedDue = allStudentRecords.reduce((sum, s) => sum + (s.dueFee || 0), 0);
        
        const studentMsg = `Dear ${activeStudentForFees.name}, we have received your payment of ৳${amount.toLocaleString()} for: ${coursePaymentDetails}. Combined outstanding due is ৳${totalCombinedDue.toLocaleString()}. Thank you!`;
        sendGeneralSms(activeStudentForFees.phone, studentMsg, "Student Payment Receipt");

        const adminPhone = "01798926897";
        const adminMsg = `Dear Admin, student ${activeStudentForFees.name} has paid a total of ৳${amount.toLocaleString()} for: ${coursePaymentDetails}. Combined Due: ৳${totalCombinedDue.toLocaleString()}.`;
        sendGeneralSms(adminPhone, adminMsg, "Admin Payment Notification");
        } catch (error) {
            console.error("Payment Submission Error:", error);
            alert("Error saving bill: " + error.message);
        }
    });

    // Settings details save
    settingsDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        settings.phone = settingsPhone.value;
        settings.address = settingsAddress.value;
        settings.courseFees = {
            "Graphic Design": parseInt(settingsPriceGraphic.value),
            "Basic Computer": parseInt(settingsPriceBasic.value),
            "Spoken English": parseInt(settingsPriceEnglish.value)
        };
        settings.lightLogo = settingsLogoLight.value;
        settings.darkLogo = settingsLogoDark.value;

        saveDatabase();
        alert("Configuration updated successfully!");
        
        // Reapply themes/logos
        const curTheme = document.documentElement.getAttribute('data-theme');
        applyTheme(curTheme);
    });

    // Settings credentials change (Email, Recovery Email & Password) without Current Password validation
    if (settingsPasswordForm) {
        settingsPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailVal = settingsAdminEmail.value.trim().toLowerCase();
            const recoveryEmailVal = settingsAdminRecoveryEmail.value.trim().toLowerCase();
            const newPwdVal = settingsPwdNew.value.trim();

            const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user'));
            if (!activeUser) {
                alert("Error: No active user session found.");
                return;
            }

            const dbUser = settings.users.find(u => u.email.toLowerCase() === activeUser.email.toLowerCase());
            if (!dbUser) {
                alert("Error: User account not found in database.");
                return;
            }

            // Check if email is already taken by another user
            const emailExists = settings.users.some(u => u.email.toLowerCase() === emailVal && u.id !== dbUser.id);
            if (emailExists) {
                alert(`Error: A user account with email "${emailVal}" already exists.`);
                return;
            }

            // Update user details
            dbUser.email = emailVal;
            dbUser.recoveryEmail = recoveryEmailVal;
            if (newPwdVal) {
                dbUser.password = newPwdVal;
                // Update global settings.adminPassword for backward compatibility if it's the Owner/first user
                if (dbUser.role === 'Owner') {
                    settings.adminPassword = newPwdVal;
                }
            }

            saveDatabase();
            
            // Update the session storage active user
            sessionStorage.setItem('ediz_active_user', JSON.stringify(dbUser));
            
            alert("Credentials updated successfully!");
            settingsPasswordForm.reset();

            // Re-populate the fields
            settingsAdminEmail.value = dbUser.email;
            settingsAdminRecoveryEmail.value = dbUser.recoveryEmail || dbUser.email;
            
            // Refresh settings user directory
            renderSettingsStaff();
            renderSettingsTeachers();
        });
    }



    // Database Export JSON
    dbExportBtn.addEventListener('click', () => {
        const fullDb = {
            students: students,
            settings: settings
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDb, null, 4));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `ediz_it_backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Database Import JSON
    dbImportFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const importedDb = JSON.parse(evt.target.result);
                if (importedDb && importedDb.students && importedDb.settings) {
                    if (confirm("WARNING: Importing this backup will overwrite ALL current portal registry data. Do you want to proceed?")) {
                        localStorage.setItem('ediz_students', JSON.stringify(importedDb.students));
                        localStorage.setItem('ediz_settings', JSON.stringify(importedDb.settings));
                        alert("Database restored successfully!");
                        window.location.reload();
                    }
                } else {
                    alert("Error: Invalid backup file format.");
                }
            } catch (err) {
                alert("Error reading JSON backup file.");
            }
        };
        reader.readAsText(file);
    });

    // Settings Add User Account Save
    const addStaffForm = document.getElementById('add-staff-form');
    if (addStaffForm) {
        const userRoleSelect = document.getElementById('user-role-select');
        const userPermsSection = document.getElementById('user-permissions-section');
        const adminRecoveryFields = document.getElementById('admin-recovery-fields');
        if (userRoleSelect) {
            userRoleSelect.addEventListener('change', () => {
                if (userRoleSelect.value === 'Admin') {
                    if (userPermsSection) userPermsSection.style.display = 'none';
                    if (adminRecoveryFields) adminRecoveryFields.style.display = 'block';
                } else {
                    if (userPermsSection) userPermsSection.style.display = 'block';
                    if (adminRecoveryFields) adminRecoveryFields.style.display = 'none';
                }
            });
        }

        addStaffForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailVal = document.getElementById('staff-email-input').value.trim();
            const pwdVal = document.getElementById('staff-pwd-input').value.trim();
            const roleVal = userRoleSelect ? userRoleSelect.value : 'Staff';
            
            let permissionsObj = {
                canEdit: true,
                canDelete: true,
                canInvoice: true,
                canCert: true,
                canCreateBatch: true
            };

            const phoneVal = document.getElementById('user-phone-input').value.trim();
            let questionVal = "What is your birth city?";
            let answerVal = "comilla";

            if (roleVal === 'Staff') {
                permissionsObj = {
                    canEdit: document.getElementById('perm-edit').checked,
                    canDelete: document.getElementById('perm-delete').checked,
                    canInvoice: document.getElementById('perm-invoice').checked,
                    canCert: document.getElementById('perm-cert').checked,
                    canCreateBatch: document.getElementById('perm-create-batch').checked
                };
            } else if (roleVal === 'Admin') {
                const qVal = document.getElementById('user-question-input').value.trim();
                const aVal = document.getElementById('user-answer-input').value.trim();
                if (qVal) questionVal = qVal;
                if (aVal) answerVal = aVal;
            }

            if (settings.users.some(u => u.email === emailVal)) {
                alert(`Error: A user account with email "${emailVal}" already exists.`);
                return;
            }

            const newStaffId = `USER-${settings.users.length + 1}`;
            settings.users.push({
                id: newStaffId,
                email: emailVal,
                password: pwdVal,
                role: roleVal,
                permissions: permissionsObj,
                phone: phoneVal,
                securityQuestion: questionVal,
                securityAnswer: answerVal
            });

            saveDatabase();
            addStaffForm.reset();
            if (userPermsSection) userPermsSection.style.display = 'block'; // Reset display to default
            if (adminRecoveryFields) adminRecoveryFields.style.display = 'none'; // Reset display to default
            renderSettingsStaff(); // Update active users table
            renderSettingsTeachers();
            alert(`Account for "${emailVal}" (${roleVal}) created successfully!`);
        });
    }

    // Settings Add Teacher Account Save
    const addTeacherForm = document.getElementById('add-teacher-form');
    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('teacher-name-input').value.trim();
            const phoneVal = document.getElementById('teacher-phone-input').value.trim();
            const emailVal = document.getElementById('teacher-email-input').value.trim();

            if (!settings.teachers) settings.teachers = [];

            if (settings.teachers.some(t => t.name.toLowerCase() === nameVal.toLowerCase())) {
                alert(`Error: A teacher named "${nameVal}" already exists.`);
                return;
            }

            const newTeacherId = `TCH-${Date.now()}`;
            settings.teachers.push({
                id: newTeacherId,
                name: nameVal,
                phone: phoneVal,
                email: emailVal
            });

            saveDatabase();
            addTeacherForm.reset();
            renderSettingsTeachers();
            alert(`Teacher "${nameVal}" added successfully!`);
        });
    }
}

// --- STUDENT ACTION WINDOW CALLS ---
window.openEditStudentModal = function(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    studentIdField.value = st.id;
    studentName.value = st.name;
    studentPhone.value = st.phone;
    studentFather.value = st.fatherName || '';
    studentMother.value = st.motherName || '';
    studentGuardianPhone.value = st.guardianPhone || '';
    studentAddress.value = st.address;
    studentCourse.value = st.course;

    // Load and select batch
    updateStudentModalBatches(st.course, studentBatch);
    studentBatch.value = st.batch || '';

    studentModalTitle.innerText = `Edit Profile (${st.id})`;
    studentFinancialFields.style.display = 'none';
    studentCourse.disabled = true;
    studentBatch.disabled = false;

    openModal(studentModal);
};

window.deleteStudent = function(id) {
    if (confirm(`Are you sure you want to permanently delete student ${id}? This deletes all payment and certificate records.`)) {
        students = students.filter(s => s.id !== id);
        saveDatabase();
    }
};

// --- PAYMENT ACTION WINDOW CALLS ---
window.openPaymentModal = function(id) {
    renderPaymentModal(id);
    openModal(feesModal);
};

function renderPaymentModal(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    activeStudentForFees = st;
    
    // Group courses by matching Registration ID
    const currentRegId = st.registrationId;
    const allStudentRecords = students.filter(s => s.registrationId === currentRegId);
    
    feesStudentName.innerText = st.name;
    
    if (allStudentRecords.length > 1) {
        feesStudentId.innerText = `IDs: ${allStudentRecords.map(s => s.id).join(', ')}`;
        feesStudentCourse.innerHTML = `Programs:<br>` + allStudentRecords.map(s => {
            const dueText = s.dueFee > 0 ? `<span style="color: var(--danger); font-weight: 700;">(Due: ৳${s.dueFee})</span>` : `<span style="color: var(--success);">(Paid)</span>`;
            return `• ${s.course}: ৳${s.totalFee} ${dueText}`;
        }).join('<br>');
        
        const totalFee = allStudentRecords.reduce((sum, s) => sum + (s.totalFee || 0), 0);
        const paidFee = allStudentRecords.reduce((sum, s) => sum + (s.paidFee || 0), 0);
        const dueFee = allStudentRecords.reduce((sum, s) => sum + (s.dueFee || 0), 0);
        
        feesTotalVal.innerText = `৳${totalFee.toLocaleString()}`;
        feesPaidVal.innerText = `৳${paidFee.toLocaleString()}`;
        feesDueVal.innerText = `৳${dueFee.toLocaleString()}`;
    } else {
        feesStudentId.innerText = `Student ID: ${st.id}`;
        feesStudentCourse.innerText = `Program: ${st.course}`;
        feesTotalVal.innerText = `৳${st.totalFee.toLocaleString()}`;
        feesPaidVal.innerText = `৳${st.paidFee.toLocaleString()}`;
        feesDueVal.innerText = `৳${st.dueFee.toLocaleString()}`;
    }

    // Reset Allocation Mode to 'auto'
    const autoRadio = document.querySelector('input[name="allocation-mode"][value="auto"]');
    if (autoRadio) autoRadio.checked = true;

    const paymentAmountInput = document.getElementById('payment-amount');
    if (paymentAmountInput) {
        paymentAmountInput.value = '';
        paymentAmountInput.readOnly = false;
    }

    const manualAllocContainer = document.getElementById('manual-allocation-container');
    if (manualAllocContainer) manualAllocContainer.style.display = 'none';

    const nextDateContainer = document.getElementById('payment-next-date-container');
    const nextDateInput = document.getElementById('payment-next-date');
    if (nextDateContainer) nextDateContainer.style.display = 'none';
    if (nextDateInput) {
        nextDateInput.value = '';
        nextDateInput.removeAttribute('required');
    }

    // Populate manual allocation fields list
    const manualFieldsList = document.getElementById('manual-allocation-fields-list');
    if (manualFieldsList) {
        const dueRecords = allStudentRecords.filter(s => s.dueFee > 0);
        if (dueRecords.length > 0) {
            manualFieldsList.innerHTML = dueRecords.map(s => {
                return `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 0.85rem;">
                    <span style="font-weight: 600; flex: 1;">${s.course} (Due: ৳${s.dueFee.toLocaleString()}):</span>
                    <input type="number" class="form-control manual-course-allocation-input" data-student-id="${s.id}" data-max-due="${s.dueFee}" placeholder="0" min="0" max="${s.dueFee}" style="height: 32px; width: 120px; text-align: right; background-color: var(--bg-card); color: var(--text-color); border: 1px solid var(--border-color);">
                </div>
                `;
            }).join('');

            // Setup input listener to sum values and update main input
            const manualInputs = manualFieldsList.querySelectorAll('.manual-course-allocation-input');
            manualInputs.forEach(inp => {
                inp.addEventListener('input', () => {
                    let maxDue = parseInt(inp.getAttribute('data-max-due')) || 0;
                    let val = parseInt(inp.value) || 0;
                    if (val > maxDue) {
                        inp.value = maxDue;
                        val = maxDue;
                    }
                    if (val < 0) {
                        inp.value = 0;
                        val = 0;
                    }

                    // Sum all manual inputs
                    let totalAllocated = 0;
                    manualInputs.forEach(i => {
                        totalAllocated += parseInt(i.value) || 0;
                    });

                    // Set main input
                    if (paymentAmountInput) {
                        paymentAmountInput.value = totalAllocated;
                        // Trigger input event to update next payment date logic
                        paymentAmountInput.dispatchEvent(new Event('input'));
                    }
                });
            });
        } else {
            manualFieldsList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted);">No outstanding course dues to allocate.</div>`;
        }
    }

    // Combine invoices across all matching records so they can print from a single list
    let combinedInvoicesMap = new Map();
    allStudentRecords.forEach(s => {
        if (s.invoices) {
            s.invoices.forEach(inv => {
                if (combinedInvoicesMap.has(inv.id)) {
                    const existing = combinedInvoicesMap.get(inv.id);
                    existing.amount += inv.amount;
                    if (!existing.courses.includes(s.course)) {
                        existing.courses.push(s.course);
                    }
                } else {
                    combinedInvoicesMap.set(inv.id, {
                        id: inv.id,
                        date: inv.date,
                        paymentType: inv.paymentType,
                        amount: inv.amount,
                        courses: [s.course],
                        studentId: s.id
                    });
                }
            });
        }
    });

    const combinedInvoicesList = Array.from(combinedInvoicesMap.values()).sort((a, b) => b.id.localeCompare(a.id));

    if (combinedInvoicesList.length > 0) {
        feesLedgerTbody.innerHTML = combinedInvoicesList.map(inv => {
            let pType = inv.paymentType || 'Due Collection';
            const courseLabel = inv.courses.length > 1 ? `Joint (${inv.courses.join(', ')})` : inv.courses[0];
            const badgeClass = pType === 'New Registration' ? 'badge-success' : (pType === 'Book Payment' ? 'badge-primary' : 'badge-warning');
            
            return `
            <tr>
                <td><strong>${inv.id}</strong><div style="font-size: 0.7rem; color: var(--text-muted);">${courseLabel}</div></td>
                <td>${inv.date}</td>
                <td><span class="badge ${badgeClass}" style="font-size: 0.75rem;">${pType}</span></td>
                <td>৳${inv.amount.toLocaleString()}</td>
                <td>
                    <button class="btn btn-secondary btn-icon-only" onclick="printInvoice('${inv.studentId}', '${inv.id}')" title="Print"><i class="fa-solid fa-print"></i></button>
                </td>
            </tr>
            `;
        }).join('');
    } else {
        feesLedgerTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1rem;">No payments registered.</td></tr>`;
    }

    // Toggle Waive Dues Section based on role and dues
    const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user'));
    const totalDueFee = allStudentRecords.reduce((sum, s) => sum + (s.dueFee || 0), 0);
    const isAdminOrOwner = activeUser && (activeUser.role === 'Owner' || activeUser.role === 'Admin');

    if (isAdminOrOwner && totalDueFee > 0 && waiveDuesSection) {
        waiveDuesSection.style.display = 'block';
        if (waiveCourseSelect) {
            waiveCourseSelect.innerHTML = allStudentRecords
                .filter(s => s.dueFee > 0)
                .map(s => `<option value="${s.id}">${s.course} (Due: ৳${s.dueFee.toLocaleString()})</option>`)
                .join('');
        }
        if (waiveAmount) waiveAmount.value = '';
    } else if (waiveDuesSection) {
        waiveDuesSection.style.display = 'none';
    }
    defaultCollectorInputs();
}

window.toggleCertificate = function(id, status) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    if (status && st.dueFee > 0) {
        alert(`Cannot award certificate. Student ${st.name} (ID: ${st.id}) has outstanding dues of ৳${st.dueFee.toLocaleString()}. Please clear all dues first.`);
        return;
    }

    st.certified = status;
    st.certificateDate = status ? getLocalDateString() : '';
    
    if (status) {
        const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { username: 'System', name: 'System' };
        const editorName = activeUser.name || activeUser.username || 'System';
        
        const auditLogId = "AUD-" + Date.now();
        const auditRecord = {
            id: auditLogId,
            type: 'Certificate Issued',
            date: getLocalDateString(),
            timestamp: Date.now(),
            details: `Graduation certificate awarded for course: ${st.course}`,
            collectedBy: editorName,
            receivedByAdmin: false,
            studentId: st.id,
            studentName: st.name,
            course: st.course
        };
        
        st.auditLogs = st.auditLogs || [];
        st.auditLogs.push(auditRecord);
        
        // Notify admin via SMS
        const adminMsg = `EDIZ IT Alert: Certificate issued for ${st.name} (${st.id}) by ${editorName} for course: ${st.course}`;
        const adminPhone = "01798926897";
        sendGeneralSms(adminPhone, adminMsg, "Admin Cert Notification");
    } else {
        // Clean up certificate audit logs that are not verified yet
        if (st.auditLogs) {
            st.auditLogs = st.auditLogs.filter(log => !(log.type === 'Certificate Issued' && !log.receivedByAdmin));
        }
    }
    
    saveDatabase();
};

// --- PRINT RECEIPT ENGINE ---
window.printInvoice = function(studentId, invoiceId) {
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    const currentRegId = targetStudent.registrationId;
    const allRecords = students.filter(s => s.registrationId === currentRegId);
    
    let inv = null;
    for (let r of allRecords) {
        if (r.invoices) {
            inv = r.invoices.find(i => i.id === invoiceId);
            if (inv) break;
        }
    }
    if (!inv) return;

    const baseInvoiceId = invoiceId.replace(/-B$/, '');
    const paymentTypeLabel = getInvoicePaymentType(targetStudent, inv, targetStudent.invoices ? targetStudent.invoices.indexOf(inv) : 0);
    const logoName = 'Logo-03.png';

    const courseDetails = allRecords.map(s => {
        let paidToday = 0;
        if (s.invoices) {
            s.invoices.forEach(i => {
                if (i.id === baseInvoiceId || i.id === baseInvoiceId + "-B") {
                    paidToday += i.amount;
                }
            });
        }
        return {
            id: s.id,
            course: s.course,
            batch: s.batch,
            fee: s.totalFee,
            discount: s.discountFee || 0,
            net: s.netFee !== undefined ? s.netFee : s.totalFee,
            paid: s.paidFee || 0,
            due: s.dueFee || 0,
            paidToday: paidToday,
            takenBook: s.takenBook
        };
    });
    
    const studentIdDisplay = allRecords.map(s => `${s.id} (${s.course})`).join(', ');
    const totalNetFee = allRecords.reduce((sum, s) => sum + (s.netFee !== undefined ? s.netFee : s.totalFee), 0);
    const totalPaidFee = allRecords.reduce((sum, s) => sum + (s.paidFee || 0), 0);
    const totalDueFee = allRecords.reduce((sum, s) => sum + (s.dueFee || 0), 0);
    const totalPaidViaInvoice = allRecords.reduce((sum, s) => {
        let amt = 0;
        if (s.invoices) {
            s.invoices.forEach(i => {
                if (i.id === baseInvoiceId || i.id === baseInvoiceId + "-B") {
                    amt += i.amount;
                }
            });
        }
        return sum + amt;
    }, 0);

    const totalCourseFee = courseDetails.reduce((sum, item) => sum + (item.fee || 0), 0);
    const totalDiscount = courseDetails.reduce((sum, item) => sum + (item.discount || 0), 0);
    const isFullyPaid = totalDueFee === 0;
    const nextPaymentDateVal = targetStudent.nextPaymentDate || allRecords.map(s => s.nextPaymentDate).find(d => d) || '';

    const paidStampHtml = isFullyPaid ? `
        <div style="position: absolute; top: 40%; right: 15%; border: 3px double #16a34a; color: #16a34a; font-size: 15px; font-weight: 800; padding: 4px 12px; border-radius: 4px; transform: rotate(-8deg); text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; pointer-events: none; font-family: 'Outfit', 'Inter', sans-serif; border-color: #16a34a !important; color: #16a34a !important; background: rgba(22, 163, 74, 0.05); z-index: 9999;">
            FULL PAID
        </div>
    ` : '';

    // Helper to generate receipt HTML per copy
    function getInvoiceCopyHTML(copyLabel) {
        return `
            <div class="invoice-print" style="padding: 2.5mm 6mm; background: #fff; position: relative; font-size: 9px; font-family: 'Outfit', 'Inter', sans-serif; box-sizing: border-box; color: #000000 !important; line-height: 1.25; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    ${paidStampHtml}
                    <!-- Copy Label Badge -->
                    <div style="position: absolute; top: 2.5mm; right: 6mm; font-size: 7.5px; font-weight: 700; color: #4f46e5 !important; border: 1.5px solid #4f46e5 !important; padding: 1px 5px; border-radius: var(--radius-sm); text-transform: uppercase; letter-spacing: 0.5px;">
                        ${copyLabel}
                    </div>

                    <!-- Header -->
                    <div class="invoice-print-header" style="border-bottom: 2px solid #000; padding-bottom: 2px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <img src="${logoName}" alt="Ediz IT" class="invoice-print-logo" style="height: 32px;">
                            <p style="margin: 1px 0 0px 0; font-weight: 600; font-size: 9px; color: #0f172a !important;">Offline Computer & Spoken English Campus</p>
                            <p style="color: #475569 !important; font-size: 7.5px; margin: 0;">${settings.address} | Mobile: ${settings.phone}</p>
                        </div>
                        <div class="invoice-print-title" style="font-size: 16px; font-weight: 800; color: #0f172a !important; letter-spacing: 0.5px;">RECEIPT</div>
                    </div>
                    
                    <!-- Billed To Grid -->
                    <div class="invoice-print-grid" style="display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 6px; margin-bottom: 4px; line-height: 1.2; font-size: 8.5px;">
                        <div>
                            <h3 style="margin: 0 0 1px 0; font-size: 8.5px; font-weight: 700; color: #0f172a !important; text-transform: uppercase; letter-spacing: 0.5px;">Billed To:</h3>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Registration ID:</strong> ${targetStudent.registrationId}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Student Name:</strong> ${targetStudent.name}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Father's Name:</strong> ${targetStudent.fatherName || 'N/A'}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Student ID(s):</strong> ${studentIdDisplay}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Mobile:</strong> ${targetStudent.phone} | <strong>Guardian:</strong> ${targetStudent.guardianPhone || 'N/A'}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Address:</strong> ${targetStudent.address}</p>
                        </div>
                        <div style="text-align: right;">
                            <h3 style="margin: 0 0 1px 0; font-size: 8.5px; font-weight: 700; color: #0f172a !important; text-transform: uppercase; letter-spacing: 0.5px;">Transaction Details:</h3>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Invoice No:</strong> ${inv.id}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Payment Date:</strong> ${inv.date}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Payment Type:</strong> ${paymentTypeLabel}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Collected By:</strong> ${inv.collectedBy || 'Staff'}</p>
                            <p style="margin: 0px 0; color: #334155 !important;"><strong>Registration Date:</strong> ${targetStudent.registrationDate}</p>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <table class="invoice-print-table" style="width: 100%; border-collapse: collapse; margin-bottom: 4px; font-size: 8.5px;">
                        <thead>
                            <tr style="background-color: #f8fafc;">
                                <th style="border: 1px solid #cbd5e1; padding: 2px 4px; text-align: left; font-weight: 700; color: #0f172a !important;">Course Enrolled</th>
                                <th style="border: 1px solid #cbd5e1; padding: 2px 4px; text-align: right; font-weight: 700; color: #0f172a !important;">Net Payable</th>
                                <th style="border: 1px solid #cbd5e1; padding: 2px 4px; text-align: right; font-weight: 700; color: #0f172a !important;">Paid Today</th>
                                <th style="border: 1px solid #cbd5e1; padding: 2px 4px; text-align: right; font-weight: 700; color: #0f172a !important;">Remaining Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${courseDetails.map(item => {
                                const batches = settings.batches || [];
                                const matchedBatch = batches.find(b => b.course === item.course && b.name === item.batch);
                                return `
                                <tr>
                                    <td style="border: 1px solid #cbd5e1; padding: 2px 4px; color: #334155 !important;">
                                        <strong>${item.course} (Batch: ${item.batch || 'N/A'})</strong>
                                        <div style="font-size: 7.5px; color: #64748b !important; margin-top: 1px;">
                                            Student ID: ${item.id}${item.takenBook ? ' | Book Included' : ''}
                                        </div>
                                        ${matchedBatch ? `
                                        <div style="font-size: 7px; color: #0f172a !important; margin-top: 1px; border-top: 1px dashed #cbd5e1; padding-top: 1px; line-height: 1.15;">
                                            <span style="display: block;">📆 <strong>Class Days:</strong> ${Array.isArray(matchedBatch.schedule) ? matchedBatch.schedule.join(', ') : (matchedBatch.schedule || 'N/A')} | <strong>Time:</strong> ${matchedBatch.time || 'N/A'}</span>
                                        </div>
                                        ` : ''}
                                    </td>
                                    <td style="border: 1px solid #cbd5e1; padding: 2px 4px; text-align: right; color: #334155 !important;">৳${item.net.toLocaleString()}</td>
                                    <td style="border: 1px solid #cbd5e1; padding: 2px 4px; text-align: right; color: #16a34a !important; font-weight: 700;">৳${item.paidToday.toLocaleString()}</td>
                                    <td style="border: 1px solid #cbd5e1; padding: 2px 4px; text-align: right; color: ${item.due > 0 ? '#dc2626' : '#16a34a'} !important; font-weight: 700;">৳${item.due.toLocaleString()}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <!-- Totals Block & Terms -->
                    <div class="invoice-print-total-section" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                        <!-- Left Side: Attention and Terms Box -->
                        <div style="flex-grow: 1; text-align: left; padding-right: 15px; display: flex; flex-direction: column; gap: 4px;">
                            ${totalDueFee > 0 ? `
                            <div style="border: 1px solid #ef4444; background-color: #fef2f2; padding: 3px 6px; border-radius: 4px; display: inline-block;">
                                <span style="font-size: 7.5px; color: #ef4444; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 1px; letter-spacing: 0.5px;">Attention: Payment Dues</span>
                                <span style="font-size: 10px; color: #dc2626; font-weight: 800; font-family: sans-serif;">Next Payment Date: <span style="color: #ef4444;">${nextPaymentDateVal || '___________________'}</span></span>
                            </div>
                            ` : ''}
                            
                            <!-- Terms and Conditions -->
                            <div style="font-size: 7.5px; line-height: 1.2; color: #334155 !important; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 5px; background-color: #f8fafc; margin-bottom: 0; max-width: 420px;">
                                <strong style="display: block; font-size: 8.5px; color: #0f172a !important; margin-bottom: 1px;">ভর্তি ও পেমেন্ট সংক্রান্ত শর্তাবলী:</strong>
                                <ul style="margin: 0; padding-left: 10px; list-style-type: disc;">
                                    <li>প্রদত্ত অর্থ কোনো অবস্থাতেই ফেরতযোগ্য নয়।</li>
                                    <li>EDIZ IT Institute প্রয়োজনে ব্যাচ, সময়সূচী, কোর্স কনটেন্ট ও প্রশিক্ষক পরিবর্তনের অধিকার সংরক্ষণ করে।</li>
                                    <li>শিক্ষার্থীর অনুপস্থিতি বা কোর্স অসম্পূর্ণ রাখার কারণে ফি ফেরত দেওয়া হবে না।</li>
                                    <li>প্রতিষ্ঠানের সকল নীতিমালা ও সিদ্ধান্ত শিক্ষার্থীর জন্য বাধ্যতামূলক।</li>
                                    <li>ভর্তি সম্পন্ন করার মাধ্যমে শিক্ষার্থী ও অভিভাবক সকল শর্তাবলীতে সম্মতি প্রদান করেছেন বলে গণ্য হবে।</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Right Side: Totals -->
                        <div class="invoice-print-total-box" style="width: 195px; line-height: 1.25; flex-shrink: 0;">
                            <div class="invoice-print-total-row" style="display: flex; justify-content: space-between; padding: 0.5px 0; font-size: 8.5px; color: #475569 !important;">
                                <span>Total Course Fee:</span>
                                <span>৳${totalCourseFee.toLocaleString()}</span>
                            </div>
                            <div class="invoice-print-total-row" style="display: flex; justify-content: space-between; padding: 0.5px 0; font-size: 8.5px; color: #475569 !important;">
                                <span>Discount:</span>
                                <span>৳${totalDiscount.toLocaleString()}</span>
                            </div>
                            <div class="invoice-print-total-row" style="display: flex; justify-content: space-between; padding: 0.5px 0; font-size: 8.5px; color: #475569 !important; border-top: 1px dashed #cbd5e1; margin-top: 1px; padding-top: 1px;">
                                <span>Net Payable:</span>
                                <span>৳${totalNetFee.toLocaleString()}</span>
                            </div>
                            <div class="invoice-print-total-row" style="display: flex; justify-content: space-between; padding: 0.5px 0; color: #16a34a !important; font-weight: 600; font-size: 8.5px;">
                                <span>Total Paid:</span>
                                <span>৳${totalPaidFee.toLocaleString()}</span>
                            </div>
                            <div class="invoice-print-total-row grand" style="display: flex; justify-content: space-between; padding: 1.5px 0; border-top: 1.5px double #000; font-weight: 800; font-size: 10px; color: #dc2626 !important; margin-top: 1px;">
                                <span>Remaining Due:</span>
                                <span>৳${totalDueFee.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <!-- Full Width Signature Row -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 10px 4px 10px; margin-bottom: 2px; margin-top: 28px;">
                        <!-- Left: Student Signature Space -->
                        <div style="text-align: center; width: 160px;">
                            <div style="margin-bottom: 3px; color: #000 !important; font-size: 8.5px; font-weight: 600;">_______________________</div>
                            <strong style="display: block; font-size: 8.5px; color: #0f172a !important; margin-bottom: 1px;">Student Signature</strong>
                            <span style="color: #475569 !important; font-size: 7.5px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Name: ${targetStudent.name}</span>
                        </div>

                        <!-- Right: Authorized Signature Space -->
                        <div style="text-align: center; width: 180px;">
                            <div style="margin-bottom: 3px; color: #000 !important; font-size: 8.5px; font-weight: 600;">_______________________</div>
                            <strong style="display: block; font-size: 8.5px; color: #0f172a !important; margin-bottom: 1px;">Authorized signature</strong>
                            <span style="color: #475569 !important; font-size: 7.5px; display: block;">Manager at EDIZ IT INSTITUTE</span>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="invoice-print-footer" style="text-align: center; font-size: 7.5px; color: #64748b !important; border-top: 1px solid #e2e8f0; padding-top: 2px;">
                        <p style="margin: 0;">This is a computer-generated invoice receipt issued by Ediz IT Institute, Comilla.</p>
                    </div>
                </div>
            </div>
        `;
    }

    const printHTML = `
        <style>
            @page {
                size: A4 portrait;
                margin: 0;
            }
            body {
                background: #fff !important;
                margin: 0;
                padding: 0;
            }
            .invoice-single-page {
                box-sizing: border-box;
                height: 297mm;
                width: 210mm;
                overflow: hidden;
                background: #fff;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 4mm 0;
            }
            .invoice-copy-block {
                height: 136mm !important;
                box-sizing: border-box;
                overflow: hidden;
                position: relative;
            }
            .invoice-divider {
                text-align: center; 
                margin: 4px 0; 
                border-top: 1.5px dashed #64748b; 
                position: relative;
                width: 100%;
            }
            .invoice-divider-text {
                position: absolute; 
                top: -9px; 
                left: 50%; 
                transform: translateX(-50%); 
                background: #fff; 
                padding: 0 10px; 
                font-size: 10px; 
                color: #64748b;
                font-family: sans-serif;
            }
            @media print {
                body > :not(#print-zone) {
                    display: none !important;
                }
                html, body {
                    width: 210mm;
                    height: 297mm;
                    background: #fff !important;
                }
                #print-zone {
                    display: block !important;
                    position: static !important;
                    width: 210mm !important;
                    height: 297mm !important;
                    background: #fff !important;
                }
                .invoice-print {
                    page: auto !important;
                    padding: 4mm 8mm !important;
                    border: none !important;
                    box-shadow: none !important;
                    height: 100% !important;
                    font-size: 10px !important;
                    color: #000 !important;
                }
            }
        </style>
        <div class="invoice-single-page">
            <div class="invoice-copy-block">
                ${getInvoiceCopyHTML("Office Copy")}
            </div>
            <div class="invoice-divider">
                <span class="invoice-divider-text">
                    <i class="fa-solid fa-scissors"></i> Cut Here to Separate (কেটে আলাদা করুন)
                </span>
            </div>
            <div class="invoice-copy-block">
                ${getInvoiceCopyHTML("Student Copy")}
            </div>
        </div>
    `;

    // Preload logo image to prevent printing blank logo in preview
    const logoImg = new Image();
    logoImg.src = logoName;
    
    const triggerPrint = () => {
        printZone.innerHTML = printHTML;
        setTimeout(() => {
            window.print();
        }, 250);
    };

    if (logoImg.complete) {
        triggerPrint();
    } else {
        logoImg.onload = triggerPrint;
        logoImg.onerror = triggerPrint;
    }
};

// --- PRINT LANDSCAPE A4 CERTIFICATE ---
// --- PRINT LANDSCAPE A4 CERTIFICATE ---
window.printCertificate = function(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    if (st.dueFee > 0) {
        alert(`Cannot print certificate. Student ${st.name} (ID: ${st.id}) has outstanding dues of ৳${st.dueFee.toLocaleString()}. Please clear all dues first.`);
        return;
    }

    function formatCourseDate(dateStr) {
        if (!dateStr) return 'TBA';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr.toUpperCase();
        const day = date.getDate();
        const month = date.toLocaleString("en-GB", { month: "long" });
        const year = date.getFullYear();
        const suffix = day > 3 && day < 21 ? 'th' : ['st', 'nd', 'rd'][day % 10 - 1] || 'th';
        return `${day}${suffix} ${month}, ${year}`;
    }

    const batches = settings.batches || defaultBatches;
    const batchObj = batches.find(b => b.course === st.course && b.name === st.batch);

    const origin = window.location.origin;
    let verifyURL = '';
    if (origin === 'null' || !origin || origin.startsWith('file')) {
        verifyURL = 'verify/index.html?verify=' + st.id;
    } else {
        const basePath = window.location.pathname.replace('index.html', '').replace('admin.html', '');
        verifyURL = origin + (basePath.endsWith('/') ? basePath : basePath + '/') + 'verify/?verify=' + st.id;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(verifyURL)}`;

    // Get descriptive lines
    const fathersName = st.fatherName || '';
    const mothersName = st.motherName || '';
    const hasFather = fathersName && fathersName.toUpperCase() !== 'N/A';
    const hasMother = mothersName && mothersName.toUpperCase() !== 'N/A';
    
    let pronoun = "SON OF";
    if (st.gender && st.gender.toLowerCase() === 'female') {
        pronoun = "DAUGHTER OF";
    }
    
    let line1 = "";
    if (hasFather && hasMother) {
        line1 = `${pronoun} ${fathersName.toUpperCase()} & ${mothersName.toUpperCase()} HAS SUCCESSFULLY`;
    } else if (hasFather) {
        line1 = `${pronoun} ${fathersName.toUpperCase()} HAS SUCCESSFULLY`;
    } else if (hasMother) {
        line1 = `${pronoun} ${mothersName.toUpperCase()} HAS SUCCESSFULLY`;
    } else {
        line1 = `HAS SUCCESSFULLY`;
    }
    
    const line2 = `COMPLETED THE ${(st.course || '').toUpperCase()} COURSE HELD ON`;
    const line3 = `${formatCourseDate(batchObj ? batchObj.startDate : '')} TO ${formatCourseDate(batchObj ? batchObj.endDate : '')} AT EDIZ IT INSTITUTE`;

    const coordinator = st.coordinator || "Mahi Rahman";
    let coordinatorSignPath = "Certificate/mahi-signature.png";
    if (coordinator.toLowerCase().includes("tariq")) {
        coordinatorSignPath = "Certificate/tariqsign.png";
    }

    function doPrint(svgTemplate) {
        let coordinatorTitle = "Instructor";
        let rightSideSubtitle = (st.course || '').toUpperCase();
        if (coordinator.toLowerCase().includes("mahi")) {
            coordinatorTitle = "Founder and CEO";
            rightSideSubtitle = "EDIZ IT INSTITUTE";
        }

        // Replace placeholders in SVG
        let replacedSvg = svgTemplate
            .replace(/__NAME__/g, st.name.toUpperCase())
            .replace(/__ID__/g, st.id)
            .replace(/__ISSUE_DATE__/g, formatCourseDate(st.certificateDate))
            .replace(/__LINE1__/g, line1)
            .replace(/__LINE2__/g, line2)
            .replace(/__LINE3__/g, line3)
            .replace(/__QR_CODE__/g, qrUrl)
            .replace(/__SIGNATURE__/g, coordinatorSignPath)
            .replace(/\/mijanursign.png/g, 'Certificate/mijanursign.png')
            .replace(/\.\/training.png/g, 'Certificate/training.png')
            .replace(/<text id="co-ordinator-title"[^>]*>.*?<\/text>/, `<text id="co-ordinator-title" x="515" y="500" font-size="9" fill="#000" text-anchor="middle">${coordinatorTitle}</text>`)
            .replace(/<text id="program_name"[^>]*>.*?<\/text>/, `<text id="program_name" x="515" y="511" font-size="9" fill="#000" text-anchor="middle">${rightSideSubtitle}</text>`)
            .replace(/<text id="co-ordinator"[^>]*>.*?<\/text>/, `<text id="co-ordinator" x="515" y="488" font-size="10" fill="#000" text-anchor="middle" font-weight="bold">${coordinator}</text>`);

        const printHTML = `
            <style>
                @page {
                    size: A4 landscape;
                    margin: 0;
                }
                body {
                    background: #fff !important;
                }
                @media print {
                    body > :not(#print-zone) {
                        display: none !important;
                    }
                    html, body {
                        width: 297mm;
                        height: 210mm;
                        background: #fff !important;
                        overflow: hidden;
                    }
                    #print-zone {
                        display: block !important;
                        position: static !important;
                        width: 297mm !important;
                        height: 210mm !important;
                        background: #fff !important;
                    }
                }
                .certificate-container {
                    width: 297mm;
                    height: 210mm;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #fff;
                }
                .certificate-container svg {
                    width: 297mm;
                    height: 210mm;
                    display: block;
                }
            </style>
            <div class="certificate-container">
                ${replacedSvg}
            </div>
        `;

        // Preload images to prevent printing blank components
        const mijanurPromise = new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = 'Certificate/mijanursign.png';
        });

        const coordPromise = new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = coordinatorSignPath;
        });

        const trainingPromise = new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = 'Certificate/training.png';
        });

        const qrPromise = new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = qrUrl;
        });

        Promise.all([mijanurPromise, coordPromise, trainingPromise, qrPromise]).then(() => {
            printZone.innerHTML = printHTML;
            setTimeout(() => {
                window.print();
            }, 250);
        });
    }

    if (window.certificateSVGTemplate) {
        doPrint(window.certificateSVGTemplate);
    } else {
        // Fallback fetch if not preloaded yet
        fetch('Certificate/certificate.svg')
            .then(res => res.text())
            .then(text => {
                window.certificateSVGTemplate = text;
                doPrint(text);
            })
            .catch(err => {
                console.error("Failed to load certificate template:", err);
                alert("Failed to print certificate: template could not be loaded.");
            });
    }
};

// Auto-formats ID input (EDIZ -> EDIZ-, GD -> GD-, etc.)
function applyStudentIdAutoFormat(inputElem) {
    if (!inputElem) return;
    inputElem.addEventListener('input', (e) => {
        if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
            return;
        }
        let val = inputElem.value;
        const uppercaseVal = val.toUpperCase();
        const prefixes = ['EDIZ-GD', 'EDIZ-BC', 'EDIZ-SP', 'EDIZ-SE', 'EDIZ', 'BC', 'SE', 'GD', 'SP'];
        for (const prefix of prefixes) {
            if (uppercaseVal === prefix) {
                inputElem.value = uppercaseVal + '-';
                inputElem.dispatchEvent(new Event('input'));
                break;
            }
        }
    });
}

function setupGlobalSearch() {
    const globalSearchInput = document.getElementById('global-student-search');
    const clearBtn = document.getElementById('clear-global-search');
    const closeBtn = document.getElementById('close-global-search-btn');
    const globalResultsView = document.getElementById('global-search-results-view');
    const globalResultsTbody = document.getElementById('global-search-results-tbody');
    const globalCountBadge = document.getElementById('global-search-count');

    if (!globalSearchInput || !globalResultsView || !globalResultsTbody) return;

    applyStudentIdAutoFormat(globalSearchInput);

    let activeTabBeforeSearch = 'dashboard';

    function clearSearch() {
        globalSearchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        globalResultsView.style.display = 'none';
        globalResultsTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Type Student ID or Mobile to search...</td></tr>`;
        
        const tabBtn = document.querySelector(`.sidebar-item[data-tab="${activeTabBeforeSearch}"]`);
        if (tabBtn) {
            tabBtn.click();
        } else {
            document.getElementById('tab-dashboard').style.display = 'block';
        }
        renderAllLists();
    }

    globalSearchInput.addEventListener('input', () => {
        const query = globalSearchInput.value.trim().toLowerCase();
        if (!query) {
            clearSearch();
            return;
        }

        if (clearBtn) clearBtn.style.display = 'block';

        const activeSidebarItem = document.querySelector('.sidebar-item.active');
        if (activeSidebarItem) {
            const currentTab = activeSidebarItem.getAttribute('data-tab');
            if (currentTab !== 'global-search-results-view') {
                activeTabBeforeSearch = currentTab;
            }
        }

        document.querySelectorAll('.tab-view').forEach(view => {
            view.style.display = 'none';
        });

        globalResultsView.style.display = 'block';

        const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
        const canEdit = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canEdit);
        const canDelete = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canDelete);
        const canInvoice = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice);

        const cleanQuery = query.replace(/\D/g, "");

        const exactIdMatch = students.find(st => st.id.toLowerCase() === query);
        const filtered = exactIdMatch ? [exactIdMatch] : students.filter(st => {
            const cleanPhone = st.phone ? st.phone.replace(/\D/g, "") : "";
            const cleanGuardian = st.guardianPhone ? st.guardianPhone.replace(/\D/g, "") : "";
            const hasLetters = /[a-z]/i.test(query);

            return st.id.toLowerCase().includes(query) || 
                   st.name.toLowerCase().includes(query) || 
                   (!hasLetters && cleanQuery && cleanPhone.includes(cleanQuery)) ||
                   (!hasLetters && cleanQuery && cleanGuardian.includes(cleanQuery)) ||
                   (st.batch && st.batch.toLowerCase().includes(query));
        });

        if (globalCountBadge) {
            globalCountBadge.innerText = filtered.length;
        }

        if (filtered.length === 0) {
            globalResultsTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No matching student records.</td></tr>`;
            return;
        }

        globalResultsTbody.innerHTML = filtered.map(st => {
            const hasNextPay = st.nextPaymentDate ? true : false;
            let nextPayHtml = "";
            let isOverdue = false;
            if (hasNextPay && st.dueFee > 0) {
                const todayStr = getLocalDateString();
                isOverdue = st.nextPaymentDate <= todayStr;
                nextPayHtml = `<div style="font-size: 0.75rem; margin-top: 3px; font-weight: 600; color: ${isOverdue ? 'var(--danger)' : 'var(--success)'};">
                    <i class="fa-solid fa-calendar-day"></i> Next Payment: ${st.nextPaymentDate} ${isOverdue ? '<span class="badge badge-danger" style="font-size: 0.6rem; padding: 1px 3px; margin-left: 2px;">Overdue</span>' : ''}
                </div>`;
            }
            const rowStyle = isOverdue ? 'background-color: rgba(239, 68, 68, 0.05); border-left: 4px solid var(--danger);' : '';

            return `
                <tr style="${rowStyle}">
                    <td>
                        <strong>${st.id}</strong><br>
                        <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">Batch: ${st.batch || 'N/A'}</span>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${st.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${st.address}</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted); font-style: italic;">
                            Parents: ${st.fatherName || 'N/A'} (F), ${st.motherName || 'N/A'} (M)
                        </div>
                        ${nextPayHtml}
                    </td>
                    <td>${st.course}</td>
                    <td>
                        <div>Mob: <a href="tel:${st.phone}" style="color: var(--primary); font-weight: 600; text-decoration: underline;">${st.phone}</a></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Grd: ${st.guardianPhone ? `<a href="tel:${st.guardianPhone}" style="color: inherit; text-decoration: underline;">${st.guardianPhone}</a>` : 'N/A'}</div>
                    </td>
                    <td>
                        <div style="font-size: 0.85rem;">Gross: ৳${st.totalFee}</div>
                        <div style="font-size: 0.8rem; color: var(--accent);">Disc: ৳${st.discountFee || 0}</div>
                        <div style="font-size: 0.8rem; font-weight: 600;">Net: ৳${st.netFee !== undefined ? st.netFee : st.totalFee}</div>
                        <div style="font-size: 0.85rem; color: var(--success); font-weight: 500;">Paid: ৳${st.paidFee}</div>
                        <div style="font-size: 0.85rem; color: var(--danger); font-weight: 600;">Due: ৳${st.dueFee}</div>
                    </td>
                    <td><span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status === 'Partial' ? 'Payment Due' : st.status}</span></td>
                    <td>
                        <div class="actions-cell" style="display: flex; gap: 0.35rem; align-items: center;">
                            ${canInvoice && st.dueFee > 0 ? `<button class="btn btn-danger btn-sm" onclick="openPaymentModal('${st.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; white-space: nowrap; height: 32px; background-color: var(--danger); border-color: var(--danger); color: white; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-wallet"></i> Collect Due</button>` : ''}
                            <button class="btn btn-secondary btn-icon-only" onclick="openProfileModal('${st.id}')" title="View Profile" style="height: 32px; width: 32px;"><i class="fa-solid fa-eye"></i></button>
                            ${canInvoice && st.dueFee <= 0 ? `<button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Manage Fees" style="height: 32px; width: 32px;"><i class="fa-solid fa-wallet"></i></button>` : ''}
                            ${canEdit ? `<button class="btn btn-secondary btn-icon-only" onclick="openEditStudentModal('${st.id}')" title="Edit Student" style="height: 32px; width: 32px;"><i class="fa-solid fa-edit"></i></button>` : ''}
                            <button class="btn btn-secondary btn-icon-only" style="color: var(--accent); height: 32px; width: 32px;" onclick="openStudentNotesModal('${st.id}')" title="Add/Edit Note & Next Payment"><i class="fa-solid fa-note-sticky"></i></button>
                            ${canDelete ? `<button class="btn btn-secondary btn-icon-only" style="color: var(--danger); height: 32px; width: 32px;" onclick="deleteStudent('${st.id}')" title="Delete Student"><i class="fa-solid fa-trash"></i></button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    });

    if (clearBtn) clearBtn.addEventListener('click', clearSearch);
    if (closeBtn) closeBtn.addEventListener('click', clearSearch);
}

function getDateRangeBounds(type, customStart, customEnd) {
    let start = null;
    let end = null;
    const now = new Date();
    
    if (type === 'today') {
        const todayStr = getLocalDateString(now);
        start = new Date(todayStr + 'T00:00:00');
        end = new Date(todayStr + 'T23:59:59');
    } else if (type === 'yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = getLocalDateString(yesterday);
        start = new Date(yesterdayStr + 'T00:00:00');
        end = new Date(yesterdayStr + 'T23:59:59');
    } else if (type === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day; // diff is Sunday
        const sunday = new Date(now);
        sunday.setDate(diff);
        const sunStr = getLocalDateString(sunday);
        start = new Date(sunStr + 'T00:00:00');
        
        const sat = new Date(sunday);
        sat.setDate(sunday.getDate() + 6);
        const satStr = getLocalDateString(sat);
        end = new Date(satStr + 'T23:59:59');
    } else if (type === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (type === 'year') {
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    } else if (type === 'last-year') {
        start = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0);
        end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    } else if (type === 'custom') {
        const s = customStart || customEnd;
        const e = customEnd || customStart;
        if (s) start = new Date(s + 'T00:00:00');
        if (e) end = new Date(e + 'T23:59:59');
    }
    return { start, end };
}

function setupPageDateFilters() {
    const studentsFilterGroup = document.getElementById('students-date-filter-group');
    const studentsCustomBtn = document.getElementById('students-custom-filter-btn');
    const studentsStartInput = document.getElementById('students-start-date');
    
    if (studentsFilterGroup) {
        const btns = studentsFilterGroup.querySelectorAll('.students-filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => {
                    b.className = "btn btn-secondary btn-sm students-filter-btn";
                });
                btn.className = "btn btn-primary btn-sm students-filter-btn";
                studentsDateRange.type = btn.getAttribute('data-range');
                studentsDateRange.start = null;
                studentsDateRange.end = null;
                if (studentsStartInput) studentsStartInput.value = '';
                renderStudentsTable();
            });
        });
    }
    
    if (studentsCustomBtn && studentsStartInput) {
        studentsCustomBtn.addEventListener('click', () => {
            const startVal = studentsStartInput.value;
            if (!startVal) {
                alert("Please select a date.");
                return;
            }
            if (studentsFilterGroup) {
                studentsFilterGroup.querySelectorAll('.students-filter-btn').forEach(b => {
                    b.className = "btn btn-secondary btn-sm students-filter-btn";
                });
            }
            studentsDateRange.type = 'custom';
            studentsDateRange.start = startVal;
            studentsDateRange.end = startVal;
            renderStudentsTable();
        });
    }

    const invoicesFilterGroup = document.getElementById('invoices-date-filter-group');
    const invoicesCustomBtn = document.getElementById('invoices-custom-filter-btn');
    const invoicesStartInput = document.getElementById('invoices-start-date');
    
    if (invoicesFilterGroup) {
        const btns = invoicesFilterGroup.querySelectorAll('.invoices-filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => {
                    b.className = "btn btn-secondary btn-sm invoices-filter-btn";
                });
                btn.className = "btn btn-primary btn-sm invoices-filter-btn";
                invoicesDateRange.type = btn.getAttribute('data-range');
                invoicesDateRange.start = null;
                invoicesDateRange.end = null;
                if (invoicesStartInput) invoicesStartInput.value = '';
                renderInvoicesTable();
            });
        });
    }
    
    if (invoicesCustomBtn && invoicesStartInput) {
        invoicesCustomBtn.addEventListener('click', () => {
            const startVal = invoicesStartInput.value;
            if (!startVal) {
                alert("Please select a date.");
                return;
            }
            if (invoicesFilterGroup) {
                invoicesFilterGroup.querySelectorAll('.invoices-filter-btn').forEach(b => {
                    b.className = "btn btn-secondary btn-sm invoices-filter-btn";
                });
            }
            invoicesDateRange.type = 'custom';
            invoicesDateRange.start = startVal;
            invoicesDateRange.end = startVal;
            renderInvoicesTable();
        });
    }

    // Collect Due Date Filters
    const collectDueFilterGroup = document.getElementById('collect-due-date-filter-group');
    const collectDueCustomBtn = document.getElementById('collect-due-custom-filter-btn');
    const collectDueStartInput = document.getElementById('collect-due-start-date');

    if (collectDueFilterGroup) {
        const btns = collectDueFilterGroup.querySelectorAll('.collect-due-filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => {
                    b.className = "btn btn-secondary btn-sm collect-due-filter-btn";
                });
                btn.className = "btn btn-primary btn-sm collect-due-filter-btn";
                collectDueDateRange.type = btn.getAttribute('data-range');
                collectDueDateRange.start = null;
                collectDueDateRange.end = null;
                if (collectDueStartInput) collectDueStartInput.value = '';
                collectDueMonthFilter = 'all'; // Reset month filter when main date range changes
                renderCollectDueTable();
            });
        });
    }

    if (collectDueCustomBtn && collectDueStartInput) {
        collectDueCustomBtn.addEventListener('click', () => {
            const startVal = collectDueStartInput.value;
            if (!startVal) {
                alert("Please select a date.");
                return;
            }
            if (collectDueFilterGroup) {
                collectDueFilterGroup.querySelectorAll('.collect-due-filter-btn').forEach(b => {
                    b.className = "btn btn-secondary btn-sm collect-due-filter-btn";
                });
            }
            collectDueDateRange.type = 'custom';
            collectDueDateRange.start = startVal;
            collectDueDateRange.end = startVal;
            collectDueMonthFilter = 'all'; // Reset month filter when main date range changes
            renderCollectDueTable();
        });
    }
}

// --- LIVE FILTER LISTENERS ---
function setupSearchFilters() {
    studentSearch.addEventListener('input', renderStudentsTable);
    applyStudentIdAutoFormat(studentSearch);
    
    filterCourse.addEventListener('change', renderStudentsTable);
    filterStatus.addEventListener('change', renderStudentsTable);
    
    const sortStudentsSelect = document.getElementById('sort-students');
    if (sortStudentsSelect) {
        sortStudentsSelect.addEventListener('change', renderStudentsTable);
    }
    
    invoiceSearch.addEventListener('input', renderInvoicesTable);
    applyStudentIdAutoFormat(invoiceSearch);
    if (invoiceTypeFilter) {
        invoiceTypeFilter.addEventListener('change', renderInvoicesTable);
    }
    
    certSearch.addEventListener('input', renderCertificatesTable);
    applyStudentIdAutoFormat(certSearch);

    const batchSearchInput = document.getElementById('batch-search-input');
    if (batchSearchInput) {
        batchSearchInput.addEventListener('input', () => {
            renderBatchesList(selectedCourseForBatches);
        });
    }

    const collectDueSearch = document.getElementById('collect-due-search');
    if (collectDueSearch) {
        collectDueSearch.addEventListener('input', renderCollectDueTable);
        applyStudentIdAutoFormat(collectDueSearch);
    }

    const collectDueCourseSelect = document.getElementById('collect-due-course-select');
    const collectDueBatchSelect = document.getElementById('collect-due-batch-select');
    if (collectDueCourseSelect) {
        collectDueCourseSelect.addEventListener('change', (e) => {
            collectDueCourseFilter = e.target.value;
            collectDueBatchFilter = '';
            updateCollectDueBatchDropdown();
            renderCollectDueTable();
        });
    }
    if (collectDueBatchSelect) {
        collectDueBatchSelect.addEventListener('change', (e) => {
            collectDueBatchFilter = e.target.value;
            renderCollectDueTable();
        });
    }
}

window.updateCollectDueBatchDropdown = function() {
    const selectEl = document.getElementById('collect-due-batch-select');
    if (!selectEl) return;
    const batches = settings.batches || [];
    let filtered = batches;
    if (collectDueCourseFilter) {
        filtered = batches.filter(b => b.course === collectDueCourseFilter);
    }
    
    // Sort batches descending by number
    filtered = [...filtered].sort((a, b) => {
        const numA = parseInt((a.name.match(/\d+/) || [0])[0], 10);
        const numB = parseInt((b.name.match(/\d+/) || [0])[0], 10);
        return numB - numA;
    });

    selectEl.innerHTML = '<option value="">All Batches (সব ব্যাচ)</option>' +
        filtered.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
    selectEl.value = collectDueBatchFilter;
};

// --- STUDENT MODAL BATCH DYNAMIC POPULATION ---
function updateStudentModalBatches(course, selectElem) {
    const batches = settings.batches || defaultBatches;
    const courseBatches = batches.filter(b => b.course === course);

    // Sort batches numerically descending (newest first)
    courseBatches.sort((a, b) => {
        const numA = parseInt((a.name.match(/\d+/) || [0])[0], 10);
        const numB = parseInt((b.name.match(/\d+/) || [0])[0], 10);
        return numB - numA;
    });

    selectElem.innerHTML = '<option value="" disabled selected>-- Select Batch --</option>';
    if (courseBatches.length > 0) {
        courseBatches.forEach(b => {
            let details = b.name;
            let parts = [];
            if (b.time) parts.push(b.time);
            if (b.schedule && b.schedule.length > 0) parts.push(b.schedule.join(','));
            if (b.startDate) parts.push(`Starts: ${b.startDate}`);
            if (parts.length > 0) {
                details += ` (${parts.join(' | ')})`;
            }
            selectElem.innerHTML += `<option value="${b.name}">${details}</option>`;
        });
    } else {
        const fallback = {
            "Graphic Design": ["GD-02", "GD-01"],
            "Basic Computer": ["BC-02", "BC-01"],
            "Spoken English": ["SE-02", "SE-01"]
        };
        const list = fallback[course] || [];
        list.forEach(name => {
            selectElem.innerHTML += `<option value="${name}">${name}</option>`;
        });
    }
}

// --- RECALCULATE NET FEE ---
function recalculateStudentNetFee() {
    const total = parseInt(studentFeeTotal.value) || 0;
    const discount = parseInt(studentFeeDiscount.value) || 0;
    const net = total - discount;
    studentFeeNet.value = net >= 0 ? net : 0;
}

// --- RENDER BATCHES IN SETTINGS TAB ---
function renderSettingsBatches() {
    const tbody = document.getElementById('settings-batches-tbody');
    if (!tbody) return;

    const batches = settings.batches || defaultBatches;
    if (batches.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1rem;">No batches configured.</td></tr>`;
        return;
    }

    tbody.innerHTML = batches.map((b, index) => `
        <tr>
            <td>${b.course}</td>
            <td><strong>${b.name}</strong></td>
            <td>৳${b.fee}</td>
            <td>৳${b.discount}</td>
            <td>৳${b.fee - b.discount}</td>
            <td>
                <button class="btn btn-secondary btn-icon-only" style="color: var(--danger);" onclick="deleteBatch(${index})" title="Delete Batch"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// --- DELETE BATCH CALL ---
window.deleteBatch = function(index) {
    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
    if (curUser.role === 'Staff') {
        alert("Permission Denied: Staff accounts cannot delete batches.");
        return;
    }
    if (confirm("Are you sure you want to delete this batch? It will no longer be available for new student enrollments.")) {
        if (!settings.batches) settings.batches = defaultBatches;
        settings.batches.splice(index, 1);
        saveDatabase();
    }
};

// --- APPLY USER PERMISSIONS ---
function applyUserPermissions(user) {
    const settingsTab = document.querySelector('[data-tab="settings"]');
    const staffCard = document.getElementById('staff-management-card');
    const batchesCreateBtn = document.getElementById('batches-create-btn');
    const settingsCreateBatchBtn = document.getElementById('settings-create-batch-btn');
    const bookStockUpdateCard = document.getElementById('book-stock-update-card');
    const booksGrid = document.querySelector('.books-grid');
    
    const canCreateBatch = user.role === 'Owner' || user.role === 'Admin' || (user.permissions && user.permissions.canCreateBatch);
    
    if (user.role === 'Owner' || user.role === 'Admin') {
        if (settingsTab) settingsTab.style.display = 'block';
        if (staffCard) staffCard.style.display = 'block';
        if (batchesCreateBtn) batchesCreateBtn.style.display = 'inline-flex';
        if (settingsCreateBatchBtn) settingsCreateBatchBtn.style.display = 'inline-flex';
        if (bookStockUpdateCard) bookStockUpdateCard.style.display = 'block';
        if (booksGrid) booksGrid.style.gridTemplateColumns = '0.7fr 1.3fr';
    } else {
        if (settingsTab) settingsTab.style.display = 'none';
        if (staffCard) staffCard.style.display = 'none';
        if (batchesCreateBtn) batchesCreateBtn.style.display = canCreateBatch ? 'inline-flex' : 'none';
        if (settingsCreateBatchBtn) settingsCreateBatchBtn.style.display = canCreateBatch ? 'inline-flex' : 'none';
        if (bookStockUpdateCard) bookStockUpdateCard.style.display = 'none';
        if (booksGrid) booksGrid.style.gridTemplateColumns = '1fr';
        
        // If staff is on settings view, redirect to dashboard
        const activeTab = document.querySelector('.sidebar-item.active');
        if (activeTab && activeTab.getAttribute('data-tab') === 'settings') {
            const dashboardTab = document.querySelector('[data-tab="dashboard"]');
            if (dashboardTab) dashboardTab.click();
        }
    }

    const userRoleDisplay = document.getElementById('user-role-display');
    if (userRoleDisplay) {
        const displayRole = (user.role === 'Owner' || user.role === 'Admin') ? 'Admin' : 'Staff';
        userRoleDisplay.innerHTML = `<i class="fa-solid fa-user-shield"></i> ${displayRole}`;
        userRoleDisplay.style.display = 'flex';
    }
    
    renderAllLists();
}

// --- RENDER USERS IN SETTINGS ---
function renderSettingsStaff() {
    const tbody = document.getElementById('settings-staff-tbody');
    if (!tbody) return;

    const users = settings.users || [];

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">No user accounts configured.</td></tr>`;
        defaultCollectorInputs();
        return;
    }

    tbody.innerHTML = users.map((u) => {
        let perms = [];
        let roleLabel = u.role === 'Owner' || u.role === 'Admin' ? 'Admin' : 'Staff';
        let badgeClass = u.role === 'Owner' || u.role === 'Admin' ? 'badge-primary' : 'badge-secondary';
        let permString = '';

        if (u.role === 'Owner' || u.role === 'Admin') {
            permString = '<strong>Full Access (All Permissions)</strong>';
        } else {
            if (u.permissions) {
                if (u.permissions.canEdit) perms.push("Edit");
                if (u.permissions.canDelete) perms.push("Delete");
                if (u.permissions.canInvoice) perms.push("Invoices");
                if (u.permissions.canCert) perms.push("Certificates");
                if (u.permissions.canCreateBatch) perms.push("Create Batches");
            }
            permString = perms.length > 0 ? perms.join(", ") : "None";
        }

        return `
            <tr>
                <td><strong>${u.email}</strong></td>
                <td><span class="badge ${badgeClass}">${roleLabel}</span></td>
                <td><span style="font-size: 0.75rem; color: var(--text-muted);">${permString}</span></td>
                <td>
                    <button class="btn btn-secondary btn-icon-only" style="color: var(--danger);" onclick="deleteStaff('${u.email}')" title="Delete Account"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');

    defaultCollectorInputs();
}

// --- DELETE USER ACCOUNT ---
window.deleteStaff = function(email) {
    const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user'));
    if (activeUser && activeUser.email === email) {
        alert("Error: You cannot delete your own active session account.");
        return;
    }

    const targetUser = settings.users.find(u => u.email === email);
    if (!targetUser) return;

    if (targetUser.role === 'Owner' || targetUser.role === 'Admin') {
        const admins = settings.users.filter(u => u.role === 'Owner' || u.role === 'Admin');
        if (admins.length <= 1) {
            alert("Error: To prevent lockout, there must be at least one Admin account in the system.");
            return;
        }
    }

    if (confirm(`Are you sure you want to permanently delete account "${email}"?`)) {
        settings.users = settings.users.filter(u => u.email !== email);
        saveDatabase();
        renderSettingsStaff();
        renderSettingsTeachers();
    }
};

// --- RENDER TEACHERS IN SETTINGS ---
function renderSettingsTeachers() {
    const tbody = document.getElementById('settings-teachers-tbody');
    if (!tbody) return;

    if (!settings.teachers) settings.teachers = [];
    const teachers = settings.teachers;

    if (teachers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">No teachers registered. (কোনো শিক্ষক নিবন্ধিত নেই)</td></tr>`;
        return;
    }

    tbody.innerHTML = teachers.map((t) => {
        return `
            <tr>
                <td><strong>${t.name}</strong></td>
                <td><a href="tel:${t.phone}" style="text-decoration: underline; color: inherit; font-weight:600;">${t.phone}</a></td>
                <td>${t.email || '<span style="color:var(--text-muted); font-style:italic;">N/A</span>'}</td>
                <td>
                    <button class="btn btn-secondary btn-icon-only" style="color: var(--danger);" onclick="deleteTeacher('${t.id}')" title="Delete Teacher"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// --- DELETE TEACHER ---
window.deleteTeacher = function(id) {
    if (!settings.teachers) settings.teachers = [];
    const target = settings.teachers.find(t => t.id === id);
    if (!target) return;

    if (confirm(`Are you sure you want to delete teacher "${target.name}"?`)) {
        settings.teachers = settings.teachers.filter(t => t.id !== id);
        saveDatabase();
        renderSettingsTeachers();
        
        // Also refresh batch dropdown if open
        const batchTeacherDropdown = document.getElementById('batch-teacher');
        if (batchTeacherDropdown) {
            populateBatchTeacherDropdown();
        }
    }
};

// --- HELPER TO POPULATE BATCH TEACHER DROPDOWN ---
function populateBatchTeacherDropdown(selectedVal = "") {
    const select = document.getElementById('batch-teacher');
    if (!select) return;

    if (!settings.teachers) settings.teachers = [];
    const teachers = settings.teachers;

    select.innerHTML = '<option value="">-- No Teacher Assigned --</option>';
    teachers.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.name;
        opt.textContent = t.name;
        if (selectedVal && selectedVal === t.name) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });
}

// --- BATCH VIEW TAB CONTROLLERS ---
let selectedCourseForBatches = "Graphic Design";
let activeBatchForRoster = "";

function setupBatchesView() {
    const courseBtns = document.querySelectorAll('.batch-course-btn');
    courseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            courseBtns.forEach(b => {
                b.classList.remove('active');
                b.className = "btn btn-secondary batch-course-btn";
            });
            btn.classList.add('active');
            btn.className = "btn btn-primary batch-course-btn";
            
            selectedCourseForBatches = btn.getAttribute('data-course');
            renderBatchesList(selectedCourseForBatches);
        });
    });

    const activeFilterBtn = document.getElementById('batch-filter-active');
    const allFilterBtn = document.getElementById('batch-filter-all');

    if (activeFilterBtn && allFilterBtn) {
        activeFilterBtn.addEventListener('click', () => {
            batchStatusFilter = 'active';
            activeFilterBtn.className = "btn btn-primary";
            allFilterBtn.className = "btn btn-secondary";
            renderBatchesList(selectedCourseForBatches);
        });

        allFilterBtn.addEventListener('click', () => {
            batchStatusFilter = 'all';
            allFilterBtn.className = "btn btn-primary";
            activeFilterBtn.className = "btn btn-secondary";
            renderBatchesList(selectedCourseForBatches);
        });
    }

    const editBatchBtn = document.getElementById('edit-batch-info-btn');
    if (editBatchBtn) {
        editBatchBtn.addEventListener('click', () => {
            if (activeBatchForRoster && selectedCourseForBatches) {
                openBatchModal(true);
            }
        });
    }
}

function renderBatchesList(course) {
    const container = document.getElementById('batches-list-container');
    if (!container) return;

    const searchQuery = document.getElementById('batch-search-input')?.value.toLowerCase() || '';

    const batches = settings.batches || defaultBatches;
    let courseBatches = batches.filter(b => b.course === course);

    // Apply Active vs All Batches filter
    const todayStr = getLocalDateString();
    if (batchStatusFilter === 'active') {
        courseBatches = courseBatches.filter(b => {
            if (!b.endDate) return true; // Default to active if no endDate
            return b.endDate >= todayStr;
        });
    }

    if (searchQuery) {
        courseBatches = courseBatches.filter(b => b.name.toLowerCase().includes(searchQuery));
    }

    // Sort batches numerically descending (newest first)
    courseBatches.sort((a, b) => {
        const numA = parseInt((a.name.match(/\d+/) || [0])[0], 10);
        const numB = parseInt((b.name.match(/\d+/) || [0])[0], 10);
        return numB - numA;
    });

    if (courseBatches.length === 0) {
        container.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem;">No batches found for this course.</p>`;
        document.getElementById('active-batch-roster-title').innerText = "---";
        document.getElementById('active-batch-roster-count').innerText = "0 Students";
        document.getElementById('batch-roster-tbody').innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No batch selected.</td></tr>`;
        const activeBatchInfoCard = document.getElementById('active-batch-info-card');
        if (activeBatchInfoCard) activeBatchInfoCard.style.display = 'none';
        return;
    }

    container.innerHTML = courseBatches.map(b => {
        const activeClass = activeBatchForRoster === b.name ? 'primary' : 'secondary';
        const count = students.filter(s => s.course && s.course.includes(course) && s.batch && s.batch.includes(b.name)).length;
        
        const waIcon = b.whatsappLink ? `<span style="color: #25d366; font-size: 0.85rem; display: inline-flex; align-items: center;" title="WhatsApp Group Linked"><i class="fa-brands fa-whatsapp"></i></span>` : '';

        return `
            <button class="btn btn-${activeClass}" data-batch="${b.name}" style="width: 100%; text-align: left; display: flex; flex-direction: column; align-items: flex-start; padding: 0.6rem 0.9rem; gap: 0.15rem;" onclick="selectActiveBatch('${course}', '${b.name}')">
                <div style="display: flex; width: 100%; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 0.9rem;"><i class="fa-solid fa-users"></i> ${b.name}</span>
                    <div style="display: flex; gap: 0.35rem; align-items: center;">
                        ${waIcon}
                        <span class="badge" style="background: rgba(255,255,255,0.2); color: inherit; font-size: 0.75rem; padding: 0.1rem 0.4rem;">${count}</span>
                    </div>
                </div>
                ${b.time ? `<span style="font-size: 0.72rem; opacity: 0.8; font-weight: 500;"><i class="fa-solid fa-clock" style="font-size: 0.65rem;"></i> ${b.time}</span>` : ''}
            </button>
        `;
    }).join('');

    // Default select first batch if none active or active not in this course
    if (courseBatches.length > 0 && (!activeBatchForRoster || !courseBatches.some(b => b.name === activeBatchForRoster))) {
        selectActiveBatch(course, courseBatches[0].name);
    } else if (activeBatchForRoster) {
        renderBatchRoster(course, activeBatchForRoster);
    }
}

window.selectActiveBatch = function(course, batchName) {
    selectedCourseForBatches = course;
    activeBatchForRoster = batchName;
    
    // Highlight active button
    const container = document.getElementById('batches-list-container');
    if (container) {
        const buttons = container.querySelectorAll('button');
        buttons.forEach(btn => {
            const bName = btn.getAttribute('data-batch');
            if (bName === batchName) {
                btn.className = "btn btn-primary";
                btn.style.display = "flex";
                btn.style.flexDirection = "column";
                btn.style.alignItems = "flex-start";
                btn.style.padding = "0.6rem 0.9rem";
                btn.style.gap = "0.15rem";
                btn.style.width = "100%";
                btn.style.textAlign = "left";
            } else {
                btn.className = "btn btn-secondary";
                btn.style.display = "flex";
                btn.style.flexDirection = "column";
                btn.style.alignItems = "flex-start";
                btn.style.padding = "0.6rem 0.9rem";
                btn.style.gap = "0.15rem";
                btn.style.width = "100%";
                btn.style.textAlign = "left";
            }
        });
    }

    // Display active batch metadata card details
    const activeBatchInfoCard = document.getElementById('active-batch-info-card');
    const infoBatchSchedule = document.getElementById('info-batch-schedule');
    const infoBatchTime = document.getElementById('info-batch-time');
    const infoBatchTimeline = document.getElementById('info-batch-timeline');
    const infoBatchFee = document.getElementById('info-batch-fee');
    const infoBatchIncome = document.getElementById('info-batch-income');
    const infoBatchDue = document.getElementById('info-batch-due');
    const infoBatchEst = document.getElementById('info-batch-est');
    const infoBatchTeacher = document.getElementById('info-batch-teacher');
    const infoBatchTeacherPct = document.getElementById('info-batch-teacher-pct');
    const infoBatchTeacherPayout = document.getElementById('info-batch-teacher-payout');

    const batches = settings.batches || defaultBatches;
    const currentBatchObj = batches.find(b => b.course === course && b.name === batchName);

    if (currentBatchObj && activeBatchInfoCard) {
        // Calculate dynamic financials for students in this batch
        const batchStudents = students.filter(s => s.course && s.course.includes(course) && s.batch && s.batch.includes(batchName));
        let totalPaid = 0;
        let totalDue = 0;
        let totalEst = 0;

        batchStudents.forEach(st => {
            totalPaid += (st.paidFee || 0);
            totalDue += (st.dueFee || 0);
            totalEst += (st.netFee !== undefined ? st.netFee : (st.totalFee || 0));
        });

        infoBatchSchedule.innerText = Array.isArray(currentBatchObj.schedule) ? currentBatchObj.schedule.join(', ') : (currentBatchObj.schedule || 'N/A');
        infoBatchTime.innerText = currentBatchObj.time || 'N/A';
        infoBatchTimeline.innerText = `${currentBatchObj.startDate || 'N/A'} to ${currentBatchObj.endDate || 'N/A'}`;
        infoBatchFee.innerText = `৳${currentBatchObj.fee.toLocaleString()}`;
        if (infoBatchIncome) infoBatchIncome.innerText = `৳${totalPaid.toLocaleString()}`;
        if (infoBatchDue) infoBatchDue.innerText = `৳${totalDue.toLocaleString()}`;
        if (infoBatchEst) infoBatchEst.innerText = `৳${totalEst.toLocaleString()}`;
        
        if (infoBatchTeacher) infoBatchTeacher.innerText = currentBatchObj.teacher || 'None';
        if (infoBatchTeacherPct) infoBatchTeacherPct.innerText = `${currentBatchObj.teacherPercentage || 0}%`;
        if (infoBatchTeacherPayout) {
            const payout = Math.round(totalPaid * (currentBatchObj.teacherPercentage || 0) / 100);
            infoBatchTeacherPayout.innerText = `৳${payout.toLocaleString()}`;
        }

        activeBatchInfoCard.style.display = 'grid';
    } else if (activeBatchInfoCard) {
        activeBatchInfoCard.style.display = 'none';
    }

    document.getElementById('active-batch-roster-title').innerText = batchName;
    renderBatchRoster(course, batchName);
};

function renderBatchRoster(course, batchName) {
    const tbody = document.getElementById('batch-roster-tbody');
    const countBadge = document.getElementById('active-batch-roster-count');
    if (!tbody) return;

    const roster = students.filter(s => s.course && s.course.includes(course) && s.batch && s.batch.includes(batchName));
    
    countBadge.innerText = `${roster.length} Student${roster.length === 1 ? '' : 's'}`;

    const smsBtn = document.getElementById('batch-sms-btn');
    if (smsBtn) {
        smsBtn.style.display = roster.length > 0 ? 'inline-block' : 'none';
    }

    const whatsappBtn = document.getElementById('batch-whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.style.display = roster.length > 0 ? 'inline-block' : 'none';
    }

    const exportBtn = document.getElementById('batch-export-btn');
    if (exportBtn) {
        exportBtn.style.display = roster.length > 0 ? 'inline-flex' : 'none';
    }

    const mobileList = document.getElementById('batch-roster-mobile-list');
    if (mobileList) {
        if (roster.length === 0) {
            mobileList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem; font-size: 0.85rem;">No students enrolled in this batch.</p>`;
        } else {
            mobileList.innerHTML = roster.map(st => {
                const isPaid = st.dueFee === 0;
                const statusBadge = isPaid 
                    ? `<span class="badge" style="background-color: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); font-weight: 700; padding: 0.25rem 0.6rem; font-size: 0.72rem; border-radius: 30px;">PAID</span>` 
                    : `<span class="badge" style="background-color: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); font-weight: 700; padding: 0.25rem 0.6rem; font-size: 0.72rem; border-radius: 30px;">DUE ৳${st.dueFee.toLocaleString()}</span>`;
                
                return `
                    <div onclick="openProfileModal('${st.id}')" class="mobile-student-item glass-panel" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); cursor: pointer; background: var(--surface); box-shadow: var(--shadow-sm);">
                        <div style="display: flex; flex-direction: column; gap: 0.15rem; text-align: left;">
                            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${st.id}</span>
                            <span style="font-size: 0.95rem; font-weight: 600; color: var(--text-color);">${st.name}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            ${statusBadge}
                            <i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.8rem; opacity: 0.7;"></i>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    if (roster.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No students enrolled in this batch.</td></tr>`;
        return;
    }

    tbody.innerHTML = roster.map(st => {
        const hasNextPay = st.nextPaymentDate ? true : false;
        let nextPayHtml = "";
        let isOverdue = false;
        if (hasNextPay && st.dueFee > 0) {
            const todayStr = getLocalDateString();
            isOverdue = st.nextPaymentDate <= todayStr;
            nextPayHtml = `<div style="font-size: 0.75rem; margin-top: 3px; font-weight: 600; color: ${isOverdue ? 'var(--danger)' : 'var(--success)'};">
                <i class="fa-solid fa-calendar-day"></i> Next Payment: ${st.nextPaymentDate} ${isOverdue ? '<span class="badge badge-danger" style="font-size: 0.6rem; padding: 1px 3px; margin-left: 2px;">Overdue</span>' : ''}
            </div>`;
        }
        const noteHtml = st.notes ? `<div style="font-size: 0.75rem; color: var(--accent); font-style: italic; margin-top: 3px;"><i class="fa-solid fa-sticky-note"></i> Note: ${st.notes}</div>` : '';
        const rowStyle = isOverdue ? 'background-color: rgba(239, 68, 68, 0.05); border-left: 4px solid var(--danger);' : '';

        const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
        const canInvoice = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice);
        const canDelete = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canDelete);
        const canEdit = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canEdit);
        const editBtn = canEdit ? `<button class="btn btn-secondary btn-icon-only" onclick="openEditStudentModal('${st.id}')" title="Edit Student Profile" style="height: 32px; width: 32px; color: var(--primary);"><i class="fa-solid fa-pen-to-square"></i></button>` : '';

        // Book status display
        let bookStatusHtml = '';
        if (course && course.includes("Basic Computer")) {
            const isTaken = st.takenBook === true;
            if (isTaken) {
                bookStatusHtml = `<td>
                    <span class="badge badge-success" style="font-size:0.75rem;"><i class="fa-solid fa-circle-check"></i> Book Issued</span>
                </td>`;
            } else {
                bookStatusHtml = `<td>
                    <span class="badge badge-danger" style="font-size:0.75rem;"><i class="fa-solid fa-circle-xmark"></i> Book Pending</span>
                    <button class="btn btn-outline-primary btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.75rem; margin-top: 0.25rem; width: 100%;" onclick="quickIssueBook('${st.id}')">Issue Book</button>
                </td>`;
            }
        } else {
            bookStatusHtml = `<td><span style="color: var(--text-muted); font-size: 0.85rem;">N/A</span></td>`;
        }

        const collectDueBtn = (canInvoice && st.dueFee > 0) 
            ? `<button class="btn btn-danger btn-sm" onclick="openPaymentModal('${st.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; white-space: nowrap; height: 32px;"><i class="fa-solid fa-wallet"></i> Collect Due</button>` 
            : '';

        const individualSmsBtn = `<button class="btn btn-secondary btn-icon-only" onclick="openIndividualSmsModal('${st.id}')" title="Send SMS" style="height: 32px; width: 32px;"><i class="fa-solid fa-paper-plane"></i></button>`;

        return `
            <tr style="${rowStyle}">
                <td><strong>${st.id}</strong></td>
                <td>
                    <div style="font-weight:600;">${st.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${st.address}</div>
                    ${nextPayHtml}
                    ${noteHtml}
                </td>
                <td>
                    <div>Mob: <a href="tel:${st.phone}" style="color: var(--primary); font-weight: 600; text-decoration: underline;">${st.phone}</a></div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Grd: ${st.guardianPhone ? `<a href="tel:${st.guardianPhone}" style="color: inherit; text-decoration: underline;">${st.guardianPhone}</a>` : 'N/A'}</div>
                </td>
                <td>
                    <div>Father: ${st.fatherName || 'N/A'}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Mother: ${st.motherName || 'N/A'}</div>
                </td>
                <td>
                    <div style="font-size:0.8rem;">Net: ৳${st.netFee !== undefined ? st.netFee : st.totalFee}</div>
                    <div style="font-size:0.75rem; color:var(--success);">Paid: ৳${st.paidFee}</div>
                    <div style="font-size:0.75rem; color:var(--danger);">Due: ৳${st.dueFee}</div>
                </td>
                ${bookStatusHtml}
                <td>
                    <span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status === 'Partial' ? 'Payment Due' : st.status}</span>
                </td>
                <td>
                    <div class="actions-cell" style="display: flex; gap: 0.35rem; align-items: center;">
                        ${collectDueBtn}
                        <button class="btn btn-secondary btn-icon-only" onclick="openProfileModal('${st.id}')" title="View Full Profile" style="height: 32px; width: 32px;"><i class="fa-solid fa-eye"></i></button>
                        ${editBtn}
                        ${canInvoice ? `<button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Manage Fees & Print" style="height: 32px; width: 32px;"><i class="fa-solid fa-wallet"></i></button>` : ''}
                        <button class="btn btn-secondary btn-icon-only" style="color: var(--accent); height: 32px; width: 32px;" onclick="openStudentNotesModal('${st.id}')" title="Add/Edit Note & Next Payment"><i class="fa-solid fa-note-sticky"></i></button>
                        ${individualSmsBtn}
                        ${canDelete ? `<button class="btn btn-secondary btn-icon-only" style="color: var(--danger); height: 32px; width: 32px;" onclick="deleteStudent('${st.id}')" title="Delete Student"><i class="fa-solid fa-trash"></i></button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// --- STUDENT PROFILE DETAILS DIALOG ---
// --- STUDENT PROFILE DETAILS DIALOG ---
window.openProfileModal = function(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    // Fill top level personal details
    document.getElementById('prof-name').innerText = st.name;
    document.getElementById('prof-id').innerText = st.id;
    
    const profPhoneEl = document.getElementById('prof-phone');
    if (profPhoneEl) {
        profPhoneEl.innerHTML = `<a href="tel:${st.phone}" style="color: var(--primary); font-weight: 600; text-decoration: underline;">${st.phone}</a>`;
    }
    const profGuardianEl = document.getElementById('prof-guardian');
    if (profGuardianEl) {
        profGuardianEl.innerHTML = st.guardianPhone ? `<a href="tel:${st.guardianPhone}" style="color: inherit; text-decoration: underline;">${st.guardianPhone}</a>` : 'N/A';
    }
    document.getElementById('prof-father').innerText = st.fatherName || 'N/A';
    document.getElementById('prof-mother').innerText = st.motherName || 'N/A';
    document.getElementById('prof-address').innerText = st.address || 'N/A';

    // Find all records that match the student's Registration ID
    const currentRegId = st.registrationId;
    const allRecords = students.filter(s => s.registrationId === currentRegId);

    const coursesContainer = document.getElementById('prof-courses-container');
    if (coursesContainer) {
        coursesContainer.innerHTML = ''; // Clear container

        allRecords.forEach(record => {
            // Calculate waiver details
            const waiverInvoices = (record.invoices || []).filter(inv => inv.paymentType === 'Dues Waived');
            
            // Build waiver audit logs HTML
            let waivedLogsHTML = '';
            if (waiverInvoices.length > 0) {
                const logsListItems = waiverInvoices.map(inv => {
                    return `<li style="margin-bottom: 4px;">
                        <strong>৳${(inv.waivedAmount || 0).toLocaleString()}</strong> waived on <strong>${inv.date}</strong> (Invoice: #${inv.id || 'N/A'})
                    </li>`;
                }).join('');

                waivedLogsHTML = `
                <div style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px dashed var(--danger); background-color: rgba(239, 68, 68, 0.03);">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--danger); font-size: 0.8rem; text-transform: uppercase;"><i class="fa-solid fa-percent"></i> Waived Dues Audit (বকেয়া মওকুফ বিবরণ)</h5>
                    <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                        ${logsListItems}
                    </ul>
                </div>
                `;
            }

            // Build Transaction history table rows HTML
            let transactionRowsHTML = '';
            const allInvoices = record.invoices || [];
            if (allInvoices.length > 0) {
                transactionRowsHTML = allInvoices.map(inv => {
                    const amtText = inv.paymentType === 'Dues Waived' 
                        ? `<span style="color: var(--danger); font-weight: 600;">Waived ৳${(inv.waivedAmount || 0).toLocaleString()}</span>`
                        : `<span style="color: var(--success); font-weight: 600;">৳${inv.amount.toLocaleString()}</span>`;
                    
                    let handoverStatusHtml = '';
                    if (inv.amount > 0 && inv.paymentType !== 'Dues Waived') {
                        const isVerified = inv.receivedByAdmin !== false;
                        handoverStatusHtml = isVerified 
                            ? `<span style="color: var(--success); font-size: 0.65rem; font-weight: 600; margin-left: 6px;"><i class="fa-solid fa-circle-check"></i> Verified</span>`
                            : `<span style="color: #f59e0b; font-size: 0.65rem; font-weight: 600; margin-left: 6px;"><i class="fa-solid fa-clock"></i> Unverified</span>`;
                    }
                    
                    return `
                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <td style="padding: 6px 4px;">${inv.date}</td>
                        <td style="padding: 6px 4px;">
                            <span class="badge badge-secondary" style="font-size: 0.65rem; background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid var(--border-color);">${inv.paymentType}</span>
                            ${handoverStatusHtml}
                        </td>
                        <td style="padding: 6px 4px; text-align: right;">${amtText}</td>
                    </tr>
                    `;
                }).join('');
            } else {
                transactionRowsHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 8px 4px;">No transactions recorded.</td>
                </tr>
                `;
            }

            // Standard details card/panel for each course enrollment
            const netPayableVal = record.netFee !== undefined ? record.netFee : (record.totalFee - (record.discountFee || 0));
            const cardHTML = `
            <div class="glass-panel" style="padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; border-left: 4px solid var(--primary); background: rgba(255,255,255,0.01);">
                <!-- Course Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                    <h4 style="margin: 0; font-size: 0.95rem; color: var(--primary); font-weight: 700;">
                        <i class="fa-solid fa-graduation-cap"></i> ${record.course} (${record.batch || 'No Batch'})
                    </h4>
                    <span class="badge badge-${record.status === 'Paid' ? 'success' : (record.status === 'Partial' ? 'warning' : 'danger')}">
                        ${record.status === 'Partial' ? 'Payment Due' : record.status}
                    </span>
                </div>
                
                <!-- ID, Admission & Next Payment Dates -->
                <div style="display: grid; grid-template-columns: 1fr 1.2fr 1.2fr; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.8rem; background: rgba(255,255,255,0.02); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
                    <div>
                        <span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Student ID</span>
                        <p style="font-weight: 700; margin: 2px 0 0 0; color: var(--text-main);">${record.id}</p>
                    </div>
                    <div>
                        <span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Admission Date</span>
                        <p style="font-weight: 600; margin: 2px 0 0 0;"><i class="fa-regular fa-calendar-check" style="margin-right: 3px;"></i>${record.registrationDate || 'N/A'}</p>
                    </div>
                    <div>
                        <span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Next Payment Date</span>
                        <p style="font-weight: 600; margin: 2px 0 0 0; color: ${record.dueFee > 0 ? 'var(--primary)' : 'inherit'};">
                            <i class="fa-regular fa-calendar-minus" style="margin-right: 3px;"></i>${record.dueFee > 0 ? (record.nextPaymentDate || 'Not Set') : 'N/A'}
                        </p>
                    </div>
                </div>

                <!-- Financial Summary -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center; margin-bottom: 1rem; font-size: 0.85rem;">
                    <div>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">Standard Fee</span>
                        <p style="font-weight: 700; font-size: 0.95rem; margin: 2px 0 0 0;">৳${record.totalFee.toLocaleString()}</p>
                    </div>
                    <div>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">Discount Given</span>
                        <p style="font-weight: 700; font-size: 0.95rem; margin: 2px 0 0 0; color: var(--accent);">৳${(record.discountFee || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <span style="font-size: 0.72rem; color: var(--text-muted);">Net Payable</span>
                        <p style="font-weight: 700; font-size: 0.95rem; margin: 2px 0 0 0;">৳${netPayableVal.toLocaleString()}</p>
                    </div>
                    <div style="grid-column: span 3; border-top: 1px dashed var(--border-color); margin-top: 0.4rem; padding-top: 0.5rem; display: flex; justify-content: space-around;">
                        <div>
                            <span style="font-size: 0.72rem; color: var(--text-muted);">Total Paid</span>
                            <p style="font-weight: 700; color: var(--success); font-size: 0.95rem; margin: 2px 0 0 0;">৳${record.paidFee.toLocaleString()}</p>
                        </div>
                        <div>
                            <span style="font-size: 0.72rem; color: var(--text-muted);">Outstanding Due</span>
                            <p style="font-weight: 700; color: var(--danger); font-size: 0.95rem; margin: 2px 0 0 0;">৳${record.dueFee.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <!-- Waived Dues Audit -->
                ${waivedLogsHTML}

                <!-- Transactions History -->
                <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                    <h5 style="margin: 0 0 0.5rem 0; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);"><i class="fa-solid fa-receipt"></i> Transactions (লেনদেন বিবরণ)</h5>
                    <div style="max-height: 120px; overflow-y: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted);">
                                    <th style="padding: 2px 4px; font-size: 0.75rem;">Date</th>
                                    <th style="padding: 2px 4px; font-size: 0.75rem;">Type</th>
                                    <th style="padding: 2px 4px; font-size: 0.75rem; text-align: right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactionRowsHTML}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `;
            coursesContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- Inject Action Buttons into Profile Modal ---
    const profActionBar = document.getElementById('prof-action-bar');
    if (profActionBar) {
        const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
        const canInvoice = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice);
        const canEdit    = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canEdit);
        const canDelete  = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canDelete);
        const hasDue     = st.dueFee > 0;

        let btns = '';

        // Collect Due — only when there is a due balance
        if (canInvoice && hasDue) {
            btns += `<button onclick="document.getElementById('profile-modal').classList.remove('active'); setTimeout(()=>openPaymentModal('${st.id}'),120);" style="flex:1; min-width:130px; font-size:0.82rem; padding:0.5rem 0.75rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; background:#dc2626; color:#fff; border:none; border-radius:var(--radius-sm); cursor:pointer; font-weight:600;"><i class="fa-solid fa-wallet"></i> Collect Due</button>`;
        }

        // Edit
        if (canEdit) {
            btns += `<button onclick="document.getElementById('profile-modal').classList.remove('active'); setTimeout(()=>openEditStudentModal('${st.id}'),120);" style="flex:1; min-width:100px; font-size:0.82rem; padding:0.5rem 0.75rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; background:var(--bg-secondary); color:var(--text-main); border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:pointer; font-weight:600;"><i class="fa-solid fa-pen-to-square"></i> Edit</button>`;
        }

        // Invoice / Manage Fees
        if (canInvoice) {
            btns += `<button onclick="document.getElementById('profile-modal').classList.remove('active'); setTimeout(()=>openPaymentModal('${st.id}'),120);" style="flex:1; min-width:110px; font-size:0.82rem; padding:0.5rem 0.75rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; background:rgba(99,102,241,0.1); color:var(--primary); border:1px solid var(--primary); border-radius:var(--radius-sm); cursor:pointer; font-weight:600;"><i class="fa-solid fa-file-invoice"></i> Invoice</button>`;
        }

        // Note & Next Payment
        btns += `<button onclick="document.getElementById('profile-modal').classList.remove('active'); setTimeout(()=>openStudentNotesModal('${st.id}'),120);" style="flex:1; min-width:90px; font-size:0.82rem; padding:0.5rem 0.75rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; background:rgba(139,92,246,0.1); color:var(--accent); border:1px solid var(--accent); border-radius:var(--radius-sm); cursor:pointer; font-weight:600;"><i class="fa-solid fa-note-sticky"></i> Note</button>`;

        // SMS
        btns += `<button onclick="document.getElementById('profile-modal').classList.remove('active'); setTimeout(()=>openIndividualSmsModal('${st.id}'),120);" style="flex:1; min-width:90px; font-size:0.82rem; padding:0.5rem 0.75rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; background:var(--bg-secondary); color:var(--text-main); border:1px solid var(--border-color); border-radius:var(--radius-sm); cursor:pointer; font-weight:600;"><i class="fa-solid fa-paper-plane"></i> SMS</button>`;

        // Delete
        if (canDelete) {
            btns += `<button onclick="document.getElementById('profile-modal').classList.remove('active'); setTimeout(()=>deleteStudent('${st.id}'),120);" style="flex:1; min-width:90px; font-size:0.82rem; padding:0.5rem 0.75rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; background:rgba(239,68,68,0.08); color:var(--danger); border:1px solid var(--danger); border-radius:var(--radius-sm); cursor:pointer; font-weight:600;"><i class="fa-solid fa-trash"></i> Delete</button>`;
        }

        profActionBar.innerHTML = btns;
    }

    openModal(document.getElementById('profile-modal'));
};

// --- BATCH MODAL SYSTEM ---
function setupBatchModal() {
    const batchForm = document.getElementById('batch-form');
    const batchCourse = document.getElementById('batch-course');
    const batchNameField = document.getElementById('batch-name');
    const batchTimeField = document.getElementById('batch-time');
    const batchStartDate = document.getElementById('batch-start-date');
    const batchEndDate = document.getElementById('batch-end-date');
    const batchFeeField = document.getElementById('batch-fee');
    const batchDiscountField = document.getElementById('batch-discount');

    if (batchCourse) {
        batchCourse.addEventListener('change', () => {
            const course = batchCourse.value;
            // Auto name
            batchNameField.value = getNextBatchName(course);
            // Fee from settings
            batchFeeField.value = settings.courseFees[course] || defaultFees[course];
            
            // Time shift default
            if (course === "Graphic Design") {
                batchTimeField.value = "09:00 AM - 10:30 AM";
            } else if (course === "Basic Computer") {
                batchTimeField.value = "11:00 AM - 12:30 PM";
            } else {
                batchTimeField.value = "11:00 AM - 12:30 PM";
            }
            
            // Dates
            const today = new Date();
            const durationMonths = course === "Graphic Design" ? 3 : 2;
            const endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + durationMonths);
            batchEndDate.value = getLocalDateString(endDate);
        });
    }

    if (batchForm) {
        batchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const course = batchCourse.value;
            const name = batchNameField.value.trim();
            const time = batchTimeField.value.trim();
            const startDate = batchStartDate.value;
            const endDate = batchEndDate.value;
            const fee = parseInt(batchFeeField.value) || 0;
            const discount = parseInt(batchDiscountField.value) || 0;
            
            // Gather weekly schedule days
            const checkedDays = [];
            document.querySelectorAll('input[name="batch-days"]:checked').forEach(cb => {
                checkedDays.push(cb.value);
            });
            
            if (checkedDays.length === 0) {
                alert("Please select at least one day for the weekly schedule.");
                return;
            }
            
            if (isEditBatchMode) {
                // Edit existing batch
                const batchesList = settings.batches || defaultBatches;
                const targetBatchIndex = batchesList.findIndex(b => b.course === course && b.name === name);
                if (targetBatchIndex === -1) {
                    alert("Error: Batch to edit not found.");
                    return;
                }
                const targetBatch = batchesList[targetBatchIndex];

                const oldTime = targetBatch.time || '';
                const oldFee = targetBatch.fee || 0;
                const oldDays = Array.isArray(targetBatch.schedule) ? targetBatch.schedule.join(', ') : (targetBatch.schedule || '');
                const oldStartDate = targetBatch.startDate || '';
                const oldEndDate = targetBatch.endDate || '';

                // Update properties
                targetBatch.time = time;
                targetBatch.schedule = checkedDays;
                targetBatch.startDate = startDate;
                targetBatch.endDate = endDate;
                targetBatch.fee = fee;
                targetBatch.discount = discount;
                targetBatch.teacher = document.getElementById('batch-teacher').value;
                targetBatch.teacherPercentage = parseInt(document.getElementById('batch-teacher-pct').value) || 0;

                // Log audit trail if Staff (neither Owner nor Admin)
                const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
                const isOwnerOrAdmin = curUser.role === 'Owner' || curUser.role === 'Admin';
                if (!isOwnerOrAdmin) {
                    if (!settings.auditLogs) settings.auditLogs = [];
                    const newDays = checkedDays.join(', ');
                    settings.auditLogs.push({
                        id: `AUD-BATCH-${Date.now()}`,
                        date: getLocalDateString(),
                        type: 'Batch Edit Verification',
                        collectedBy: curUser.username || 'Staff',
                        receivedByAdmin: false,
                        course: course,
                        batch: name,
                        details: `Edited batch ${name} (Days: ${oldDays} -> ${newDays}, Time: ${oldTime} -> ${time}, Dates: ${oldStartDate}/${oldEndDate} -> ${startDate}/${endDate}, Fee: ৳${oldFee} -> ৳${fee})`
                    });
                }

                saveDatabase();
                closeAllModals();
                batchCourse.disabled = false;
                alert(`Batch "${name}" updated successfully!`);

                // If on Batches tab, refresh list and selected details
                const activeTab = document.querySelector('.sidebar-item.active');
                if (activeTab && activeTab.getAttribute('data-tab') === 'batches') {
                    renderBatchesList(selectedCourseForBatches);
                    selectActiveBatch(selectedCourseForBatches, activeBatchForRoster);
                }
            } else {
                // Create new batch
                if (!settings.batches) settings.batches = [];
                if (settings.batches.some(b => b.course === course && b.name === name)) {
                    alert(`Error: A batch named "${name}" already exists for "${course}".`);
                    return;
                }
                
                settings.batches.push({
                    course: course,
                    name: name,
                    fee: fee,
                    discount: discount,
                    time: time,
                    schedule: checkedDays,
                    startDate: startDate,
                    endDate: endDate,
                    teacher: document.getElementById('batch-teacher').value,
                    teacherPercentage: parseInt(document.getElementById('batch-teacher-pct').value) || 0
                });
                
                saveDatabase();
                closeAllModals();
                batchCourse.disabled = false;
                alert(`Batch "${name}" created successfully!`);
                
                // If on Batches tab, refresh list
                const activeTab = document.querySelector('.sidebar-item.active');
                if (activeTab && activeTab.getAttribute('data-tab') === 'batches') {
                    renderBatchesList(selectedCourseForBatches);
                }
            }
        });
    }
}

window.openBatchModal = function(editMode = false) {
    const batchModal = document.getElementById('batch-modal');
    const batchForm = document.getElementById('batch-form');
    const batchCourse = document.getElementById('batch-course');
    const batchNameField = document.getElementById('batch-name');
    const batchTimeField = document.getElementById('batch-time');
    const batchStartDate = document.getElementById('batch-start-date');
    const batchEndDate = document.getElementById('batch-end-date');
    const batchFeeField = document.getElementById('batch-fee');
    const batchDiscountField = document.getElementById('batch-discount');

    if (!batchModal || !batchForm) return;

    isEditBatchMode = editMode;
    batchForm.reset();

    // Populate teacher dropdown
    const teacherSelect = document.getElementById('batch-teacher');
    if (teacherSelect) {
        teacherSelect.innerHTML = '<option value="">-- No Teacher Assigned --</option>';
        if (settings.teachers && settings.teachers.length > 0) {
            settings.teachers.forEach(tch => {
                const opt = document.createElement('option');
                opt.value = tch.name;
                opt.textContent = tch.name;
                teacherSelect.appendChild(opt);
            });
        }
    }

    const titleEl = document.getElementById('batch-modal-title');
    const submitBtn = document.getElementById('batch-submit-btn');

    if (editMode) {
        if (titleEl) titleEl.innerText = "Edit Batch Details";
        if (submitBtn) submitBtn.innerText = "Save Changes";

        // Pre-fill active batch details
        const batchesList = settings.batches || defaultBatches;
        activeBatchForEdit = batchesList.find(b => b.course === selectedCourseForBatches && b.name === activeBatchForRoster);
        if (!activeBatchForEdit) {
            alert("Error: Batch not found.");
            return;
        }

        batchCourse.value = activeBatchForEdit.course;
        batchCourse.disabled = true;

        batchNameField.value = activeBatchForEdit.name;

        batchTimeField.value = activeBatchForEdit.time || '';
        batchStartDate.value = activeBatchForEdit.startDate || '';
        batchEndDate.value = activeBatchForEdit.endDate || '';
        batchFeeField.value = activeBatchForEdit.fee || 0;
        batchDiscountField.value = activeBatchForEdit.discount || 0;
        if (teacherSelect) teacherSelect.value = activeBatchForEdit.teacher || '';
        const pctField = document.getElementById('batch-teacher-pct');
        if (pctField) pctField.value = activeBatchForEdit.teacherPercentage || 0;

        // Set checkboxes
        const schedule = activeBatchForEdit.schedule || [];
        document.querySelectorAll('input[name="batch-days"]').forEach(cb => {
            cb.checked = schedule.includes(cb.value);
        });
    } else {
        if (titleEl) titleEl.innerText = "Create New Batch";
        if (submitBtn) submitBtn.innerText = "Create Batch";

        activeBatchForEdit = null;
        batchCourse.disabled = false;

        // Set course to Graphic Design first and trigger auto-fill
        batchCourse.value = "Graphic Design";
        batchNameField.value = getNextBatchName("Graphic Design");
        batchFeeField.value = settings.courseFees["Graphic Design"] || defaultFees["Graphic Design"];
        batchDiscountField.value = 0;
        batchTimeField.value = "09:00 AM - 10:30 AM";
        
        const today = new Date();
        batchStartDate.value = getLocalDateString(today);
        
        const endDate = new Date(today);
        endDate.setMonth(endDate.getMonth() + 3); // Graphic Design is 3 months
        batchEndDate.value = getLocalDateString(endDate);

        // Reset checkboxes to default (Sat, Mon, Wed checked)
        document.querySelectorAll('input[name="batch-days"]').forEach(cb => {
            if (cb.value === "Sat" || cb.value === "Mon" || cb.value === "Wed") {
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        });

        if (teacherSelect) teacherSelect.value = '';
        const pctField = document.getElementById('batch-teacher-pct');
        if (pctField) pctField.value = 0;
    }

    openModal(batchModal);
};

function getNextBatchName(course) {
    const batches = settings.batches || defaultBatches;
    const courseBatches = batches.filter(b => b.course === course);
    
    if (courseBatches.length === 0) {
        return "Batch 01";
    }
    
    let maxNum = 0;
    courseBatches.forEach(b => {
        const match = b.name.match(/\d+/);
        if (match) {
            const num = parseInt(match[0], 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    
    const nextNum = maxNum + 1;
    const paddedNum = nextNum < 10 ? `0${nextNum}` : nextNum;
    return `Batch ${paddedNum}`;
}

// --- SMS CAMPAIGN AND GATEWAY INTEGRATION ---
function setupSmsFeature() {
    const settingsSmsForm = document.getElementById('settings-sms-form');
    const toggleApiKeyBtn = document.getElementById('toggle-api-key-btn');
    const settingsSmsApiKey = document.getElementById('settings-sms-api-key');
    
    const batchSmsBtn = document.getElementById('batch-sms-btn');
    const smsModal = document.getElementById('sms-modal');
    const smsTargetCourse = document.getElementById('sms-target-course');
    const smsTargetBatch = document.getElementById('sms-target-batch');
    const smsTargetStudent = document.getElementById('sms-target-student');
    const smsTargetGuardian = document.getElementById('sms-target-guardian');
    const smsRecipientCount = document.getElementById('sms-recipient-count');
    const smsRecipientsTooltip = document.getElementById('sms-recipients-tooltip');
    const smsPhoneListContainer = document.getElementById('sms-phone-list-container');
    const smsMessageText = document.getElementById('sms-message-text');
    const smsCharCounter = document.getElementById('sms-char-counter');
    const smsPartsCounter = document.getElementById('sms-parts-counter');
    const smsCampaignForm = document.getElementById('sms-campaign-form');
    const smsSendingIndicator = document.getElementById('sms-sending-indicator');
    const smsSendSubmitBtn = document.getElementById('sms-send-submit-btn');

    let smsRecipientsList = [];

    // Toggle API Key visibility
    if (toggleApiKeyBtn && settingsSmsApiKey) {
        toggleApiKeyBtn.addEventListener('click', () => {
            const isPass = settingsSmsApiKey.getAttribute('type') === 'password';
            settingsSmsApiKey.setAttribute('type', isPass ? 'text' : 'password');
            toggleApiKeyBtn.innerHTML = isPass ? `<i class="fa-solid fa-eye-slash"></i>` : `<i class="fa-solid fa-eye"></i>`;
        });
    }

    // Save SMS Config settings
    if (settingsSmsForm) {
        settingsSmsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const apiKeyVal = document.getElementById('settings-sms-api-key').value.trim();
            const senderIdVal = document.getElementById('settings-sms-sender-id').value.trim();
            const templateVal = document.getElementById('settings-sms-template').value.trim();
            const autoSendVal = document.getElementById('settings-sms-auto-send').checked;
            
            settings.smsConfig = {
                apiKey: apiKeyVal,
                senderId: senderIdVal,
                welcomeTemplate: templateVal,
                autoSendWelcome: autoSendVal
            };
            saveDatabase();
            alert("SMS Gateway Configuration updated successfully!");
        });
    }

    // Toggle recipient view list
    if (smsRecipientsTooltip) {
        smsRecipientsTooltip.addEventListener('click', () => {
            if (smsPhoneListContainer) {
                const isHidden = smsPhoneListContainer.style.display === 'none';
                smsPhoneListContainer.style.display = isHidden ? 'block' : 'none';
                smsRecipientsTooltip.innerText = isHidden ? 'Hide Phone List' : 'View Phone List';
            }
        });
    }

    // Update targeting phone numbers
    function updateSmsRecipients() {
        if (!selectedCourseForBatches || !activeBatchForRoster) return;
        const roster = students.filter(s => s.course && s.course.includes(selectedCourseForBatches) && s.batch && s.batch.includes(activeBatchForRoster));
        smsRecipientsList = [];

        const sendToStudents = smsTargetStudent.checked;
        const sendToGuardians = smsTargetGuardian.checked;

        roster.forEach(st => {
            if (sendToStudents) {
                const formatted = formatBDNumber(st.phone);
                if (formatted && !smsRecipientsList.includes(formatted)) {
                    smsRecipientsList.push(formatted);
                }
            }
            if (sendToGuardians) {
                const formatted = formatBDNumber(st.guardianPhone);
                if (formatted && !smsRecipientsList.includes(formatted)) {
                    smsRecipientsList.push(formatted);
                }
            }
        });

        if (smsRecipientCount) smsRecipientCount.innerText = smsRecipientsList.length;
        if (smsPhoneListContainer) {
            smsPhoneListContainer.innerText = smsRecipientsList.length > 0 ? smsRecipientsList.join(', ') : 'No recipients selected.';
        }
    }

    if (smsTargetStudent) smsTargetStudent.addEventListener('change', updateSmsRecipients);
    if (smsTargetGuardian) smsTargetGuardian.addEventListener('change', updateSmsRecipients);

    // Text counter
    function isUnicode(text) {
        for (let i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) > 127) return true;
        }
        return false;
    }

    function updateCharCounter() {
        if (!smsMessageText || !smsCharCounter || !smsPartsCounter) return;
        const text = smsMessageText.value;
        const charCount = text.length;
        smsCharCounter.innerText = `${charCount} character${charCount === 1 ? '' : 's'}`;

        if (charCount === 0) {
            smsPartsCounter.innerText = "0 / 1 SMS (Standard)";
            return;
        }

        const unicode = isUnicode(text);
        const limitSingle = unicode ? 70 : 160;
        const limitMulti = unicode ? 67 : 153;
        let parts = 1;

        if (charCount > limitSingle) {
            parts = Math.ceil(charCount / limitMulti);
        }
        smsPartsCounter.innerText = `${parts} / ${parts} SMS (${unicode ? 'Unicode/Bengali' : 'Standard/English'})`;
    }

    if (smsMessageText) {
        smsMessageText.addEventListener('input', updateCharCounter);
    }

    // Open Campaign Modal
    if (batchSmsBtn) {
        batchSmsBtn.addEventListener('click', () => {
            const hasConfig = settings.smsConfig?.apiKey && settings.smsConfig?.senderId;
            if (!hasConfig) {
                alert("SMS Gateway is not configured. Please enter your BulkSMSBD API Key and Sender ID in the Settings tab first.");
                const settingsTabBtn = document.querySelector('.sidebar-item[data-tab="settings"]');
                if (settingsTabBtn) settingsTabBtn.click();
                return;
            }

            if (!activeBatchForRoster) {
                alert("Please select a batch first.");
                return;
            }

            if (smsTargetCourse) smsTargetCourse.innerText = selectedCourseForBatches;
            if (smsTargetBatch) smsTargetBatch.innerText = activeBatchForRoster;

            // Reset modal inputs
            if (smsMessageText) smsMessageText.value = '';
            if (smsTargetStudent) smsTargetStudent.checked = true;
            if (smsTargetGuardian) smsTargetGuardian.checked = false;
            updateCharCounter();
            updateSmsRecipients();

            if (smsPhoneListContainer) smsPhoneListContainer.style.display = 'none';
            if (smsRecipientsTooltip) smsRecipientsTooltip.innerText = 'View Phone List';

            openModal(smsModal);
        });
    }

    // Submit Campaign
    if (smsCampaignForm) {
        smsCampaignForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (smsRecipientsList.length === 0) {
                alert("No valid recipients selected. Please ensure the target groups contain valid phone numbers.");
                return;
            }

            const apiKey = settings.smsConfig.apiKey;
            const senderId = settings.smsConfig.senderId;
            const message = smsMessageText.value;
            const numbers = smsRecipientsList.join(',');

            if (smsSendingIndicator) smsSendingIndicator.style.display = 'flex';
            if (smsSendSubmitBtn) smsSendSubmitBtn.disabled = true;

            try {
                const encodedMessage = encodeURIComponent(message);
                const apiUrl = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&senderid=${senderId}&number=${numbers}&message=${encodedMessage}`;

                const res = await fetch(apiUrl);
                const data = await res.json();

                console.log("BulkSMSBD API Gateway Response:", data);

                if (data.response_code === 202) {
                    alert("SMS Campaign submitted successfully!");

                    if (!settings.smsHistory) settings.smsHistory = [];
                    settings.smsHistory.push({
                        date: new Date().toISOString(),
                        batch: activeBatchForRoster,
                        recipientCount: smsRecipientsList.length,
                        status: 'Success',
                        message: message
                    });
                    saveDatabase();
                    closeAllModals();
                } else {
                    const errMsg = data.success_message || `Gateway Error Code: ${data.response_code}`;
                    alert(`Failed to send SMS Campaign: ${errMsg}`);

                    if (!settings.smsHistory) settings.smsHistory = [];
                    settings.smsHistory.push({
                        date: new Date().toISOString(),
                        batch: activeBatchForRoster,
                        recipientCount: smsRecipientsList.length,
                        status: 'Failed',
                        message: message
                    });
                    saveDatabase();
                }
            } catch (err) {
                console.error("SMS Dispatch error:", err);
                alert(`Network error connecting to BulkSMSBD gateway: ${err.message}`);

                if (!settings.smsHistory) settings.smsHistory = [];
                settings.smsHistory.push({
                    date: new Date().toISOString(),
                    batch: activeBatchForRoster,
                    recipientCount: smsRecipientsList.length,
                    status: 'Failed',
                    message: message
                });
                saveDatabase();
            } finally {
                if (smsSendingIndicator) smsSendingIndicator.style.display = 'none';
                if (smsSendSubmitBtn) smsSendSubmitBtn.disabled = false;
            }
        });
    }

    // --- INDIVIDUAL SMS HANDLERS ---
    window.openIndividualSmsModal = function(studentId) {
        const hasConfig = settings.smsConfig?.apiKey && settings.smsConfig?.senderId;
        if (!hasConfig) {
            alert("SMS Gateway is not configured. Please enter your BulkSMSBD API Key and Sender ID in the Settings tab first.");
            const settingsTabBtn = document.querySelector('.sidebar-item[data-tab="settings"]');
            if (settingsTabBtn) settingsTabBtn.click();
            return;
        }

        const st = students.find(s => s.id === studentId);
        if (!st) return;

        const modal = document.getElementById('individual-sms-modal');
        const idInput = document.getElementById('ind-sms-student-id');
        const nameDisplay = document.getElementById('ind-sms-student-name');
        const idDisplay = document.getElementById('ind-sms-student-id-display');
        const selectEl = document.getElementById('ind-sms-recipient-type');
        const messageText = document.getElementById('ind-sms-message-text');

        if (idInput) idInput.value = st.id;
        if (nameDisplay) nameDisplay.innerText = st.name;
        if (idDisplay) idDisplay.innerText = st.id;
        if (messageText) messageText.value = '';

        if (selectEl) {
            let optionsHtml = `<option value="${st.phone}">Student: ${st.phone}</option>`;
            if (st.guardianPhone) {
                optionsHtml += `<option value="${st.guardianPhone}">Guardian: ${st.guardianPhone}</option>`;
            }
            selectEl.innerHTML = optionsHtml;
        }

        updateIndividualCharCounter();

        const sendingIndicator = document.getElementById('ind-sms-sending-indicator');
        if (sendingIndicator) sendingIndicator.style.display = 'none';

        const submitBtn = document.getElementById('ind-sms-send-submit-btn');
        if (submitBtn) submitBtn.disabled = false;

        openModal(modal);
    };

    const indMessageText = document.getElementById('ind-sms-message-text');
    const indCharCounter = document.getElementById('ind-sms-char-counter');
    const indPartsCounter = document.getElementById('ind-sms-parts-counter');

    function updateIndividualCharCounter() {
        if (!indMessageText || !indCharCounter || !indPartsCounter) return;
        const text = indMessageText.value;
        const charCount = text.length;
        indCharCounter.innerText = `${charCount} character${charCount === 1 ? '' : 's'}`;

        if (charCount === 0) {
            indPartsCounter.innerText = "0 / 1 SMS (Standard)";
            return;
        }

        const unicode = isUnicode(text);
        const limitSingle = unicode ? 70 : 160;
        const limitMulti = unicode ? 67 : 153;
        let parts = 1;

        if (charCount > limitSingle) {
            parts = Math.ceil(charCount / limitMulti);
        }
        indPartsCounter.innerText = `${parts} / ${parts} SMS (${unicode ? 'Unicode/Bengali' : 'Standard/English'})`;
    }

    if (indMessageText) {
        indMessageText.addEventListener('input', updateIndividualCharCounter);
    }

    const indSmsForm = document.getElementById('individual-sms-form');
    if (indSmsForm) {
        indSmsForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const studentId = document.getElementById('ind-sms-student-id')?.value;
            const phone = document.getElementById('ind-sms-recipient-type')?.value;
            const message = document.getElementById('ind-sms-message-text')?.value;

            const st = students.find(s => s.id === studentId);
            if (!st) return;

            const formattedPhone = formatBDNumber(phone);
            if (!formattedPhone) {
                alert("Invalid recipient phone number.");
                return;
            }

            const apiKey = settings.smsConfig.apiKey;
            const senderId = settings.smsConfig.senderId;

            const sendingIndicator = document.getElementById('ind-sms-sending-indicator');
            const submitBtn = document.getElementById('ind-sms-send-submit-btn');

            if (sendingIndicator) sendingIndicator.style.display = 'flex';
            if (submitBtn) submitBtn.disabled = true;

            try {
                const encodedMessage = encodeURIComponent(message);
                const apiUrl = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&senderid=${senderId}&number=${formattedPhone}&message=${encodedMessage}`;

                const res = await fetch(apiUrl);
                const data = await res.json();

                console.log("Individual SMS Gateway Response:", data);

                if (data.response_code === 202) {
                    alert("SMS sent successfully!");

                    if (!settings.smsHistory) settings.smsHistory = [];
                    settings.smsHistory.push({
                        date: new Date().toISOString(),
                        batch: `Individual (${st.name})`,
                        recipientCount: 1,
                        status: 'Success',
                        message: message
                    });
                    saveDatabase();
                    closeAllModals();
                    renderSmsHistory();
                } else {
                    const errMsg = data.success_message || `Gateway Error Code: ${data.response_code}`;
                    alert(`Failed to send SMS: ${errMsg}`);

                    if (!settings.smsHistory) settings.smsHistory = [];
                    settings.smsHistory.push({
                        date: new Date().toISOString(),
                        batch: `Individual (${st.name})`,
                        recipientCount: 1,
                        status: 'Failed',
                        message: message
                    });
                    saveDatabase();
                }
            } catch (err) {
                console.error("SMS Dispatch error:", err);
                alert(`Network error connecting to BulkSMSBD gateway: ${err.message}`);

                if (!settings.smsHistory) settings.smsHistory = [];
                settings.smsHistory.push({
                    date: new Date().toISOString(),
                    batch: `Individual (${st.name})`,
                    recipientCount: 1,
                    status: 'Failed',
                    message: message
                });
                saveDatabase();
            } finally {
                if (sendingIndicator) sendingIndicator.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
}

function renderSmsHistory() {
    const tbody = document.getElementById('settings-sms-history-tbody');
    if (!tbody) return;

    const history = settings.smsHistory || [];
    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">No SMS campaign history.</td></tr>`;
        return;
    }

    const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    tbody.innerHTML = sorted.map(camp => {
        const dateStr = new Date(camp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const statusClass = camp.status === 'Success' ? 'success' : 'danger';
        return `
            <tr>
                <td style="font-size:0.75rem;">${dateStr}</td>
                <td style="font-weight:600;">${camp.batch}</td>
                <td>${camp.recipientCount}</td>
                <td><span class="badge badge-${statusClass}">${camp.status}</span></td>
            </tr>
        `;
    }).join('');
}

// --- DASHBOARD ANALYTICS PERIOD EARNINGS ---
function calculatePeriodEarnings() {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    
    let lastMonthYear = currentYear;
    let lastMonth = currentMonth - 1;
    if (lastMonth < 0) {
        lastMonth = 11;
        lastMonthYear = currentYear - 1;
    }
    
    let todaySum = 0;
    let todayCount = 0;
    let todayNewReg = 0;
    let todayDueColl = 0;
    let todayBookPay = 0;

    let monthSum = 0;
    let monthCount = 0;
    let lastMonthSum = 0;
    let lastMonthCount = 0;
    let yearSum = 0;
    let yearCount = 0;
    
    students.forEach(st => {
        if (st.invoices) {
            st.invoices.forEach((inv, index) => {
                if (!inv.date) return;
                
                const cleanDateStr = inv.date.split('T')[0];
                const parts = cleanDateStr.split('-');
                const y = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1;
                
                if (isNaN(y) || isNaN(m)) return;
                
                const amount = parseFloat(inv.amount) || 0;
                
                // 1. Today
                if (cleanDateStr === todayStr) {
                    todaySum += amount;
                    todayCount++;

                    const pType = getInvoicePaymentType(st, inv, index);
                    if (pType === 'New Registration') {
                        todayNewReg += amount;
                    } else if (pType === 'Due Collection') {
                        todayDueColl += amount;
                    } else if (pType === 'Book Payment') {
                        todayBookPay += amount;
                    }
                }
                
                // 2. This Month
                if (y === currentYear && m === currentMonth) {
                    monthSum += amount;
                    monthCount++;
                }
                
                // 3. Last Month
                if (y === lastMonthYear && m === lastMonth) {
                    lastMonthSum += amount;
                    lastMonthCount++;
                }
                
                // 4. This Year
                if (y === currentYear) {
                    yearSum += amount;
                    yearCount++;
                }
            });
        }
    });
    
    const todayValEl = document.getElementById('calc-earnings-today');
    const todayCountEl = document.getElementById('calc-count-today');
    const todayNewRegEl = document.getElementById('today-new-reg');
    const todayDueCollEl = document.getElementById('today-due-coll');
    const todayBookPayEl = document.getElementById('today-book-pay');

    const monthValEl = document.getElementById('calc-earnings-month');
    const monthCountEl = document.getElementById('calc-count-month');
    const lastMonthValEl = document.getElementById('calc-earnings-lastmonth');
    const lastMonthCountEl = document.getElementById('calc-count-lastmonth');
    const yearValEl = document.getElementById('calc-earnings-year');
    const yearCountEl = document.getElementById('calc-count-year');
    
    if (todayValEl) todayValEl.innerText = `৳${todaySum.toLocaleString()}`;
    if (todayCountEl) todayCountEl.innerText = `${todayCount} payment${todayCount === 1 ? '' : 's'}`;
    if (todayNewRegEl) todayNewRegEl.innerText = `৳${todayNewReg.toLocaleString()}`;
    if (todayDueCollEl) todayDueCollEl.innerText = `৳${todayDueColl.toLocaleString()}`;
    if (todayBookPayEl) todayBookPayEl.innerText = `৳${todayBookPay.toLocaleString()}`;

    if (monthValEl) monthValEl.innerText = `৳${monthSum.toLocaleString()}`;
    if (monthCountEl) monthCountEl.innerText = `${monthCount} payment${monthCount === 1 ? '' : 's'}`;
    if (lastMonthValEl) lastMonthValEl.innerText = `৳${lastMonthSum.toLocaleString()}`;
    if (lastMonthCountEl) lastMonthCountEl.innerText = `${lastMonthCount} payment${lastMonthCount === 1 ? '' : 's'}`;
    if (yearValEl) yearValEl.innerText = `৳${yearSum.toLocaleString()}`;
    if (yearCountEl) yearCountEl.innerText = `${yearCount} payment${yearCount === 1 ? '' : 's'}`;
}

// --- DASHBOARD RECENT VIEW SUB-TABS ---
function setupDashboardSubTabs() {
    const subTabs = document.querySelectorAll('.dashboard-sub-tab');
    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            subTabs.forEach(t => {
                t.className = "btn btn-secondary btn-sm dashboard-sub-tab";
            });
            tab.className = "btn btn-primary btn-sm dashboard-sub-tab";
            
            const subTabName = tab.getAttribute('data-subtab');
            activeDashboardSubTab = subTabName;
            
            // Toggle view containers
            document.querySelectorAll('.dashboard-table-view').forEach(view => {
                view.style.display = 'none';
            });
            const targetView = document.getElementById(`dashboard-view-${subTabName}`);
            if (targetView) targetView.style.display = 'block';
            
            // Update Title
            const titleEl = document.getElementById('dashboard-list-title');
            if (titleEl) {
                if (subTabName === 'registrations') {
                    titleEl.innerText = "Recent Registrations";
                } else if (subTabName === 'payments') {
                    titleEl.innerText = "Recent Fee Payments";
                } else if (subTabName === 'certificates') {
                    titleEl.innerText = "Recent Certificates Issued";
                } else if (subTabName === 'handover') {
                    titleEl.innerText = "Verify Staff Handover Payments";
                }
            }
            
            renderRecentDashboard();
        });
    });
}

// --- EXCEL CSV EXPORT FEATURES ---
function setupExportFeatures() {
    const batchExportBtn = document.getElementById('batch-export-btn');
    if (batchExportBtn) {
        batchExportBtn.addEventListener('click', () => {
            if (!activeBatchForRoster) {
                alert("Please select a batch first.");
                return;
            }
            
            const course = selectedCourseForBatches;
            const batchName = activeBatchForRoster;
            
            // Filter roster
            const roster = students.filter(s => s.course && s.course.includes(course) && s.batch && s.batch.includes(batchName));
            
            if (roster.length === 0) {
                alert("No students in this batch to export.");
                return;
            }
            
            // Define headers
            const headers = [
                "Student ID",
                "Name",
                "Course",
                "Batch",
                "Father's Name",
                "Mother's Name",
                "Student Phone",
                "Guardian Phone",
                "Total Fee",
                "Discount",
                "Net Fee",
                "Paid Amount",
                "Due Amount",
                "Status"
            ];
            
            // Convert rows
            const rows = roster.map(st => {
                const net = st.netFee !== undefined ? st.netFee : (st.totalFee - (st.discountFee || 0));
                return [
                    st.id || "",
                    st.name || "",
                    st.course || "",
                    st.batch || "",
                    st.fatherName || "",
                    st.motherName || "",
                    st.phone || "",
                    st.guardianPhone || "",
                    st.totalFee || 0,
                    st.discountFee || 0,
                    net,
                    st.paidFee || 0,
                    st.dueFee || 0,
                    st.status || ""
                ];
            });
            
            // Build CSV content
            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(val => {
                    let str = String(val);
                    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
                        str = '"' + str.replace(/"/g, '""') + '"';
                    }
                    return str;
                }).join(","))
            ].join("\n");
            
            // Create Blob with UTF-8 BOM
            const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            
            const sanitizedCourse = course.replace(/[^a-z0-9]/gi, '_');
            const sanitizedBatch = batchName.replace(/[^a-z0-9]/gi, '_');
            const fileName = `${sanitizedCourse}_${sanitizedBatch}_Roster.csv`;
            
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }

    const exportAllBtn = document.getElementById('students-export-all-btn');
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', () => {
            if (students.length === 0) {
                alert("No students registered to export.");
                return;
            }
            
            // Define headers
            const headers = [
                "Student ID",
                "Name",
                "Course",
                "Batch",
                "Father's Name",
                "Mother's Name",
                "Student Phone",
                "Guardian Phone",
                "Total Fee",
                "Discount",
                "Net Fee",
                "Paid Amount",
                "Due Amount",
                "Status",
                "Registration Date"
            ];
            
            // Convert rows
            const rows = students.map(st => {
                const net = st.netFee !== undefined ? st.netFee : (st.totalFee - (st.discountFee || 0));
                return [
                    st.id || "",
                    st.name || "",
                    st.course || "",
                    st.batch || "",
                    st.fatherName || "",
                    st.motherName || "",
                    st.phone || "",
                    st.guardianPhone || "",
                    st.totalFee || 0,
                    st.discountFee || 0,
                    net,
                    st.paidFee || 0,
                    st.dueFee || 0,
                    st.status || "",
                    st.registrationDate || ""
                ];
            });
            
            // Build CSV content
            const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(val => {
                    let str = String(val);
                    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
                        str = '"' + str.replace(/"/g, '""') + '"';
                    }
                    return str;
                }).join(","))
            ].join("\n");
            
            // Create Blob with UTF-8 BOM
            const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            
            const fileName = `Ediz_IT_All_Students_Roster.csv`;
            
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
}

// --- WHATSAPP BATCH GROUP FEATURE ---
function setupWhatsAppFeature() {
    function renderWaIndividualInvites(batchStudents, whatsappLink) {
        const tbody = document.getElementById('wa-individual-list-tbody');
        if (!tbody) return;
        
        if (batchStudents.length === 0) {
            tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--text-muted); padding: 0.75rem;">No students in this batch.</td></tr>`;
            return;
        }
        
        tbody.innerHTML = batchStudents.map(s => {
            const formattedPhone = formatBDNumber(s.phone);
            const cleanPhone = formattedPhone ? formattedPhone : '';
            
            const msg = `Dear ${s.name}, please join the official WhatsApp group for your class (${activeBatchForRoster}): ${whatsappLink} - Ediz IT Institute`;
            const encodedMsg = encodeURIComponent(msg);
            const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` : '#';
            
            return `
                <tr>
                    <td>
                        <div style="font-weight: 600;">${s.name}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${s.phone}</div>
                    </td>
                    <td>
                        ${cleanPhone ? `
                            <a href="${waUrl}" target="_blank" class="btn btn-secondary btn-sm" style="background-color: rgba(37, 211, 102, 0.15); color: #25d366; border: 1px solid #25d366; padding: 0.2rem 0.5rem; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 0.25rem;">
                                <i class="fa-brands fa-whatsapp"></i> Chat & Invite
                            </a>
                        ` : '<span style="color: var(--text-muted); font-size: 0.75rem;">No valid phone</span>'}
                    </td>
                </tr>
            `;
        }).join('');
    }

    const batchWhatsappBtn = document.getElementById('batch-whatsapp-btn');
    const waModal = document.getElementById('whatsapp-group-modal');
    const waTargetCourse = document.getElementById('wa-target-course');
    const waTargetBatch = document.getElementById('wa-target-batch');
    const waSuggestedName = document.getElementById('wa-suggested-name');
    const waStudentNumbers = document.getElementById('wa-student-numbers');
    const waCopyNameBtn = document.getElementById('wa-copy-name-btn');
    const waCopyNumbersBtn = document.getElementById('wa-copy-numbers-btn');
    const waGroupLink = document.getElementById('wa-group-link');
    const waSaveLinkForm = document.getElementById('wa-save-link-form');
    const waSmsInvitePanel = document.getElementById('wa-sms-invite-panel');
    const waSendSmsBtn = document.getElementById('wa-send-sms-btn');

    if (!waModal) return;

    if (batchWhatsappBtn) {
        batchWhatsappBtn.addEventListener('click', () => {
            if (!activeBatchForRoster) {
                alert("Please select a batch first.");
                return;
            }

            if (waTargetCourse) waTargetCourse.innerText = selectedCourseForBatches;
            if (waTargetBatch) waTargetBatch.innerText = activeBatchForRoster;

            // Suggest group name
            const groupName = `Ediz IT - ${activeBatchForRoster}`;
            if (waSuggestedName) waSuggestedName.value = groupName;

            // Find students in active batch
            const batchStudents = students.filter(s => 
                s.course && s.course.includes(selectedCourseForBatches) && 
                s.batch && s.batch.includes(activeBatchForRoster)
            );

            // Collect student phone numbers
            const phones = batchStudents.map(s => {
                let raw = String(s.phone || '');
                let clean = raw.replace(/\D/g, '');
                if (clean.length === 13 && clean.startsWith('8801')) {
                    clean = clean.substring(2);
                }
                return clean;
            }).filter(Boolean);

            if (waStudentNumbers) {
                waStudentNumbers.value = phones.join(', ');
            }

            // Find existing WhatsApp Link
            const batches = settings.batches || defaultBatches;
            const batchObj = batches.find(b => b.course === selectedCourseForBatches && b.name === activeBatchForRoster);
            const waIndividualInvitePanel = document.getElementById('wa-individual-invite-panel');
            
            if (batchObj) {
                if (waGroupLink) waGroupLink.value = batchObj.whatsappLink || '';
                if (waSmsInvitePanel) {
                    waSmsInvitePanel.style.display = batchObj.whatsappLink ? 'block' : 'none';
                }
                if (waIndividualInvitePanel) {
                    waIndividualInvitePanel.style.display = batchObj.whatsappLink ? 'block' : 'none';
                }
                if (batchObj.whatsappLink) {
                    renderWaIndividualInvites(batchStudents, batchObj.whatsappLink);
                }
            } else {
                if (waGroupLink) waGroupLink.value = '';
                if (waSmsInvitePanel) waSmsInvitePanel.style.display = 'none';
                if (waIndividualInvitePanel) waIndividualInvitePanel.style.display = 'none';
            }

            openModal(waModal);
        });
    }

    if (waCopyNameBtn && waSuggestedName) {
        waCopyNameBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(waSuggestedName.value).then(() => {
                const originalText = waCopyNameBtn.innerHTML;
                waCopyNameBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => {
                    waCopyNameBtn.innerHTML = originalText;
                }, 1500);
            });
        });
    }

    if (waCopyNumbersBtn && waStudentNumbers) {
        waCopyNumbersBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(waStudentNumbers.value).then(() => {
                const originalText = waCopyNumbersBtn.innerHTML;
                waCopyNumbersBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => {
                    waCopyNumbersBtn.innerHTML = originalText;
                }, 1500);
            });
        });
    }

    if (waSaveLinkForm) {
        waSaveLinkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const linkVal = waGroupLink.value.trim();

            if (!settings.batches) settings.batches = defaultBatches;
            const batchObj = settings.batches.find(b => b.course === selectedCourseForBatches && b.name === activeBatchForRoster);

            if (batchObj) {
                batchObj.whatsappLink = linkVal;
                saveDatabase();
                if (waSmsInvitePanel) waSmsInvitePanel.style.display = 'block';
                
                const waIndividualInvitePanel = document.getElementById('wa-individual-invite-panel');
                if (waIndividualInvitePanel) waIndividualInvitePanel.style.display = 'block';
                
                const batchStudents = students.filter(s => 
                    s.course && s.course.includes(selectedCourseForBatches) && 
                    s.batch && s.batch.includes(activeBatchForRoster)
                );
                renderWaIndividualInvites(batchStudents, linkVal);
                
                alert(`WhatsApp Group Link saved successfully for Batch ${activeBatchForRoster}!`);
                renderBatchesList(selectedCourseForBatches);
            } else {
                alert("Error: Batch object not found in settings.");
            }
        });
    }

    if (waSendSmsBtn) {
        waSendSmsBtn.addEventListener('click', async () => {
            const hasConfig = settings.smsConfig?.apiKey && settings.smsConfig?.senderId;
            if (!hasConfig) {
                alert("SMS Gateway is not configured. Please enter your BulkSMSBD API Key and Sender ID in the Settings tab first.");
                return;
            }

            const batches = settings.batches || defaultBatches;
            const batchObj = batches.find(b => b.course === selectedCourseForBatches && b.name === activeBatchForRoster);

            if (!batchObj || !batchObj.whatsappLink) {
                alert("Please save a WhatsApp Group Invite Link first.");
                return;
            }

            const batchStudents = students.filter(s => 
                s.course && s.course.includes(selectedCourseForBatches) && 
                s.batch && s.batch.includes(activeBatchForRoster)
            );

            const recipients = batchStudents.map(s => formatBDNumber(s.phone)).filter(Boolean);

            if (recipients.length === 0) {
                alert("No students with valid mobile numbers in this batch.");
                return;
            }

            if (!confirm(`Are you sure you want to send the WhatsApp Group invite link via SMS to all ${recipients.length} students of Batch ${activeBatchForRoster}?`)) {
                return;
            }

            const message = `Dear Student, please join the official WhatsApp group for your class (${activeBatchForRoster}): ${batchObj.whatsappLink} - Ediz IT Institute`;
            const numbers = recipients.join(',');
            const apiKey = settings.smsConfig.apiKey;
            const senderId = settings.smsConfig.senderId;
            const encodedMessage = encodeURIComponent(message);
            const apiUrl = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&senderid=${senderId}&number=${numbers}&message=${encodedMessage}`;

            waSendSmsBtn.disabled = true;
            waSendSmsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending SMS...';

            try {
                const res = await fetch(apiUrl);
                const data = await res.json();

                if (data.response_code === 202) {
                    alert("Invite SMS sent successfully to all students!");
                    
                    if (!settings.smsHistory) settings.smsHistory = [];
                    settings.smsHistory.push({
                        date: new Date().toISOString(),
                        batch: activeBatchForRoster,
                        recipientCount: recipients.length,
                        status: 'Success',
                        message: `[WhatsApp Invite] ${message}`
                    });
                    saveDatabase();
                } else {
                    const errMsg = data.success_message || `Gateway Error Code: ${data.response_code}`;
                    alert(`Failed to send SMS Campaign: ${errMsg}`);
                }
            } catch (err) {
                console.error("SMS Dispatch error:", err);
                alert(`Network error connecting to BulkSMSBD gateway: ${err.message}`);
            } finally {
                waSendSmsBtn.disabled = false;
                waSendSmsBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Invite SMS';
            }
        });
    }
}

function formatBDNumber(rawPhone) {
    if (!rawPhone) return null;
    let digits = String(rawPhone).replace(/\D/g, ''); // remove non-digits
    
    // Check if it's already got 88
    if (digits.length === 13 && digits.startsWith('8801')) {
        return digits;
    }
    // Check standard 11 digit mobile numbers
    if (digits.length === 11 && digits.startsWith('01')) {
        return '88' + digits;
    }
    // Fallback if starts with 01 but is different length (e.g. user input typo)
    if (digits.startsWith('01') && digits.length >= 10) {
        return '88' + digits;
    }
    // General fallback
    return digits.length >= 10 ? digits : null;
}

// --- DASHBOARD FILTERING ENGINE ---
function parseDateString(dateStr) {
    if (!dateStr) return null;
    // Check if it's already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    // Check if it is DD/MM/YYYY or MM/DD/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const p0 = parseInt(parts[0]);
        const p1 = parseInt(parts[1]);
        const p2 = parseInt(parts[2]);
        if (parts[2].length === 4) {
            // Check if day is first (e.g. 13/06/2026 -> p0 = 13, p1 = 6)
            if (p0 > 12) {
                return new Date(p2, p1 - 1, p0);
            } else if (p1 > 12) {
                return new Date(p2, p0 - 1, p1);
            } else {
                // Ambient guess: standard in Bangladesh is DD/MM/YYYY
                return new Date(p2, p1 - 1, p0);
            }
        }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

function getFilteredStats() {
    let filteredStudents = [...students];
    
    // Flatten all invoices
    let filteredInvoices = [];
    students.forEach(st => {
        if (st.invoices) {
            st.invoices.forEach(inv => {
                filteredInvoices.push({
                    date: inv.date,
                    amount: inv.amount,
                    studentId: st.id
                });
            });
        }
    });

    let filteredCerts = students.filter(st => st.certified);

    if (dashboardDateRange.type !== 'all') {
        const bounds = getDateRangeBounds(dashboardDateRange.type, dashboardDateRange.start, dashboardDateRange.end);
        const start = bounds.start;
        const end = bounds.end;

        // Check if date falls in [start, end]
        function inRange(dateVal) {
            if (!dateVal) return false;
            const parsed = parseDateString(dateVal);
            if (!parsed) return false;
            if (start && parsed < start) return false;
            if (end && parsed > end) return false;
            return true;
        }

        filteredStudents = students.filter(st => inRange(st.registrationDate));
        filteredInvoices = filteredInvoices.filter(inv => inRange(inv.date));
        filteredCerts = students.filter(st => st.certified && inRange(st.certificateDate));
    }

    const totalStudents = filteredStudents.length;
    
    let earnings = 0;
    filteredInvoices.forEach(inv => earnings += inv.amount || 0);

    let dues = 0;
    filteredStudents.forEach(st => dues += st.dueFee || 0);

    const certs = filteredCerts.length;

    return {
        totalStudents,
        earnings,
        dues,
        certs,
        studentsList: filteredStudents
    };
}

function setupEmailFeature() {
    if (!settingsEmailForm) return;

    // Toggle EmailJS fields visibility based on provider choice
    const toggleFields = () => {
        if (settingsEmailProvider.value === 'emailjs') {
            emailjsFields.style.display = 'block';
            settingsEmailjsPublicKey.required = true;
            settingsEmailjsServiceId.required = true;
            settingsEmailjsTemplateId.required = true;
        } else {
            emailjsFields.style.display = 'none';
            settingsEmailjsPublicKey.required = false;
            settingsEmailjsServiceId.required = false;
            settingsEmailjsTemplateId.required = false;
        }
    };

    if (settingsEmailProvider) {
        settingsEmailProvider.addEventListener('change', toggleFields);
        // Initial toggle state
        toggleFields();
    }

    settingsEmailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        settings.emailConfig = {
            provider: settingsEmailProvider.value,
            publicKey: settingsEmailjsPublicKey.value.trim(),
            serviceId: settingsEmailjsServiceId.value.trim(),
            templateId: settingsEmailjsTemplateId.value.trim()
        };
        
        saveDatabase();
        alert("Email Gateway Configuration saved successfully!");
    });
}

function setupDashboardFilters() {
    const filterBtnGroup = document.getElementById('dashboard-filter-btn-group');
    const customFilterBtn = document.getElementById('stats-custom-filter-btn');
    const startDateInput = document.getElementById('stats-start-date');

    if (!filterBtnGroup) return;

    const buttons = filterBtnGroup.querySelectorAll('.stat-filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.className = "btn btn-secondary stat-filter-btn";
                b.classList.remove('btn-primary');
            });
            btn.className = "btn btn-primary stat-filter-btn";

            const rangeType = btn.getAttribute('data-range');
            dashboardDateRange.type = rangeType;
            dashboardDateRange.start = null;
            dashboardDateRange.end = null;

            // Clear custom dates inputs
            if (startDateInput) startDateInput.value = '';

            refreshStats();
            renderRecentDashboard();
        });
    });

    if (customFilterBtn && startDateInput) {
        customFilterBtn.addEventListener('click', () => {
            const startVal = startDateInput.value;

            if (!startVal) {
                alert("Please select a date.");
                return;
            }

            buttons.forEach(b => {
                b.className = "btn btn-secondary stat-filter-btn";
                b.classList.remove('btn-primary');
            });

            dashboardDateRange.type = 'custom';
            dashboardDateRange.start = startVal;
            dashboardDateRange.end = startVal;

            refreshStats();
            renderRecentDashboard();
        });
    }
}

function setupDashboardSearch() {
    const dbSearchInput = document.getElementById('dashboard-student-search');
    const dbResultsCard = document.getElementById('dashboard-search-results-card');
    const dbSearchCount = document.getElementById('dash-search-count');
    const dbSearchTbody = document.getElementById('dashboard-search-results-tbody');

    if (!dbSearchInput || !dbResultsCard || !dbSearchTbody) return;

    dbSearchInput.addEventListener('input', () => {
        const query = dbSearchInput.value.trim().toLowerCase();
        if (!query) {
            dbResultsCard.style.display = 'none';
            dbSearchTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">Type to search...</td></tr>`;
            return;
        }

        const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
        const canEdit = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canEdit);
        const canDelete = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canDelete);
        const canInvoice = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice);

        const cleanQuery = query.replace(/\D/g, "");

        // Prioritize exact ID match
        const exactIdMatch = students.find(st => st.id.toLowerCase() === query);

        const filtered = exactIdMatch ? [exactIdMatch] : students.filter(st => {
            const cleanPhone = st.phone ? st.phone.replace(/\D/g, "") : "";
            const cleanGuardian = st.guardianPhone ? st.guardianPhone.replace(/\D/g, "") : "";

            const hasLetters = /[a-z]/i.test(query);

            return st.id.toLowerCase().includes(query) || 
                   st.name.toLowerCase().includes(query) || 
                   (!hasLetters && cleanQuery && cleanPhone.includes(cleanQuery)) ||
                   (!hasLetters && cleanQuery && cleanGuardian.includes(cleanQuery)) ||
                   (st.batch && st.batch.toLowerCase().includes(query));
        });

        dbResultsCard.style.display = 'block';
        if (dbSearchCount) {
            dbSearchCount.innerText = filtered.length;
        }

        if (filtered.length === 0) {
            dbSearchTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No matching student records.</td></tr>`;
            return;
        }

        dbSearchTbody.innerHTML = filtered.map(st => {
            const hasNextPay = st.nextPaymentDate ? true : false;
            let nextPayHtml = "";
            let isOverdue = false;
            if (hasNextPay && st.dueFee > 0) {
                const todayStr = getLocalDateString();
                isOverdue = st.nextPaymentDate <= todayStr;
                nextPayHtml = `<div style="font-size: 0.75rem; margin-top: 3px; font-weight: 600; color: ${isOverdue ? 'var(--danger)' : 'var(--success)'};">
                    <i class="fa-solid fa-calendar-day"></i> Next Payment: ${st.nextPaymentDate} ${isOverdue ? '<span class="badge badge-danger" style="font-size: 0.6rem; padding: 1px 3px; margin-left: 2px;">Overdue</span>' : ''}
                </div>`;
            }
            const noteHtml = st.notes ? `<div style="font-size: 0.75rem; color: var(--accent); font-style: italic; margin-top: 3px;"><i class="fa-solid fa-sticky-note"></i> Note: ${st.notes}</div>` : '';
            const rowStyle = isOverdue ? 'background-color: rgba(239, 68, 68, 0.05); border-left: 4px solid var(--danger);' : '';

            return `
                <tr style="${rowStyle}">
                    <td>
                        <strong>${st.id}</strong><br>
                        <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">Batch: ${st.batch || 'N/A'}</span>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${st.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${st.address}</div>
                        <div style="font-size: 0.7rem; color: var(--text-muted); font-style: italic;">
                            Parents: ${st.fatherName || 'N/A'} (F), ${st.motherName || 'N/A'} (M)
                        </div>
                        ${nextPayHtml}
                        ${noteHtml}
                    </td>
                    <td>
                        ${st.course}
                        ${st.takenBook ? `<br><span class="badge badge-success" style="font-size:0.65rem; padding: 1px 4px; margin-top: 2px; display: inline-block;">Book Taken</span>` : ''}
                    </td>
                    <td>
                        <div>Mob: <a href="tel:${st.phone}" style="color: var(--primary); font-weight: 600; text-decoration: underline;">${st.phone}</a></div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Grd: ${st.guardianPhone ? `<a href="tel:${st.guardianPhone}" style="color: inherit; text-decoration: underline;">${st.guardianPhone}</a>` : 'N/A'}</div>
                    </td>
                    <td>
                        <div style="font-size: 0.85rem;">Gross: ৳${st.totalFee}</div>
                        <div style="font-size: 0.8rem; color: var(--accent);">Disc: ৳${st.discountFee || 0}</div>
                        <div style="font-size: 0.8rem; font-weight: 600;">Net: ৳${st.netFee !== undefined ? st.netFee : st.totalFee}</div>
                        <div style="font-size: 0.85rem; color: var(--success); font-weight: 500;">Paid: ৳${st.paidFee}</div>
                        <div style="font-size: 0.85rem; color: var(--danger); font-weight: 600;">Due: ৳${st.dueFee}</div>
                    </td>
                    <td><span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status === 'Partial' ? 'Payment Due' : st.status}</span></td>
                    <td>
                        <div class="actions-cell" style="display: flex; gap: 0.35rem; align-items: center;">
                            ${canInvoice && st.dueFee > 0 ? `<button class="btn btn-danger btn-sm" onclick="openPaymentModal('${st.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; white-space: nowrap; height: 32px; background-color: var(--danger); border-color: var(--danger); color: white; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-wallet"></i> Collect Due</button>` : ''}
                            <button class="btn btn-secondary btn-icon-only" onclick="openProfileModal('${st.id}')" title="View Full Profile" style="height: 32px; width: 32px;"><i class="fa-solid fa-eye"></i></button>
                            ${canInvoice && st.dueFee <= 0 ? `<button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Manage Fees" style="height: 32px; width: 32px;"><i class="fa-solid fa-wallet"></i></button>` : ''}
                            ${canEdit ? `<button class="btn btn-secondary btn-icon-only" onclick="openEditStudentModal('${st.id}')" title="Edit Student" style="height: 32px; width: 32px;"><i class="fa-solid fa-edit"></i></button>` : ''}
                            <button class="btn btn-secondary btn-icon-only" style="color: var(--accent); height: 32px; width: 32px;" onclick="openStudentNotesModal('${st.id}')" title="Add/Edit Note & Next Payment"><i class="fa-solid fa-note-sticky"></i></button>
                            ${canDelete ? `<button class="btn btn-secondary btn-icon-only" style="color: var(--danger); height: 32px; width: 32px;" onclick="deleteStudent('${st.id}')" title="Delete Student"><i class="fa-solid fa-trash"></i></button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    });
}

async function sendAutomatedWelcomeSms(studentObj) {
    const hasConfig = settings.smsConfig?.apiKey && settings.smsConfig?.senderId;
    const isAutoSend = settings.smsConfig?.autoSendWelcome !== false;
    if (!hasConfig || !isAutoSend) {
        console.log("Welcome SMS skipped: SMS Config missing or auto-send disabled.");
        return;
    }

    // Find batch info
    const batches = settings.batches || defaultBatches;
    const batchObj = batches.find(b => b.course === studentObj.course && b.name === studentObj.batch) || {
        startDate: 'TBA',
        time: 'TBA'
    };

    // Compile template
    let template = settings.smsConfig.welcomeTemplate || "Dear {student_name}, your admission to {course_name} (Batch: {batch_name}) is confirmed! Class starts: {start_date}, Time: {class_time}.";
    let compiled = template
        .replace(/{student_name}/g, studentObj.name)
        .replace(/{student_id}/g, studentObj.id)
        .replace(/{course_name}/g, studentObj.course)
        .replace(/{batch_name}/g, studentObj.batch)
        .replace(/{start_date}/g, batchObj.startDate || 'TBA')
        .replace(/{class_time}/g, batchObj.time || 'TBA');

    // Compile recipients
    let recipientsList = [];
    const formattedPhone = formatBDNumber(studentObj.phone);
    if (formattedPhone) recipientsList.push(formattedPhone);

    const formattedGuardian = formatBDNumber(studentObj.guardianPhone);
    if (formattedGuardian && !recipientsList.includes(formattedGuardian)) {
        recipientsList.push(formattedGuardian);
    }

    if (recipientsList.length === 0) {
        console.warn("Welcome SMS skipped: No valid phone numbers found.");
        return;
    }

    const apiKey = settings.smsConfig.apiKey;
    const senderId = settings.smsConfig.senderId;
    const numbers = recipientsList.join(',');

    try {
        console.log(`Auto-sending Welcome SMS to ${numbers}...`);
        const encodedMessage = encodeURIComponent(compiled);
        const apiUrl = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&senderid=${senderId}&number=${numbers}&message=${encodedMessage}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        console.log("Welcome SMS Gateway Response:", data);

        if (data.response_code === 202) {
            // Log in SMS Campaign history
            if (!settings.smsHistory) settings.smsHistory = [];
            settings.smsHistory.push({
                date: new Date().toISOString(),
                batch: studentObj.batch,
                recipientCount: recipientsList.length,
                status: 'Success',
                message: `[Auto-Welcome] ${compiled}`
            });
            saveDatabase();
        } else {
            console.warn("Welcome SMS gateway failed:", data);
            if (!settings.smsHistory) settings.smsHistory = [];
            settings.smsHistory.push({
                date: new Date().toISOString(),
                batch: studentObj.batch,
                recipientCount: recipientsList.length,
                status: 'Failed',
                message: `[Auto-Welcome Failed] ${compiled}`
            });
            saveDatabase();
        }
    } catch (err) {
        console.error("Welcome SMS Dispatch error:", err);
        if (!settings.smsHistory) settings.smsHistory = [];
        settings.smsHistory.push({
            date: new Date().toISOString(),
            batch: studentObj.batch,
            recipientCount: recipientsList.length,
            status: 'Failed',
            message: `[Auto-Welcome Error] ${compiled}`
        });
        saveDatabase();
    }
}

// --- FEES LOOKUP & DUE COLLECTION FEATURE ---
function setupDueLookupFeature() {
    const dashboardCollectDueBtn = document.getElementById('dashboard-collect-due-btn');
    const adminCollectDueBtn = document.getElementById('admin-collect-due-btn');
    const dueLookupModal = document.getElementById('due-lookup-modal');
    const dueLookupForm = document.getElementById('due-lookup-form');
    const dueLookupSearch = document.getElementById('due-lookup-search');
    const dueLookupError = document.getElementById('due-lookup-error');

    const triggerDueModal = () => {
        if (dueLookupForm) dueLookupForm.reset();
        if (dueLookupSearch) dueLookupSearch.value = "";
        if (dueLookupError) dueLookupError.style.display = 'none';
        renderDueLookupList();
        openModal(dueLookupModal);
    };

    if (dashboardCollectDueBtn) {
        dashboardCollectDueBtn.addEventListener('click', () => {
            const tabBtn = document.querySelector('.sidebar-item[data-tab="collect-due"]');
            if (tabBtn) tabBtn.click();
        });
    }
    if (adminCollectDueBtn) {
        adminCollectDueBtn.addEventListener('click', () => {
            const tabBtn = document.querySelector('.sidebar-item[data-tab="collect-due"]');
            if (tabBtn) tabBtn.click();
        });
    }

    if (dueLookupForm) {
        dueLookupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchVal = dueLookupSearch.value.trim().toLowerCase();
            if (!searchVal) return;

            const cleanSearchPhone = searchVal.replace(/\D/g, "");

            // Helper functions for smart ID matching
            function normalizeIdForSearch(id) {
                if (!id) return "";
                let clean = id.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (clean.startsWith("ediz")) {
                    clean = clean.substring(4);
                }
                clean = clean.replace(/([a-z]+)0*(\d+)/g, "$1$2");
                clean = clean.replace(/^0+(\d+)/g, "$1");
                return clean;
            }

            function isIdMatch(stId, searchInput) {
                const normId = normalizeIdForSearch(stId);
                const normSearch = normalizeIdForSearch(searchInput);
                if (normId === normSearch) return true;
                if (/^\d+$/.test(normSearch)) {
                    const parts = stId.split('-');
                    const lastPart = parts[parts.length - 1];
                    const num = parseInt(lastPart, 10);
                    const searchNum = parseInt(normSearch, 10);
                    if (!isNaN(num) && num === searchNum) {
                        return true;
                    }
                }
                return false;
            }

            // 1. Check for exact matches by name, smart ID, or phone number
            const exactMatches = students.filter(st => {
                const cleanStudentPhone = st.phone ? st.phone.replace(/\D/g, "") : "";
                const cleanGuardianPhone = st.guardianPhone ? st.guardianPhone.replace(/\D/g, "") : "";
                
                return st.name.toLowerCase() === searchVal || 
                       isIdMatch(st.id, searchVal) ||
                       (cleanSearchPhone && cleanStudentPhone === cleanSearchPhone) ||
                       (cleanSearchPhone && cleanGuardianPhone === cleanSearchPhone);
            });

            if (exactMatches.length === 1) {
                closeAllModals();
                openPaymentModal(exactMatches[0].id);
            } else {
                // 2. Check for partial matches
                const partialMatches = students.filter(st => {
                    const cleanStudentPhone = st.phone ? st.phone.replace(/\D/g, "") : "";
                    const cleanGuardianPhone = st.guardianPhone ? st.guardianPhone.replace(/\D/g, "") : "";
                    
                    return st.name.toLowerCase().includes(searchVal) || 
                           st.id.toLowerCase().includes(searchVal) || 
                           isIdMatch(st.id, searchVal) ||
                           (cleanSearchPhone && cleanStudentPhone.includes(cleanSearchPhone)) ||
                           (cleanSearchPhone && cleanGuardianPhone.includes(cleanSearchPhone));
                });

                if (partialMatches.length === 1) {
                    closeAllModals();
                    openPaymentModal(partialMatches[0].id);
                } else if (partialMatches.length > 1) {
                    if (dueLookupError) dueLookupError.style.display = 'none';
                    const tbody = document.getElementById('due-lookup-list-tbody');
                    if (tbody) {
                        tbody.innerHTML = partialMatches.map(st => `
                            <tr>
                                <td>
                                    <div style="font-weight:600;">${st.name}</div>
                                    <span style="font-size:0.75rem; color:var(--text-muted);">${st.id} | ${st.course} | Mob: <a href="tel:${st.phone}" style="color: inherit; text-decoration: underline;">${st.phone}</a> | Guardian: ${st.guardianPhone ? `<a href="tel:${st.guardianPhone}" style="color: inherit; text-decoration: underline;">${st.guardianPhone}</a>` : 'N/A'}</span>
                                </td>
                                <td style="color:${st.dueFee > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight:700;">
                                    ৳${st.dueFee.toLocaleString()}
                                </td>
                                <td>
                                    <button class="btn btn-primary btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="selectDueStudent('${st.id}')">Select</button>
                                </td>
                            </tr>
                        `).join('');
                    }
                } else {
                    if (dueLookupError) dueLookupError.style.display = 'block';
                }
            }
        });
    }
}

function renderDueLookupList() {
    const tbody = document.getElementById('due-lookup-list-tbody');
    if (!tbody) return;

    const dueStudents = students.filter(st => st.dueFee > 0);
    if (dueStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No outstanding dues found.</td></tr>`;
        return;
    }

    tbody.innerHTML = dueStudents.map(st => `
        <tr>
            <td>
                <div style="font-weight:600;">${st.name}</div>
                <span style="font-size:0.75rem; color:var(--text-muted);">${st.id} | ${st.course} | Mob: <a href="tel:${st.phone}" style="color: inherit; text-decoration: underline;">${st.phone}</a> | Guardian: ${st.guardianPhone ? `<a href="tel:${st.guardianPhone}" style="color: inherit; text-decoration: underline;">${st.guardianPhone}</a>` : 'N/A'}</span>
            </td>
            <td style="color:var(--danger); font-weight:700;">৳${st.dueFee.toLocaleString()}</td>
            <td>
                <button class="btn btn-primary btn-sm" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="selectDueStudent('${st.id}')">Select</button>
            </td>
        </tr>
    `).join('');
}

window.selectDueStudent = function(studentId) {
    closeAllModals();
    openPaymentModal(studentId);
};

// --- REGISTRATION SUCCESS MODAL POPULATION ---
function showRegistrationSuccessModal(st) {
    const successModal = document.getElementById('reg-success-modal');
    if (!successModal) return;

    // Support both a single student object or an array of student objects
    const studentsArray = Array.isArray(st) ? st : [st];
    const firstStudent = studentsArray[0] || {};

    const ids = studentsArray.map(s => s.id).filter(Boolean).join(', ');
    const name = firstStudent.name || '---';
    const courses = studentsArray.map(s => s.course + (s.takenBook ? ' (Book Included)' : '')).filter(Boolean).join(', ');
    const batches = studentsArray.map(s => s.batch).filter(Boolean).join(', ');

    const totalPaid = studentsArray.reduce((sum, s) => sum + (s.paidFee || 0), 0);
    const totalDue = studentsArray.reduce((sum, s) => sum + (s.dueFee || 0), 0);

    // Populate Student Metadata
    const idEl = document.getElementById('success-student-id');
    const nameEl = document.getElementById('success-student-name');
    const courseEl = document.getElementById('success-student-course');
    const batchEl = document.getElementById('success-student-batch');
    const paidEl = document.getElementById('success-student-paid');
    const dueEl = document.getElementById('success-student-due');

    if (idEl) idEl.innerText = ids || '---';
    if (nameEl) nameEl.innerText = name || '---';
    if (courseEl) courseEl.innerText = courses || '---';
    if (batchEl) batchEl.innerText = batches || '---';
    if (paidEl) paidEl.innerText = `৳${totalPaid.toLocaleString()}`;
    if (dueEl) dueEl.innerText = `৳${totalDue.toLocaleString()}`;

    // Wire up Buttons
    const printBtn = document.getElementById('success-print-btn');
    const closeBtn = document.getElementById('success-close-btn');

    if (printBtn) {
        printBtn.onclick = function() {
            const invId = (firstStudent.invoices && firstStudent.invoices.length > 0) ? firstStudent.invoices[0].id : null;
            if (invId) {
                printInvoice(firstStudent.id, invId);
            } else {
                alert('No invoice found for this student registration.');
            }
        };
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            closeAllModals();
        };
    }

    // Open Success Modal
    openModal(successModal);
}

// --- MULTIPLE COURSE REGISTRATION HELPERS ---
function setupMultiCourseListeners() {
    const checkboxes = document.querySelectorAll('.course-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            renderMultiCourseRows();
        });
    });
}

function renderMultiCourseRows() {
    const container = document.getElementById('course-details-container');
    if (!container) return;

    const defaultFees = {
        "Graphic Design": 5000,
        "Basic Computer": 3000,
        "Spoken English": 3000
    };

    // Keep track of previously entered values
    const existingData = {};
    container.querySelectorAll('.course-detail-row').forEach(row => {
        const course = row.getAttribute('data-course');
        const batch = row.querySelector('.course-batch-select').value;
        const fee = parseFloat(row.querySelector('.course-fee-input').value) || 0;
        const discount = parseFloat(row.querySelector('.course-discount-input').value) || 0;
        const paidInput = row.querySelector('.course-paid-input');
        const paid = paidInput ? parseFloat(paidInput.value) || 0 : 0;
        const bookCb = row.querySelector('.course-book-checkbox');
        const takenBook = bookCb ? bookCb.checked : false;
        existingData[course] = { batch, fee, discount, paid, takenBook };
    });

    container.innerHTML = '';
    const checkedBoxes = Array.from(document.querySelectorAll('.course-checkbox:checked'));
    
    if (checkedBoxes.length === 0) {
        container.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin: 0.5rem 0;">Please select at least one course track.</p>';
        recalculateMultiCourseTotals();
        return;
    }

    const batches = settings.batches || defaultBatches;

    checkedBoxes.forEach(cb => {
        const course = cb.value;
        const previous = existingData[course];
        const defaultFee = settings.courseFees?.[course] || defaultFees[course] || 0;
        
        const row = document.createElement('div');
        row.className = 'course-detail-row';
        row.setAttribute('data-course', course);
        row.style.border = '1px solid var(--border-color)';
        row.style.borderRadius = 'var(--radius-sm)';
        row.style.padding = '0.75rem';
        row.style.background = 'var(--bg-secondary)';
        row.style.marginBottom = '0.5rem';

        const courseBatches = batches.filter(b => b.course === course);
        
        // Sort batches numerically descending (newest first)
        courseBatches.sort((a, b) => {
            const numA = parseInt((a.name.match(/\d+/) || [0])[0], 10);
            const numB = parseInt((b.name.match(/\d+/) || [0])[0], 10);
            return numB - numA;
        });

        let batchOptions = `<option value="" disabled ${!previous?.batch ? 'selected' : ''}>-- Select Batch --</option>`;
        
        if (courseBatches.length > 0) {
            courseBatches.forEach(b => {
                let details = b.name;
                let parts = [];
                if (b.time) parts.push(b.time);
                if (b.schedule && b.schedule.length > 0) parts.push(b.schedule.join(','));
                if (b.startDate) parts.push(`Starts: ${b.startDate}`);
                if (parts.length > 0) {
                    details += ` (${parts.join(' | ')})`;
                }
                batchOptions += `<option value="${b.name}" ${previous?.batch === b.name ? 'selected' : ''}>${details}</option>`;
            });
        } else {
            const fallback = {
                "Graphic Design": ["GD-02", "GD-01"],
                "Basic Computer": ["BC-02", "BC-01"],
                "Spoken English": ["SE-02", "SE-01"]
            };
            const list = fallback[course] || [];
            list.forEach(name => {
                batchOptions += `<option value="${name}" ${previous?.batch === name ? 'selected' : ''}>${name}</option>`;
            });
        }

        let bookCheckboxHtml = '';
        if (course === "Basic Computer") {
            bookCheckboxHtml = `
                <div class="form-group" style="margin-bottom: 0; display: flex; align-items: center; height: 100%;">
                    <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; margin: 0; cursor: pointer; font-weight: 600; color: var(--text-main);">
                        <input type="checkbox" class="course-book-checkbox" ${previous?.takenBook ? 'checked' : ''} style="width: 15px; height: 15px; margin: 0;"> Include Book (+৳200)
                    </label>
                </div>
            `;
        }

        row.innerHTML = `
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: var(--primary); font-weight: 700;">${course}</h4>
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Batch Selection</label>
                    <select class="form-control course-batch-select" required style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                        ${batchOptions}
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Course Fee (৳)</label>
                    <input type="number" class="form-control course-fee-input" value="${previous ? previous.fee : defaultFee}" style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Discount (৳)</label>
                    <input type="number" class="form-control course-discount-input" value="${previous ? previous.discount : 0}" style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Initial Paid (৳)</label>
                    <input type="number" class="form-control course-paid-input" value="${previous ? previous.paid : 0}" style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 0.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Net Fee (৳)</label>
                    <input type="number" class="form-control course-net-input" value="0" disabled style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto; font-weight: 600;">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Due Fee (৳)</label>
                    <input type="number" class="form-control course-due-input" value="0" disabled style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto; font-weight: 600; color: var(--danger);">
                </div>
                <div style="display: flex; align-items: flex-end; justify-content: flex-end; height: 100%;">
                    ${bookCheckboxHtml || '<div style="display:block;"></div>'}
                </div>
            </div>
        `;

        container.appendChild(row);

        const feeInput = row.querySelector('.course-fee-input');
        const discInput = row.querySelector('.course-discount-input');
        const paidInput = row.querySelector('.course-paid-input');
        const netInput = row.querySelector('.course-net-input');
        const dueInput = row.querySelector('.course-due-input');
        const batchSelect = row.querySelector('.course-batch-select');
        const bookCb = row.querySelector('.course-book-checkbox');

        function updateRowNet() {
            let fee = parseFloat(feeInput.value) || 0;
            const disc = parseFloat(discInput.value) || 0;
            const paid = parseFloat(paidInput.value) || 0;
            
            let net = fee - disc;
            if (bookCb && bookCb.checked) {
                net += 200;
            }
            netInput.value = net;

            const due = net - paid;
            dueInput.value = due >= 0 ? due : 0;

            recalculateMultiCourseTotals();
        }

        feeInput.addEventListener('input', updateRowNet);
        discInput.addEventListener('input', updateRowNet);
        paidInput.addEventListener('input', updateRowNet);
        if (bookCb) {
            bookCb.addEventListener('change', updateRowNet);
        }
        
        batchSelect.addEventListener('change', () => {
            const bName = batchSelect.value;
            const matched = batches.find(b => b.course === course && b.name === bName);
            if (matched) {
                feeInput.value = matched.fee;
                discInput.value = matched.discount;
                updateRowNet();
            }
        });

        updateRowNet();
    });
}

function recalculateMultiCourseTotals() {
    let totalFeeSum = 0;
    let discountSum = 0;
    let netSum = 0;
    let paidSum = 0;
    let dueSum = 0;

    document.querySelectorAll('.course-detail-row').forEach(row => {
        let fee = parseFloat(row.querySelector('.course-fee-input').value) || 0;
        const discount = parseFloat(row.querySelector('.course-discount-input').value) || 0;
        const paid = parseFloat(row.querySelector('.course-paid-input').value) || 0;
        
        const bookCb = row.querySelector('.course-book-checkbox');
        let rowNet = fee - discount;
        if (bookCb && bookCb.checked) {
            rowNet += 200;
            fee += 200;
        }
        
        totalFeeSum += fee;
        discountSum += discount;
        netSum += rowNet;
        paidSum += paid;
    });

    dueSum = netSum - paidSum;

    // Update hidden legacy input values to prevent page crashes
    const studentFeeTotal = document.getElementById('student-fee-total');
    const studentFeeDiscount = document.getElementById('student-fee-discount');
    const studentFeeNet = document.getElementById('student-fee-net');
    const studentFeePaid = document.getElementById('student-fee-paid');

    if (studentFeeTotal) studentFeeTotal.value = totalFeeSum;
    if (studentFeeDiscount) studentFeeDiscount.value = discountSum;
    if (studentFeeNet) studentFeeNet.value = netSum;
    if (studentFeePaid) studentFeePaid.value = paidSum;

    // Update the summary elements
    const summaryNet = document.getElementById('summary-total-net');
    const summaryPaid = document.getElementById('summary-total-paid');
    const summaryDue = document.getElementById('summary-total-due');

    if (summaryNet) summaryNet.innerText = `৳${netSum.toLocaleString()}`;
    if (summaryPaid) summaryPaid.innerText = `৳${paidSum.toLocaleString()}`;
    if (summaryDue) summaryDue.innerText = `৳${dueSum.toLocaleString()}`;

    // Manage visibility of the next payment date field
    const nextPaymentGroup = document.getElementById('next-payment-date-group');
    if (nextPaymentGroup) {
        if (dueSum > 0) {
            nextPaymentGroup.style.display = 'block';
        } else {
            nextPaymentGroup.style.display = 'none';
            const nextPaymentInput = document.getElementById('student-next-payment-date');
            if (nextPaymentInput) nextPaymentInput.value = '';
        }
    }
}

// --- BOOKS INVENTORY & ALLOCATION FEATURES ---
function saveBookStock(val) {
    bookStock = val;
    localStorage.setItem('ediz_book_stock', val);
}

function setupBooksFeature() {
    const stockForm = document.getElementById('book-stock-form');
    if (stockForm) {
        stockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputVal = parseInt(document.getElementById('book-stock-input').value);
            if (isNaN(inputVal) || inputVal < 0) {
                alert("Please enter a valid stock amount.");
                return;
            }
            saveBookStock(inputVal);
            renderBooksTab();
            alert("Inventory stock updated successfully!");
        });
    }

    const filterSelect = document.getElementById('book-filter-status');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            renderBooksTab();
        });
    }

    const dateFilterSelect = document.getElementById('book-filter-date');
    if (dateFilterSelect) {
        dateFilterSelect.addEventListener('change', () => {
            renderBooksTab();
        });
    }
}

window.renderBooksTab = function() {
    const totalStock = bookStock;
    
    // Calculate books sold: count Basic Computer students with takenBook === true
    const basicComputerStudents = students.filter(s => s.course && s.course.includes("Basic Computer"));
    const booksSold = basicComputerStudents.filter(s => s.takenBook === true).length;
    
    const booksAvailable = Math.max(0, totalStock - booksSold);
    const totalRevenue = booksSold * 200;

    // Update summary text
    const statTotal = document.getElementById('stat-book-total');
    const statSold = document.getElementById('stat-book-sold');
    const statAvailable = document.getElementById('stat-book-available');
    const statRevenue = document.getElementById('stat-book-revenue');
    const stockInput = document.getElementById('book-stock-input');

    if (statTotal) statTotal.innerText = totalStock;
    if (statSold) statSold.innerText = booksSold;
    if (statAvailable) statAvailable.innerText = booksAvailable;
    if (statRevenue) statRevenue.innerText = `৳${totalRevenue.toLocaleString()}`;
    if (stockInput && !stockInput.value) stockInput.value = totalStock;

    // Calculate dynamic analytics cards
    const todayStr = getLocalDateString();
    const curYearMonth = todayStr.substring(0, 7);
    const curYear = todayStr.substring(0, 4);

    const issuedToday = basicComputerStudents.filter(s => s.takenBook === true && s.bookIssueDate === todayStr).length;
    const issuedThisMonth = basicComputerStudents.filter(s => s.takenBook === true && s.bookIssueDate && s.bookIssueDate.startsWith(curYearMonth)).length;
    const issuedThisYear = basicComputerStudents.filter(s => s.takenBook === true && s.bookIssueDate && s.bookIssueDate.startsWith(curYear)).length;
    const pendingDistributions = basicComputerStudents.filter(s => s.takenBook !== true).length;

    const statTodayEl = document.getElementById('stat-book-today');
    const statMonthEl = document.getElementById('stat-book-month');
    const statYearEl = document.getElementById('stat-book-year');
    const statPendingEl = document.getElementById('stat-book-pending');

    if (statTodayEl) statTodayEl.innerText = issuedToday;
    if (statMonthEl) statMonthEl.innerText = issuedThisMonth;
    if (statYearEl) statYearEl.innerText = issuedThisYear;
    if (statPendingEl) statPendingEl.innerText = pendingDistributions;

    // Filter students based on selection: 'all', 'taken', 'not-taken'
    const filterSelect = document.getElementById('book-filter-status');
    const filterVal = filterSelect ? filterSelect.value : 'all';

    const dateFilterSelect = document.getElementById('book-filter-date');
    const dateFilterVal = dateFilterSelect ? dateFilterSelect.value : 'all';

    // Sort Basic Computer students so recently registered students (registrationDate descending) appear first by default.
    const sortedStudents = [...basicComputerStudents].sort((a, b) => {
        const dateA = new Date(a.registrationDate || '1970-01-01');
        const dateB = new Date(b.registrationDate || '1970-01-01');
        return dateB - dateA;
    });

    let displayStudents = sortedStudents;

    // Status filtering
    if (filterVal === 'taken') {
        displayStudents = displayStudents.filter(s => s.takenBook === true);
    } else if (filterVal === 'not-taken') {
        displayStudents = displayStudents.filter(s => s.takenBook !== true);
    }

    // Date filtering
    if (dateFilterVal === 'today') {
        displayStudents = displayStudents.filter(s => s.takenBook === true && s.bookIssueDate === todayStr);
    } else if (dateFilterVal === 'month') {
        displayStudents = displayStudents.filter(s => s.takenBook === true && s.bookIssueDate && s.bookIssueDate.startsWith(curYearMonth));
    } else if (dateFilterVal === 'year') {
        displayStudents = displayStudents.filter(s => s.takenBook === true && s.bookIssueDate && s.bookIssueDate.startsWith(curYear));
    }

    const tbody = document.getElementById('books-tbody');
    if (!tbody) return;

    if (displayStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No student records found.</td></tr>`;
        return;
    }

    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };

    tbody.innerHTML = displayStudents.map(st => {
        const isTaken = st.takenBook === true;
        let statusBadge = '';
        if (isTaken) {
            statusBadge = `<span class="badge badge-success" style="font-size:0.75rem;">Book Taken</span>`;
            if (st.bookIssueDate) {
                statusBadge += `<div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.15rem;"><i class="fa-regular fa-calendar"></i> ${st.bookIssueDate}</div>`;
            }
        } else {
            statusBadge = `<span class="badge badge-danger" style="font-size:0.75rem;">Pending</span>`;
        }
            
        let actionButton = '';
        if (isTaken) {
            if (curUser.role === 'Owner' || curUser.role === 'Admin') {
                actionButton = `<button class="btn btn-secondary btn-sm" onclick="toggleBookAllocation('${st.id}', false)" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Mark Pending</button>`;
            } else {
                actionButton = `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Issued</span>`;
            }
        } else {
            actionButton = `<button class="btn btn-primary btn-sm" onclick="toggleBookAllocation('${st.id}', true)" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Give Book</button>`;
        }

        return `
            <tr>
                <td><strong>${st.id}</strong></td>
                <td>${st.name}</td>
                <td>${st.phone}</td>
                <td>${st.batch || 'N/A'}</td>
                <td>${statusBadge}</td>
                <td>${actionButton}</td>
            </tr>
        `;
    }).join('');
};

window.toggleBookAllocation = function(studentId, status) {
    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
    if (!status && curUser.role === 'Staff') {
        alert("Permission Denied: Staff accounts cannot return books or mark allocations as pending.");
        return;
    }
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    st.takenBook = status;
    if (status) {
        // Add book fee (৳200) to student's financials
        st.totalFee += 200;
        if (st.netFee !== undefined) {
            st.netFee += 200;
        } else {
            st.netFee = st.totalFee;
        }
        st.paidFee += 200; // Increment paidFee by 200 since it is paid
        
        // Generate and record Book Payment invoice
        const bookInvId = getNextInvoiceId();
        if (!st.invoices) st.invoices = [];
        const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { username: 'System', role: 'Unknown' };
        const receivedByAdmin = false;
        st.invoices.push({
            id: bookInvId,
            date: getLocalDateString(),
            amount: 200,
            paymentType: 'Book Payment',
            collectedBy: activeUser.email || activeUser.username,
            receivedByAdmin: receivedByAdmin
        });
        st.bookIssueDate = getLocalDateString();
        
        // Notify admin via SMS
        const adminMsg = `EDIZ IT Alert: Book issued to student ${st.name} (${st.id}) by ${activeUser.username || 'System'}. Collection: ৳200.`;
        const adminPhone = "01798926897";
        sendGeneralSms(adminPhone, adminMsg, "Admin Book Notification");
    } else {
        // Deduct book fee (৳200)
        st.totalFee = Math.max(0, st.totalFee - 200);
        if (st.netFee !== undefined) {
            st.netFee = Math.max(0, st.netFee - 200);
        } else {
            st.netFee = st.totalFee;
        }
        st.paidFee = Math.max(0, st.paidFee - 200);
        
        // Find and remove Book Payment invoice
        if (st.invoices) {
            const invIdx = st.invoices.findIndex(inv => inv.amount === 200 && inv.paymentType === 'Book Payment');
            if (invIdx !== -1) {
                st.invoices.splice(invIdx, 1);
            }
        }
        delete st.bookIssueDate;
    }
    
    // Recalculate status based on new dueFee/paidFee
    const targetNet = st.netFee !== undefined ? st.netFee : st.totalFee;
    st.status = st.paidFee >= targetNet ? 'Paid' : (st.paidFee > 0 ? 'Partial' : 'Unpaid');

    saveDatabase();
    
    // Calculate updated book availability
    const totalStock = bookStock;
    const basicComputerStudents = students.filter(s => s.course && s.course.includes("Basic Computer"));
    const booksSold = basicComputerStudents.filter(s => s.takenBook === true).length;
    const booksAvailable = Math.max(0, totalStock - booksSold);

    // Send SMS to Student
    const studentMsg = status 
        ? `Dear ${st.name}, you have been issued a book for your Basic Computer class. Thank you!`
        : `Dear ${st.name}, your book allocation has been marked as pending/returned.`;
    sendGeneralSms(st.phone, studentMsg, "Student Book Notification");

    // Send SMS to Admin
    const adminPhone = "01798926897";
    const adminMsg = status
        ? `Dear Admin, student ${st.name} (ID: ${st.id}) has taken a book. Total remaining books in stock: ${booksAvailable}.`
        : `Dear Admin, student ${st.name} (ID: ${st.id}) has returned the book. Total remaining books in stock: ${booksAvailable}.`;
    sendGeneralSms(adminPhone, adminMsg, "Admin Book Notification");

    renderAllLists();
    renderBooksTab();

    if (typeof selectedCourseForBatches !== 'undefined' && typeof activeBatchForRoster !== 'undefined' && selectedCourseForBatches && activeBatchForRoster) {
        renderBatchRoster(selectedCourseForBatches, activeBatchForRoster);
    }
};

window.quickIssueBook = function(studentId) {
    window.toggleBookAllocation(studentId, true);
};

// --- REUSABLE SYSTEM SMS DISPATCHER ---
async function sendGeneralSms(number, message, tag) {
    const hasConfig = settings.smsConfig?.apiKey && settings.smsConfig?.senderId;
    if (!hasConfig) {
        console.log(`SMS skipped (${tag}): SMS Config missing.`);
        return false;
    }

    const formattedPhone = formatBDNumber(number);
    if (!formattedPhone) {
        console.warn(`SMS skipped (${tag}): Invalid phone number: ${number}`);
        return false;
    }

    const apiKey = settings.smsConfig.apiKey;
    const senderId = settings.smsConfig.senderId;

    try {
        console.log(`Sending SMS (${tag}) to ${formattedPhone}...`);
        const encodedMessage = encodeURIComponent(message);
        const apiUrl = `https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&senderid=${senderId}&number=${formattedPhone}&message=${encodedMessage}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        console.log(`SMS Gateway Response (${tag}):`, data);

        if (data.response_code === 202) {
            if (!settings.smsHistory) settings.smsHistory = [];
            settings.smsHistory.push({
                date: new Date().toISOString(),
                batch: 'System',
                recipientCount: 1,
                status: 'Success',
                message: `[${tag}] ${message}`
            });
            // Persist the SMS log in the database
            localStorage.setItem('ediz_settings', JSON.stringify(settings));
            renderSmsHistory();
            return true;
        } else {
            console.warn(`SMS Gateway Failed (${tag}):`, data);
            if (!settings.smsHistory) settings.smsHistory = [];
            settings.smsHistory.push({
                date: new Date().toISOString(),
                batch: 'System',
                recipientCount: 1,
                status: 'Failed',
                message: `[${tag} Failed] ${message}`
            });
            localStorage.setItem('ediz_settings', JSON.stringify(settings));
            renderSmsHistory();
            return false;
        }
    } catch (err) {
        console.error(`SMS dispatch error (${tag}):`, err);
        if (!settings.smsHistory) settings.smsHistory = [];
        settings.smsHistory.push({
            date: new Date().toISOString(),
            batch: 'System',
            recipientCount: 1,
            status: 'Error',
            message: `[${tag} Error] ${message}: ${err.message}`
        });
        localStorage.setItem('ediz_settings', JSON.stringify(settings));
        renderSmsHistory();
        return false;
    }
}

window.openStudentNotesModal = function(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    document.getElementById('note-student-id').value = st.id;
    document.getElementById('note-student-name-display').innerText = st.name;
    document.getElementById('note-student-id-display').innerText = st.id;
    document.getElementById('student-notes-input').value = st.notes || '';
    document.getElementById('student-next-payment-date-input').value = st.nextPaymentDate || '';

    openModal(document.getElementById('student-notes-modal'));
};

function setupStudentNotesFeature() {
    const form = document.getElementById('student-notes-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('note-student-id').value;
        const notes = document.getElementById('student-notes-input').value.trim();
        const nextPaymentDate = document.getElementById('student-next-payment-date-input').value;

        const targetStudent = students.find(s => s.id === id);
        if (targetStudent) {
            const currentRegId = targetStudent.registrationId;
            const relatedRecords = students.filter(s => s.registrationId === currentRegId);
            
            relatedRecords.forEach(record => {
                record.notes = notes;
                record.nextPaymentDate = nextPaymentDate || '';
                
                const todayStr = getLocalDateString();
                if (nextPaymentDate > todayStr) {
                    delete record.lastReminderSentDate;
                }
            });

            saveDatabase();
            closeAllModals();
            alert("Student notes and payment reminder date updated successfully!");
        }
    });
}

function checkAndSendNextPaymentReminders() {
    const todayStr = getLocalDateString();
    const adminPhone = settings.phone || "01335530900"; // Admin/Institute Mobile
    let databaseModified = false;

    students.forEach(st => {
        if (st.nextPaymentDate && st.nextPaymentDate <= todayStr && st.dueFee > 0 && st.lastReminderSentDate !== todayStr) {
            // 1. Send Student SMS
            const studentMsg = `Assalamu Alaikum, আজ আপনার পেমেন্ট দেওয়ার নির্ধারিত তারিখ। আপনার বকেয়া (Due) পরিশোধ করুন। ediz it isntitute, our mobile number ${adminPhone}`;
            sendGeneralSms(st.phone, studentMsg, `Student Due Reminder (${st.id})`);

            // 2. Send Guardian SMS
            if (st.guardianPhone) {
                const guardianMsg = `Assalamu Alaikum,আজ আপনার শিক্ষার্থীর কোর্স ফি পরিশোধের নির্ধারিত তারিখ। অনুগ্রহ করে বকেয়া পরিশোধ করুন।ediz it isntitute, our mobile number ${adminPhone}`;
                sendGeneralSms(st.guardianPhone, guardianMsg, `Guardian Due Reminder (${st.id})`);
            }

            // 3. Send Admin SMS
            const adminMsg = `আজ ${st.name} (${st.id})-এর পেমেন্ট দেওয়ার নির্ধারিত তারিখ। এখনও পেমেন্ট বাকি রয়েছে।`;
            sendGeneralSms(adminPhone, adminMsg, `Admin Due Alert (${st.id})`);

            // Mark as sent for today
            st.lastReminderSentDate = todayStr;
            databaseModified = true;
        }
    });

    if (databaseModified) {
        localStorage.setItem('ediz_students', JSON.stringify(students));
    }

    renderDashboardAlerts();
}

function renderDashboardAlerts() {
    const alertsContainer = document.getElementById('payment-reminders-alerts');
    const listContainer = document.getElementById('payment-reminders-list');
    if (!alertsContainer || !listContainer) return;

    const todayStr = getLocalDateString();
    const dueStudents = students.filter(st => st.nextPaymentDate === todayStr && st.dueFee > 0);

    if (dueStudents.length > 0) {
        alertsContainer.style.display = 'block';
        listContainer.innerHTML = dueStudents.map(st => `
            <div class="glass-panel" style="padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border-color); font-size: 0.9rem; border-radius: var(--radius-sm); background: var(--bg-card);">
                <div>
                    <span style="color: var(--danger); font-weight: 700;"><i class="fa-solid fa-circle-exclamation"></i> আজ ${st.name} (${st.id})-এর পেমেন্ট দেওয়ার নির্ধারিত তারিখ। এখনও পেমেন্ট বাকি রয়েছে।</span>
                    <span style="margin-left: 10px; color: var(--text-muted);">Due: ৳${st.dueFee.toLocaleString()} | Course: ${st.course}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm" onclick="openPaymentModal('${st.id}')" style="padding: 0.25rem 0.6rem; font-size: 0.8rem; min-height: auto;"><i class="fa-solid fa-wallet"></i> Collect Fee</button>
                    <button class="btn btn-secondary btn-sm" onclick="sendReminderSmsDirect('${st.id}')" style="padding: 0.25rem 0.6rem; font-size: 0.8rem; min-height: auto;"><i class="fa-solid fa-paper-plane"></i> Send SMS</button>
                </div>
            </div>
        `).join('');
    } else {
        alertsContainer.style.display = 'none';
        listContainer.innerHTML = '';
    }
}

window.sendReminderSmsDirect = function(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;
    const adminPhone = settings.phone || "01335530900";
    
    // Send Student SMS
    const studentMsg = `Assalamu Alaikum, আজ আপনার পেমেন্ট দেওয়ার নির্ধারিত তারিখ। আপনার বকেয়া (Due) পরিশোধ করুন। ediz it isntitute, our mobile number ${adminPhone}`;
    sendGeneralSms(st.phone, studentMsg, `Student Due Reminder (${st.id})`);

    // Send Guardian SMS
    if (st.guardianPhone) {
        const guardianMsg = `Assalamu Alaikum,আজ আপনার শিক্ষার্থীর কোর্স ফি পরিশোধের নির্ধারিত তারিখ। অনুগ্রহ করে বকেয়া পরিশোধ করুন।ediz it isntitute, our mobile number ${adminPhone}`;
        sendGeneralSms(st.guardianPhone, guardianMsg, `Guardian Due Reminder (${st.id})`);
    }
    
    alert(`Reminder SMS successfully dispatched to student ${st.name} and guardian!`);
};

// --- STANDALONE REGISTRATION PAGE HELPERS ---
function setupRegistrationPage() {
    const regForm = document.getElementById('registration-page-form');
    if (!regForm) return;

    // Listen to course checkbox changes
    const checkboxes = document.querySelectorAll('.reg-course-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            renderRegistrationCourseRows();
        });
    });

    // Listen to form submit
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-student-name').value.trim();
        const phone = document.getElementById('reg-student-phone').value.trim();
        const father = document.getElementById('reg-student-father').value.trim();
        const mother = document.getElementById('reg-student-mother').value.trim();
        const guardian = document.getElementById('reg-student-guardian-phone').value.trim();
        const address = document.getElementById('reg-student-address').value.trim();

        // Validation helpers
        function validateBDMobile(num) {
            if (!num) return false;
            const digits = num.replace(/\D/g, ''); // strip non-digits
            return /^01[3-9]\d{8}$/.test(digits);
        }

        // Clean numbers for comparison and validation
        const strippedPhone = phone.replace(/\D/g, '');
        const strippedGuardian = guardian.replace(/\D/g, '');

        if (!validateBDMobile(phone)) {
            alert("Please enter a valid 11-digit Bangladeshi mobile number for the student (e.g. 017xxxxxxxx).");
            return;
        }
        if (!validateBDMobile(guardian)) {
            alert("Please enter a valid 11-digit Bangladeshi mobile number for the guardian (e.g. 017xxxxxxxx).");
            return;
        }
        if (strippedPhone === strippedGuardian) {
            alert("Student Mobile Number and Guardian Mobile Number cannot be the same.");
            return;
        }
        if (!father) {
            alert("Father's Name is required.");
            return;
        }

        // Get selected courses and batches
        const checkedBoxes = Array.from(document.querySelectorAll('.reg-course-checkbox:checked'));
        if (checkedBoxes.length === 0) {
            alert("Please select at least one course track.");
            return;
        }

        let courseDetailsList = [];
        let validationFailed = false;

        document.querySelectorAll('.reg-course-detail-row').forEach(row => {
            const cName = row.getAttribute('data-course');
            const bSelect = row.querySelector('.reg-course-batch-select');
            const bName = bSelect.value;

            if (!bName) {
                alert(`Please select a batch for the course: ${cName}`);
                validationFailed = true;
                return;
            }

            let feeVal = parseFloat(row.querySelector('.reg-course-fee-input').value) || 0;
            const discVal = parseFloat(row.querySelector('.reg-course-discount-input').value) || 0;
            const paidVal = parseFloat(row.querySelector('.reg-course-paid-input').value) || 0;
            
            const bookCb = row.querySelector('.reg-course-book-checkbox');
            const takenBook = bookCb ? bookCb.checked : false;
            
            let netVal = feeVal - discVal;
            if (takenBook) {
                netVal += 200;
                feeVal += 200;
            }

            courseDetailsList.push({
                course: cName,
                batch: bName,
                fee: feeVal,
                discount: discVal,
                net: netVal,
                paid: paidVal,
                takenBook: takenBook
            });
        });

        if (validationFailed) return;

        const totalPaid = courseDetailsList.reduce((sum, item) => sum + item.paid, 0);
        if (totalPaid <= 0) {
            alert("Initial paid amount must be greater than 0. Admission cannot be confirmed without payment.");
            return;
        }

        const todayStr = getLocalDateString();

        // 1. Generate shared Invoice ID & Registration ID
        const invId = getNextInvoiceId();
        const registrationId = getNextRegistrationId();

        // 2. Create separate student records (one per course)
        let newlyCreatedStudents = [];

        const collectorVal = document.getElementById('reg-student-collector').value;
        const selectedCollectorObj = findCollectorUser(collectorVal);
        const receivedByAdmin = false;

        courseDetailsList.forEach((item, idx) => {
            const cName = item.course;
            const bName = item.batch;
            const feeVal = item.fee;
            const discVal = item.discount;
            const netVal = item.net;
            const coursePaid = item.paid;
            const courseDue = netVal - coursePaid;
            const takenBook = item.takenBook || false;

            // Generate prefix-based ID for this specific course track
            const studentId = generateNextStudentId(cName, students, newlyCreatedStudents);

            const status = coursePaid >= netVal ? 'Paid' : (coursePaid > 0 ? 'Partial' : 'Unpaid');

            let invoicesList = [];
            if (takenBook) {
                if (coursePaid >= 200) {
                    invoicesList.push({
                        id: invId + "-B",
                        date: todayStr,
                        amount: 200,
                        paymentType: 'Book Payment',
                        collectedBy: collectorVal,
                        receivedByAdmin: receivedByAdmin
                    });
                    invoicesList.push({
                        id: invId,
                        date: todayStr,
                        amount: coursePaid - 200,
                        paymentType: 'New Registration',
                        collectedBy: collectorVal,
                        receivedByAdmin: receivedByAdmin
                    });
                } else {
                    invoicesList.push({
                        id: invId + "-B",
                        date: todayStr,
                        amount: coursePaid,
                        paymentType: 'Book Payment',
                        collectedBy: collectorVal,
                        receivedByAdmin: receivedByAdmin
                    });
                }
            } else {
                invoicesList.push({
                    id: invId,
                    date: todayStr,
                    amount: coursePaid,
                    paymentType: 'New Registration',
                    collectedBy: collectorVal,
                    receivedByAdmin: receivedByAdmin
                });
            }

            const newStObj = {
                registrationId: registrationId,
                id: studentId,
                name: name,
                phone: phone,
                fatherName: father,
                motherName: mother,
                guardianPhone: guardian,
                address: address,
                course: cName,
                batch: bName,
                registrationDate: todayStr,
                status: status,
                totalFee: feeVal,
                discountFee: discVal,
                netFee: netVal,
                paidFee: coursePaid,
                dueFee: courseDue,
                takenBook: takenBook,
                nextPaymentDate: courseDue > 0 ? document.getElementById('reg-student-next-payment-date').value : '',
                invoices: invoicesList,
                certified: false,
                certificateDate: ''
            };

            students.push(newStObj);
            newlyCreatedStudents.push(newStObj);

            // Trigger Welcome SMS async dispatch for this course
            setTimeout(() => {
                sendAutomatedWelcomeSms(newStObj);
            }, 500 + (idx * 200));
        });

        saveDatabase();

        if (newlyCreatedStudents && newlyCreatedStudents.length > 0) {
            showRegistrationSuccessModal(newlyCreatedStudents);

            // Send Admin Admission Notification SMS
            const adminPhone = "01798926897";
            const studentNames = newlyCreatedStudents[0].name;
            const courseInfos = newlyCreatedStudents.map(s => `${s.course} (${s.batch})`).join(', ');
            const totalNet = newlyCreatedStudents.reduce((sum, s) => sum + s.netFee, 0);
            const totalPaid = newlyCreatedStudents.reduce((sum, s) => sum + s.paidFee, 0);
            const totalDue = totalNet - totalPaid;
            const hasBook = newlyCreatedStudents.some(s => s.takenBook);
            
            let adminMsg = `Dear Admin, student ${studentNames} has enrolled in ${courseInfos}. Net Fee: ৳${totalNet}, Paid: ৳${totalPaid}, Due: ৳${totalDue}.`;
            if (hasBook) {
                const totalStock = bookStock;
                const basicComputerStudents = students.filter(s => s.course && s.course.includes("Basic Computer"));
                const booksSold = basicComputerStudents.filter(s => s.takenBook === true).length;
                const booksAvailable = Math.max(0, totalStock - booksSold);
                adminMsg += ` (Book Included. Remaining books in stock: ${booksAvailable})`;
            }
            sendGeneralSms(adminPhone, adminMsg, "Admin Admission Notification");
        }
        
        // Reset form and go back to students list
        resetRegistrationPageForm();
        const tabBtn = document.querySelector('.sidebar-item[data-tab="students"]');
        if (tabBtn) tabBtn.click();
    });
}

function resetRegistrationPageForm() {
    const regForm = document.getElementById('registration-page-form');
    if (regForm) regForm.reset();
    document.querySelectorAll('.reg-course-checkbox').forEach(cb => cb.checked = false);
    renderRegistrationCourseRows();
}

function renderRegistrationCourseRows() {
    const container = document.getElementById('reg-course-details-container');
    if (!container) return;

    const defaultFees = {
        "Graphic Design": 5000,
        "Basic Computer": 3000,
        "Spoken English": 3000
    };

    // Keep track of previously entered values
    const existingData = {};
    container.querySelectorAll('.reg-course-detail-row').forEach(row => {
        const course = row.getAttribute('data-course');
        const batch = row.querySelector('.reg-course-batch-select').value;
        const fee = parseFloat(row.querySelector('.reg-course-fee-input').value) || 0;
        const discount = parseFloat(row.querySelector('.reg-course-discount-input').value) || 0;
        const paidInput = row.querySelector('.reg-course-paid-input');
        const paid = paidInput ? parseFloat(paidInput.value) || 0 : 0;
        const bookCb = row.querySelector('.reg-course-book-checkbox');
        const takenBook = bookCb ? bookCb.checked : false;
        existingData[course] = { batch, fee, discount, paid, takenBook };
    });

    container.innerHTML = '';
    const checkedBoxes = Array.from(document.querySelectorAll('.reg-course-checkbox:checked'));
    
    if (checkedBoxes.length === 0) {
        container.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin: 0.5rem 0;">Please select at least one course track.</p>';
        recalculateRegistrationCourseTotals();
        return;
    }

    const batches = settings.batches || defaultBatches;

    checkedBoxes.forEach(cb => {
        const course = cb.value;
        const previous = existingData[course];
        const defaultFee = settings.courseFees?.[course] || defaultFees[course] || 0;
        
        const row = document.createElement('div');
        row.className = 'reg-course-detail-row';
        row.setAttribute('data-course', course);
        row.style.border = '1px solid var(--border-color)';
        row.style.borderRadius = 'var(--radius-sm)';
        row.style.padding = '0.75rem';
        row.style.background = 'var(--bg-secondary)';
        row.style.marginBottom = '0.5rem';

        const courseBatches = batches.filter(b => b.course === course);
        
        // Sort batches numerically descending (newest first)
        courseBatches.sort((a, b) => {
            const numA = parseInt((a.name.match(/\d+/) || [0])[0], 10);
            const numB = parseInt((b.name.match(/\d+/) || [0])[0], 10);
            return numB - numA;
        });

        let batchOptions = `<option value="" disabled ${!previous?.batch ? 'selected' : ''}>-- Select Batch --</option>`;
        
        if (courseBatches.length > 0) {
            courseBatches.forEach(b => {
                let details = b.name;
                let parts = [];
                if (b.time) parts.push(b.time);
                if (b.schedule && b.schedule.length > 0) parts.push(b.schedule.join(','));
                if (b.startDate) parts.push(`Starts: ${b.startDate}`);
                if (parts.length > 0) {
                    details += ` (${parts.join(' | ')})`;
                }
                batchOptions += `<option value="${b.name}" ${previous?.batch === b.name ? 'selected' : ''}>${details}</option>`;
            });
        } else {
            const fallback = {
                "Graphic Design": ["GD-02", "GD-01"],
                "Basic Computer": ["BC-02", "BC-01"],
                "Spoken English": ["SE-02", "SE-01"]
            };
            const list = fallback[course] || [];
            list.forEach(name => {
                batchOptions += `<option value="${name}" ${previous?.batch === name ? 'selected' : ''}>${name}</option>`;
            });
        }

        let bookCheckboxHtml = '';
        if (course === "Basic Computer") {
            bookCheckboxHtml = `
                <div class="form-group" style="margin-bottom: 0; display: flex; align-items: center; height: 100%;">
                    <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; margin: 0; cursor: pointer; font-weight: 600; color: var(--text-main);">
                        <input type="checkbox" class="reg-course-book-checkbox" ${previous?.takenBook ? 'checked' : ''} style="width: 15px; height: 15px; margin: 0;"> Include Book (+৳200)
                    </label>
                </div>
            `;
        }

        row.innerHTML = `
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; color: var(--primary); font-weight: 700;">${course}</h4>
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Batch Selection</label>
                    <select class="form-control reg-course-batch-select" required style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                        ${batchOptions}
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Course Fee (৳)</label>
                    <input type="number" class="form-control reg-course-fee-input" value="${previous ? previous.fee : defaultFee}" style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Discount (৳)</label>
                    <input type="number" class="form-control reg-course-discount-input" value="${previous ? previous.discount : 0}" style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Initial Paid (৳)</label>
                    <input type="number" class="form-control reg-course-paid-input" value="${previous ? previous.paid : 0}" style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 0.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Net Fee (৳)</label>
                    <input type="number" class="form-control reg-course-net-input" value="0" disabled style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto; font-weight: 600;">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Due Fee (৳)</label>
                    <input type="number" class="form-control reg-course-due-input" value="0" disabled style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto; font-weight: 600; color: var(--danger);">
                </div>
                <div style="display: flex; align-items: flex-end; justify-content: flex-end; height: 100%;">
                    ${bookCheckboxHtml || '<div style="display:block;"></div>'}
                </div>
            </div>
        `;

        container.appendChild(row);

        const feeInput = row.querySelector('.reg-course-fee-input');
        const discInput = row.querySelector('.reg-course-discount-input');
        const paidInput = row.querySelector('.reg-course-paid-input');
        const netInput = row.querySelector('.reg-course-net-input');
        const dueInput = row.querySelector('.reg-course-due-input');
        const batchSelect = row.querySelector('.reg-course-batch-select');
        const bookCb = row.querySelector('.reg-course-book-checkbox');

        function updateRowNet() {
            let fee = parseFloat(feeInput.value) || 0;
            const disc = parseFloat(discInput.value) || 0;
            const paid = parseFloat(paidInput.value) || 0;
            
            let net = fee - disc;
            if (bookCb && bookCb.checked) {
                net += 200;
            }
            netInput.value = net;

            const due = net - paid;
            dueInput.value = due >= 0 ? due : 0;

            recalculateRegistrationCourseTotals();
        }

        feeInput.addEventListener('input', updateRowNet);
        discInput.addEventListener('input', updateRowNet);
        paidInput.addEventListener('input', updateRowNet);
        if (bookCb) {
            bookCb.addEventListener('change', updateRowNet);
        }
        
        batchSelect.addEventListener('change', () => {
            const bName = batchSelect.value;
            const matched = batches.find(b => b.course === course && b.name === bName);
            if (matched) {
                feeInput.value = matched.fee;
                discInput.value = matched.discount;
                updateRowNet();
            }
        });

        updateRowNet();
    });
}

function recalculateRegistrationCourseTotals() {
    let totalFeeSum = 0;
    let discountSum = 0;
    let netSum = 0;
    let paidSum = 0;
    let dueSum = 0;

    document.querySelectorAll('.reg-course-detail-row').forEach(row => {
        let fee = parseFloat(row.querySelector('.reg-course-fee-input').value) || 0;
        const discount = parseFloat(row.querySelector('.reg-course-discount-input').value) || 0;
        const paid = parseFloat(row.querySelector('.reg-course-paid-input').value) || 0;
        
        const bookCb = row.querySelector('.reg-course-book-checkbox');
        let rowNet = fee - discount;
        if (bookCb && bookCb.checked) {
            rowNet += 200;
            fee += 200;
        }
        
        totalFeeSum += fee;
        discountSum += discount;
        netSum += rowNet;
        paidSum += paid;
    });

    dueSum = netSum - paidSum;

    // Update the summary elements
    const summaryNet = document.getElementById('reg-summary-total-net');
    const summaryPaid = document.getElementById('reg-summary-total-paid');
    const summaryDue = document.getElementById('reg-summary-total-due');

    if (summaryNet) summaryNet.innerText = `৳${netSum.toLocaleString()}`;
    if (summaryPaid) summaryPaid.innerText = `৳${paidSum.toLocaleString()}`;
    if (summaryDue) summaryDue.innerText = `৳${dueSum.toLocaleString()}`;

    // Manage visibility of the next payment date field
    const nextPaymentGroup = document.getElementById('reg-next-payment-date-group');
    if (nextPaymentGroup) {
        if (dueSum > 0) {
            nextPaymentGroup.style.display = 'block';
        } else {
            nextPaymentGroup.style.display = 'none';
        }
    }
}

// --- DUES LEDGER & COLLECTION PAGE HELPERS ---
function renderCollectDueTable() {
    const tbody = document.getElementById('collect-due-tbody');
    const totalCountEl = document.getElementById('collect-due-total-count');
    if (!tbody) return;

    const searchVal = document.getElementById('collect-due-search')?.value.trim().toLowerCase() || "";

    // 1. Filter by Date Range Bounds first
    const bounds = getDateRangeBounds(collectDueDateRange.type, collectDueDateRange.start, collectDueDateRange.end);
    let matchedDateStudents = students.filter(st => st.dueFee > 0).filter(st => {
        let matchesDate = true;
        if (collectDueDateRange.type !== 'all') {
            if (bounds.start || bounds.end) {
                const parsed = parseDateString(st.registrationDate);
                if (!parsed) {
                    matchesDate = false;
                } else {
                    if (bounds.start && parsed < bounds.start) matchesDate = false;
                    if (bounds.end && parsed > bounds.end) matchesDate = false;
                }
            }
        }
        return matchesDate;
    });

    // 2. Calculate and update stats cards
    const totalAmount = matchedDateStudents.reduce((sum, st) => sum + (st.dueFee || 0), 0);
    const totalStudentsCount = matchedDateStudents.length;

    const statAmountEl = document.getElementById('collect-due-stat-amount');
    const statCountEl = document.getElementById('collect-due-stat-count');
    if (statAmountEl) statAmountEl.innerText = `৳${totalAmount.toLocaleString()}`;
    if (statCountEl) statCountEl.innerText = totalStudentsCount.toLocaleString();

    // Calculate total collected in the range
    let totalCollectedInRange = 0;
    students.forEach(st => {
        if (st.invoices && st.invoices.length > 0) {
            st.invoices.forEach(inv => {
                let matchesDate = true;
                if (collectDueDateRange.type !== 'all' && (bounds.start || bounds.end)) {
                    const parsed = parseDateString(inv.date.split('T')[0]);
                    if (!parsed) {
                        matchesDate = false;
                    } else {
                        if (bounds.start && parsed < bounds.start) matchesDate = false;
                        if (bounds.end && parsed > bounds.end) matchesDate = false;
                    }
                }
                if (matchesDate) {
                    totalCollectedInRange += (inv.amount || 0);
                }
            });
        }
    });

    const statCollectedEl = document.getElementById('collect-due-stat-collected');
    if (statCollectedEl) statCollectedEl.innerText = `৳${totalCollectedInRange.toLocaleString()}`;

    // 3. Generate course-wise groups for breakdown
    const courseGroups = {};
    matchedDateStudents.forEach(st => {
        if (!st.course) return;
        if (!courseGroups[st.course]) {
            courseGroups[st.course] = {
                name: st.course,
                due: 0,
                count: 0
            };
        }
        courseGroups[st.course].due += (st.dueFee || 0);
        courseGroups[st.course].count += 1;
    });

    // Render course-wise breakdown cards
    const courseBreakdownEl = document.getElementById('collect-due-course-breakdown');
    const courseListEl = document.getElementById('collect-due-course-list');
    const activeCourses = Object.values(courseGroups).filter(c => c.due > 0);

    if (courseBreakdownEl && courseListEl) {
        if (activeCourses.length > 0 && !searchVal) {
            courseBreakdownEl.style.display = 'block';
            courseListEl.innerHTML = activeCourses.map(c => {
                const isActive = collectDueCourseFilter === c.name;
                return `
                    <div class="course-due-card" onclick="toggleCollectDueCourseFilter('${c.name}')" 
                         style="cursor: pointer; padding: 1rem; border-radius: var(--radius-md); border: 2px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}; background: ${isActive ? 'rgba(99, 102, 241, 0.1)' : 'var(--surface-card)'}; transition: all 0.2s ease; box-shadow: var(--shadow-sm);">
                        <div style="font-weight: 700; color: ${isActive ? 'var(--primary)' : 'var(--text-color)'}; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
                            <span>${c.name}</span>
                            ${isActive ? '<i class="fa-solid fa-circle-check" style="color: var(--primary);"></i>' : ''}
                        </div>
                        <div style="font-size: 1.3rem; font-weight: 800; color: var(--danger); margin: 0.35rem 0;">৳${c.due.toLocaleString()}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-users"></i> ${c.count} Student${c.count > 1 ? 's' : ''}</div>
                    </div>
                `;
            }).join('');
        } else {
            courseBreakdownEl.style.display = 'none';
        }
    }

    // 4. Generate month-wise options for explorer
    const explorerMonthSelect = document.getElementById('explorer-month-select');
    if (explorerMonthSelect) {
        const currentSelected = explorerMonthSelect.value;
        explorerMonthSelect.innerHTML = '<option value="">-- Select Month --</option>';
        
        const allMonths = {};
        students.filter(st => st.dueFee > 0).forEach(st => {
            const parsedDate = parseDateString(st.registrationDate);
            if (!parsedDate) return;
            const year = parsedDate.getFullYear();
            const monthNum = parsedDate.getMonth();
            const monthKey = `${year}-${String(monthNum + 1).padStart(2, '0')}`;
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthName = `${monthNames[monthNum]} ${year}`;
            allMonths[monthKey] = monthName;
        });

        const sortedMonthKeys = Object.keys(allMonths).sort((a, b) => b.localeCompare(a));
        sortedMonthKeys.forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.innerText = allMonths[key];
            explorerMonthSelect.appendChild(opt);
        });

        if (sortedMonthKeys.includes(currentSelected)) {
            explorerMonthSelect.value = currentSelected;
        }
    }

    // Update explorer result values based on active selection
    updateDuesExplorerResults();

    // 6. Filter by Search Query
    let filtered = [];
    if (searchVal) {
        // Search globally across all students with dues, bypassing any active course, batch, or date filters
        filtered = students.filter(st => st.dueFee > 0).filter(st => 
            st.id.toLowerCase().includes(searchVal) ||
            st.name.toLowerCase().includes(searchVal) ||
            st.phone.replace(/\D/g, '').includes(searchVal.replace(/\D/g, '')) ||
            (st.guardianPhone && st.guardianPhone.replace(/\D/g, '').includes(searchVal.replace(/\D/g, ''))) ||
            (st.guardianName && st.guardianName.toLowerCase().includes(searchVal))
        );
    } else {
        // Apply explorer and date filters when no search term is entered
        filtered = matchedDateStudents;
        
        if (collectDueCourseFilter) {
            filtered = filtered.filter(st => st.course === collectDueCourseFilter);
        }

        if (collectDueBatchFilter) {
            filtered = filtered.filter(st => st.batch === collectDueBatchFilter);
        }

        if (collectDueMonthFilter !== 'all') {
            filtered = filtered.filter(st => {
                const parsedDate = parseDateString(st.registrationDate);
                if (!parsedDate) return false;
                const year = parsedDate.getFullYear();
                const monthNum = parsedDate.getMonth();
                const monthKey = `${year}-${String(monthNum + 1).padStart(2, '0')}`;
                return monthKey === collectDueMonthFilter;
            });
        }
    }

    // Update active filter banner visibility & text
    const filterBanner = document.getElementById('collect-due-active-filter-banner');
    const filterText = document.getElementById('collect-due-active-filter-text');
    if (filterBanner && filterText) {
        if (!searchVal && (collectDueCourseFilter || collectDueBatchFilter || collectDueMonthFilter !== 'all')) {
            let filterDesc = [];
            if (collectDueCourseFilter) filterDesc.push(`Course: ${collectDueCourseFilter}`);
            if (collectDueBatchFilter) filterDesc.push(`Batch: ${collectDueBatchFilter}`);
            if (collectDueMonthFilter !== 'all') {
                const parts = collectDueMonthFilter.split('-');
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const mName = monthNames[parseInt(parts[1], 10) - 1] || 'Month';
                filterDesc.push(`Month: ${mName} ${parts[0]}`);
            }
            filterText.innerText = filterDesc.join(' | ');
            filterBanner.style.display = 'flex';
        } else {
            filterBanner.style.display = 'none';
        }
    }

    if (totalCountEl) {
        totalCountEl.innerText = `Total Due Records: ${filtered.length}`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No outstanding dues records found.</td></tr>`;
        return;
    }

    // Sort newest registration first by default for collect dues
    const sorted = [...filtered].sort((a, b) => {
        const dateA = new Date(a.registrationDate || '1970-01-01');
        const dateB = new Date(b.registrationDate || '1970-01-01');
        return dateB - dateA;
    });

    // Check permission to see if user can invoice
    const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
    const canInvoice = activeUser.role === 'Owner' || (activeUser.permissions && activeUser.permissions.canInvoice);

    tbody.innerHTML = sorted.map(st => {
        const nextPayDate = st.nextPaymentDate ? `<div style="font-size: 0.72rem; color: var(--danger); font-weight: 700; margin-top: 0.25rem;"><i class="fa-solid fa-calendar-xmark"></i> Next Pay: ${st.nextPaymentDate}</div>` : '';
        return `
            <tr>
                <td style="text-align: center; vertical-align: middle;">
                    <input type="checkbox" class="collect-due-row-checkbox" data-student-id="${st.id}" onchange="updateDueBulkActionsBar()">
                </td>
                <td style="font-weight: 700; color: var(--primary);">${st.id}</td>
                <td style="font-weight: 600;">${st.name}</td>
                <td>${st.fatherName || 'N/A'}</td>
                <td>
                    <div style="font-weight: 600;">${st.course}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Batch: ${st.batch}</div>
                </td>
                <td>
                    <div><i class="fa-solid fa-mobile-screen-button"></i> Student: ${st.phone}</div>
                    ${st.guardianPhone ? `<div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-people-roof"></i> Guardian: ${st.guardianPhone}</div>` : ''}
                </td>
                <td style="font-weight: 700; color: var(--danger);">
                    ৳${st.dueFee.toLocaleString()}
                    ${nextPayDate}
                </td>
                <td>
                    <div style="display: flex; gap: 0.35rem; align-items: center;">
                        ${canInvoice ? `<button class="btn btn-secondary btn-sm" onclick="openPaymentModal('${st.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; min-height: auto;" title="Collect Fee"><i class="fa-solid fa-wallet"></i> Pay</button>` : `<span style="font-size: 0.8rem; color: var(--text-muted);">View</span>`}
                        <button class="btn btn-primary btn-sm" onclick="sendSmsDueMessage('${st.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; min-height: auto;" title="Send SMS"><i class="fa-solid fa-paper-plane"></i> SMS</button>
                        <button class="btn btn-success btn-sm" onclick="sendWhatsAppDueMessage('${st.id}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; min-height: auto;" title="Send WhatsApp"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Reset master checkbox state
    const masterCheckbox = document.getElementById('collect-due-select-all');
    if (masterCheckbox) masterCheckbox.checked = false;
    updateDueBulkActionsBar();
}

window.toggleCollectDueMonthFilter = function(monthKey) {
    if (collectDueMonthFilter === monthKey) {
        collectDueMonthFilter = 'all';
    } else {
        collectDueMonthFilter = monthKey;
    }
    renderCollectDueTable();
};

window.toggleCollectDueCourseFilter = function(courseName) {
    const selectEl = document.getElementById('collect-due-course-select');
    if (collectDueCourseFilter === courseName) {
        collectDueCourseFilter = '';
    } else {
        collectDueCourseFilter = courseName;
    }
    if (selectEl) {
        selectEl.value = collectDueCourseFilter;
    }
    renderCollectDueTable();
};

// --- DUES EXPLORER & REPORTS SYSTEM ---
window.updateDuesExplorerResults = function() {
    const monthResultEl = document.getElementById('explorer-month-result');
    const monthNoResultEl = document.getElementById('explorer-month-no-result');
    const monthDueVal = document.getElementById('explorer-month-due-val');
    const monthCountVal = document.getElementById('explorer-month-count-val');

    if (explorerSelectedMonth) {
        let monthDues = 0;
        let monthCount = 0;
        students.filter(st => st.dueFee > 0).forEach(st => {
            const parsedDate = parseDateString(st.registrationDate);
            if (!parsedDate) return;
            const year = parsedDate.getFullYear();
            const monthNum = parsedDate.getMonth();
            const monthKey = `${year}-${String(monthNum + 1).padStart(2, '0')}`;
            if (monthKey === explorerSelectedMonth) {
                monthDues += (st.dueFee || 0);
                monthCount++;
            }
        });

        if (monthCount > 0) {
            if (monthDueVal) monthDueVal.innerText = `৳${monthDues.toLocaleString()}`;
            if (monthCountVal) monthCountVal.innerText = monthCount;
            if (monthResultEl) monthResultEl.style.display = 'block';
            if (monthNoResultEl) monthNoResultEl.style.display = 'none';
        } else {
            if (monthResultEl) monthResultEl.style.display = 'none';
            if (monthNoResultEl) {
                monthNoResultEl.style.display = 'block';
                monthNoResultEl.innerText = "No dues found for the selected month.";
            }
        }
    } else {
        if (monthResultEl) monthResultEl.style.display = 'none';
        if (monthNoResultEl) {
            monthNoResultEl.style.display = 'block';
            monthNoResultEl.innerText = "Select a month above and click Search to see results.";
        }
    }

    const batchResultEl = document.getElementById('explorer-batch-result');
    const batchNoResultEl = document.getElementById('explorer-batch-no-result');
    const batchDueVal = document.getElementById('explorer-batch-due-val');
    const batchTotalStudents = document.getElementById('explorer-batch-total-students');
    const batchDueCount = document.getElementById('explorer-batch-due-count');
    const batchResultTitle = document.getElementById('explorer-batch-result-title');

    if (explorerSelectedBatchCourse && explorerSelectedBatch) {
        let batchDues = 0;
        let dueCount = 0;
        const batchStudents = students.filter(st => st.course === explorerSelectedBatchCourse && st.batch === explorerSelectedBatch);
        batchStudents.forEach(st => {
            if (st.dueFee > 0) {
                batchDues += st.dueFee;
                dueCount++;
            }
        });

        if (batchResultTitle) {
            batchResultTitle.innerText = `Dues for ${explorerSelectedBatchCourse} (${explorerSelectedBatch})`;
        }
        if (batchDueVal) batchDueVal.innerText = `৳${batchDues.toLocaleString()}`;
        if (batchTotalStudents) batchTotalStudents.innerText = batchStudents.length;
        if (batchDueCount) batchDueCount.innerText = dueCount;

        if (batchResultEl) batchResultEl.style.display = 'block';
        if (batchNoResultEl) batchNoResultEl.style.display = 'none';
    } else {
        if (batchResultEl) batchResultEl.style.display = 'none';
        if (batchNoResultEl) {
            batchNoResultEl.style.display = 'block';
            batchNoResultEl.innerText = "Select a course and batch above and click Search to see results.";
        }
    }
};

window.exportMonthDuesToExcel = function(monthKey) {
    const roster = students.filter(st => st.dueFee > 0).filter(st => {
        const parsedDate = parseDateString(st.registrationDate);
        if (!parsedDate) return false;
        const year = parsedDate.getFullYear();
        const monthNum = parsedDate.getMonth();
        const mKey = `${year}-${String(monthNum + 1).padStart(2, '0')}`;
        return mKey === monthKey;
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const parts = monthKey.split('-');
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const monthName = monthNames[monthIndex] || 'Month';
    
    const fileName = `${monthName}_${year}_Due_Report.csv`;
    window.downloadDueReportCsv(roster, fileName);
};

function setupDuesExplorerListeners() {
    const explorerMonthSelect = document.getElementById('explorer-month-select');
    const explorerBatchCourseSelect = document.getElementById('explorer-batch-course-select');
    const explorerBatchSelect = document.getElementById('explorer-batch-select');

    if (explorerBatchCourseSelect && explorerBatchSelect) {
        explorerBatchCourseSelect.addEventListener('change', () => {
            const selectedCourse = explorerBatchCourseSelect.value;
            explorerBatchSelect.innerHTML = '<option value="">-- Select Batch --</option>';
            
            // Reset batch results when course changes
            explorerSelectedBatchCourse = selectedCourse;
            explorerSelectedBatch = '';
            updateDuesExplorerResults();

            if (!selectedCourse) {
                explorerBatchSelect.disabled = true;
                return;
            }

            const batchesList = settings.batches || defaultBatches;
            const courseBatches = batchesList.filter(b => b.course === selectedCourse);

            courseBatches.sort((a, b) => {
                const numA = parseInt((a.name.match(/\d+/) || [0])[0], 10);
                const numB = parseInt((b.name.match(/\d+/) || [0])[0], 10);
                return numB - numA;
            });

            courseBatches.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.name;
                opt.innerText = b.name;
                explorerBatchSelect.appendChild(opt);
            });
            explorerBatchSelect.disabled = false;
        });

        explorerBatchSelect.addEventListener('change', () => {
            explorerSelectedBatchCourse = explorerBatchCourseSelect.value;
            explorerSelectedBatch = explorerBatchSelect.value;
            updateDuesExplorerResults();
        });
    }

    if (explorerMonthSelect) {
        explorerMonthSelect.addEventListener('change', () => {
            explorerSelectedMonth = explorerMonthSelect.value;
            updateDuesExplorerResults();
        });
    }

    const monthViewBtn = document.getElementById('explorer-month-view-btn');
    const monthExcelBtn = document.getElementById('explorer-month-excel-btn');
    const batchViewBtn = document.getElementById('explorer-batch-view-btn');
    const batchExcelBtn = document.getElementById('explorer-batch-excel-btn');

    if (monthViewBtn) {
        monthViewBtn.addEventListener('click', () => {
            if (explorerSelectedMonth) {
                collectDueMonthFilter = explorerSelectedMonth;
                collectDueCourseFilter = '';
                collectDueBatchFilter = '';
                renderCollectDueTable();
            }
        });
    }

    if (monthExcelBtn) {
        monthExcelBtn.addEventListener('click', () => {
            if (explorerSelectedMonth) {
                exportMonthDuesToExcel(explorerSelectedMonth);
            }
        });
    }

    if (batchViewBtn) {
        batchViewBtn.addEventListener('click', () => {
            if (explorerSelectedBatchCourse && explorerSelectedBatch) {
                collectDueCourseFilter = explorerSelectedBatchCourse;
                collectDueBatchFilter = explorerSelectedBatch;
                collectDueMonthFilter = 'all';
                renderCollectDueTable();
            }
        });
    }

    if (batchExcelBtn) {
        batchExcelBtn.addEventListener('click', () => {
            if (explorerSelectedBatchCourse && explorerSelectedBatch) {
                exportBatchDuesToExcel(explorerSelectedBatchCourse, explorerSelectedBatch);
            }
        });
    }
}

window.clearCollectDueFilters = function() {
    collectDueCourseFilter = '';
    collectDueBatchFilter = '';
    collectDueMonthFilter = 'all';
    
    // Reset values in explorer dropdowns
    const explorerMonthSelect = document.getElementById('explorer-month-select');
    if (explorerMonthSelect) explorerMonthSelect.value = '';
    
    const explorerBatchCourseSelect = document.getElementById('explorer-batch-course-select');
    if (explorerBatchCourseSelect) explorerBatchCourseSelect.value = '';
    
    const explorerBatchSelect = document.getElementById('explorer-batch-select');
    if (explorerBatchSelect) {
        explorerBatchSelect.innerHTML = '<option value="">-- Select Batch --</option>';
        explorerBatchSelect.disabled = true;
    }
    
    // Reset global explorer selections
    explorerSelectedMonth = '';
    explorerSelectedBatchCourse = '';
    explorerSelectedBatch = '';
    updateDuesExplorerResults();

    const searchInput = document.getElementById('collect-due-search');
    if (searchInput) searchInput.value = '';
    
    renderCollectDueTable();
};

// --- DYNAMIC INVOICE STATISTICS CARD CALCULATIONS ---
function updateInvoiceStats() {
    const bounds = getDateRangeBounds(invoicesDateRange.type, invoicesDateRange.start, invoicesDateRange.end);
    
    // 1. Calculate New Admissions in date range
    let newAdmissionsCount = 0;
    let totalDueAmount = 0;
    
    students.forEach(st => {
        let matchesDate = true;
        if (invoicesDateRange.type !== 'all' && (bounds.start || bounds.end)) {
            const parsed = parseDateString(st.registrationDate);
            if (!parsed) {
                matchesDate = false;
            } else {
                if (bounds.start && parsed < bounds.start) matchesDate = false;
                if (bounds.end && parsed > bounds.end) matchesDate = false;
            }
        }
        if (matchesDate) {
            newAdmissionsCount++;
            totalDueAmount += (st.dueFee || 0);
        }
    });

    // 2. Calculate Fee Collected and Invoices Count in date range
    let totalFeeCollected = 0;
    let invoicesCount = 0;
    const typeFilterVal = invoiceTypeFilter ? invoiceTypeFilter.value : 'all';
    
    students.forEach(st => {
        if (st.invoices && st.invoices.length > 0) {
            st.invoices.forEach((inv, index) => {
                let matchesType = true;
                if (typeFilterVal !== 'all') {
                    const pType = getInvoicePaymentType(st, inv, index);
                    if (pType !== typeFilterVal) matchesType = false;
                }

                let matchesDate = true;
                if (invoicesDateRange.type !== 'all' && (bounds.start || bounds.end)) {
                    const parsed = parseDateString(inv.date.split('T')[0]);
                    if (!parsed) {
                        matchesDate = false;
                    } else {
                        if (bounds.start && parsed < bounds.start) matchesDate = false;
                        if (bounds.end && parsed > bounds.end) matchesDate = false;
                    }
                }
                if (matchesType && matchesDate) {
                    totalFeeCollected += (inv.amount || 0);
                    invoicesCount++;
                }
            });
        }
    });

    // Update the DOM elements
    const admissionsEl = document.getElementById('invoice-stat-admissions');
    const collectedEl = document.getElementById('invoice-stat-collected');
    const dueEl = document.getElementById('invoice-stat-due');
    const countEl = document.getElementById('invoice-stat-count');

    if (admissionsEl) admissionsEl.innerText = newAdmissionsCount.toLocaleString();
    if (collectedEl) collectedEl.innerText = `৳${totalFeeCollected.toLocaleString()}`;
    if (dueEl) dueEl.innerText = `৳${totalDueAmount.toLocaleString()}`;
    if (countEl) countEl.innerText = invoicesCount.toLocaleString();
}

// --- MOBILE NAVIGATION & DRAWER SYSTEM ---
function setupMobileNav() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavList = document.getElementById('mobile-nav-list');
    
    if (!mobileMenuToggle || !mobileNavList) return;
    
    // Populate mobile nav list
    const sidebarItemsList = document.querySelectorAll('.sidebar-menu .sidebar-item');
    let navHtml = `
        <li style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color);">
            <div style="position: relative;">
                <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.85rem;"></i>
                <input type="text" id="mobile-global-student-search" class="form-control" placeholder="Quick Search Student ID or Phone..." style="padding-left: 2.5rem; font-size: 0.85rem; height: 36px; border-radius: var(--radius-md); width: 100%; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-main);">
            </div>
        </li>
    `;
    
    sidebarItemsList.forEach(item => {
        const tab = item.getAttribute('data-tab');
        const icon = item.querySelector('i').className;
        const text = item.querySelector('span').innerText;
        navHtml += `
            <li class="mobile-nav-item" data-tab="${tab}">
                <a href="#${tab}"><i class="${icon}"></i> <span>${text}</span></a>
            </li>
        `;
    });
    
    // Add logout item to mobile nav
    navHtml += `
        <li class="mobile-nav-item logout-item" style="border-top: 1px solid var(--border-color); margin-top: 0.5rem; padding-top: 0.5rem;">
            <a href="#" id="mobile-drawer-logout"><i class="fa-solid fa-sign-out-alt" style="color: var(--danger);"></i> <span style="color: var(--danger);">Log Out</span></a>
        </li>
    `;
    
    mobileNavList.innerHTML = navHtml;
    
    // Toggle menu
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileNavList.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNavList.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle navigation clicks
    mobileNavList.addEventListener('click', (e) => {
        const navItem = e.target.closest('.mobile-nav-item');
        if (!navItem) return;
        
        if (navItem.classList.contains('logout-item') || e.target.closest('#mobile-drawer-logout')) {
            e.preventDefault();
            closeMobileMenu();
            const desktopLogoutBtn = document.getElementById('logout-btn') || document.getElementById('mobile-logout-btn');
            if (desktopLogoutBtn) {
                desktopLogoutBtn.click();
            } else {
                sessionStorage.removeItem('ediz_admin_auth');
                sessionStorage.removeItem('ediz_active_user');
                window.location.reload();
            }
            return;
        }
        
        const tab = navItem.getAttribute('data-tab');
        if (tab) {
            closeMobileMenu();
            window.location.hash = tab;
        }
    });

    function openMobileMenu() {
        mobileNavList.style.display = 'block';
        setTimeout(() => {
            mobileNavList.classList.add('active');
        }, 10);
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-xmark';
        }
    }

    function closeMobileMenu() {
        mobileNavList.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fa-solid fa-bars';
        }
        setTimeout(() => {
            if (!mobileNavList.classList.contains('active')) {
                mobileNavList.style.display = 'none';
            }
        }, 300);
    }

    // Sync search input
    const mobSearch = document.getElementById('mobile-global-student-search');
    const deskSearch = document.getElementById('global-student-search');
    if (mobSearch && deskSearch) {
        mobSearch.addEventListener('input', (e) => {
            deskSearch.value = e.target.value;
            deskSearch.dispatchEvent(new Event('input'));
        });
        
        // Sync clear event
        const clearBtn = document.getElementById('clear-global-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                mobSearch.value = '';
            });
        }
        const closeSearchBtn = document.getElementById('close-global-search-btn');
        if (closeSearchBtn) {
            closeSearchBtn.addEventListener('click', () => {
                mobSearch.value = '';
            });
        }
    }

    // Set initial active tab
    const currentTab = window.location.hash.substring(1) || localStorage.getItem('ediz_active_tab') || 'dashboard';
    document.querySelectorAll('#mobile-nav-list .mobile-nav-item').forEach(li => {
        if (li.getAttribute('data-tab') === currentTab) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });

    // Listen for hashchange to update active states
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            document.querySelectorAll('#mobile-nav-list .mobile-nav-item').forEach(li => {
                if (li.getAttribute('data-tab') === hash) {
                    li.classList.add('active');
                } else {
                    li.classList.remove('active');
                }
            });
        }
    });
}

// --- RESPONSIVE TABLE CARDS SYSTEM ---
function initTableResponsiveObserver() {
    const applyLabels = (table) => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        if (headers.length === 0) return;
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (cell.getAttribute('colspan')) return;
                const label = headers[index] || '';
                if (label && label !== 'Actions' && label !== 'Action' && label !== '---') {
                    cell.setAttribute('data-label', label);
                }
            });
        });
    };

    // Run once on all existing tables
    document.querySelectorAll('table.data-table').forEach(applyLabels);

    // MutationObserver to apply labels when tables are re-rendered dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'TABLE' && node.classList.contains('data-table')) {
                            applyLabels(node);
                        } else {
                            const tables = node.querySelectorAll('table.data-table');
                            tables.forEach(applyLabels);
                        }
                    }
                });
                
                const target = mutation.target;
                if (target.nodeType === Node.ELEMENT_NODE && target.tagName === 'TBODY') {
                    const table = target.closest('table.data-table');
                    if (table) applyLabels(table);
                }
            }
        });
    });

    const portal = document.getElementById('portal-content');
    if (portal) {
        observer.observe(portal, {
            childList: true,
            subtree: true
        });
    }
}

function defaultCollectorInputs() {
    const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || {};
    const defaultVal = activeUser.name || activeUser.username || '';

    const regInput = document.getElementById('reg-student-collector');
    const modInput = document.getElementById('student-collector');
    const payInput = document.getElementById('payment-collector');
    
    if (regInput) regInput.value = defaultVal;
    if (modInput) modInput.value = defaultVal;
    if (payInput) payInput.value = defaultVal;
}

function findCollectorUser(collectorVal) {
    if (!collectorVal) return { role: 'Staff' };
    const val = collectorVal.trim().toLowerCase();
    const users = settings.users || [];
    
    // 1. Try exact match on email, username or name
    let user = users.find(u => {
        const email = (u.email || '').toLowerCase();
        const username = (u.username || '').toLowerCase();
        const name = (u.name || '').toLowerCase();
        return email === val || username === val || name === val;
    });
    
    // 2. Try prefix/fuzzy match
    if (!user) {
        user = users.find(u => {
            const email = (u.email || '').toLowerCase();
            const username = (u.username || '').toLowerCase();
            const name = (u.name || '').toLowerCase();
            return email.includes(val) || username.includes(val) || name.includes(val) || val.includes(username) || val.includes(name);
        });
    }
    
    return user || { role: 'Staff' };
}

let handoverFilterRange = 'today';

function setupHandoverBoardFeature() {
    const rangeGroup = document.getElementById('handover-date-filter-group');
    const monthFilter = document.getElementById('handover-month-filter');
    const dateFilter = document.getElementById('handover-date-filter');
    
    if (rangeGroup) {
        rangeGroup.addEventListener('click', (e) => {
            const btn = e.target.closest('.handover-filter-btn');
            if (!btn) return;
            
            // Set range
            handoverFilterRange = btn.getAttribute('data-range');
            
            // Clear inputs
            if (monthFilter) monthFilter.value = '';
            if (dateFilter) dateFilter.value = '';
            
            // Toggle active classes
            rangeGroup.querySelectorAll('.handover-filter-btn').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-secondary');
            
            renderHandoverBoard();
        });
    }
    
    if (monthFilter) {
        monthFilter.addEventListener('change', () => {
            if (monthFilter.value) {
                handoverFilterRange = 'custom-month';
                if (dateFilter) dateFilter.value = '';
                
                // Clear active buttons
                if (rangeGroup) {
                    rangeGroup.querySelectorAll('.handover-filter-btn').forEach(b => {
                        b.classList.remove('btn-primary');
                        b.classList.add('btn-secondary');
                    });
                }
                renderHandoverBoard();
            }
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            if (dateFilter.value) {
                handoverFilterRange = 'custom-date';
                if (monthFilter) monthFilter.value = '';
                
                // Clear active buttons
                if (rangeGroup) {
                    rangeGroup.querySelectorAll('.handover-filter-btn').forEach(b => {
                        b.classList.remove('btn-primary');
                        b.classList.add('btn-secondary');
                    });
                }
                renderHandoverBoard();
            }
        });
    }
}

window.renderHandoverBoard = function() {
    const tbody = document.getElementById('handover-board-tbody');
    if (!tbody) return;
    
    // Compile invoices list (excluding 'Dues Waived')
    let invoiceList = [];
    students.forEach(st => {
        if (st.invoices) {
            st.invoices.forEach(inv => {
                if (inv.paymentType === 'Dues Waived') return;
                
                invoiceList.push({
                    id: inv.id,
                    date: inv.date,
                    paymentType: inv.paymentType,
                    amount: inv.amount || 0,
                    collectedBy: inv.collectedBy || 'Staff',
                    receivedByAdmin: inv.receivedByAdmin || false,
                    courses: [st.course],
                    studentIds: [st.id],
                    studentNames: [st.name],
                    isAuditLog: false
                });
            });
        }
    });
    
    let groupedInvoices = invoiceList;
    
    // Build audit log records
    let auditList = [];
    students.forEach(st => {
        if (st.auditLogs) {
            st.auditLogs.forEach(log => {
                auditList.push({
                    id: log.id,
                    date: log.date,
                    paymentType: log.type, // 'Batch Transfer' or 'Profile Edit'
                    amount: 0,
                    collectedBy: log.collectedBy || 'Staff',
                    receivedByAdmin: log.receivedByAdmin || false,
                    courses: [log.course || st.course],
                    studentIds: [log.studentId || st.id],
                    studentNames: [log.studentName || st.name],
                    details: log.details,
                    isAuditLog: true
                });
            });
        }
    });

    if (settings.auditLogs) {
        settings.auditLogs.forEach(log => {
            auditList.push({
                id: log.id,
                date: log.date,
                paymentType: log.type, // 'Batch Edit Verification'
                amount: 0,
                collectedBy: log.collectedBy || 'Staff',
                receivedByAdmin: log.receivedByAdmin || false,
                courses: [log.course || 'N/A'],
                studentIds: ['N/A'],
                studentNames: [log.batch ? `Batch: ${log.batch}` : 'Global/System'],
                details: log.details,
                isAuditLog: true
            });
        });
    }
    
    // Build teacher payouts list
    let payoutsList = [];
    if (settings.teacherPayouts) {
        settings.teacherPayouts.forEach(po => {
            payoutsList.push({
                id: po.id,
                date: po.date,
                paymentType: 'Teacher Payout',
                amount: po.amount || 0,
                collectedBy: po.recordedBy || 'Admin',
                receivedByAdmin: po.receivedByAdmin || false,
                courses: ['Teacher Payout'],
                studentIds: [po.teacherId],
                studentNames: [po.teacherName || 'Teacher'],
                details: `Paid ৳${(po.amount || 0).toLocaleString()} via ${po.paymentMethod}. Remarks: ${po.remarks || 'None'}`,
                isAuditLog: false,
                isTeacherPayout: true
            });
        });
    }
    
    let completedTasksList = [];
    if (tasks) {
        tasks.forEach(t => {
            if (t.status === 'Completed') {
                completedTasksList.push({
                    id: t.id,
                    date: t.completedAt ? t.completedAt.substring(0, 10) : (t.date || ''),
                    paymentType: 'Task Completed',
                    amount: 0,
                    collectedBy: t.assignedTo || 'Staff',
                    receivedByAdmin: t.receivedByAdmin || false,
                    courses: ['Daily Tasks'],
                    studentIds: ['N/A'],
                    studentNames: ['N/A'],
                    details: `Task Completed: ${t.description}`,
                    isAuditLog: true,
                    isTaskCompleted: true
                });
            }
        });
    }
    
    let combinedItems = [...groupedInvoices, ...auditList, ...payoutsList, ...completedTasksList];
    
    // Determine filters
    const today = getLocalDateString();
    let filterFn = () => true;
    
    if (handoverFilterRange === 'today') {
        filterFn = (item) => item.date === today;
    } else if (handoverFilterRange === 'yesterday') {
        const yesterdayObj = new Date();
        yesterdayObj.setDate(yesterdayObj.getDate() - 1);
        const yesterday = getLocalDateString(yesterdayObj);
        filterFn = (item) => item.date === yesterday;
    } else if (handoverFilterRange === 'month') {
        const prefix = today.substring(0, 7);
        filterFn = (item) => item.date && item.date.startsWith(prefix);
    } else if (handoverFilterRange === 'last_month') {
        const lmObj = new Date();
        lmObj.setMonth(lmObj.getMonth() - 1);
        const prefix = getLocalDateString(lmObj).substring(0, 7);
        filterFn = (item) => item.date && item.date.startsWith(prefix);
    } else if (handoverFilterRange === 'year') {
        const prefix = today.substring(0, 4);
        filterFn = (item) => item.date && item.date.startsWith(prefix);
    } else if (handoverFilterRange === 'custom-month') {
        const monthVal = document.getElementById('handover-month-filter').value;
        filterFn = (item) => item.date && item.date.startsWith(monthVal);
    } else if (handoverFilterRange === 'custom-date') {
        const dateVal = document.getElementById('handover-date-filter').value;
        filterFn = (item) => item.date === dateVal;
    }
    
    let filteredItems = combinedItems.filter(filterFn);
    window.currentFilteredHandoverItems = filteredItems;
    
    // Sort: Date descending, then ID descending
    filteredItems.sort((a, b) => {
        const dateCompare = (b.date || '').localeCompare(a.date || '');
        if (dateCompare !== 0) return dateCompare;
        return (b.id || '').localeCompare(a.id || '');
    });
    
    // Calculate totals (only from cash transactions, excluding audit logs and teacher payouts)
    let totalCollected = 0;
    let totalVerified = 0;
    let totalPending = 0;
    
    filteredItems.forEach(item => {
        if (!item.isAuditLog && !item.isTeacherPayout) {
            totalCollected += item.amount;
            if (item.receivedByAdmin) {
                totalVerified += item.amount;
            } else {
                totalPending += item.amount;
            }
        }
    });
    
    // Render Stats
    document.getElementById('handover-board-total-collected').innerText = `৳${totalCollected.toLocaleString()}`;
    document.getElementById('handover-board-total-verified').innerText = `৳${totalVerified.toLocaleString()}`;
    document.getElementById('handover-board-total-pending').innerText = `৳${totalPending.toLocaleString()}`;
    
    // ── Mobile List Rendering (fully expanded cards, no modal needed) ──
    const mobileHandoverList = document.getElementById('handover-mobile-list');
    if (mobileHandoverList) {
        if (filteredItems.length === 0) {
            mobileHandoverList.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:1.5rem; font-size:0.85rem;">No activities found for the selected range.</p>`;
        } else {
            window._handoverItemMap = {};
            const curUserM = JSON.parse(sessionStorage.getItem('ediz_active_user')) || {};
            const isOAM = curUserM.role === 'Owner' || curUserM.role === 'Admin';

            mobileHandoverList.innerHTML = filteredItems.map((item, idx) => {
                const safeKey = 'hi_' + idx;
                window._handoverItemMap[safeKey] = item;

                const isVerified = item.receivedByAdmin;
                const pType = item.paymentType || 'Due Collection';

                // Payment type badge colour
                let typeColor = '#ca8a04'; let typeBg = 'rgba(234,179,8,0.12)'; let typeBdr = 'rgba(234,179,8,0.25)';
                if (pType === 'New Registration')             { typeColor='#10b981'; typeBg='rgba(16,185,129,0.12)'; typeBdr='rgba(16,185,129,0.25)'; }
                else if (pType === 'Book Payment')            { typeColor='var(--primary)'; typeBg='rgba(99,102,241,0.12)'; typeBdr='rgba(99,102,241,0.25)'; }
                else if (pType === 'Batch Transfer')          { typeColor='var(--text-muted)'; typeBg='rgba(148,163,184,0.08)'; typeBdr='var(--border-color)'; }
                else if (pType === 'Profile Edit')            { typeColor='#38bdf8'; typeBg='rgba(56,189,248,0.1)'; typeBdr='rgba(56,189,248,0.25)'; }
                else if (pType === 'Certificate Issued')      { typeColor='#10b981'; typeBg='rgba(16,185,129,0.12)'; typeBdr='rgba(16,185,129,0.25)'; }
                else if (pType === 'Batch Edit Verification') { typeColor='#ef4444'; typeBg='rgba(239,68,68,0.1)'; typeBdr='rgba(239,68,68,0.25)'; }
                else if (pType === 'Task Completed')          { typeColor='#38bdf8'; typeBg='rgba(56,189,248,0.1)'; typeBdr='rgba(56,189,248,0.25)'; }

                const statusHTML = isVerified
                    ? `<span style="background:rgba(22,163,74,0.1); color:#16a34a; border:1px solid rgba(22,163,74,0.2); font-weight:700; padding:0.22rem 0.6rem; font-size:0.7rem; border-radius:30px;"><i class="fa-solid fa-circle-check"></i> Verified</span>`
                    : `<span style="background:rgba(220,38,38,0.08); color:#dc2626; border:1px solid rgba(220,38,38,0.2); font-weight:700; padding:0.22rem 0.6rem; font-size:0.7rem; border-radius:30px;"><i class="fa-solid fa-clock"></i> Pending</span>`;

                const studentRows = item.studentNames.map((n, i) =>
                    `<div style="display:flex; justify-content:space-between; align-items:center; padding:0.3rem 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                        <span style="font-size:0.85rem; font-weight:600; color:var(--text-color);">${n}</span>
                        <span style="font-family:monospace; font-size:0.78rem; font-weight:700; color:var(--primary);">${item.studentIds[i]}</span>
                    </div>`
                ).join('');

                const auditBlock = item.isAuditLog && item.details
                    ? `<div style="margin-top:0.5rem; padding:0.45rem 0.65rem; background:${item.isTaskCompleted ? 'rgba(56,189,248,0.06)' : 'rgba(239,68,68,0.06)'}; border:1px dashed ${item.isTaskCompleted ? 'rgba(56,189,248,0.25)' : 'rgba(239,68,68,0.25)'}; border-radius:6px; font-size:0.75rem; color:${item.isTaskCompleted ? 'var(--info)' : 'var(--danger)'};">${item.details}</div>`
                    : '';

                const amountBlock = item.isAuditLog
                    ? ''
                    : `<div style="font-size:1.4rem; font-weight:800; color:var(--text-color); line-height:1; margin-bottom:0.1rem;">৳${item.amount.toLocaleString()}</div>`;

                const verifyBtnAttr = isOAM && !isVerified ? `data-verify-key="${safeKey}"` : '';
                const verifyBtn = isOAM && !isVerified
                    ? `<button ${verifyBtnAttr} style="width:100%; margin-top:0.75rem; padding:0.55rem; font-size:0.82rem; font-weight:700; background:#16a34a; color:#fff; border:none; border-radius:var(--radius-sm); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.4rem;"><i class="fa-solid fa-check"></i> ${item.id.startsWith('TSK-') ? 'টাস্ক নিশ্চিত করুন' : (item.isAuditLog ? 'অডিট নিশ্চিত করুন' : 'টাকা বুঝে পেয়েছি ✓')}</button>`
                    : '';

                return `
                <div class="glass-panel" style="padding:1rem; border-radius:var(--radius-md); border:1px solid ${isVerified ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.15)'}; background:var(--surface); box-shadow:var(--shadow-sm);">
                    <!-- Top row: ID + type badge + amount -->
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.6rem;">
                        <div style="display:flex; flex-direction:column; gap:0.2rem;">
                            <span style="font-size:0.68rem; font-weight:700; color:var(--text-muted); font-family:monospace;">${item.id}</span>
                            <span style="font-size:0.68rem; color:var(--text-muted);"><i class="fa-regular fa-calendar" style="margin-right:3px;"></i>${item.date}</span>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.3rem;">
                            ${amountBlock}
                            <span style="font-size:0.7rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:30px; background:${typeBg}; color:${typeColor}; border:1px solid ${typeBdr}; white-space:nowrap;">${pType}</span>
                        </div>
                    </div>

                    <!-- Student(s) -->
                    <div style="margin-bottom:0.5rem;">${studentRows}</div>

                    <!-- Course + Collector -->
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem; margin-top:0.25rem;">
                        <span><i class="fa-solid fa-graduation-cap" style="margin-right:4px;"></i>${item.courses.join(', ')}</span>
                        <span><i class="fa-solid fa-user" style="margin-right:4px;"></i>${item.collectedBy || 'Staff'}</span>
                    </div>

                    <!-- Audit details (if any) -->
                    ${auditBlock}

                    <!-- Status + verify -->
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem;">
                        ${statusHTML}
                    </div>
                    ${verifyBtn}
                </div>`;
            }).join('');

            // Attach verify button listeners
            mobileHandoverList.querySelectorAll('[data-verify-key]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const key = this.getAttribute('data-verify-key');
                    const itm = window._handoverItemMap[key];
                    if (itm) verifyHandoverFromBoard(itm.id, itm.studentIds[0]);
                });
            });
        }
    }
    // ──────────────────────────────────────────────────────────

    // Render Table
    if (filteredItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No activities found for the selected range.</td></tr>`;
        return;
    }

    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || {};
    const isOwnerOrAdmin = curUser.role === 'Owner' || curUser.role === 'Admin';

    tbody.innerHTML = filteredItems.map(item => {
        const dateLabel = item.date || '---';
        const coursesLabel = item.courses.length > 1 ? `Joint (${item.courses.join(', ')})` : item.courses[0];
        
        let pType = item.paymentType || 'Due Collection';
        let typeBadgeClass = 'badge-warning';
        if (pType === 'New Registration') {
            typeBadgeClass = 'badge-success';
        } else if (pType === 'Book Payment') {
            typeBadgeClass = 'badge-primary';
        } else if (pType === 'Batch Transfer') {
            typeBadgeClass = 'badge-secondary';
        } else if (pType === 'Profile Edit') {
            typeBadgeClass = 'badge-info';
        } else if (pType === 'Certificate Issued') {
            typeBadgeClass = 'badge-success';
        } else if (pType === 'Batch Edit Verification') {
            typeBadgeClass = 'badge-danger';
        } else if (pType === 'Teacher Payout') {
            typeBadgeClass = 'badge-danger';
        } else if (pType === 'Task Completed') {
            typeBadgeClass = 'badge-info';
        }
        
        const studentInfoHtml = item.studentNames.map((name, i) => `${name} (<span style="font-weight:600; font-size:0.8rem; font-family:monospace; color:var(--primary);">${item.studentIds[i]}</span>)`).join(', ');
        
        // Status Badge
        let statusBadge = '';
        if (item.receivedByAdmin) {
            statusBadge = `<span class="badge" style="font-weight: 700; color: #16a34a; background-color: rgba(22, 163, 74, 0.1); border: 1px solid rgba(22, 163, 74, 0.2); font-size: 0.8rem; padding: 0.25rem 0.5rem;"><i class="fa-solid fa-circle-check"></i> Handover Verified</span>`;
        } else {
            statusBadge = `<span class="badge" style="font-weight: 700; color: #dc2626; background-color: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.2); font-size: 0.8rem; padding: 0.25rem 0.5rem;"><i class="fa-solid fa-triangle-exclamation"></i> Pending Verification</span>`;
        }
        
        // Amount column rendering
        let amountHtml = '';
        if (item.isTaskCompleted) {
            amountHtml = `<span style="color: var(--text-muted); font-size: 0.8rem;">Task Details:<br><span style="font-weight: 600; color: var(--info); font-size: 0.75rem;">${item.details}</span></span>`;
        } else if (item.isAuditLog) {
            amountHtml = `<span style="color: var(--text-muted); font-size: 0.8rem;">Change Info:<br><span style="font-weight: 600; color: var(--danger); font-size: 0.75rem;">${item.details}</span></span>`;
        } else if (item.isTeacherPayout) {
            amountHtml = `<span style="color: var(--danger); font-weight: 700;">- ৳${item.amount.toLocaleString()}</span><br><span style="font-size:0.75rem; color:var(--text-muted);">${item.details}</span>`;
        } else {
            amountHtml = `৳${item.amount.toLocaleString()}`;
        }
        
        // Action column
        let actionBtn = '---';
        if (isOwnerOrAdmin && !item.receivedByAdmin) {
            let btnLabel = item.isAuditLog ? 'অডিট নিশ্চিত করুন' : 'টাকা বুঝে পেয়েছি';
            if (item.isTeacherPayout) {
                btnLabel = 'পেমেন্ট নিশ্চিত করুন';
            } else if (item.isTaskCompleted) {
                btnLabel = 'টাস্ক নিশ্চিত করুন';
            }
            actionBtn = `<button class="btn btn-success btn-sm" onclick="verifyHandoverFromBoard('${item.id}', '${item.studentIds[0]}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; white-space: nowrap;"><i class="fa-solid fa-check"></i> ${btnLabel}</button>`;
        }
        
        return `
            <tr>
                <td><strong>${dateLabel}</strong></td>
                <td><span style="font-family: monospace; font-weight: 700; font-size: 0.75rem; color: var(--text-muted);">${item.id}</span></td>
                <td>${studentInfoHtml}</td>
                <td><span style="font-weight: 500; font-size: 0.8rem;">${coursesLabel}</span></td>
                <td><span class="badge ${typeBadgeClass}" style="font-size: 0.75rem;">${pType}</span></td>
                <td style="font-weight: 700; color: var(--text-color);">${amountHtml}</td>
                <td><span style="font-weight: 600; color: var(--text-muted);">${item.collectedBy || 'Staff'}</span></td>
                <td>${statusBadge}</td>
                <td>${actionBtn}</td>
            </tr>
        `;
    }).join('');
};

window.verifyHandoverFromBoard = function(id, studentId) {
    if (id.startsWith('TSK-')) {
        const targetTask = tasks.find(t => t.id === id);
        if (targetTask) {
            targetTask.receivedByAdmin = true;
            saveDatabase();
            alert(`Task verification completed successfully.`);
            renderHandoverBoard();
            renderTasks();
            return;
        }
        alert("Task not found.");
        return;
    }

    if (id.startsWith('PAYOUT-')) {
        if (settings.teacherPayouts) {
            const targetPayout = settings.teacherPayouts.find(po => po.id === id);
            if (targetPayout) {
                targetPayout.receivedByAdmin = true;
                saveDatabase();
                alert(`Teacher payout ${id} verified successfully.`);
                renderHandoverBoard();
                renderTeacherPayouts();
                refreshStats();
                return;
            }
        }
        alert("Teacher payout not found.");
        return;
    }

    if (id.startsWith('AUD-')) {
        let targetLog = null;
        let targetStudent = null;
        students.forEach(st => {
            if (st.auditLogs) {
                const log = st.auditLogs.find(l => l.id === id);
                if (log) {
                    targetLog = log;
                    targetStudent = st;
                }
            }
        });
        
        if (!targetLog && settings.auditLogs) {
            targetLog = settings.auditLogs.find(l => l.id === id);
        }
        
        if (targetLog) {
            targetLog.receivedByAdmin = true;
            saveDatabase();
            
            alert(`Audit log verified by Admin. Status updated to Confirmed.`);
            
            // Send confirmation SMS to editor/collector if configured
            const editorName = targetLog.collectedBy;
            const staffUser = findCollectorUser(editorName);
            if (staffUser && staffUser.phone) {
                const entityName = targetStudent ? targetStudent.name : (targetLog.batch ? `Batch ${targetLog.batch}` : 'System');
                const staffMsg = `EDIZ IT: Sir/Admin has confirmed and verified your edit for ${entityName} (${targetLog.details}).`;
                sendGeneralSms(staffUser.phone, staffMsg, "Staff Edit Verification Alert");
            }
            
            renderRecentDashboard();
            renderHandoverBoard();
            refreshStats();
        } else {
            alert("Audit log not found.");
        }
    } else {
        verifyHandover(studentId, id);
    }
};

// ==========================================
// HANDOVER BOARD BULK ACTIONS & EXPORTS
// ==========================================
window.verifyAllPendingHandovers = function() {
    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || {};
    const isOwnerOrAdmin = curUser.role === 'Owner' || curUser.role === 'Admin';
    if (!isOwnerOrAdmin) {
        alert("Permission Denied: Only Owner or Admin can verify handovers.");
        return;
    }

    const items = window.currentFilteredHandoverItems || [];
    const pendingItems = items.filter(item => !item.receivedByAdmin);
    
    if (pendingItems.length === 0) {
        alert("No pending handovers/audit logs to verify in the current filter range.");
        return;
    }
    
    if (!confirm(`Are you sure you want to verify all ${pendingItems.length} pending handovers/audit logs in the current range at once?`)) {
        return;
    }
    
    let count = 0;
    pendingItems.forEach(item => {
        if (item.isAuditLog) {
            let found = false;
            students.forEach(st => {
                if (st.auditLogs) {
                    const log = st.auditLogs.find(l => l.id === item.id);
                    if (log) {
                        log.receivedByAdmin = true;
                        count++;
                        found = true;
                    }
                }
            });
            if (!found && settings.auditLogs) {
                const log = settings.auditLogs.find(l => l.id === item.id);
                if (log) {
                    log.receivedByAdmin = true;
                    count++;
                }
            }
        } else if (item.isTeacherPayout) {
            if (settings.teacherPayouts) {
                const targetPayout = settings.teacherPayouts.find(po => po.id === item.id);
                if (targetPayout) {
                    targetPayout.receivedByAdmin = true;
                    count++;
                }
            }
        } else if (item.isTaskCompleted) {
            const targetTask = tasks.find(t => t.id === item.id);
            if (targetTask) {
                targetTask.receivedByAdmin = true;
                count++;
            }
        } else {
            students.forEach(st => {
                if (st.invoices) {
                    const inv = st.invoices.find(i => i.id === item.id);
                    if (inv) {
                        inv.receivedByAdmin = true;
                        count++;
                    }
                }
            });
        }
    });
    
    saveDatabase();
    alert(`Successfully verified all ${count} pending handovers/audit logs!`);
    
    renderRecentDashboard();
    renderHandoverBoard();
    renderTeacherPayouts();
    renderTasks();
    refreshStats();
};

window.exportHandoverLedgerToExcel = function() {
    const items = window.currentFilteredHandoverItems || [];
    if (items.length === 0) {
        alert("No handover records to export.");
        return;
    }
    
    const headers = [
        "Date",
        "Invoice/Log ID",
        "Student ID(s)",
        "Student Name(s)",
        "Course Track",
        "Payment Type",
        "Amount",
        "Collected By",
        "Status",
        "Details (for Audit Logs)"
    ];
    
    const rows = items.map(item => {
        const statusLabel = item.receivedByAdmin ? "Verified" : "Pending";
        return [
            item.date || "",
            item.id || "",
            item.studentIds ? item.studentIds.join("; ") : "",
            item.studentNames ? item.studentNames.join("; ") : "",
            item.courses ? item.courses.join("; ") : "",
            item.paymentType || "",
            item.amount || 0,
            item.collectedBy || "Staff",
            statusLabel,
            item.details || ""
        ];
    });
    
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(val => {
            let str = String(val);
            if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
                str = '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        }).join(","))
    ].join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const rangeName = typeof handoverFilterRange !== 'undefined' ? handoverFilterRange : 'Export';
    const fileName = `Handover_Ledger_${rangeName}.csv`;
    
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// ==========================================
// BATCH-WISE DUE FILTERS & QUICK ACTIONS
// ==========================================
window.filterDueTabByBatch = function(course, batch) {
    const courseSelect = document.getElementById('collect-due-course-select');
    const batchSelect = document.getElementById('collect-due-batch-select');
    
    collectDueCourseFilter = course;
    collectDueBatchFilter = batch;
    
    if (courseSelect) courseSelect.value = course;
    window.updateCollectDueBatchDropdown();
    if (batchSelect) batchSelect.value = batch;
    
    renderCollectDueTable();
};

window.sendBulkSmsToBatchDues = function(course, batch) {
    const roster = students.filter(st => st.course === course && st.batch === batch && st.dueFee > 0);
    if (roster.length === 0) {
        alert("No due students in this batch to notify.");
        return;
    }
    if (!confirm(`Are you sure you want to send due reminders to all ${roster.length} due students in batch: "${course} - ${batch}"?`)) {
        return;
    }
    
    const adminPhone = settings.phone || "01335530900";
    roster.forEach((st, index) => {
        setTimeout(() => {
            const msg = `Assalamu Alaikum, আপনার EDIZ IT Institute-এর কোর্স ফি-এর ৳${st.dueFee.toLocaleString()} টাকা বকেয়া (Due) রয়েছে। অনুগ্রহ করে নির্ধারিত সময়ের মধ্যে পরিশোধ করুন। ধন্যবাদ। EDIZ IT Institute, mobile: ${adminPhone}`;
            sendGeneralSms(st.phone, msg, `Bulk Due SMS (${st.id})`);
        }, index * 200);
    });
    alert(`Started bulk messaging for ${roster.length} students in the background!`);
};

window.exportBatchDuesToExcel = function(course, batch) {
    const roster = students.filter(st => st.course === course && st.batch === batch && st.dueFee > 0);
    const sanitizedCourse = course.replace(/[^a-z0-9]/gi, '_');
    const sanitizedBatch = batch.replace(/[^a-z0-9]/gi, '_');
    const fileName = `${sanitizedCourse}_${sanitizedBatch}_Due_Report.csv`;
    window.downloadDueReportCsv(roster, fileName);
};

// ==========================================
// BULK ACTIONS & CHECKBOXES
// ==========================================
window.toggleSelectAllDueRows = function(masterCb) {
    const checkboxes = document.querySelectorAll('.collect-due-row-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = masterCb.checked;
    });
    window.updateDueBulkActionsBar();
};

window.updateDueBulkActionsBar = function() {
    const checked = document.querySelectorAll('.collect-due-row-checkbox:checked');
    const bulkBar = document.getElementById('collect-due-bulk-bar');
    const countEl = document.getElementById('collect-due-selected-count');
    
    if (bulkBar && countEl) {
        if (checked.length > 0) {
            countEl.innerText = checked.length;
            bulkBar.style.display = 'flex';
        } else {
            bulkBar.style.display = 'none';
        }
    }
};

window.sendBulkSmsToSelected = function() {
    const checked = document.querySelectorAll('.collect-due-row-checkbox:checked');
    if (checked.length === 0) return;
    
    if (!confirm(`Are you sure you want to send due reminders to all ${checked.length} selected students?`)) {
        return;
    }
    
    const adminPhone = settings.phone || "01335530900";
    let sentCount = 0;
    checked.forEach((cb, index) => {
        const studentId = cb.getAttribute('data-student-id');
        const st = students.find(s => s.id === studentId);
        if (st && st.dueFee > 0) {
            setTimeout(() => {
                const msg = `Assalamu Alaikum, আপনার EDIZ IT Institute-এর কোর্স ফি-এর ৳${st.dueFee.toLocaleString()} টাকা বকেয়া (Due) রয়েছে। অনুগ্রহ করে নির্ধারিত সময়ের মধ্যে পরিশোধ করুন। ধন্যবাদ। EDIZ IT Institute, mobile: ${adminPhone}`;
                sendGeneralSms(st.phone, msg, `Bulk Due SMS (${st.id})`);
            }, index * 200);
            sentCount++;
        }
    });
    alert(`Dispatched due reminder SMS to ${sentCount} selected students!`);
};

window.exportSelectedDuesToExcel = function() {
    const checked = document.querySelectorAll('.collect-due-row-checkbox:checked');
    if (checked.length === 0) return;
    
    const selectedIds = Array.from(checked).map(cb => cb.getAttribute('data-student-id'));
    const roster = students.filter(st => selectedIds.includes(st.id));
    window.downloadDueReportCsv(roster, 'Selected_Students_Due_Report.csv');
};

// ==========================================
// EXCEL EXPORTS (GENERAL)
// ==========================================
window.exportCurrentDueFilter = function() {
    // Collect list currently displayed in tbody by inspecting its checkboxes
    const checkboxes = document.querySelectorAll('.collect-due-row-checkbox');
    const ids = Array.from(checkboxes).map(cb => cb.getAttribute('data-student-id'));
    const roster = students.filter(st => ids.includes(st.id));
    window.downloadDueReportCsv(roster, 'Filtered_Dues_Report.csv');
};

window.exportAllDueStudents = function() {
    const roster = students.filter(st => st.dueFee > 0);
    window.downloadDueReportCsv(roster, 'All_Outstanding_Dues_Report.csv');
};

// ==========================================
// SINGLE MESSAGING TRIGGERS
// ==========================================
window.sendSmsDueMessage = function(studentId) {
    const st = students.find(s => s.id === studentId);
    if (!st) return;
    const adminPhone = settings.phone || "01335530900";
    const msg = `Assalamu Alaikum, আপনার EDIZ IT Institute-এর কোর্স ফি-এর ৳${st.dueFee.toLocaleString()} টাকা বকেয়া (Due) রয়েছে। অনুগ্রহ করে নির্ধারিত সময়ের মধ্যে পরিশোধ করুন। ধন্যবাদ। EDIZ IT Institute, mobile: ${adminPhone}`;
    sendGeneralSms(st.phone, msg, `Due Reminder SMS (${st.id})`);
    alert(`SMS sent to ${st.name} successfully.`);
};

window.sendWhatsAppDueMessage = function(studentId) {
    const st = students.find(s => s.id === studentId);
    if (!st) return;
    const adminPhone = settings.phone || "01335530900";
    const msg = `Assalamu Alaikum,\n\nআপনার EDIZ IT Institute-এর কোর্স ফি-এর ৳${st.dueFee.toLocaleString()} টাকা বকেয়া (Due) রয়েছে।\n\nঅনুগ্রহ করে নির্ধারিত সময়ের মধ্যে পরিশোধ করুন।\n\nধন্যবাদ।\nEDIZ IT Institute\nমোবাইল: ${adminPhone}`;
    let phoneNum = st.phone.replace(/\D/g, '');
    if (phoneNum.length === 11 && phoneNum.startsWith('0')) {
        phoneNum = '88' + phoneNum;
    }
    const url = `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
};

// ==========================================
// EXCEL EXPORTER UTILITY
// ==========================================
window.downloadDueReportCsv = function(roster, fileName) {
    if (!roster || roster.length === 0) {
        alert("No records to export.");
        return;
    }
    const headers = [
        "Student ID",
        "Student Name",
        "Guardian Name",
        "Student Mobile",
        "Guardian Mobile",
        "Course Name",
        "Batch Name",
        "Total Fee",
        "Total Paid",
        "Remaining Due",
        "Next Payment Date"
    ];
    const rows = roster.map(st => {
        return [
            st.id || "",
            st.name || "",
            st.fatherName || "N/A",
            st.phone || "",
            st.guardianPhone || "N/A",
            st.course || "",
            st.batch || "",
            st.totalFee || 0,
            st.paidFee || 0,
            st.dueFee || 0,
            st.nextPaymentDate || "N/A"
        ];
    });

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(val => {
            let str = String(val);
            if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
                str = '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        }).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

function getActiveStudentTotalDue() {
    if (!activeStudentForFees) return 0;
    const currentRegId = activeStudentForFees.registrationId;
    const allRecords = students.filter(s => s.registrationId === currentRegId);
    return allRecords.reduce((sum, s) => sum + (s.dueFee || 0), 0);
}

function setupBillingFormFeatures() {
    const payAmountInput = document.getElementById('payment-amount');
    const paymentNextDateContainer = document.getElementById('payment-next-date-container');
    const paymentRemainingDueDisplay = document.getElementById('payment-remaining-due-display');
    const paymentNextDateInput = document.getElementById('payment-next-date');

    if (payAmountInput) {
        payAmountInput.addEventListener('input', () => {
            const amount = parseInt(payAmountInput.value) || 0;
            const totalDue = getActiveStudentTotalDue();
            const remaining = totalDue - amount;
            
            if (remaining > 0) {
                if (paymentNextDateContainer) paymentNextDateContainer.style.display = 'flex';
                if (paymentRemainingDueDisplay) paymentRemainingDueDisplay.innerText = `৳${remaining.toLocaleString()}`;
                if (paymentNextDateInput) paymentNextDateInput.setAttribute('required', 'true');
            } else {
                if (paymentNextDateContainer) paymentNextDateContainer.style.display = 'none';
                if (paymentNextDateInput) {
                    paymentNextDateInput.removeAttribute('required');
                    paymentNextDateInput.value = '';
                }
            }
        });
    }

    // Setup Allocation Mode Radio Toggle event listeners
    document.querySelectorAll('input[name="allocation-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const mode = e.target.value;
            const paymentAmountInput = document.getElementById('payment-amount');
            const manualAllocContainer = document.getElementById('manual-allocation-container');
            const manualInputsList = document.getElementById('manual-allocation-fields-list');

            if (mode === 'manual') {
                if (paymentAmountInput) {
                    paymentAmountInput.readOnly = true;
                }
                if (manualAllocContainer) {
                    manualAllocContainer.style.display = 'flex';
                }
                // Initialize sum of manual fields
                let totalAllocated = 0;
                if (manualInputsList) {
                    const inputs = manualInputsList.querySelectorAll('.manual-course-allocation-input');
                    inputs.forEach(i => {
                        totalAllocated += parseInt(i.value) || 0;
                    });
                }
                if (paymentAmountInput) {
                    paymentAmountInput.value = totalAllocated;
                    paymentAmountInput.dispatchEvent(new Event('input'));
                }
            } else {
                if (paymentAmountInput) {
                    paymentAmountInput.readOnly = false;
                    paymentAmountInput.value = '';
                    paymentAmountInput.dispatchEvent(new Event('input'));
                }
                if (manualAllocContainer) {
                    manualAllocContainer.style.display = 'none';
                }
                if (manualInputsList) {
                    const inputs = manualInputsList.querySelectorAll('.manual-course-allocation-input');
                    inputs.forEach(i => {
                        i.value = '';
                    });
                }
            }
        });
    });
}


// ==========================================
// --- INQUIRIES & TASKS BUSINESS LOGIC ---
// ==========================================

// --- INQUIRIES TAB INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Inquiry Form submission
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', saveInquiry);
    }
    
    // Inquiries search
    const inquirySearch = document.getElementById('inquiry-search-input');
    if (inquirySearch) {
        inquirySearch.addEventListener('input', renderInquiries);
    }
    
    // Inquiry Filter Pills listener
    const pills = document.querySelectorAll('.inquiry-filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            pills.forEach(p => {
                p.className = 'btn btn-secondary btn-sm inquiry-filter-pill';
            });
            pill.className = 'btn btn-primary btn-sm inquiry-filter-pill';
            inquiriesFilter = pill.getAttribute('data-filter');
            renderInquiries();
        });
    });

    // Task Form submission
    const taskForm = document.getElementById('task-add-form');
    if (taskForm) {
        taskForm.addEventListener('submit', addTask);
    }

    // Advanced Date Filters
    const dateFilterSelect = document.getElementById('inquiry-date-filter-select');
    const specificDateInput = document.getElementById('inquiry-specific-date-input');
    const specificYearSelect = document.getElementById('inquiry-specific-year-select');

    if (dateFilterSelect) {
        // Populate year selector dynamically
        if (specificYearSelect) {
            const currentYear = new Date().getFullYear();
            specificYearSelect.innerHTML = '';
            for (let y = currentYear; y >= 2020; y--) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = `${y} Year (বছর)`;
                specificYearSelect.appendChild(opt);
            }
        }

        dateFilterSelect.addEventListener('change', () => {
            const val = dateFilterSelect.value;
            if (specificDateInput) specificDateInput.style.display = val === 'specific-date' ? 'inline-block' : 'none';
            if (specificYearSelect) specificYearSelect.style.display = val === 'specific-year' ? 'inline-block' : 'none';
            renderInquiries();
        });
    }
    if (specificDateInput) {
        specificDateInput.addEventListener('input', renderInquiries);
    }
    if (specificYearSelect) {
        specificYearSelect.addEventListener('change', renderInquiries);
    }
    const courseFilterSelect = document.getElementById('inquiry-course-filter-select');
    if (courseFilterSelect) {
        courseFilterSelect.addEventListener('change', renderInquiries);
    }
    const taskFilterDate = document.getElementById('task-filter-date');
    if (taskFilterDate) {
        taskFilterDate.addEventListener('change', renderTasks);
    }
    const taskFilterAssignee = document.getElementById('task-filter-assignee');
    if (taskFilterAssignee) {
        taskFilterAssignee.addEventListener('change', renderTasks);
    }
});

// --- HELPER FOR AUTO-ADMISSION DETECTION ---
function findMatchingStudent(phone, guardianPhone) {
    if (!students || students.length === 0) return null;
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const cleanGrd = (guardianPhone || '').replace(/\D/g, '');
    
    if (!cleanPhone && !cleanGrd) return null;
    
    return students.find(s => {
        const sPhone = (s.phone || '').replace(/\D/g, '');
        const sGrdPhone = (s.guardianPhone || '').replace(/\D/g, '');
        
        if (cleanPhone && (sPhone === cleanPhone || sGrdPhone === cleanPhone)) return true;
        if (cleanGrd && (sPhone === cleanGrd || sGrdPhone === cleanGrd)) return true;
        return false;
    });
}

// --- WALK-IN INQUIRIES CRUD ---
window.openInquiryModal = function(id = '') {
    const modal = document.getElementById('inquiry-modal');
    const title = document.getElementById('inquiry-modal-title');
    const form = document.getElementById('inquiry-form');
    
    if (!modal) return;
    
    // Clear / Reset form
    form.reset();
    document.getElementById('inquiry-edit-id').value = '';
    
    // Clear checkboxes
    document.querySelectorAll('.inq-course-checkbox').forEach(cb => cb.checked = false);
    
    // Clear checkbox for ignore auto admit
    const ignoreCheckbox = document.getElementById('inq-ignore-auto-admit');
    if (ignoreCheckbox) ignoreCheckbox.checked = false;
    
    // Clear fees
    document.getElementById('inq-quoted-fee').value = '';
    document.getElementById('inq-offered-fee').value = '';
    
    // Set default inquiry date as today
    const today = getLocalDateString();
    document.getElementById('inq-date').value = today;
    
    // Default next follow-up date to 3 days from now
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 3);
    document.getElementById('inq-next-followup').value = getLocalDateString(nextDate);
    
    if (id) {
        // Edit Mode
        const inq = inquiries.find(item => item.id === id);
        if (inq) {
            title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Inquiry Details';
            document.getElementById('inquiry-edit-id').value = inq.id;
            document.getElementById('inq-date').value = inq.date || today;
            document.getElementById('inq-name').value = inq.name || '';
            document.getElementById('inq-phone').value = inq.phone || '';
            document.getElementById('inq-guardian-phone').value = inq.guardianPhone || '';
            document.getElementById('inq-address').value = inq.address || '';
            
            // Handle courses checkboxes
            const targetCourses = inq.courses || (inq.course ? [inq.course] : []);
            document.querySelectorAll('.inq-course-checkbox').forEach(cb => {
                if (targetCourses.includes(cb.value)) {
                    cb.checked = true;
                }
            });
            
            // Handle ignore auto admit checkbox
            if (ignoreCheckbox) {
                ignoreCheckbox.checked = !!inq.ignoreAutoAdmit;
            }
            
            // Handle fees
            document.getElementById('inq-quoted-fee').value = inq.quotedFee || '';
            document.getElementById('inq-offered-fee').value = inq.offeredFee || '';
            
            document.getElementById('inq-next-followup').value = inq.nextFollowUp || today;
            document.getElementById('inq-comments').value = inq.comments || '';
            document.getElementById('inq-status').value = inq.status || 'Pending';
        }
    } else {
        title.innerHTML = '<i class="fa-solid fa-circle-question"></i> Add Walk-in Inquiry';
    }
    
    modal.classList.add('active');
};

window.closeInquiryModal = function() {
    const modal = document.getElementById('inquiry-modal');
    if (modal) modal.classList.remove('active');
};

function saveInquiry(e) {
    e.preventDefault();
    
    const editId = document.getElementById('inquiry-edit-id').value;
    const dateVal = document.getElementById('inq-date').value;
    const nameVal = document.getElementById('inq-name').value.trim();
    const phoneVal = document.getElementById('inq-phone').value.trim();
    const guardianPhoneVal = document.getElementById('inq-guardian-phone').value.trim();
    const addressVal = document.getElementById('inq-address').value.trim();
    
    // Read checkboxes
    const checkedCourses = Array.from(document.querySelectorAll('.inq-course-checkbox:checked')).map(cb => cb.value);
    if (checkedCourses.length === 0) {
        alert("Please select at least one course (দয়া করে অন্তত একটি কোর্স সিলেক্ট করুন)!");
        return;
    }
    
    // Read ignore database match checkbox
    const ignoreCheckbox = document.getElementById('inq-ignore-auto-admit');
    const ignoreAutoAdmitVal = ignoreCheckbox ? ignoreCheckbox.checked : false;
    
    // Read fees
    const quotedFeeVal = parseInt(document.getElementById('inq-quoted-fee').value) || 0;
    const offeredFeeVal = parseInt(document.getElementById('inq-offered-fee').value) || 0;
    
    const nextFollowUpVal = document.getElementById('inq-next-followup').value;
    const commentsVal = document.getElementById('inq-comments').value.trim();
    const statusVal = document.getElementById('inq-status').value;
    
    if (editId) {
        // Update existing
        const index = inquiries.findIndex(item => item.id === editId);
        if (index !== -1) {
            inquiries[index] = {
                ...inquiries[index],
                date: dateVal,
                name: nameVal,
                phone: phoneVal,
                guardianPhone: guardianPhoneVal,
                address: addressVal,
                courses: checkedCourses,
                course: checkedCourses.join(', '),
                ignoreAutoAdmit: ignoreAutoAdmitVal,
                quotedFee: quotedFeeVal,
                offeredFee: offeredFeeVal,
                nextFollowUp: nextFollowUpVal,
                comments: commentsVal,
                status: statusVal
            };
        }
    } else {
        // Create new
        const newInq = {
            id: 'INQ-' + Date.now(),
            date: dateVal,
            name: nameVal,
            phone: phoneVal,
            guardianPhone: guardianPhoneVal,
            address: addressVal,
            courses: checkedCourses,
            course: checkedCourses.join(', '),
            ignoreAutoAdmit: ignoreAutoAdmitVal,
            quotedFee: quotedFeeVal,
            offeredFee: offeredFeeVal,
            nextFollowUp: nextFollowUpVal,
            comments: commentsVal,
            status: statusVal
        };
        inquiries.push(newInq);
    }
    
    saveDatabase();
    closeInquiryModal();
    renderInquiries();
    checkInquiryReminders();
}

window.deleteInquiry = function(id) {
    if (confirm("Are you sure you want to delete this inquiry?")) {
        inquiries = inquiries.filter(item => item.id !== id);
        saveDatabase();
        renderInquiries();
        checkInquiryReminders();
    }
};

window.convertLeadToStudent = function(id) {
    const inq = inquiries.find(item => item.id === id);
    if (!inq) return;
    
    // Set status as Admitted
    inq.status = 'Admitted';
    saveDatabase();
    
    // Fill Registration Form
    const nameInput = document.getElementById('reg-name');
    const phoneInput = document.getElementById('reg-phone');
    const guardianPhoneInput = document.getElementById('reg-guardian-phone');
    const addressInput = document.getElementById('reg-address');
    const courseSelect = document.getElementById('reg-course');
    
    if (nameInput) nameInput.value = inq.name || '';
    if (phoneInput) phoneInput.value = inq.phone || '';
    if (guardianPhoneInput) guardianPhoneInput.value = inq.guardianPhone || '';
    if (addressInput) addressInput.value = inq.address || '';
    
    if (courseSelect) {
        const targetCourse = (inq.courses && inq.courses.length > 0) ? inq.courses[0] : (inq.course || '');
        courseSelect.value = targetCourse;
        // Trigger course change event to populate batches
        courseSelect.dispatchEvent(new Event('change'));
    }
    
    // Close modal & navigate to Registration
    closeInquiryModal();
    window.location.hash = 'registration';
    
    alert(`Lead "${inq.name}" converted. Please complete admission form below!`);
};

// --- RENDER INQUIRIES LIST ---
function renderInquiries() {
    const tbody = document.getElementById('inquiries-tbody');
    const mobileList = document.getElementById('inquiries-mobile-list');
    if (!tbody) return;
    
    const searchVal = document.getElementById('inquiry-search-input')?.value.toLowerCase() || '';
    const today = getLocalDateString();
    
    // 1. Calculate dynamic auto-admitted status from students database
    inquiries.forEach(item => {
        if (item.ignoreAutoAdmit) {
            item.autoAdmitted = null;
        } else {
            const match = findMatchingStudent(item.phone, item.guardianPhone);
            if (match) {
                item.autoAdmitted = match;
            } else {
                item.autoAdmitted = null;
            }
        }
    });

    // 2. Filter inquiries by status
    let filtered = inquiries;
    
    if (inquiriesFilter === 'pending') {
        filtered = filtered.filter(item => item.status === 'Pending' && !item.autoAdmitted);
    } else if (inquiriesFilter === 'today') {
        filtered = filtered.filter(item => item.nextFollowUp === today && item.status === 'Pending' && !item.autoAdmitted);
    } else if (inquiriesFilter === 'admitted') {
        filtered = filtered.filter(item => item.status === 'Admitted' || item.autoAdmitted);
    } else if (inquiriesFilter === 'cancelled') {
        filtered = filtered.filter(item => item.status === 'Cancelled');
    }
    
    // 3. Filter inquiries by date period dropdown
    const dateFilterSelect = document.getElementById('inquiry-date-filter-select');
    const dateFilterVal = dateFilterSelect ? dateFilterSelect.value : 'all';
    const specificDateInput = document.getElementById('inquiry-specific-date-input');
    const specificYearSelect = document.getElementById('inquiry-specific-year-select');

    if (dateFilterVal === 'today') {
        filtered = filtered.filter(item => item.date === today);
    } else if (dateFilterVal === 'yesterday') {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = getLocalDateString(yesterdayDate);
        filtered = filtered.filter(item => item.date === yesterday);
    } else if (dateFilterVal === 'this-week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const startWeekStr = getLocalDateString(oneWeekAgo);
        filtered = filtered.filter(item => item.date >= startWeekStr && item.date <= today);
    } else if (dateFilterVal === 'this-month') {
        const currentMonth = today.substring(0, 7);
        filtered = filtered.filter(item => item.date && item.date.startsWith(currentMonth));
    } else if (dateFilterVal === 'this-year') {
        const currentYear = today.substring(0, 4);
        filtered = filtered.filter(item => item.date && item.date.startsWith(currentYear));
    } else if (dateFilterVal === 'last-year') {
        const lastYear = String(new Date().getFullYear() - 1);
        filtered = filtered.filter(item => item.date && item.date.startsWith(lastYear));
    } else if (dateFilterVal === 'specific-date') {
        const targetDate = specificDateInput ? specificDateInput.value : '';
        if (targetDate) {
            filtered = filtered.filter(item => item.date === targetDate);
        }
    } else if (dateFilterVal === 'specific-year') {
        const targetYear = specificYearSelect ? specificYearSelect.value : '';
        if (targetYear) {
            filtered = filtered.filter(item => item.date && item.date.startsWith(targetYear));
        }
    }

    // 3.5. Filter inquiries by course filter dropdown
    const courseFilterSelect = document.getElementById('inquiry-course-filter-select');
    const courseFilterVal = courseFilterSelect ? courseFilterSelect.value : 'all';
    if (courseFilterVal !== 'all') {
        filtered = filtered.filter(item => {
            const courses = item.courses || (item.course ? [item.course] : []);
            return courses.includes(courseFilterVal);
        });
    }

    // 4. Filter by text search bar
    if (searchVal) {
        filtered = filtered.filter(item => 
            (item.name || '').toLowerCase().includes(searchVal) ||
            (item.phone || '').toLowerCase().includes(searchVal) ||
            (item.address || '').toLowerCase().includes(searchVal) ||
            (item.comments || '').toLowerCase().includes(searchVal)
        );
    }
    
    // Sort by date descending
    filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    
    // RENDER METRICS ON THE FLY
    const inquiriesToday = inquiries.filter(item => item.date === today).length;
    const followupsPending = inquiries.filter(item => item.nextFollowUp <= today && item.status === 'Pending' && !item.autoAdmitted).length;
    const tasksPending = tasks.filter(item => item.status === 'Pending').length;
    
    const metricTodayEl = document.getElementById('metric-inquiries-today');
    const metricFollowupEl = document.getElementById('metric-followups-pending');
    const metricTasksEl = document.getElementById('metric-tasks-pending');
    
    if (metricTodayEl) metricTodayEl.innerText = inquiriesToday;
    if (metricFollowupEl) {
        metricFollowupEl.innerText = followupsPending;
        metricFollowupEl.style.color = followupsPending > 0 ? 'var(--danger)' : 'var(--text-main)';
    }
    if (metricTasksEl) {
        metricTasksEl.innerText = tasksPending;
        metricTasksEl.style.color = tasksPending > 0 ? 'var(--accent)' : 'var(--text-main)';
    }
    
    // RENDER TABLE ROWS (DESKTOP)
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching inquiries found.</td></tr>`;
        if (mobileList) {
            mobileList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No matching inquiries found.</p>`;
        }
        return;
    }
    
    tbody.innerHTML = filtered.map(item => {
        const isFollowupToday = item.nextFollowUp === today && item.status === 'Pending' && !item.autoAdmitted;
        const isOverdue = item.nextFollowUp < today && item.status === 'Pending' && !item.autoAdmitted;
        
        let dateBadge = `<span style="font-weight: 500;">${item.nextFollowUp || 'N/A'}</span>`;
        if (isFollowupToday) {
            dateBadge = `<span class="badge" style="background-color: rgba(239, 68, 68, 0.12); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); font-weight: 700;">Today</span>`;
        } else if (isOverdue) {
            dateBadge = `<span class="badge" style="background-color: rgba(245, 158, 11, 0.12); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); font-weight: 700;">Overdue</span>`;
        }
        
        let displayStatus = item.status;
        if (item.autoAdmitted) {
            displayStatus = 'Admitted (Auto)';
        }

        let statusStyle = '';
        if (displayStatus === 'Admitted' || displayStatus === 'Admitted (Auto)') {
            statusStyle = 'background-color: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);';
        } else if (displayStatus === 'Cancelled') {
            statusStyle = 'background-color: rgba(107, 114, 128, 0.12); color: #6b7280; border: 1px solid rgba(107, 114, 128, 0.2);';
        } else {
            statusStyle = 'background-color: rgba(99, 102, 241, 0.12); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.2);';
        }
        
        const rowStyle = isFollowupToday ? 'background: rgba(239, 68, 68, 0.04); border-left: 4px solid var(--danger);' : '';
        
        const callBtn = `<a href="tel:${item.phone}" class="btn btn-secondary btn-icon-only" title="Call Candidate" style="color: var(--primary);"><i class="fa-solid fa-phone"></i></a>`;
        
        const coursesText = item.courses ? item.courses.join(', ') : (item.course || '');
        const waMsg = encodeURIComponent(`Hello ${item.name},\nThis is EDIZ IT Institute. We are contacting you regarding your walk-in inquiry about the ${coursesText} course(s). Let us know if you have any questions!\nHelpline: 01335530900`);
        const waBtn = `<a href="https://wa.me/88${item.phone}?text=${waMsg}" target="_blank" class="btn btn-secondary btn-icon-only" title="Send WhatsApp Message" style="color: #25d366;"><i class="fa-brands fa-whatsapp"></i></a>`;
        
        const convertBtn = (!item.autoAdmitted && (item.status === 'Pending' || item.status === 'Called'))
            ? `<button class="btn btn-success btn-icon-only" onclick="convertLeadToStudent('${item.id}')" title="Convert to Admitted Student" style="color: white; background: #10b981; border-color: #10b981;"><i class="fa-solid fa-user-check"></i></button>`
            : '';
            
        return `
            <tr style="${rowStyle}">
                <td><span style="font-size:0.8rem; color:var(--text-muted);">${item.date || 'N/A'}</span></td>
                <td>
                    <div style="font-weight: 600; font-size:0.95rem;">${item.name}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.15rem;">
                        Mob: <a href="tel:${item.phone}" style="text-decoration: underline; color: inherit; font-weight:600;">${item.phone}</a>
                        ${item.guardianPhone ? ` | Grd: <a href="tel:${item.guardianPhone}" style="text-decoration: underline; color: inherit;">${item.guardianPhone}</a>` : ''}
                    </div>
                    ${item.autoAdmitted ? `
                    <div style="margin-top:0.25rem;">
                        <button class="btn btn-secondary btn-sm" onclick="openProfileModal('${item.autoAdmitted.id}')" style="font-size: 0.72rem; padding: 0.1rem 0.4rem; height: auto; font-weight: 600; display: inline-flex; align-items: center; gap: 0.2rem; color: var(--primary); border: 1px solid var(--border-color); background: var(--bg-secondary);">
                            <i class="fa-solid fa-eye"></i> Profile: ${item.autoAdmitted.id}
                        </button>
                    </div>
                    ` : ''}
                </td>
                <td>
                    <div style="font-weight: 500;">${coursesText}</div>
                    <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">Quote: ৳${item.quotedFee || 0} | Offer: ৳${item.offeredFee || 0}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.15rem;">${item.address}</div>
                </td>
                <td>
                    <div style="font-size:0.85rem;">${dateBadge}</div>
                    ${(isFollowupToday || isOverdue) ? `<div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.15rem;">Due: ${item.nextFollowUp}</div>` : ''}
                </td>
                <td><div style="font-size:0.85rem; color:var(--text-main); font-style: italic; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.comments}">${item.comments || ''}</div></td>
                <td><span class="badge" style="${statusStyle}">${displayStatus}</span></td>
                <td>
                    <div style="display: flex; gap: 0.35rem; align-items: center;">
                        ${convertBtn}
                        ${callBtn}
                        ${waBtn}
                        <button class="btn btn-secondary btn-icon-only" onclick="openInquiryModal('${item.id}')" title="Edit Inquiry"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-secondary btn-icon-only" onclick="deleteInquiry('${item.id}')" title="Delete Inquiry" style="color:var(--danger);"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // RENDER MOBILE CARDS (PORTRAIT LIST)
    if (mobileList) {
        mobileList.innerHTML = filtered.map(item => {
            const isFollowupToday = item.nextFollowUp === today && item.status === 'Pending' && !item.autoAdmitted;
            const isOverdue = item.nextFollowUp < today && item.status === 'Pending' && !item.autoAdmitted;
            
            let displayStatus = item.status;
            if (item.autoAdmitted) {
                displayStatus = 'Admitted (Auto)';
            }

            let statusStyle = '';
            if (displayStatus === 'Admitted' || displayStatus === 'Admitted (Auto)') {
                statusStyle = 'background-color: rgba(16, 185, 129, 0.12); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);';
            } else if (displayStatus === 'Cancelled') {
                statusStyle = 'background-color: rgba(107, 114, 128, 0.12); color: #6b7280; border: 1px solid rgba(107, 114, 128, 0.2);';
            } else {
                statusStyle = 'background-color: rgba(99, 102, 241, 0.12); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.2);';
            }
            
            let reminderAlert = '';
            if (isFollowupToday) {
                reminderAlert = `<div style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); border-radius: var(--radius-sm); padding: 0.5rem; font-size: 0.75rem; color: #ef4444; font-weight: 700; margin-top: 0.25rem;"><i class="fa-solid fa-phone-volume"></i> Call due today!</div>`;
            } else if (isOverdue) {
                reminderAlert = `<div style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.15); border-radius: var(--radius-sm); padding: 0.5rem; font-size: 0.75rem; color: #f59e0b; font-weight: 700; margin-top: 0.25rem;"><i class="fa-solid fa-clock"></i> Follow-up overdue (${item.nextFollowUp})</div>`;
            }
            
            const coursesText = item.courses ? item.courses.join(', ') : (item.course || '');
            const waMsg = encodeURIComponent(`Hello ${item.name},\nThis is EDIZ IT Institute. We are contacting you regarding your walk-in inquiry about the ${coursesText} course(s). Let us know if you have any questions!\nHelpline: 01335530900`);
            
            const convertBtn = (!item.autoAdmitted && (item.status === 'Pending' || item.status === 'Called'))
                ? `<button class="btn btn-success btn-sm" onclick="convertLeadToStudent('${item.id}')" style="font-weight:600;"><i class="fa-solid fa-user-check"></i> Admit</button>`
                : '';
                
            return `
                <div class="mobile-inquiry-card glass-panel" style="${isFollowupToday ? 'border-left: 4px solid var(--danger);' : ''}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Date: ${item.date || 'N/A'}</span>
                        <span class="badge" style="${statusStyle}">${displayStatus}</span>
                    </div>
                    <div>
                        <div style="font-weight: 700; font-size:1.05rem; color:var(--text-main);">${item.name}</div>
                        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.25rem;">
                            <i class="fa-solid fa-location-dot"></i> ${item.address}
                        </div>
                        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.15rem;">
                            <strong>Courses:</strong> ${coursesText}
                        </div>
                        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.15rem;">
                            <strong>Quote:</strong> ৳${item.quotedFee || 0} | <strong>Offer:</strong> ৳${item.offeredFee || 0}
                        </div>
                        ${item.autoAdmitted ? `
                        <div style="margin-top:0.25rem;">
                            <button class="btn btn-secondary btn-sm" onclick="openProfileModal('${item.autoAdmitted.id}')" style="font-size: 0.72rem; padding: 0.1rem 0.4rem; height: auto; font-weight: 600; display: inline-flex; align-items: center; gap: 0.2rem; color: var(--primary); border: 1px solid var(--border-color); background: var(--bg-secondary);">
                                <i class="fa-solid fa-eye"></i> View Profile: ${item.autoAdmitted.id}
                            </button>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div style="font-size:0.85rem; padding: 0.5rem; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-style:italic; color:var(--text-main);">
                        "${item.comments || 'No comments'}"
                    </div>
                    
                    ${reminderAlert}
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:0.65rem; margin-top:0.25rem; gap:0.5rem; flex-wrap:wrap;">
                        <div style="display:flex; gap:0.35rem;">
                            <a href="tel:${item.phone}" class="btn btn-secondary btn-sm" style="color:var(--primary); font-weight:600;"><i class="fa-solid fa-phone"></i> Call</a>
                            <a href="https://wa.me/88${item.phone}?text=${waMsg}" target="_blank" class="btn btn-secondary btn-sm" style="color:#25d366; font-weight:600;"><i class="fa-brands fa-whatsapp"></i> WA</a>
                        </div>
                        <div style="display:flex; gap:0.35rem;">
                            ${convertBtn}
                            <button class="btn btn-secondary btn-sm" onclick="openInquiryModal('${item.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                            <button class="btn btn-secondary btn-sm" onclick="deleteInquiry('${item.id}')" style="color:var(--danger);"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// --- DAILY TASKS CRUD ---
function addTask(e) {
    e.preventDefault();
    
    const descInput = document.getElementById('task-desc-input');
    const dateInput = document.getElementById('task-date-input');
    const assignInput = document.getElementById('task-assign-input');
    
    if (!descInput || !dateInput) return;
    
    const assignedToVal = assignInput ? assignInput.value : 'Staff';
    
    const newTask = {
        id: 'TSK-' + Date.now(),
        date: dateInput.value,
        description: descInput.value.trim(),
        assignedTo: assignedToVal,
        status: 'Pending'
    };
    
    tasks.push(newTask);
    saveDatabase();
    
    descInput.value = '';
    
    renderTasks();
    renderInquiries(); // Refresh metrics cards
}

window.toggleTaskStatus = function(id) {
    const task = tasks.find(item => item.id === id);
    if (task) {
        if (task.status === 'Pending') {
            task.status = 'Completed';
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const d = String(now.getDate()).padStart(2, '0');
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            task.completedAt = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
            task.receivedByAdmin = false;
        } else {
            task.status = 'Pending';
            delete task.completedAt;
            delete task.receivedByAdmin;
        }
        saveDatabase();
        renderTasks();
        renderHandoverBoard();
        renderInquiries(); // Refresh metrics cards
    }
};

window.deleteTask = function(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(item => item.id !== id);
        saveDatabase();
        renderTasks();
        renderHandoverBoard();
        renderInquiries(); // Refresh metrics cards
    }
};

// --- RENDER DAILY TASKS LIST ---
function renderTasks() {
    const container = document.getElementById('tasks-list-container');
    const completedContainer = document.getElementById('completed-tasks-log-container');
    if (!container) return;
    
    const today = getLocalDateString();
    
    const dateFilterEl = document.getElementById('task-filter-date');
    const dateFilter = dateFilterEl ? dateFilterEl.value : 'all';
    
    const assigneeFilterEl = document.getElementById('task-filter-assignee');
    const assigneeFilter = assigneeFilterEl ? assigneeFilterEl.value : 'all';
    
    // Filter active & completed tasks
    let activeTasks = tasks.filter(t => t.status === 'Pending');
    let completedTasks = tasks.filter(t => t.status === 'Completed');
    
    // 1. Assignee filtering
    if (assigneeFilter === 'staff') {
        activeTasks = activeTasks.filter(t => t.assignedTo === 'Staff' || t.assignedTo === 'Manager');
        completedTasks = completedTasks.filter(t => t.assignedTo === 'Staff' || t.assignedTo === 'Manager');
    } else if (assigneeFilter === 'admin') {
        activeTasks = activeTasks.filter(t => t.assignedTo === 'Admin');
        completedTasks = completedTasks.filter(t => t.assignedTo === 'Admin');
    }
    
    // 2. Date filtering for active tasks
    if (dateFilter === 'today') {
        activeTasks = activeTasks.filter(t => t.date === today);
    } else if (dateFilter === 'tomorrow') {
        const tomorrowObj = new Date();
        tomorrowObj.setDate(tomorrowObj.getDate() + 1);
        const tomorrow = getLocalDateString(tomorrowObj);
        activeTasks = activeTasks.filter(t => t.date === tomorrow);
    } else if (dateFilter === 'overdue') {
        activeTasks = activeTasks.filter(t => t.date < today);
    }
    
    // --- 1. RENDER ACTIVE TASKS ---
    if (activeTasks.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 2rem; font-size: 0.85rem;">No active tasks assigned.</p>`;
    } else {
        const groups = {};
        activeTasks.forEach(task => {
            if (!groups[task.date]) groups[task.date] = [];
            groups[task.date].push(task);
        });
        
        const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
        
        container.innerHTML = sortedDates.map(date => {
            const dateTasks = groups[date];
            const taskItemsHtml = dateTasks.map(t => {
                const assigneeBadge = t.assignedTo === 'Admin'
                    ? `<span class="badge" style="font-size:0.68rem; padding:0.1rem 0.35rem; margin-left:0.5rem; background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.2);">Admin</span>`
                    : `<span class="badge" style="font-size:0.68rem; padding:0.1rem 0.35rem; margin-left:0.5rem; background:rgba(56,189,248,0.1); color:#38bdf8; border:1px solid rgba(56,189,248,0.2);">Staff</span>`;
                
                return `
                    <div class="task-item">
                        <input type="checkbox" class="task-checkbox" onchange="toggleTaskStatus('${t.id}')">
                        <span class="task-text">${t.description}</span>
                        ${assigneeBadge}
                        <button class="btn btn-icon-only btn-secondary" onclick="deleteTask('${t.id}')" title="Delete Task" style="height:26px; width:26px; font-size:0.75rem; color:var(--danger); border:none; background:transparent;"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                `;
            }).join('');
            
            return `
                <div class="task-group-card glass-panel">
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary); padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                         <span><i class="fa-solid fa-calendar-day"></i> Date: ${date}</span>
                         <span class="badge" style="background: var(--primary-glow); color: var(--primary); font-size:0.7rem; padding: 0.1rem 0.4rem;">${dateTasks.length} Tasks</span>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        ${taskItemsHtml}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // --- 2. RENDER COMPLETED TASKS LOG ---
    if (completedContainer) {
        if (completedTasks.length === 0) {
            completedContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem; font-size: 0.8rem;">No completed tasks yet.</p>`;
            return;
        }
        
        const sortedCompleted = [...completedTasks].sort((a, b) => {
            const timeA = a.completedAt || '';
            const timeB = b.completedAt || '';
            return timeB.localeCompare(timeA);
        });
        
        completedContainer.innerHTML = sortedCompleted.map(t => {
            const dateText = t.date || '';
            const compTimeText = t.completedAt ? t.completedAt.substring(0, 16) : 'N/A';
            const isVerified = !!t.receivedByAdmin;
            const verificationBadge = isVerified
                ? `<span style="font-size:0.7rem; font-weight:700; color:#16a34a; background:rgba(22,163,74,0.1); padding:0.1rem 0.35rem; border-radius:4px; border:1px solid rgba(22,163,74,0.2); margin-left:0.5rem;"><i class="fa-solid fa-check"></i> Verified</span>`
                : `<span style="font-size:0.7rem; font-weight:700; color:#dc2626; background:rgba(220,38,38,0.08); padding:0.1rem 0.35rem; border-radius:4px; border:1px solid rgba(220,38,38,0.2); margin-left:0.5rem;"><i class="fa-solid fa-clock"></i> Pending Verification</span>`;
            
            const assigneeBadge = t.assignedTo === 'Admin'
                ? `<span class="badge" style="font-size:0.68rem; padding:0.1rem 0.35rem; margin-left:0.5rem; background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.2);">Admin</span>`
                : `<span class="badge" style="font-size:0.68rem; padding:0.1rem 0.35rem; margin-left:0.5rem; background:rgba(56,189,248,0.1); color:#38bdf8; border:1px solid rgba(56,189,248,0.2);">Staff</span>`;
            
            return `
                <div class="task-item" style="opacity: 0.85; padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; flex-grow: 1;">
                        <input type="checkbox" class="task-checkbox" checked onchange="toggleTaskStatus('${t.id}')">
                        <div style="display: flex; flex-direction: column; text-align: left;">
                            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0.25rem;">
                                <span class="task-text completed" style="font-size:0.85rem; text-decoration: line-through; color: var(--text-muted);">${t.description}</span>
                                ${assigneeBadge}
                                ${verificationBadge}
                            </div>
                            <span style="font-size:0.7rem; color: var(--text-muted);">
                                <i class="fa-solid fa-calendar-check"></i> Assign: ${dateText} | Completed: ${compTimeText}
                            </span>
                        </div>
                    </div>
                    <button class="btn btn-icon-only btn-secondary" onclick="deleteTask('${t.id}')" title="Delete Task" style="height:24px; width:24px; font-size:0.7rem; color:var(--danger); border:none; background:transparent;"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
        }).join('');
    }
}

// --- DAILY FOLLOW-UP DASHBOARD ALERT SYSTEM ---
function checkInquiryReminders() {
    const banner = document.getElementById('inquiry-follow-up-alerts');
    const list = document.getElementById('inquiry-follow-up-list');
    
    if (!banner || !list) return;
    
    const today = getLocalDateString();
    
    // Filter inquiries scheduled to be followed up today (or overdue) and still pending (not auto admitted)
    const dueFollowups = inquiries.filter(item => item.nextFollowUp <= today && item.status === 'Pending' && !item.autoAdmitted);
    
    if (dueFollowups.length === 0) {
        banner.style.display = 'none';
        return;
    }
    
    banner.style.display = 'block';
    
    list.innerHTML = dueFollowups.map(item => {
        const isOverdue = item.nextFollowUp < today;
        const alertColor = isOverdue ? '#f59e0b' : 'var(--primary)';
        const dateText = isOverdue ? `Overdue (${item.nextFollowUp})` : 'Today';
        
        const coursesText = item.courses ? item.courses.join(', ') : (item.course || '');
        const waMsg = encodeURIComponent(`Hello ${item.name},\nThis is EDIZ IT Institute. We are contacting you regarding your walk-in inquiry about the ${coursesText} course(s). Let us know if you have any questions!\nHelpline: 01335530900`);
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-secondary); flex-wrap:wrap; gap:0.5rem;">
                <div style="text-align: left;">
                    <strong style="color: var(--text-main); font-size:0.9rem;">${item.name}</strong> 
                    <span style="font-size: 0.75rem; color: ${alertColor}; font-weight: 700; margin-left: 0.5rem;"><i class="fa-solid fa-triangle-exclamation"></i> ${dateText}</span>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top:0.15rem;">Courses: ${coursesText} | Phone: <a href="tel:${item.phone}" style="text-decoration:underline; color:inherit;">${item.phone}</a></div>
                </div>
                <div style="display: flex; gap: 0.35rem;">
                    <a href="tel:${item.phone}" class="btn btn-secondary btn-sm" style="color:var(--primary); font-weight:600;"><i class="fa-solid fa-phone"></i> Call</a>
                    <a href="https://wa.me/88${item.phone}?text=${waMsg}" target="_blank" class="btn btn-secondary btn-sm" style="color:#25d366; font-weight:600;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                    <button class="btn btn-primary btn-sm" onclick="openInquiryModal('${item.id}')" style="font-weight:600;">Update Status</button>
                </div>
            </div>
        `;
    }).join('');
}

function setupTeacherPayoutsFeature() {
    const filterSelect = document.getElementById('filter-teacher-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            renderTeacherPayouts();
        });
    }

    const btnRecordPayout = document.getElementById('btn-record-teacher-payout');
    if (btnRecordPayout) {
        btnRecordPayout.addEventListener('click', () => {
            openTeacherPayoutModal();
        });
    }

    const payoutForm = document.getElementById('teacher-payout-form');
    if (payoutForm) {
        payoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const teacherSelect = document.getElementById('payout-teacher-select');
            const amountInput = document.getElementById('payout-amount-input');
            const dateInput = document.getElementById('payout-date-input');
            const methodSelect = document.getElementById('payout-method-select');
            const remarksInput = document.getElementById('payout-remarks-input');

            if (!teacherSelect || !amountInput || !dateInput || !methodSelect) return;

            const selectedOption = teacherSelect.options[teacherSelect.selectedIndex];
            const teacherId = selectedOption.value;
            const teacherName = selectedOption.getAttribute('data-name');
            const amount = parseInt(amountInput.value);
            const date = dateInput.value;
            const method = methodSelect.value;
            const remarks = remarksInput ? remarksInput.value.trim() : '';

            if (!teacherId || isNaN(amount) || amount <= 0 || !date) {
                alert("Please fill in all required fields correctly.");
                return;
            }

            if (!settings.teacherPayouts) settings.teacherPayouts = [];

            // Generate payout ID
            let maxIdNum = 1000;
            settings.teacherPayouts.forEach(po => {
                if (po.id && po.id.startsWith('PAYOUT-')) {
                    const num = parseInt(po.id.replace('PAYOUT-', ''));
                    if (!isNaN(num) && num > maxIdNum) maxIdNum = num;
                }
            });
            const newId = `PAYOUT-${maxIdNum + 1}`;

            const activeUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || {};
            const recordedBy = activeUser.email || 'Admin';

            // Check if current user is Owner/Admin. If so, auto-verify, otherwise start as unverified (pending).
            const isOwnerOrAdmin = activeUser.role === 'Owner' || activeUser.role === 'Admin';
            const receivedByAdmin = isOwnerOrAdmin; // auto-verify if recorded by admin

            const newPayout = {
                id: newId,
                date: date,
                teacherId: teacherId,
                teacherName: teacherName,
                amount: amount,
                paymentMethod: method,
                recordedBy: recordedBy,
                receivedByAdmin: receivedByAdmin,
                remarks: remarks
            };

            settings.teacherPayouts.push(newPayout);
            saveDatabase();

            alert(`Teacher payout recorded successfully! Payout ID: ${newId}.` + (receivedByAdmin ? "" : " (Pending Admin verification)"));
            closeTeacherPayoutModal();
            renderTeacherPayouts();
            renderHandoverBoard();
        });
    }
}

window.openTeacherPayoutModal = function() {
    const modal = document.getElementById('teacher-payout-modal');
    const teacherSelect = document.getElementById('payout-teacher-select');
    const amountInput = document.getElementById('payout-amount-input');
    const dateInput = document.getElementById('payout-date-input');
    const remarksInput = document.getElementById('payout-remarks-input');

    if (!modal || !teacherSelect) return;

    // Populate teachers dropdown
    teacherSelect.innerHTML = '<option value="">-- Select Teacher --</option>';
    if (settings.teachers && settings.teachers.length > 0) {
        settings.teachers.forEach(tch => {
            const opt = document.createElement('option');
            opt.value = tch.id;
            opt.setAttribute('data-name', tch.name);
            opt.textContent = `${tch.name} (${tch.phone})`;
            teacherSelect.appendChild(opt);
        });
    }

    // Reset inputs
    if (amountInput) amountInput.value = '';
    if (dateInput) dateInput.value = getLocalDateString();
    if (remarksInput) remarksInput.value = '';

    modal.classList.add('active');
};

window.closeTeacherPayoutModal = function() {
    const modal = document.getElementById('teacher-payout-modal');
    if (modal) modal.classList.remove('active');
};

window.renderTeacherPayouts = function() {
    const tbody = document.getElementById('teacher-payouts-tbody');
    const filterSelect = document.getElementById('filter-teacher-select');
    const historyTbody = document.getElementById('teacher-payments-history-tbody');
    if (!tbody || !filterSelect) return;

    // Save current selection
    const selectedTeacher = filterSelect.value;

    // Repopulate filter select with available teachers
    filterSelect.innerHTML = '<option value="">-- All Teachers --</option>';
    if (settings.teachers && settings.teachers.length > 0) {
        settings.teachers.forEach(tch => {
            const opt = document.createElement('option');
            opt.value = tch.name;
            opt.textContent = tch.name;
            filterSelect.appendChild(opt);
        });
    }
    filterSelect.value = selectedTeacher; // Restore selection if still exists

    // Calculate payouts
    const batches = settings.batches || defaultBatches;
    let totalBatchesCount = 0;
    let totalNetIncomeSum = 0;
    let totalEarningsSum = 0;

    tbody.innerHTML = '';
    const escapeHtml = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // Map to track earned totals per teacher
    const teacherEarningsMap = {};

    batches.forEach(b => {
        // Skip if batch has no teacher assigned
        if (!b.teacher) return;

        // Calculate financials
        const batchStudents = students.filter(st => st.course && st.course.includes(b.course) && st.batch && st.batch.includes(b.name));
        let netIncome = 0;
        batchStudents.forEach(st => {
            netIncome += (st.paidFee || 0);
        });

        const sharePct = b.teacherPercentage || 0;
        const earnings = Math.round(netIncome * sharePct / 100);

        if (!teacherEarningsMap[b.teacher]) {
            teacherEarningsMap[b.teacher] = 0;
        }
        teacherEarningsMap[b.teacher] += earnings;

        // Skip if filtered by teacher
        if (selectedTeacher && b.teacher !== selectedTeacher) return;

        totalBatchesCount++;
        totalNetIncomeSum += netIncome;
        totalEarningsSum += earnings;

        const scheduleStr = Array.isArray(b.schedule) ? b.schedule.join(', ') : (b.schedule || 'N/A');
        const timeStr = b.time || 'N/A';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHtml(b.teacher)}</strong></td>
            <td>
                <span class="badge badge-primary">${escapeHtml(b.course)}</span>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">${escapeHtml(b.name)}</div>
            </td>
            <td>
                <div style="font-size: 0.85rem; font-weight: 500;">${escapeHtml(scheduleStr)}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(timeStr)}</div>
            </td>
            <td><span class="badge badge-secondary">${batchStudents.length} Students</span></td>
            <td><strong>৳${netIncome.toLocaleString()}</strong></td>
            <td><span class="badge badge-primary">${sharePct}%</span></td>
            <td style="color: var(--success); font-weight: 700;">৳${earnings.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });

    if (totalBatchesCount === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No batches found for this selection.</td></tr>`;
    }

    // Now calculate payouts paid
    let totalPaidSum = 0;
    const payouts = settings.teacherPayouts || [];

    if (historyTbody) {
        historyTbody.innerHTML = '';
        
        const filteredPayouts = payouts.filter(po => {
            const matchName = po.teacherName || '';
            const matchTeacher = selectedTeacher ? (matchName === selectedTeacher) : true;
            return matchTeacher;
        });

        filteredPayouts.forEach(po => {
            // Count verified payouts in total paid sum
            if (po.receivedByAdmin) {
                totalPaidSum += (po.amount || 0);
            }

            const tr = document.createElement('tr');
            const statusLabel = po.receivedByAdmin 
                ? '<span style="background:rgba(22,163,74,0.1); color:#16a34a; border:1px solid rgba(22,163,74,0.2); font-weight:700; padding:0.2rem 0.55rem; font-size:0.75rem; border-radius:30px;"><i class="fa-solid fa-circle-check"></i> Verified</span>'
                : '<span style="background:rgba(220,38,38,0.08); color:#dc2626; border:1px solid rgba(220,38,38,0.2); font-weight:700; padding:0.2rem 0.55rem; font-size:0.75rem; border-radius:30px;"><i class="fa-solid fa-clock"></i> Pending</span>';

            tr.innerHTML = `
                <td><strong style="font-family: monospace;">${escapeHtml(po.id)}</strong></td>
                <td><strong>${escapeHtml(po.teacherName)}</strong></td>
                <td>${escapeHtml(po.date)}</td>
                <td><span class="badge badge-secondary">${escapeHtml(po.paymentMethod)}</span></td>
                <td style="font-weight: 700;">৳${(po.amount || 0).toLocaleString()}</td>
                <td><span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(po.recordedBy)}</span></td>
                <td>${statusLabel}</td>
                <td><span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(po.remarks || 'None')}</span></td>
            `;
            historyTbody.appendChild(tr);
        });

        if (filteredPayouts.length === 0) {
            historyTbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">No payment history found.</td></tr>`;
        }
    }

    // If no specific teacher is selected, we sum all earnings and all verified paid payouts globally
    if (!selectedTeacher) {
        totalEarningsSum = 0;
        Object.keys(teacherEarningsMap).forEach(k => {
            totalEarningsSum += teacherEarningsMap[k];
        });
        totalPaidSum = 0;
        payouts.forEach(po => {
            if (po.receivedByAdmin) {
                totalPaidSum += (po.amount || 0);
            }
        });
    }

    const dueSum = totalEarningsSum - totalPaidSum;

    // Update metrics cards
    document.getElementById('metric-teacher-batches').innerText = totalBatchesCount;
    document.getElementById('metric-teacher-net-income').innerText = `৳${totalNetIncomeSum.toLocaleString()}`;
    document.getElementById('metric-teacher-earnings').innerText = `৳${totalEarningsSum.toLocaleString()}`;
    
    const metricPaid = document.getElementById('metric-teacher-paid');
    const metricDue = document.getElementById('metric-teacher-due');
    if (metricPaid) metricPaid.innerText = `৳${totalPaidSum.toLocaleString()}`;
    if (metricDue) {
        metricDue.innerText = `৳${dueSum.toLocaleString()}`;
        metricDue.style.color = dueSum > 0 ? 'var(--danger)' : 'var(--success)';
    }
};

