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
});

// --- THEME MANAGEMENT ---
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('ediz_theme', theme);

    // Get customized logo settings if any, otherwise use default
    const settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
    const lightLogoName = settings.lightLogo || 'Logo-07.png';
    const darkLogoName = settings.darkLogo || 'Logo-03.png';

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
            
            // Generate prefix-based ID based on course track
            let prefix = "EDIZ";
            if (course === "Graphic Design") prefix = "EDIZ-GD";
            else if (course === "Basic Computer") prefix = "EDIZ-BC";
            else if (course === "Spoken English") prefix = "EDIZ-SP";

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
            const nextNum = maxNum + 1;
            const sequence = String(nextNum).padStart(3, '0');
            const studentId = `${prefix}-${sequence}`;

            const newStudent = {
                id: studentId,
                name: name,
                phone: phone,
                fatherName: father,
                motherName: mother,
                guardianPhone: guardianPhone,
                address: address,
                course: course,
                batch: batchName,
                registrationDate: new Date().toISOString().split('T')[0],
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
    
    selectElem.innerHTML = '<option value="" disabled selected>-- Select Batch --</option>';
    if (courseBatches.length > 0) {
        courseBatches.forEach(b => {
            const discText = b.discount > 0 ? ` (Discount: ৳${b.discount})` : '';
            const timeText = b.time ? ` (${b.time})` : '';
            selectElem.innerHTML += `<option value="${b.name}">Name: ${b.name}${timeText} | Fee: ৳${b.fee - b.discount}${discText}</option>`;
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
        const students = JSON.parse(localStorage.getItem('ediz_students')) || [];
        const settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
        const batches = settings.batches || [];
        const matched = students.filter(s => s.id && isIdMatch(s.id, searchId));

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
                    certFooterHTML = `
                        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1rem; width: 100%; grid-column: 1 / -1;">
                            <span style="color: var(--success); font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 0.35rem;">
                                <i class="fa-solid fa-circle-check"></i> Certificate is ready!
                            </span>
                            <button class="btn btn-primary" onclick="printStudentCertificate('${student.id}')" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;">
                                <i class="fa-solid fa-print"></i> Print Digital Certificate
                            </button>
                        </div>
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
    const students = JSON.parse(localStorage.getItem('ediz_students')) || [];
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    const settings = JSON.parse(localStorage.getItem('ediz_settings')) || {};
    const batches = settings.batches || [];
    const batchObj = batches.find(b => b.course === st.course && b.name === st.batch);

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

    const origin = window.location.origin;
    let verifyURL = '';
    if (origin === 'null' || !origin || origin.startsWith('file')) {
        verifyURL = 'https://edizit.com/index.html?verify=' + st.id;
    } else {
        verifyURL = origin + window.location.pathname.split('?')[0] + '?verify=' + st.id;
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

    const printZone = document.getElementById('print-zone');
    if (printZone) {
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
    }
};
