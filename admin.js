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
let dashboardDateRange = { type: 'all', start: null, end: null };
let bookStock = 0;
let batchStatusFilter = 'active'; // Filter state: 'active' or 'all'


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
    // 1. Load Local Database first (initializes settings.users database)
    loadDatabase();
    migrateLegacyStudentIds();

    // 2. Check Session Token
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
});

// --- AUTHENTICATION GATE ---
function setupAuthentication() {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredEmail = document.getElementById('auth-email').value.trim();
        const enteredPassword = authPassword.value;

        // Retrieve users from settings database
        const users = settings.users || [];
        const matchedUser = users.find(u => u.email === enteredEmail && u.password === enteredPassword);

        if (matchedUser) {
            sessionStorage.setItem('ediz_admin_auth', 'true');
            sessionStorage.setItem('ediz_active_user', JSON.stringify(matchedUser));
            authError.style.display = 'none';
            unlockDashboard();
            applyUserPermissions(matchedUser);
        } else {
            authError.style.display = 'block';
            authPassword.value = '';
        }
    });

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

    const lightLogoName = settings.lightLogo || 'Logo-07.png';
    const darkLogoName = settings.darkLogo || 'Logo-03.png';

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

// --- DATABASE ACCESS ---
function loadDatabase() {
    // One-time automatic migration import from database_backup.js if present
    if (!localStorage.getItem('ediz_students_migrated') && window.migratedDatabase) {
        localStorage.setItem('ediz_students', JSON.stringify(window.migratedDatabase.students));
        localStorage.setItem('ediz_settings', JSON.stringify(window.migratedDatabase.settings));
        localStorage.setItem('ediz_students_migrated', 'true');
    }

    students = JSON.parse(localStorage.getItem('ediz_students')) || [];
    bookStock = parseInt(localStorage.getItem('ediz_book_stock')) || 0;
    settings = JSON.parse(localStorage.getItem('ediz_settings')) || {
        adminPassword: 'admin123',
        phone: '+880 1712-345678',
        address: 'Jhautala, Comilla',
        lightLogo: 'Logo-07.png',
        darkLogo: 'Logo-03.png',
        courseFees: defaultFees,
        batches: defaultBatches,
        smsConfig: { apiKey: '', senderId: '', welcomeTemplate: '', autoSendWelcome: true },
        smsHistory: [],
        emailConfig: { provider: 'simulation', publicKey: '', serviceId: '', templateId: '' }
    };

    if (!settings.courseFees) settings.courseFees = defaultFees;
    if (!settings.batches) settings.batches = defaultBatches;
    if (!settings.smsConfig) settings.smsConfig = { apiKey: '', senderId: '', welcomeTemplate: '', autoSendWelcome: true };
    if (!settings.smsHistory) settings.smsHistory = [];
    if (!settings.emailConfig) settings.emailConfig = { provider: 'simulation', publicKey: '', serviceId: '', templateId: '' };

    if (settings.smsConfig.welcomeTemplate === undefined) {
        settings.smsConfig.welcomeTemplate = "Dear {student_name}, your admission to {course_name} (Batch: {batch_name}) at EDIZ IT Institute is confirmed! Class starts on {start_date} at {class_time}. Website: https://edizit.com";
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
                permissions: { canEdit: true, canDelete: true, canInvoice: true, canCert: true },
                recoveryEmail: "owner@ediz.com"
            },
            { 
                id: "USER-2", 
                email: "staff@ediz.com", 
                password: "staff123", 
                role: "Staff", 
                permissions: { canEdit: true, canDelete: false, canInvoice: true, canCert: true } 
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
    renderSmsHistory();
    renderBooksTab();
}

function saveDatabase() {
    localStorage.setItem('ediz_students', JSON.stringify(students));
    localStorage.setItem('ediz_settings', JSON.stringify(settings));
    refreshStats();
    renderAllLists();
    renderSettingsBatches();
    renderSettingsStaff();
    renderSmsHistory();
    renderBooksTab();
    
    // Refresh active batch explorer roster and card financials in real-time
    if (activeBatchForRoster) {
        renderBatchRoster(selectedCourseForBatches, activeBatchForRoster);
        const activeBatchInfoCard = document.getElementById('active-batch-info-card');
        if (activeBatchInfoCard && activeBatchInfoCard.style.display !== 'none') {
            selectActiveBatch(selectedCourseForBatches, activeBatchForRoster);
        }
    }
}

function migrateLegacyStudentIds() {
    let modified = false;
    const courseCounters = {
        "Graphic Design": 1,
        "Basic Computer": 1,
        "Spoken English": 1,
        "Other": 1
    };

    // First pass: identify the highest sequence number for already correct IDs, so we don't overwrite them or collide
    students.forEach(st => {
        const firstCourse = (st.course || "Other").split(',')[0].trim();
        let prefix = "EDIZ";
        if (firstCourse === "Graphic Design") prefix = "EDIZ-GD";
        else if (firstCourse === "Basic Computer") prefix = "EDIZ-BC";
        else if (firstCourse === "Spoken English") prefix = "EDIZ-SP";

        const regex = new RegExp(`^${prefix}-\\d{3}$`);
        if (regex.test(st.id)) {
            const parts = st.id.split('-');
            const lastPart = parts[parts.length - 1];
            const num = parseInt(lastPart, 10);
            const courseKey = firstCourse;
            if (!isNaN(num) && num >= courseCounters[courseKey]) {
                courseCounters[courseKey] = num + 1;
            }
        }
    });

    // Second pass: migrate legacy IDs
    students.forEach(st => {
        const firstCourse = (st.course || "Other").split(',')[0].trim();
        let prefix = "EDIZ";
        let courseKey = "Other";
        if (firstCourse === "Graphic Design") {
            prefix = "EDIZ-GD";
            courseKey = "Graphic Design";
        } else if (firstCourse === "Basic Computer") {
            prefix = "EDIZ-BC";
            courseKey = "Basic Computer";
        } else if (firstCourse === "Spoken English") {
            prefix = "EDIZ-SP";
            courseKey = "Spoken English";
        }

        const regex = new RegExp(`^${prefix}-\\d{3}$`);
        if (!regex.test(st.id)) {
            let nextNum = courseCounters[courseKey] || 1;
            let studentId = `${prefix}-${String(nextNum).padStart(3, '0')}`;
            
            // Safe increment checking for uniqueness
            while (students.some(s => s.id === studentId)) {
                nextNum++;
                studentId = `${prefix}-${String(nextNum).padStart(3, '0')}`;
            }

            console.log(`Migrating student "${st.name}" ID from "${st.id}" to "${studentId}"`);
            st.id = studentId;
            courseCounters[courseKey] = nextNum + 1;
            modified = true;
        }
    });

    if (modified) {
        saveDatabase();
        renderAllLists();
    }
}

function refreshStats() {
    const stats = getFilteredStats();
    statTotalStudents.innerText = stats.totalStudents;
    statEarnings.innerText = `৳${stats.earnings.toLocaleString()}`;
    statDues.innerText = `৳${stats.dues.toLocaleString()}`;
    statCerts.innerText = stats.certs;
}

// --- TAB ROUTING ---
function setupTabSwitching() {
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');
            
            // Toggle active sidebar item
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

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
            } else if (tabName === 'settings') {
                activeTabTitle.innerText = "System Configuration";
                activeTabSubtitle.innerText = "Manage fees, database backups, and details.";
            }
        });
    });
}

// --- SYNC TABLES / UI RENDERS ---
function renderAllLists() {
    renderRecentDashboard();
    renderStudentsTable();
    renderInvoicesTable();
    renderCertificatesTable();
}

function renderRecentDashboard() {
    const stats = getFilteredStats();
    const list = [...stats.studentsList].reverse();
    const displayList = dashboardDateRange.type === 'all' ? list.slice(0, 5) : list;

    if (displayList.length === 0) {
        recentEnrollmentsTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No registrations found for the selected range.</td></tr>`;
        return;
    }

    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
    const canInvoice = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice);

    recentEnrollmentsTbody.innerHTML = displayList.map(st => `
        <tr>
            <td><strong>${st.id}</strong></td>
            <td>${st.name}</td>
            <td>${st.course}</td>
            <td>${st.registrationDate}</td>
            <td><span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status}</span></td>
            <td>
                ${canInvoice ? `<button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Payments"><i class="fa-solid fa-credit-card"></i></button>` : '---'}
            </td>
        </tr>
    `).join('');
}

function renderStudentsTable() {
    const sQuery = studentSearch.value.toLowerCase();
    const courseVal = filterCourse.value;
    const statusVal = filterStatus.value;

    const activeTab = document.querySelector('.sidebar-item.active');
    const isStudentsTab = activeTab && activeTab.getAttribute('data-tab') === 'students';
    if (isStudentsTab && activeTabSubtitle) {
        activeTabSubtitle.innerText = `View, manage and enroll students. Total Registered: ${students.length}`;
    }

    const registryTotalEl = document.getElementById('student-registry-total');
    if (registryTotalEl) {
        registryTotalEl.innerText = `Total Students: ${students.length}`;
    }

    const curUser = JSON.parse(sessionStorage.getItem('ediz_active_user')) || { role: 'Owner' };
    const canEdit = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canEdit);
    const canDelete = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canDelete);
    const canInvoice = curUser.role === 'Owner' || (curUser.permissions && curUser.permissions.canInvoice);

    const cleanQuery = sQuery.replace(/\D/g, "");

    const filtered = students.filter(st => {
        const cleanPhone = st.phone ? st.phone.replace(/\D/g, "") : "";
        const cleanGuardian = st.guardianPhone ? st.guardianPhone.replace(/\D/g, "") : "";

        const matchesSearch = st.id.toLowerCase().includes(sQuery) || 
                              st.name.toLowerCase().includes(sQuery) || 
                              (cleanQuery && cleanPhone.includes(cleanQuery)) ||
                              (cleanQuery && cleanGuardian.includes(cleanQuery)) ||
                              (st.batch && st.batch.toLowerCase().includes(sQuery));
        const matchesCourse = courseVal === "" || (st.course && st.course.includes(courseVal));
        const matchesStatus = statusVal === "" || st.status === statusVal;
        return matchesSearch && matchesCourse && matchesStatus;
    });

    if (filtered.length === 0) {
        studentsTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No matching student records.</td></tr>`;
        return;
    }

    studentsTbody.innerHTML = filtered.map(st => `
        <tr>
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
            </td>
            <td>
                ${st.course}
                ${st.takenBook ? `<br><span class="badge badge-success" style="font-size:0.65rem; padding: 1px 4px; margin-top: 2px; display: inline-block;">Book Taken</span>` : ''}
            </td>
            <td>
                <div>Mob: ${st.phone}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Grd: ${st.guardianPhone || 'N/A'}</div>
            </td>
            <td>
                <div style="font-size: 0.85rem;">Gross: ৳${st.totalFee}</div>
                <div style="font-size: 0.8rem; color: var(--accent);">Disc: ৳${st.discountFee || 0}</div>
                <div style="font-size: 0.8rem; font-weight: 600;">Net: ৳${st.netFee !== undefined ? st.netFee : st.totalFee}</div>
                <div style="font-size: 0.85rem; color: var(--success); font-weight: 500;">Paid: ৳${st.paidFee}</div>
                <div style="font-size: 0.85rem; color: var(--danger); font-weight: 600;">Due: ৳${st.dueFee}</div>
            </td>
            <td><span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status}</span></td>
            <td>
                <div class="actions-cell">
                    ${canInvoice ? `<button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Manage Fees"><i class="fa-solid fa-wallet"></i></button>` : ''}
                    ${canEdit ? `<button class="btn btn-secondary btn-icon-only" onclick="openEditStudentModal('${st.id}')" title="Edit Student"><i class="fa-solid fa-edit"></i></button>` : ''}
                    ${canDelete ? `<button class="btn btn-secondary btn-icon-only" style="color: var(--danger);" onclick="deleteStudent('${st.id}')" title="Delete Student"><i class="fa-solid fa-trash"></i></button>` : ''}
                    ${!canInvoice && !canEdit && !canDelete ? '---' : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderInvoicesTable() {
    const sQuery = invoiceSearch.value.toLowerCase();
    
    // Flatten invoices
    let allInvoices = [];
    students.forEach(st => {
        if (st.invoices && st.invoices.length > 0) {
            st.invoices.forEach(inv => {
                allInvoices.push({
                    invId: inv.id,
                    studentId: st.id,
                    studentName: st.name,
                    date: inv.date,
                    amount: inv.amount
                });
            });
        }
    });

    const filtered = allInvoices.filter(inv => {
        return inv.invId.toLowerCase().includes(sQuery) || inv.studentId.toLowerCase().includes(sQuery) || inv.studentName.toLowerCase().includes(sQuery);
    });

    if (filtered.length === 0) {
        invoicesTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No invoices generated.</td></tr>`;
        return;
    }

    invoicesTbody.innerHTML = filtered.map(inv => `
        <tr>
            <td><strong>${inv.invId}</strong></td>
            <td>${inv.studentId}</td>
            <td>${inv.studentName}</td>
            <td>${inv.date}</td>
            <td>৳${inv.amount.toLocaleString()}</td>
            <td>
                <button class="btn btn-secondary btn-icon-only" onclick="printInvoice('${inv.studentId}', '${inv.invId}')" title="Print Invoice"><i class="fa-solid fa-print"></i></button>
            </td>
        </tr>
    `).join('');
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

    if (adminAddStudentBtn) adminAddStudentBtn.addEventListener('click', () => triggerStudentModal("Register Offline Student", 'add'));
    if (dashboardAddStudentBtn) dashboardAddStudentBtn.addEventListener('click', () => triggerStudentModal("Register Offline Student", 'add'));

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
        authGate.style.display = 'block';
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
            const stIdx = students.findIndex(s => s.id === id);
            if (stIdx !== -1) {
                students[stIdx].name = name;
                students[stIdx].phone = phone;
                students[stIdx].fatherName = father;
                students[stIdx].motherName = mother;
                students[stIdx].guardianPhone = guardian;
                students[stIdx].address = address;
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

            const todayStr = new Date().toISOString().split('T')[0];
            const year = new Date().getFullYear();

            // 1. Generate shared Invoice ID
            let totalInvCount = 0;
            students.forEach(s => totalInvCount += (s.invoices ? s.invoices.length : 0));
            const invId = `INV-${year}-${String(totalInvCount + 1).padStart(4, '0')}`;

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
                let prefix = "EDIZ";
                if (cName === "Graphic Design") prefix = "EDIZ-GD";
                else if (cName === "Basic Computer") prefix = "EDIZ-BC";
                else if (cName === "Spoken English") prefix = "EDIZ-SP";

                const matchingStudents = students.filter(s => s.id && s.id.startsWith(prefix + "-"));
                let maxNum = 0;
                matchingStudents.forEach(s => {
                    const parts = s.id.split('-');
                    const lastPart = parts[parts.length - 1];
                    const num = parseInt(lastPart, 10);
                    if (!isNaN(num) && num > maxNum) {
                        maxNum = num;
                    }
                });
                // Check in currently generated ones in this loop as well
                newlyCreatedStudents.forEach(s => {
                    if (s.id && s.id.startsWith(prefix + "-")) {
                        const parts = s.id.split('-');
                        const lastPart = parts[parts.length - 1];
                        const num = parseInt(lastPart, 10);
                        if (!isNaN(num) && num > maxNum) {
                            maxNum = num;
                        }
                    }
                });

                const nextNum = maxNum + 1;
                const sequence = String(nextNum).padStart(3, '0');
                const studentId = `${prefix}-${sequence}`;

                const status = coursePaid >= netVal ? 'Paid' : (coursePaid > 0 ? 'Partial' : 'Unpaid');

                const newStObj = {
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
                    invoices: [
                        {
                            id: invId,
                            date: todayStr,
                            amount: coursePaid
                        }
                    ],
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
        e.preventDefault();
        if (!activeStudentForFees) return;

        const amount = parseInt(paymentAmount.value);
        if (isNaN(amount) || amount <= 0) {
            alert("Please input a valid positive amount.");
            return;
        }

        if (amount > activeStudentForFees.dueFee) {
            alert(`Error: Student only has outstanding balance of ৳${activeStudentForFees.dueFee}. You cannot collect more.`);
            return;
        }

        // Apply transaction values
        activeStudentForFees.paidFee += amount;
        activeStudentForFees.dueFee -= amount;
        const targetNet = activeStudentForFees.netFee !== undefined ? activeStudentForFees.netFee : activeStudentForFees.totalFee;
        activeStudentForFees.status = activeStudentForFees.paidFee >= targetNet ? 'Paid' : 'Partial';

        // Add Invoice Transaction
        const year = new Date().getFullYear();
        let totalInvCount = 0;
        students.forEach(s => totalInvCount += (s.invoices ? s.invoices.length : 0));
        const newInvId = `INV-${year}-${String(totalInvCount + 1).padStart(4, '0')}`;

        if (!activeStudentForFees.invoices) activeStudentForFees.invoices = [];
        activeStudentForFees.invoices.push({
            id: newInvId,
            date: new Date().toISOString().split('T')[0],
            amount: amount
        });

        // Save and reload modal
        saveDatabase();
        paymentAmount.value = '';
        renderPaymentModal(activeStudentForFees.id);

        // Send payment confirmation SMS notifications
        const studentMsg = `Dear ${activeStudentForFees.name}, we have received your payment of ৳${amount} for ${activeStudentForFees.course}. Current outstanding due is ৳${activeStudentForFees.dueFee}. Thank you!`;
        sendGeneralSms(activeStudentForFees.phone, studentMsg, "Student Payment Receipt");

        const adminPhone = "01798926897";
        const adminMsg = `Dear Admin, student ${activeStudentForFees.name} (ID: ${activeStudentForFees.id}) has paid ৳${amount} for ${activeStudentForFees.course}. Current Due: ৳${activeStudentForFees.dueFee}.`;
        sendGeneralSms(adminPhone, adminMsg, "Admin Payment Notification");
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
                canCert: true
            };

            let phoneVal = "";
            let questionVal = "What is your birth city?";
            let answerVal = "comilla";

            if (roleVal === 'Staff') {
                permissionsObj = {
                    canEdit: document.getElementById('perm-edit').checked,
                    canDelete: document.getElementById('perm-delete').checked,
                    canInvoice: document.getElementById('perm-invoice').checked,
                    canCert: document.getElementById('perm-cert').checked
                };
            } else if (roleVal === 'Admin') {
                const pVal = document.getElementById('user-phone-input').value.trim();
                const qVal = document.getElementById('user-question-input').value.trim();
                const aVal = document.getElementById('user-answer-input').value.trim();
                if (pVal) phoneVal = pVal;
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
            alert(`Account for "${emailVal}" (${roleVal}) created successfully!`);
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
    studentBatch.disabled = true;

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

    feesStudentName.innerText = st.name;
    feesStudentId.innerText = `Student ID: ${st.id}`;
    feesStudentCourse.innerText = `Program: ${st.course}`;
    feesTotalVal.innerText = `৳${st.totalFee}`;
    feesPaidVal.innerText = `৳${st.paidFee}`;
    feesDueVal.innerText = `৳${st.dueFee}`;

    if (st.invoices && st.invoices.length > 0) {
        feesLedgerTbody.innerHTML = st.invoices.map(inv => `
            <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.date}</td>
                <td>৳${inv.amount.toLocaleString()}</td>
                <td>
                    <button class="btn btn-secondary btn-icon-only" onclick="printInvoice('${st.id}', '${inv.id}')" title="Print"><i class="fa-solid fa-print"></i></button>
                </td>
            </tr>
        `).join('');
    } else {
        feesLedgerTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">No payments registered.</td></tr>`;
    }
}

window.toggleCertificate = function(id, status) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    if (status && st.dueFee > 0) {
        alert(`Cannot award certificate. Student ${st.name} (ID: ${st.id}) has outstanding dues of ৳${st.dueFee.toLocaleString()}. Please clear all dues first.`);
        return;
    }

    st.certified = status;
    st.certificateDate = status ? new Date().toISOString().split('T')[0] : '';
    saveDatabase();
};

// --- PRINT RECEIPT ENGINE ---
// --- PRINT RECEIPT ENGINE ---
window.printInvoice = function(studentId, invoiceId) {
    // Find all student records that share this invoiceId
    const matchedStudents = students.filter(s => s.invoices && s.invoices.some(i => i.id === invoiceId));
    
    let targetStudent = null;
    if (matchedStudents.length > 0) {
        targetStudent = matchedStudents.find(s => s.id === studentId) || matchedStudents[0];
    } else {
        targetStudent = students.find(s => s.id === studentId);
    }
    
    if (!targetStudent) return;

    // Retrieve the specific invoice entry
    const inv = targetStudent.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    // Hardcoded Logo-03.png as requested by the user
    const logoName = 'Logo-03.png';

    // Construct courseDetails, student ID display, and aggregate financial totals
    let courseDetails = [];
    let studentIdDisplay = '';
    let totalNetFee = 0;
    let totalPaidFee = 0;
    let totalDueFee = 0;
    let totalPaidViaInvoice = 0;

    if (matchedStudents.length > 0) {
        courseDetails = matchedStudents.map(s => ({
            id: s.id,
            course: s.course,
            batch: s.batch,
            fee: s.totalFee,
            discount: s.discountFee || 0,
            net: s.netFee !== undefined ? s.netFee : s.totalFee,
            takenBook: s.takenBook
        }));
        studentIdDisplay = matchedStudents.map(s => `${s.id} (${s.course})`).join(', ');
        totalNetFee = matchedStudents.reduce((sum, s) => sum + (s.netFee !== undefined ? s.netFee : s.totalFee), 0);
        totalPaidFee = matchedStudents.reduce((sum, s) => sum + (s.paidFee || 0), 0);
        totalDueFee = matchedStudents.reduce((sum, s) => sum + (s.dueFee || 0), 0);
        totalPaidViaInvoice = matchedStudents.reduce((sum, s) => {
            const invoiceEntry = s.invoices && s.invoices.find(i => i.id === invoiceId);
            return sum + (invoiceEntry ? invoiceEntry.amount : 0);
        }, 0);
    } else {
        // Fallback for single-course or legacy structures
        courseDetails = targetStudent.courseDetails || [
            {
                id: targetStudent.id,
                course: targetStudent.course,
                batch: targetStudent.batch,
                fee: targetStudent.totalFee,
                discount: targetStudent.discountFee || 0,
                net: targetStudent.netFee !== undefined ? targetStudent.netFee : targetStudent.totalFee,
                takenBook: targetStudent.takenBook
            }
        ];
        studentIdDisplay = `${targetStudent.id} (Batch: ${targetStudent.batch || 'N/A'})`;
        totalNetFee = targetStudent.netFee !== undefined ? targetStudent.netFee : targetStudent.totalFee;
        totalPaidFee = targetStudent.paidFee || 0;
        totalDueFee = targetStudent.dueFee || 0;
        totalPaidViaInvoice = inv.amount;
    }

    // Helper to generate receipt HTML per copy
    function getInvoiceCopyHTML(copyLabel) {
        return `
            <div class="invoice-print" style="padding: 12mm 15mm; background: #fff; position: relative; font-size: 13px; font-family: 'Outfit', 'Inter', sans-serif; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; color: #000000 !important;">
                <div>
                    <!-- Copy Label Badge -->
                    <div style="position: absolute; top: 12mm; right: 15mm; font-size: 11px; font-weight: 700; color: #4f46e5 !important; border: 1.5px solid #4f46e5 !important; padding: 3px 10px; border-radius: var(--radius-sm); text-transform: uppercase; letter-spacing: 0.5px;">
                        ${copyLabel}
                    </div>

                    <!-- Header -->
                    <div class="invoice-print-header" style="border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <img src="${logoName}" alt="Ediz IT" class="invoice-print-logo" style="height: 55px;">
                            <p style="margin: 5px 0 2px 0; font-weight: 600; font-size: 13px; color: #0f172a !important;">Offline Computer & Spoken English Campus</p>
                            <p style="color: #475569 !important; font-size: 10px; margin: 0;">Jhautala Zilla School Road, Comilla | Tel: ${settings.phone}</p>
                        </div>
                        <div class="invoice-print-title" style="font-size: 28px; font-weight: 800; color: #0f172a !important; letter-spacing: 0.5px;">RECEIPT</div>
                    </div>
                    
                    <!-- Billed To Grid -->
                    <div class="invoice-print-grid" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px; margin-bottom: 25px; line-height: 1.5;">
                        <div>
                            <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0f172a !important; text-transform: uppercase; letter-spacing: 0.5px;">Billed To:</h3>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Student Name:</strong> ${targetStudent.name}</p>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Father's Name:</strong> ${targetStudent.fatherName || 'N/A'}</p>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Student ID:</strong> ${studentIdDisplay}</p>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Mobile:</strong> ${targetStudent.phone} | <strong>Guardian:</strong> ${targetStudent.guardianPhone || 'N/A'}</p>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Address:</strong> ${targetStudent.address}</p>
                        </div>
                        <div style="text-align: right;">
                            <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0f172a !important; text-transform: uppercase; letter-spacing: 0.5px;">Transaction Details:</h3>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Invoice No:</strong> ${inv.id}</p>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Payment Date:</strong> ${inv.date}</p>
                            <p style="margin: 3px 0; color: #334155 !important;"><strong>Registration Date:</strong> ${targetStudent.registrationDate}</p>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <table class="invoice-print-table" style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px;">
                        <thead>
                            <tr style="background-color: #f8fafc;">
                                <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; color: #0f172a !important;">Course Enrolled</th>
                                <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; font-weight: 700; color: #0f172a !important;">Total Base Fee</th>
                                <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; font-weight: 700; color: #0f172a !important;">Discount Given</th>
                                <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; font-weight: 700; color: #0f172a !important;">Net Payable</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${courseDetails.map(item => `
                                <tr>
                                    <td style="border: 1px solid #cbd5e1; padding: 10px 14px; color: #334155 !important;">
                                        <strong>${item.course} (Batch: ${item.batch || 'N/A'})</strong>
                                        <div style="font-size: 10px; color: #64748b !important; margin-top: 2px;">
                                            Student ID: ${item.id}${item.takenBook ? ' | Book Included' : ''}
                                        </div>
                                    </td>
                                    <td style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; color: #334155 !important;">৳${item.fee.toLocaleString()}</td>
                                    <td style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; color: #334155 !important;">৳${item.discount.toLocaleString()}</td>
                                    <td style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; font-weight: 700; color: #0f172a !important;">৳${item.net.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Totals Block -->
                    <div class="invoice-print-total-section" style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
                        <div class="invoice-print-total-box" style="width: 260px; line-height: 1.6;">
                            <div class="invoice-print-total-row" style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #475569 !important;">
                                <span>Net Course Fee:</span>
                                <span>৳${totalNetFee.toLocaleString()}</span>
                            </div>
                            <div class="invoice-print-total-row" style="display: flex; justify-content: space-between; padding: 4px 0; color: #16a34a !important; font-weight: 600; font-size: 12px;">
                                <span>Accumulated Payments:</span>
                                <span>৳${totalPaidFee.toLocaleString()}</span>
                            </div>
                            <div class="invoice-print-total-row" style="display: flex; justify-content: space-between; padding: 4px 0; color: #dc2626 !important; font-weight: 600; font-size: 12px;">
                                <span>Outstanding Dues:</span>
                                <span>৳${totalDueFee.toLocaleString()}</span>
                            </div>
                            <div class="invoice-print-total-row grand" style="display: flex; justify-content: space-between; padding: 6px 0; border-top: 2px double #000; font-weight: 800; font-size: 14px; color: #0f172a !important; margin-top: 6px;">
                                <span>Paid via ${inv.id}:</span>
                                <span>৳${totalPaidViaInvoice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Terms & Conditions Section -->
                    <div class="invoice-terms-section" style="margin-top: 35px; border-top: 1px solid #cbd5e1; padding-top: 15px;">
                        <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: #0f172a !important; font-weight: 700; letter-spacing: 0.5px;">Terms & Conditions (শর্তাবলী)</h4>
                        <ol style="margin: 0; padding-left: 18px; font-size: 10.5px; line-height: 1.6; color: #334155 !important; text-align: justify;">
                            <li style="margin-bottom: 6px;"><strong>কোর্স রিফান্ড নীতি:</strong> শিক্ষার্থী ভর্তি হওয়ার পর কোর্স শুরু থেকে ৭ (সাত) দিনের মধ্যে কোর্সে অসন্তুষ্ট হলে প্রদত্ত কোর্স ফি-এর ৫০% ফেরত নিতে পারবেন। ৭ দিনের পর কোনো রিফান্ড প্রযোজ্য হবে না।</li>
                            <li style="margin-bottom: 6px;"><strong>বকেয়া ফি পরিশোধ:</strong> ভর্তি হওয়ার পর সর্বোচ্চ ৭ (সাত) দিনের মধ্যে বকেয়া ফি পরিশোধ করতে হবে। নির্ধারিত সময়ে পরিশোধ না করলে প্রতিষ্ঠান ভর্তি বাতিল করার অধিকার সংরক্ষণ করে।</li>
                            <li style="margin-bottom: 6px;"><strong>ক্লাসে উপস্থিতি:</strong> অনুপস্থিতির কারণে মিস হওয়া ক্লাস পুনরায় নেওয়ার জন্য প্রতিষ্ঠান বাধ্য থাকবে না।</li>
                            <li style="margin-bottom: 6px;"><strong>আচরণবিধি:</strong> প্রতিষ্ঠানের শিক্ষক, কর্মকর্তা ও শিক্ষার্থীদের সাথে শালীন আচরণ বজায় রাখতে হবে। অসদাচরণ প্রমাণিত হলে ভর্তি বাতিল করা হতে পারে।</li>
                            <li style="margin-bottom: 6px;"><strong>কোর্স সামগ্রী:</strong> প্রদত্ত নোট, ভিডিও, সফটওয়্যার ও অন্যান্য শিক্ষাসামগ্রী অনুমতি ছাড়া শেয়ার, বিক্রয় বা কপি করা যাবে না।</li>
                            <li style="margin-bottom: 6px;"><strong>প্রতিষ্ঠান কর্তৃপক্ষের সিদ্ধান্ত:</strong> EDIZ IT Institute যেকোনো সময় প্রয়োজন অনুযায়ী কোর্স, সময়সূচী, ব্যাচ, প্রশিক্ষক ও অন্যান্য প্রশাসনিক বিষয়ে সিদ্ধান্ত গ্রহণ ও পরিবর্তনের অধিকার সংরক্ষণ করে।</li>
                            <li style="margin-bottom: 6px;"><strong>সার্টিফিকেট:</strong> প্রতিষ্ঠানের নির্ধারিত শর্ত পূরণ সাপেক্ষে কোর্স শেষে সার্টিফিকেট প্রদান করা হবে।</li>
                        </ol>
                    </div>
                </div>

                <div>
                    <!-- Signatures Area -->
                    <div style="margin-top: 60px; display: flex; justify-content: space-between; font-size: 12px; padding: 0 10px;">
                        <div style="width: 200px; text-align: center; border-top: 1.5px solid #0f172a; padding-top: 6px; font-weight: 600; color: #0f172a !important;">
                            Student Signature
                        </div>
                        <div style="width: 200px; text-align: center; border-top: 1.5px solid #0f172a; padding-top: 6px; font-weight: 600; color: #0f172a !important;">
                            Authorized Signature
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="invoice-print-footer" style="margin-top: 40px; text-align: center; font-size: 10px; color: #64748b !important; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                        <p style="margin: 0;">This is a computer-generated invoice receipt issued by Ediz IT Institute, Comilla.</p>
                        <p style="margin: 3px 0 0 0; font-weight: 600; color: #4f46e5 !important;">Thank you for choosing Ediz IT Institute for your educational progress!</p>
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
            }
            .invoice-copy-container {
                page-break-after: always;
                break-after: page;
                box-sizing: border-box;
                height: 297mm;
                width: 210mm;
                overflow: hidden;
                background: #fff;
            }
            .invoice-copy-container:last-child {
                page-break-after: avoid;
                break-after: avoid;
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
                    height: auto !important;
                    background: #fff !important;
                }
                /* Clean reset for elements styled under old @media print in styles.css */
                .invoice-print {
                    padding: 12mm 15mm !important;
                    border: none !important;
                    box-shadow: none !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: space-between !important;
                    height: 100% !important;
                    box-sizing: border-box !important;
                }
            }
        </style>
        <div class="invoice-copy-container">
            ${getInvoiceCopyHTML("Office Copy")}
        </div>
        <div class="invoice-copy-container">
            ${getInvoiceCopyHTML("Student Copy")}
        </div>
    `;

    printZone.innerHTML = printHTML;
    window.print();
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
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function formatIssueDate(dateStr) {
        if (!dateStr) return 'TBA';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const batches = settings.batches || defaultBatches;
    const batchObj = batches.find(b => b.course === st.course && b.name === st.batch);

    const origin = window.location.origin;
    let verifyURL = '';
    if (origin === 'null' || !origin || origin.startsWith('file')) {
        verifyURL = 'https://edizit.com/index.html?verify=' + st.id;
    } else {
        verifyURL = origin + window.location.pathname.replace('admin.html', 'index.html') + '?verify=' + st.id;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(verifyURL)}`;

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
                }
                #print-zone {
                    display: block !important;
                    position: static !important;
                    width: 297mm !important;
                    height: 210mm !important;
                    background: #fff !important;
                }
                .certificate-print {
                    border: none !important;
                    box-shadow: none !important;
                }
            }
        </style>
        <div class="certificate-print">
            <div class="cert-dyn-id">${st.id}</div>
            <div class="cert-dyn-issue-date">${formatIssueDate(st.certificateDate)}</div>
            <div class="cert-dyn-qr">
                <img src="${qrUrl}" class="cert-dyn-qr-image">
            </div>
            <div class="cert-dyn-name">${st.name}</div>
            <div class="cert-dyn-description">
                SON/DAUGHTER OF <strong>${(st.fatherName || '---').toUpperCase()}</strong> & <strong>${(st.motherName || '---').toUpperCase()}</strong> HAS SUCCESSFULLY COMPLETED THE <strong>${st.course.toUpperCase()}</strong> COURSE HELD ON <strong>${formatCourseDate(batchObj ? batchObj.startDate : '2026-06-01')} TO ${formatCourseDate(batchObj ? batchObj.endDate : '2026-08-31')}</strong> AT EDIZ IT INSTITUTE.
            </div>
        </div>
    `;

    // Wait for both the background image and QR code to preload in memory
    const bgPromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = 'Certificate/Student Certificate.png';
    });

    const qrPromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = qrUrl;
    });

    Promise.all([bgPromise, qrPromise]).then(() => {
        printZone.innerHTML = printHTML;
        setTimeout(() => {
            window.print();
        }, 250);
    });
};

// --- LIVE FILTER LISTENERS ---
function setupSearchFilters() {
    studentSearch.addEventListener('input', renderStudentsTable);
    filterCourse.addEventListener('change', renderStudentsTable);
    filterStatus.addEventListener('change', renderStudentsTable);
    
    invoiceSearch.addEventListener('input', renderInvoicesTable);
    certSearch.addEventListener('input', renderCertificatesTable);

    const batchSearchInput = document.getElementById('batch-search-input');
    if (batchSearchInput) {
        batchSearchInput.addEventListener('input', () => {
            renderBatchesList(selectedCourseForBatches);
        });
    }
}

// --- STUDENT MODAL BATCH DYNAMIC POPULATION ---
function updateStudentModalBatches(course, selectElem) {
    const batches = settings.batches || defaultBatches;
    const courseBatches = batches.filter(b => b.course === course);

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
            "Graphic Design": ["GD-01", "GD-02"],
            "Basic Computer": ["BC-01", "BC-02"],
            "Spoken English": ["SE-01", "SE-02"]
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
    
    if (user.role === 'Owner' || user.role === 'Admin') {
        if (settingsTab) settingsTab.style.display = 'block';
        if (staffCard) staffCard.style.display = 'block';
        if (batchesCreateBtn) batchesCreateBtn.style.display = 'inline-flex';
        if (settingsCreateBatchBtn) settingsCreateBatchBtn.style.display = 'inline-flex';
    } else {
        if (settingsTab) settingsTab.style.display = 'none';
        if (staffCard) staffCard.style.display = 'none';
        if (batchesCreateBtn) batchesCreateBtn.style.display = 'none';
        if (settingsCreateBatchBtn) settingsCreateBatchBtn.style.display = 'none';
        
        // If staff is on settings view, redirect to dashboard
        const activeTab = document.querySelector('.sidebar-item.active');
        if (activeTab && activeTab.getAttribute('data-tab') === 'settings') {
            const dashboardTab = document.querySelector('[data-tab="dashboard"]');
            if (dashboardTab) dashboardTab.click();
        }
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
    }
};

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
}

function renderBatchesList(course) {
    const container = document.getElementById('batches-list-container');
    if (!container) return;

    const searchQuery = document.getElementById('batch-search-input')?.value.toLowerCase() || '';

    const batches = settings.batches || defaultBatches;
    let courseBatches = batches.filter(b => b.course === course);

    // Apply Active vs All Batches filter
    const todayStr = new Date().toISOString().split('T')[0];
    if (batchStatusFilter === 'active') {
        courseBatches = courseBatches.filter(b => {
            if (!b.endDate) return true; // Default to active if no endDate
            return b.endDate >= todayStr;
        });
    }

    if (searchQuery) {
        courseBatches = courseBatches.filter(b => b.name.toLowerCase().includes(searchQuery));
    }

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

    if (roster.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No students enrolled in this batch.</td></tr>`;
        return;
    }

    tbody.innerHTML = roster.map(st => `
        <tr>
            <td><strong>${st.id}</strong></td>
            <td>
                <div style="font-weight:600;">${st.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${st.address}</div>
            </td>
            <td>
                <div>Mob: ${st.phone}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Grd: ${st.guardianPhone || 'N/A'}</div>
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
            <td>
                <span class="badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}">${st.status}</span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-secondary btn-icon-only" onclick="openProfileModal('${st.id}')" title="View Full Profile"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn btn-secondary btn-icon-only" onclick="openPaymentModal('${st.id}')" title="Manage Fees & Print"><i class="fa-solid fa-wallet"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// --- STUDENT PROFILE DETAILS DIALOG ---
window.openProfileModal = function(id) {
    const st = students.find(s => s.id === id);
    if (!st) return;

    document.getElementById('prof-name').innerText = st.name;
    document.getElementById('prof-id').innerText = st.id;
    document.getElementById('prof-course').innerText = st.course;
    document.getElementById('prof-batch').innerText = st.batch || 'N/A';
    document.getElementById('prof-phone').innerText = st.phone;
    document.getElementById('prof-guardian').innerText = st.guardianPhone || 'N/A';
    document.getElementById('prof-father').innerText = st.fatherName || 'N/A';
    document.getElementById('prof-mother').innerText = st.motherName || 'N/A';
    document.getElementById('prof-address').innerText = st.address || 'N/A';

    document.getElementById('prof-fee-total').innerText = `৳${st.totalFee.toLocaleString()}`;
    document.getElementById('prof-fee-discount').innerText = `৳${(st.discountFee || 0).toLocaleString()}`;
    
    const net = st.netFee !== undefined ? st.netFee : (st.totalFee - (st.discountFee || 0));
    document.getElementById('prof-fee-net').innerText = `৳${net.toLocaleString()}`;
    document.getElementById('prof-fee-paid').innerText = `৳${st.paidFee.toLocaleString()}`;
    document.getElementById('prof-fee-due').innerText = `৳${st.dueFee.toLocaleString()}`;

    const badge = document.getElementById('prof-status-badge');
    if (badge) {
        badge.className = `badge badge-${st.status === 'Paid' ? 'success' : (st.status === 'Partial' ? 'warning' : 'danger')}`;
        badge.innerText = st.status;
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
            batchEndDate.value = endDate.toISOString().split('T')[0];
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
            
            if (settings.batches.some(b => b.course === course && b.name === name)) {
                alert(`Error: A batch named "${name}" already exists for "${course}".`);
                return;
            }
            
            if (!settings.batches) settings.batches = [];
            settings.batches.push({
                course: course,
                name: name,
                fee: fee,
                discount: discount,
                time: time,
                schedule: checkedDays,
                startDate: startDate,
                endDate: endDate
            });
            
            saveDatabase();
            closeAllModals();
            alert(`Batch "${name}" created successfully!`);
            
            // If on Batches tab, refresh list
            const activeTab = document.querySelector('.sidebar-item.active');
            if (activeTab && activeTab.getAttribute('data-tab') === 'batches') {
                renderBatchesList(selectedCourseForBatches);
            }
        });
    }
}

window.openBatchModal = function() {
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

    batchForm.reset();
    
    // Set course to Graphic Design first and trigger auto-fill
    batchCourse.value = "Graphic Design";
    batchNameField.value = getNextBatchName("Graphic Design");
    batchFeeField.value = settings.courseFees["Graphic Design"] || defaultFees["Graphic Design"];
    batchDiscountField.value = 0;
    batchTimeField.value = "09:00 AM - 10:30 AM";
    
    const today = new Date();
    batchStartDate.value = today.toISOString().split('T')[0];
    
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 3); // Graphic Design is 3 months
    batchEndDate.value = endDate.toISOString().split('T')[0];

    // Reset checkboxes to default (Sat, Mon, Wed checked)
    document.querySelectorAll('input[name="batch-days"]').forEach(cb => {
        if (cb.value === "Sat" || cb.value === "Mon" || cb.value === "Wed") {
            cb.checked = true;
        } else {
            cb.checked = false;
        }
    });

    openModal(batchModal);
};

function getNextBatchName(course) {
    const batches = settings.batches || defaultBatches;
    const courseBatches = batches.filter(b => b.course === course);
    
    let prefix = "GD-";
    if (course === "Basic Computer") prefix = "BC-";
    else if (course === "Spoken English") prefix = "SE-";
    
    if (courseBatches.length === 0) {
        return prefix + "01";
    }
    
    let maxNum = 0;
    courseBatches.forEach(b => {
        if (b.name.startsWith(prefix)) {
            const suffix = b.name.substring(prefix.length);
            const num = parseInt(suffix);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    
    const nextNum = maxNum + 1;
    return prefix + String(nextNum).padStart(2, '0');
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
                let raw = s.phone || '';
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
    let digits = rawPhone.replace(/\D/g, ''); // remove non-digits
    
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
        return new Date(dateStr);
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
        let start = dashboardDateRange.start;
        let end = dashboardDateRange.end;

        if (dashboardDateRange.type === 'today') {
            const todayStr = new Date().toISOString().split('T')[0];
            start = new Date(todayStr + 'T00:00:00');
            end = new Date(todayStr + 'T23:59:59');
        } else if (dashboardDateRange.type === 'month') {
            const now = new Date();
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        } else if (dashboardDateRange.type === 'year') {
            const now = new Date();
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        } else if (dashboardDateRange.type === 'last-year') {
            const now = new Date();
            start = new Date(now.getFullYear() - 1, 0, 1);
            end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        } else if (dashboardDateRange.type === 'custom') {
            if (start) start = new Date(start + 'T00:00:00');
            if (end) end = new Date(end + 'T23:59:59');
        }

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
    const endDateInput = document.getElementById('stats-end-date');

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
            if (endDateInput) endDateInput.value = '';

            refreshStats();
            renderRecentDashboard();
        });
    });

    if (customFilterBtn && startDateInput && endDateInput) {
        customFilterBtn.addEventListener('click', () => {
            const startVal = startDateInput.value;
            const endVal = endDateInput.value;

            if (!startVal && !endVal) {
                alert("Please select at least one boundary date for custom range.");
                return;
            }

            buttons.forEach(b => {
                b.className = "btn btn-secondary stat-filter-btn";
                b.classList.remove('btn-primary');
            });

            dashboardDateRange.type = 'custom';
            dashboardDateRange.start = startVal || null;
            dashboardDateRange.end = endVal || null;

            refreshStats();
            renderRecentDashboard();
        });
    }
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

    if (dashboardCollectDueBtn) dashboardCollectDueBtn.addEventListener('click', triggerDueModal);
    if (adminCollectDueBtn) adminCollectDueBtn.addEventListener('click', triggerDueModal);

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
                                    <span style="font-size:0.75rem; color:var(--text-muted);">${st.id} | ${st.course} | Mob: ${st.phone} | Guardian: ${st.guardianPhone || 'N/A'}</span>
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
                <span style="font-size:0.75rem; color:var(--text-muted);">${st.id} | ${st.course} | Mob: ${st.phone} | Guardian: ${st.guardianPhone || 'N/A'}</span>
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
                "Graphic Design": ["GD-01", "GD-02"],
                "Basic Computer": ["BC-01", "BC-02"],
                "Spoken English": ["SE-01", "SE-02"]
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
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div class="form-group" style="margin-bottom: 0;">
                    <label style="font-size: 0.7rem; margin-bottom: 0.15rem; display: block; color: var(--text-muted);">Net Fee (৳)</label>
                    <input type="number" class="form-control course-net-input" value="0" disabled style="padding: 0.25rem 0.4rem; font-size: 0.75rem; height: auto;">
                </div>
                ${bookCheckboxHtml || '<div style="display:block;"></div>'}
            </div>
        `;

        container.appendChild(row);

        const feeInput = row.querySelector('.course-fee-input');
        const discInput = row.querySelector('.course-discount-input');
        const paidInput = row.querySelector('.course-paid-input');
        const netInput = row.querySelector('.course-net-input');
        const batchSelect = row.querySelector('.course-batch-select');
        const bookCb = row.querySelector('.course-book-checkbox');

        function updateRowNet() {
            let fee = parseFloat(feeInput.value) || 0;
            const disc = parseFloat(discInput.value) || 0;
            
            if (bookCb && bookCb.checked) {
                netInput.value = fee - disc + 200;
            } else {
                netInput.value = fee - disc;
            }
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

    // Filter students based on selection: 'all', 'taken', 'not-taken'
    const filterSelect = document.getElementById('book-filter-status');
    const filterVal = filterSelect ? filterSelect.value : 'all';

    let displayStudents = basicComputerStudents;
    if (filterVal === 'taken') {
        displayStudents = basicComputerStudents.filter(s => s.takenBook === true);
    } else if (filterVal === 'not-taken') {
        displayStudents = basicComputerStudents.filter(s => s.takenBook !== true);
    }

    const tbody = document.getElementById('books-tbody');
    if (!tbody) return;

    if (displayStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No student records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = displayStudents.map(st => {
        const isTaken = st.takenBook === true;
        const statusBadge = isTaken 
            ? `<span class="badge badge-success" style="font-size:0.75rem;">Book Taken</span>` 
            : `<span class="badge badge-danger" style="font-size:0.75rem;">Pending</span>`;
            
        const actionButton = isTaken
            ? `<button class="btn btn-secondary btn-sm" onclick="toggleBookAllocation('${st.id}', false)" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Mark Pending</button>`
            : `<button class="btn btn-primary btn-sm" onclick="toggleBookAllocation('${st.id}', true)" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Give Book</button>`;

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
        st.dueFee += 200;
    } else {
        // Deduct book fee (৳200)
        st.totalFee = Math.max(0, st.totalFee - 200);
        if (st.netFee !== undefined) {
            st.netFee = Math.max(0, st.netFee - 200);
        } else {
            st.netFee = st.totalFee;
        }
        st.dueFee = Math.max(0, st.dueFee - 200);
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
