// --- UTILITY FOR LOCAL DATE STRING ---
function getLocalDateString(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// --- DATASETS (SYLLABUS) ---
const syllabusData = {
    graphic: {
        title: "Graphic Design (3 Months, 36 Classes)",
        description: "Master industry-standard graphics tools and build a professional design portfolio for online freelancing.",
        timeline: [
            { title: "Phase 1: Adobe Illustrator Foundations (Class 1-12)", desc: "Understanding vectors, canvas setup, pen tool mastery, shapes construction, typography, color theory, corporate branding, and professional logo design." },
            { title: "Phase 2: Adobe Photoshop Editing (Class 13-24)", desc: "Understanding raster graphics, layers, image restoration, color correction, photo manipulation, background removal, flyer/brochure layouts, and social media post design." },
            { title: "Phase 3: Product Packaging & AI Integration (Class 25-30)", desc: "Learn packaging dimensions, label templates, 3D mockups. Use generative AI tools (Midjourney, ChatGPT, vector AI engines) to speed up layouts." },
            { title: "Phase 4: Behance Portfolio & Freelancing (Class 31-36)", desc: "Create a professional Behance/Dribbble portfolio. Build Fiverr and Upwork profiles, optimize gigs, learn pricing, client communication, and order delivery." }
        ]
    },
    basic: {
        title: "Basic Computer Literacy (2 Months)",
        description: "Develop core office computational skills and rapid Bengali/English keyboard typing speeds.",
        timeline: [
            { title: "Week 1-2: OS Fundamentals & Typing Skills", desc: "Understanding Windows structure, file explorer operations, shortcut keys, and building dual-language keyboard speeds using Bijoy 52 and Avro layouts." },
            { title: "Week 3-4: Microsoft Word for Documentation", desc: "Document formatting, paragraph alignments, headers/footers, inserting tables/graphs, writing professional resumes (CV), cover letters, and official memos." },
            { title: "Week 5-6: Microsoft Excel for Spreadsheets", desc: "Data sheet entries, cell formatting, mathematical calculations (Sum, Average, Percentage), advanced logical formulas (IF statements), and visual chart layouts." },
            { title: "Week 7: Microsoft PowerPoint for Presentations", desc: "Designing attractive presentation slides, customizing themes, transitions, animations, and learning public presenting techniques." },
            { title: "Week 8: Internet Operations & ChatGPT AI Utility", desc: "Cybersecurity rules, email composition, online document management, and leveraging ChatGPT/AI assistants for daily administrative productivity." }
        ]
    },
    english: {
        title: "Spoken English & Communication (2 Months)",
        description: "Overcome speaking anxiety, develop conversational accents, and excel in career interviews.",
        timeline: [
            { title: "Week 1-2: English Grammar & Listening Foundations", desc: "Interactive sentence building rules, parts of speech application, tense configurations, and active listening audio exercises." },
            { title: "Week 3-4: Vocabulary Building & Pronunciation Drills", desc: "Pronunciation phonetics, daily routine conversational vocabulary, interactive communication scripts, and slang/idioms reduction." },
            { title: "Week 5-6: Public Speaking & Group Discussions", desc: "Impromptu speech sessions, debating structures, body language optimization, and collaborative group discussions to build confidence." },
            { title: "Week 7: Job Interview Preparation & Interview Mock Tests", desc: "Answering standard interview questions, explaining achievements, roleplay interviews, and individual performance critiques." },
            { title: "Week 8: Final Assessments & Oral Certification Exams", desc: "Simulated real-world communication exams and comprehensive spoken assessments to measure fluency progress." }
        ]
    }
};

// --- DEFAULT SETTINGS ---
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

// --- DOM ELEMENTS ---
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
const navLogo = document.getElementById('nav-logo');
const footerLogo = document.getElementById('footer-logo');

const enrollmentModal = document.getElementById('enrollment-modal');
const syllabusModal = document.getElementById('syllabus-modal');
const syllabusTitle = document.getElementById('syllabus-modal-title');
const syllabusContent = document.getElementById('syllabus-content');

const enrollmentForm = document.getElementById('enrollment-form');
const contactForm = document.getElementById('contact-form');

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Force reset to original unmigrated IDs from database_backup.js if not already done
    if (!localStorage.getItem('ediz_students_restored_v11') && window.migratedDatabase) {
        localStorage.setItem('ediz_students', JSON.stringify(window.migratedDatabase.students));
        localStorage.setItem('ediz_settings', JSON.stringify(window.migratedDatabase.settings));
        localStorage.setItem('ediz_students_restored_v11', 'true');
    }
    // 1. Initialize Theme from Local Storage
    const savedTheme = localStorage.getItem('ediz_theme') || 'light';
    setTheme(savedTheme);

    // 2. Set Up Click Handlers for Modals
    setupModalListeners();

    // 3. Set Up Form Submissions
    setupFormListeners();

    // 4. Update Settings (Phone numbers etc.) if they exist in localStorage
    loadCustomSettings();

    // 5. Course batch dynamic loading bindings
    const enrollCourseSelect = document.getElementById('enroll-course');
    const enrollBatchSelect = document.getElementById('enroll-batch');
    if (enrollCourseSelect && enrollBatchSelect) {
        enrollCourseSelect.addEventListener('change', () => {
            updateEnrollBatches(enrollCourseSelect.value, enrollBatchSelect);
        });
    }

    // 6. Setup Certificate and Student ID Verification Portal
    setupVerificationPortal();

    // 7. Setup Mobile Navigation Menu
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }
    // 8. Sync data with server
    syncWithServer();
});

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
                // Save to localStorage for client-side queries
                localStorage.setItem('ediz_students', JSON.stringify(data.students));
                localStorage.setItem('ediz_settings', JSON.stringify(data.settings));
                localStorage.setItem('ediz_book_stock', data.bookStock || 0);
                
                // Reapply settings in UI
                loadCustomSettings();
                
                // Update batch dropdowns if present
                const enrollCourseSelect = document.getElementById('enroll-course');
                const enrollBatchSelect = document.getElementById('enroll-batch');
                if (enrollCourseSelect && enrollBatchSelect && enrollCourseSelect.value) {
                    updateEnrollBatches(enrollCourseSelect.value, enrollBatchSelect);
                }
                console.log("Database synchronized with server.");
            }
        })
        .catch(err => {
            console.log("Offline mode or api.php not available. Using local cache:", err);
        });
}

// --- THEME MANAGEMENT ---
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('ediz_theme', theme);

    // Get customized logo settings if any, otherwise use default
    const settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
    const lightLogoName = settings.lightLogo || 'Logo-03.png';
    const darkLogoName = settings.darkLogo || 'Logo-04.png';

    if (theme === 'dark') {
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
            themeToggle.title = 'Switch to Light Mode';
        }
        if (navLogo) navLogo.src = darkLogoName;
        if (footerLogo) footerLogo.src = darkLogoName;
    } else {
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-moon';
            themeToggle.title = 'Switch to Dark Mode';
        }
        if (navLogo) navLogo.src = lightLogoName;
        if (footerLogo) footerLogo.src = lightLogoName;
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });
}

// --- MODAL UTILITIES ---
function setupModalListeners() {
    // Open Enrollment Modal
    document.querySelectorAll('.open-enrollment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseSelect = e.currentTarget.getAttribute('data-course-select');
            const selectElement = document.getElementById('enroll-course');
            
            if (selectElement && courseSelect) {
                if (courseSelect === 'graphic') selectElement.value = 'Graphic Design';
                else if (courseSelect === 'basic') selectElement.value = 'Basic Computer';
                else if (courseSelect === 'english') selectElement.value = 'Spoken English';
                selectElement.dispatchEvent(new Event('change'));
            }
            openModal(enrollmentModal);
        });
    });

    // Open Syllabus Modal
    document.querySelectorAll('.view-syllabus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseKey = e.currentTarget.getAttribute('data-course');
            renderSyllabus(courseKey);
            openModal(syllabusModal);
        });
    });

    // Close buttons
    document.querySelectorAll('.modal-close, .modal-close-btn, .modal-backdrop').forEach(elem => {
        elem.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Escape Key close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });
}

function openModal(modal) {
    if (modal) modal.classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
}

// --- SYLLABUS RENDERER ---
function renderSyllabus(courseKey) {
    const course = syllabusData[courseKey];
    if (!course) return;

    syllabusTitle.innerText = course.title;
    
    let htmlContent = `
        <p style="margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.95rem;">${course.description}</p>
        <div class="syllabus-timeline">
    `;

    course.timeline.forEach(item => {
        htmlContent += `
            <div class="timeline-item">
                <h4 class="timeline-title">${item.title}</h4>
                <p class="timeline-desc">${item.desc}</p>
            </div>
        `;
    });

    htmlContent += `</div>`;
    syllabusContent.innerHTML = htmlContent;
}

// --- FORM HANDLING ---
function setupFormListeners() {
    // Public Enrollment Form
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const course = document.getElementById('enroll-course').value;
            const batchName = document.getElementById('enroll-batch').value;
            const name = document.getElementById('enroll-name').value;
            const phone = document.getElementById('enroll-phone').value;
            const father = document.getElementById('enroll-father').value;
            const mother = document.getElementById('enroll-mother').value;
            const guardianPhone = document.getElementById('enroll-guardian-phone').value;
            const address = document.getElementById('enroll-address').value;

            // Load pricing settings if customized
            const settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
            const batches = settings.batches || defaultBatches;
            const matchedBatch = batches.find(b => b.course === course && b.name === batchName);

            let baseFee = settings.courseFees ? (settings.courseFees[course] || defaultFees[course]) : defaultFees[course];
            let discountFee = 0;

            if (matchedBatch) {
                baseFee = matchedBatch.fee;
                discountFee = matchedBatch.discount;
            }

            const netFee = baseFee - discountFee;

            // Retrieve database or create new
            const students = JSON.parse(localStorage.getItem('ediz_students')) || [];
            
            // Generate prefix-based ID based on course track with legacy database compatibility
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
            students.forEach(s => {
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
            const sequence = nextNum < 10 ? String(nextNum).padStart(2, '0') : String(nextNum);
            const studentId = `${prefix}-${sequence}`;

            // Find if student already has a Registration ID
            const cleanName = name.toLowerCase().trim().replace(/\s+/g, '');
            const cleanPhone = phone.replace(/\D/g, '');
            const existingStudent = students.find(s => {
                const sName = (s.name || '').toLowerCase().trim().replace(/\s+/g, '');
                const sPhone = (s.phone || '').replace(/\D/g, '');
                return sName === cleanName && sPhone === cleanPhone && s.registrationId;
            });

            let registrationId;
            if (existingStudent) {
                registrationId = existingStudent.registrationId;
            } else {
                let maxRegId = 1000;
                students.forEach(s => {
                    if (s.registrationId) {
                        const match = s.registrationId.match(/^REG-(\d+)$/);
                        if (match) {
                            const val = parseInt(match[1], 10);
                            if (val > maxRegId) maxRegId = val;
                        }
                    }
                });
                registrationId = `REG-${maxRegId + 1}`;
            }

            const newStudent = {
                registrationId: registrationId,
                id: studentId,
                name: name,
                phone: phone,
                fatherName: father,
                motherName: mother,
                guardianPhone: guardianPhone,
                address: address,
                course: course,
                batch: batchName,
                registrationDate: getLocalDateString(),
                status: 'Unpaid', // Status: Unpaid, Paid, Partial
                totalFee: baseFee,
                discountFee: discountFee,
                netFee: netFee,
                paidFee: 0,
                dueFee: netFee,
                invoices: [],
                certified: false,
                certificateDate: ''
            };

            students.push(newStudent);
            localStorage.setItem('ediz_students', JSON.stringify(students));

            // Sync new student registration to Hostinger PHP server database
            const dbPayload = {
                students: students,
                settings: settings,
                bookStock: parseInt(localStorage.getItem('ediz_book_stock')) || 0
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
                console.log("Registration successfully synchronized to server:", res);
            })
            .catch(err => {
                console.warn("Failed to synchronize registration to server:", err);
            });

            // Show Confirmation
            alert(`Application Submitted Successfully!\nYour temporary registration ID is ${studentId}. Our admission desk will contact you soon.`);
            
            // Clean up
            enrollmentForm.reset();
            closeAllModals();
        });
    }

    // Direct Inquiry Form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! Ediz IT support team will respond to your query via phone/email shortly.');
            contactForm.reset();
        });
    }
}

// --- LOAD CUSTOM SETTINGS ---
function loadCustomSettings() {
    const settings = JSON.parse(localStorage.getItem('ediz_settings'));
    if (settings && settings.phone) {
        document.querySelectorAll('.dummy-phone').forEach(el => {
            el.innerText = settings.phone;
        });
    }
}

// --- DYNAMIC BATCH POPULATOR ---
function updateEnrollBatches(course, selectElem) {
    const settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
    const batches = settings.batches || defaultBatches;
    
    // Filter batches for selected course
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
            const discText = b.discount > 0 ? ` (Discount: ৳${b.discount})` : '';
            const timeText = b.time ? ` (${b.time})` : '';
            selectElem.innerHTML += `<option value="${b.name}">Name: ${b.name}${timeText} | Fee: ৳${b.fee - b.discount}${discText}</option>`;
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

// --- CERTIFICATE / STUDENT ID VERIFICATION ---
function setupVerificationPortal() {
    const verifyForm = document.getElementById('verify-form');
    const verifyIdInput = document.getElementById('verify-id');
    const verifyResultContainer = document.getElementById('verify-result');

    if (!verifyForm || !verifyIdInput || !verifyResultContainer) return;

    verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchId = verifyIdInput.value.trim();

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

        const normSearch = normalizeIdForSearch(searchId);

        function isIdMatch(stId, searchInput) {
            const normId = normalizeIdForSearch(stId);
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

        // Load students database
        let students = JSON.parse(localStorage.getItem('ediz_students')) || [];
        let settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
        
        const localMatched = students.filter(s => s.id && isIdMatch(s.id, searchId));
        let matched = localMatched;
        
        if (localMatched.length === 0 && window.migratedDatabase && window.migratedDatabase.students) {
            matched = window.migratedDatabase.students.filter(s => s.id && isIdMatch(s.id, searchId));
            if (matched.length > 0 && window.migratedDatabase.settings) {
                settings = window.migratedDatabase.settings;
            }
        }
        
        const batches = settings.batches || [];

        verifyResultContainer.style.display = 'block';

        if (matched.length > 0) {
            let htmlContent = matched.map(student => {
                const isCertified = student.certified === true;
                const statusText = isCertified ? 'Verified Graduate' : 'Active Student';
                const statusIcon = isCertified ? 'fa-award' : 'fa-user-check';
                
                // Format dates cleanly
                const regDate = student.registrationDate || 'N/A';
                const certDate = isCertified ? (student.certificateDate || 'N/A') : 'N/A';

                const batchObj = batches.find(b => b.course === student.course && b.name === student.batch);
                const startDate = batchObj ? batchObj.startDate : 'N/A';
                const endDate = batchObj ? batchObj.endDate : 'N/A';

                // Determine layout footer based on graduation status
                let certFooterHTML = '';
                if (isCertified) {
                    const date = new Date(student.certificateDate || new Date());
                    const day = date.getDate();
                    const month = date.toLocaleString("en-GB", { month: "long" });
                    const year = date.getFullYear();
                    const suffix = day > 3 && day < 21 ? 'th' : ['st', 'nd', 'rd'][day % 10 - 1] || 'th';
                    const formattedIssueDate = `${day}${suffix} ${month}, ${year}`;
                    
                    const formatCourseDate = (dateStr) => {
                        if (!dateStr) return 'TBA';
                        const d = new Date(dateStr);
                        if (isNaN(d.getTime())) return dateStr.toUpperCase();
                        const dy = d.getDate();
                        const mth = d.toLocaleString("en-GB", { month: "long" });
                        const yr = d.getFullYear();
                        const sfx = dy > 3 && dy < 21 ? 'th' : ['st', 'nd', 'rd'][dy % 10 - 1] || 'th';
                        return `${dy}${sfx} ${mth}, ${yr}`;
                    };

                    const fathersName = student.fatherName || '';
                    const mothersName = student.motherName || '';
                    const hasFather = fathersName && fathersName.toUpperCase() !== 'N/A';
                    const hasMother = mothersName && mothersName.toUpperCase() !== 'N/A';
                    
                    let pronoun = "SON OF";
                    if (student.gender && student.gender.toLowerCase() === 'female') {
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
                    
                    const line2 = `COMPLETED THE ${(student.course || '').toUpperCase()} COURSE HELD ON`;
                    const line3 = `${formatCourseDate(batchObj ? batchObj.startDate : '')} TO ${formatCourseDate(batchObj ? batchObj.endDate : '')} AT EDIZ IT INSTITUTE`;

                    const origin = window.location.origin;
                    let verifyURL = '';
                    if (origin === 'null' || !origin || origin.startsWith('file')) {
                        verifyURL = 'verify.html?verify=' + student.id;
                    } else {
                        const basePath = window.location.pathname.replace('index.html', '').replace('verify.html', '');
                        verifyURL = origin + (basePath.endsWith('/') ? basePath : basePath + '/') + 'verify.html?verify=' + student.id;
                    }
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(verifyURL)}`;

                    const coordinator = student.coordinator || "Mahi Rahman";
                    let coordinatorSignPath = "Certificate/mahi-signature.png";
                    if (coordinator.toLowerCase().includes("tariq")) {
                        coordinatorSignPath = "Certificate/tariqsign.png";
                    }
                    
                    let coordinatorTitle = "Instructor";
                    let rightSideSubtitle = (student.course || '').toUpperCase();
                    if (coordinator.toLowerCase().includes("mahi")) {
                        coordinatorTitle = "Founder and CEO";
                        rightSideSubtitle = "EDIZ IT INSTITUTE";
                    }

                    let replacedSvg = '';
                    if (window.certificateSVGTemplate) {
                        replacedSvg = window.certificateSVGTemplate
                            .replace(/__NAME__/g, student.name.toUpperCase())
                            .replace(/__ID__/g, student.id)
                            .replace(/__ISSUE_DATE__/g, formattedIssueDate)
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
                    }

                    certFooterHTML = `
                        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1rem; width: 100%; grid-column: 1 / -1;">
                            <span style="color: var(--success); font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 0.35rem;">
                                <i class="fa-solid fa-circle-check"></i> Certificate is verified!
                            </span>
                            <button class="btn btn-primary" onclick="printStudentCertificate('${student.id}')" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;">
                                <i class="fa-solid fa-print"></i> Print or Download PDF
                            </button>
                        </div>
                        
                        ${replacedSvg ? `
                        <div class="certificate-preview" style="margin-top: 1.5rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: #fff; width: 100%; grid-column: 1 / -1; box-shadow: var(--shadow-md);">
                            <div style="background: var(--surface); padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); font-weight: 600; font-size: 0.85rem; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fa-solid fa-eye" style="color: var(--primary);"></i> Online Certificate Preview
                            </div>
                            <div style="padding: 1rem; display: flex; justify-content: center; align-items: center; overflow-x: auto; background: #f8fafc;">
                                <div style="width: 100%; max-width: 800px; aspect-ratio: 297/210; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); background: #fff;">
                                    ${replacedSvg}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    `;
                } else {
                    certFooterHTML = `
                        <div style="margin-top: 1.5rem; padding: 1rem; border-radius: var(--radius-sm); background: rgba(79, 70, 229, 0.05); border: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.85rem; width: 100%; grid-column: 1 / -1;">
                            <i class="fa-solid fa-circle-info"></i> Your course is currently in progress. The certificate will be generated and issued upon successful course completion.
                        </div>
                    `;
                }

                return `
                    <div style="padding: 1.5rem; border-radius: var(--radius-md); background: rgba(79, 70, 229, 0.05); border: 1px solid var(--border-color); margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0;">${student.name}</h3>
                                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.15rem 0 0 0;">Student ID: <strong>${student.id}</strong></p>
                            </div>
                            <span class="badge ${isCertified ? 'badge-warning' : 'badge-primary'}" style="padding: 0.35rem 0.85rem; font-size: 0.75rem; background: ${isCertified ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--primary-glow)'}; color: ${isCertified ? '#fff' : 'var(--primary)'}; border: none;">
                                <i class="fa-solid ${statusIcon}"></i> ${statusText}
                            </span>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-size: 0.85rem;">
                            <div>
                                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Enrolled Course</span>
                                <strong style="color: var(--text-main);">${student.course}</strong>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Batch Name</span>
                                <strong style="color: var(--text-main);">${student.batch || 'N/A'}</strong>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Course Timeline</span>
                                <strong style="color: var(--text-main);">${startDate} to ${endDate}</strong>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Father's Name</span>
                                <span style="color: var(--text-main); font-weight: 500;">${student.fatherName || 'N/A'}</span>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Mother's Name</span>
                                <span style="color: var(--text-main); font-weight: 500;">${student.motherName || 'N/A'}</span>
                            </div>
                            <div>
                                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Registration Date</span>
                                <span style="color: var(--text-main); font-weight: 500;">${regDate}</span>
                            </div>
                            ${isCertified ? `
                            <div>
                                <span style="color: var(--text-muted); display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Certificate Date</span>
                                <span style="color: var(--text-main); font-weight: 500;">${certDate}</span>
                            </div>
                            ` : ''}
                            ${certFooterHTML}
                        </div>
                    </div>
                `;
            }).join('');
            
            verifyResultContainer.innerHTML = htmlContent;
            
            // Show verification modal popup
            const verifyModal = document.getElementById('verification-modal');
            const verifyModalBody = document.getElementById('verification-modal-body');
            if (verifyModal && verifyModalBody) {
                verifyModalBody.innerHTML = htmlContent;
                verifyModal.classList.add('active');
            }
        } else {
            verifyResultContainer.innerHTML = `
                <div style="padding: 1.25rem; border-radius: var(--radius-md); background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--danger); text-align: center; font-size: 0.9rem;">
                    <i class="fa-solid fa-circle-exclamation"></i> <strong>Verification Failed:</strong> Student ID "${searchId}" was not found. Please verify the ID format and try again.
                </div>
            `;
        }
    });

    // Auto-trigger search if query parameter 'verify' is present
    const urlParams = new URLSearchParams(window.location.search);
    const verifyId = urlParams.get('verify');
    if (verifyId) {
        verifyIdInput.value = verifyId;
        verifyForm.dispatchEvent(new Event('submit'));
        const verifySection = document.getElementById('verify');
        if (verifySection) {
            setTimeout(() => {
                verifySection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }
}

// --- STUDENT SELF-PRINT CERTIFICATE ENGINE ---
window.printStudentCertificate = function(studentId) {
    let students = JSON.parse(localStorage.getItem('ediz_students')) || [];
    let st = students.find(s => s.id === studentId);
    
    // Fallback to migratedDatabase
    if (!st && window.migratedDatabase && window.migratedDatabase.students) {
        st = window.migratedDatabase.students.find(s => s.id === studentId);
    }
    if (!st) return;

    let settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
    if (Object.keys(settings).length === 0 && window.migratedDatabase && window.migratedDatabase.settings) {
        settings = window.migratedDatabase.settings;
    }
    const batches = settings.batches || [];
    const batchObj = batches.find(b => b.course === st.course && b.name === st.batch);

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

    const origin = window.location.origin;
    let verifyURL = '';
    if (origin === 'null' || !origin || origin.startsWith('file')) {
        verifyURL = 'verify.html?verify=' + st.id;
    } else {
        const basePath = window.location.pathname.replace('index.html', '').replace('verify.html', '');
        verifyURL = origin + (basePath.endsWith('/') ? basePath : basePath + '/') + 'verify.html?verify=' + st.id;
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

    const printZone = document.getElementById('print-zone');
    if (!printZone) return;

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
