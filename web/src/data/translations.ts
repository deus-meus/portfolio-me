export type Language = 'en' | 'id';

export interface Translations {
  // Navigation & Status Banner
  status: string;
  statusText: string;
  locationText: string;
  noticePeriodText: string;
  emailDirectly: string;
  backendPos: string;
  navOverview: string;
  navTechStack: string;
  navCaseStudies: string;
  navExperience: string;
  navEducation: string;
  navApiPlayground: string;
  downloadCv: string;
  contactBtn: string;
  directContact: string;

  // Hero Section
  roleBadge: string;
  heroHeadline: string;
  heroBio: string;
  yearsExp: string;
  yearsExpSub: string;
  coreFocusLabel: string;
  coreFocusVal: string;
  databasesLabel: string;
  databasesVal: string;
  databasesSub: string;
  asyncFlowLabel: string;
  asyncFlowVal: string;
  asyncFlowSub: string;

  // Recruiter Quick Card
  recruiterCardTitle: string;
  recruiterSnapshot: string;
  openToWork: string;
  targetRoleLabel: string;
  targetRoleVal: string;
  primaryStackLabel: string;
  productionGrade: string;
  noticePeriodLabel: string;
  noticePeriodVal: string;
  noticePeriodSub: string;
  locationLabel: string;
  locationVal: string;
  expLabel: string;

  // Tech Stack Section
  techStackTag: string;
  techStackTitle: string;
  techStackDesc: string;
  catLanguages: string;
  catLanguagesBadge: string;
  catLanguagesDesc: string;
  catFrameworks: string;
  catFrameworksBadge: string;
  catFrameworksDesc: string;
  catDatabases: string;
  catDatabasesBadge: string;
  catDatabasesDesc: string;
  catQueues: string;
  catQueuesBadge: string;
  catQueuesDesc: string;
  catDevops: string;
  catDevopsBadge: string;
  catDevopsDesc: string;
  catObservability: string;
  catObservabilityBadge: string;
  catObservabilityDesc: string;

  // Case Studies Section
  caseStudiesTag: string;
  caseStudiesTitle: string;
  caseStudiesDesc: string;
  colProblems: string;
  colSolution: string;
  colResults: string;
  githubRepo: string;
  archBlueprint: string;

  // Case Studies Data Overrides (Indonesian STAR Content)
  caseStudyOverrides: Record<string, {
    title?: string;
    domain_category?: string;
    badge_label?: string;
    problems_challenges?: string[];
    architecture_solution?: string[];
    metrics?: { label: string; value: string; delta: string }[];
  }>;

  // Experience Section
  expTag: string;
  expTitle: string;
  expDesc: string;
  coreFocusPrefix: string;
  presentLabel: string;
  expOverrides: Record<string, {
    role_title?: string;
    company_tagline?: string;
    employment_type?: string;
    location?: string;
    core_focus?: string;
    achievements?: { number: string; title: string; metric: string; description: string }[];
  }>;

  // Credentials / Education Section
  credTag: string;
  credTitle: string;
  credDesc: string;
  verifiedBadge: string;
  issuedLabel: string;
  credOverrides: Record<string, {
    title?: string;
    issuer?: string;
  }>;

  // API Playground Section
  apiTag: string;
  apiTitle: string;
  apiDesc: string;
  telemetryTitle: string;
  serverUptime: string;
  goroutines: string;
  heapAlloc: string;
  gcCycles: string;
  simulatorTitle: string;
  providerLabel: string;
  eventTypeLabel: string;
  payloadLabel: string;
  sigLabel: string;
  sigPlaceholder: string;
  dispatchBtn: string;
  dispatchingBtn: string;
  hmacEvaluator: string;
  sigValid: string;
  sigInvalid: string;
  execLatency: string;
  providedSig: string;
  expectedSig: string;

  // Footer
  footerSub: string;
  apiOnline: string;
  topBtn: string;
  rightsReserved: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation & Status Banner
    status: "READY FOR INTERVIEWS",
    statusText: "AVAILABLE FOR OPPORTUNITIES",
    locationText: "Denpasar, Bali • Open to On-site, Hybrid & Remote (Relocation OK)",
    noticePeriodText: "Notice Period: 1 Month / Immediate",
    emailDirectly: "Email Directly →",
    backendPos: "Backend Developer Positions",
    navOverview: "Overview",
    navTechStack: "Tech Stack",
    navCaseStudies: "Case Studies",
    navExperience: "Experience",
    navEducation: "Education",
    navApiPlayground: "API Playground",
    downloadCv: "CV (PDF)",
    contactBtn: "Contact",
    directContact: "Direct Contact",

    // Hero Section
    roleBadge: "BACKEND DEVELOPER",
    heroHeadline: "Engineering Reliable RESTful APIs & Scalable Backend Systems.",
    heroBio: "Backend Developer experienced in building backend systems using NestJS and Node.js, including real-time systems (Socket.IO) and data management with PostgreSQL, MongoDB, and Redis. Familiar with observability infrastructure (Grafana, Loki) and object storage (MinIO). Seeking a Backend Developer role.",
    yearsExp: "2+ Years",
    yearsExpSub: "Backend Dev",
    coreFocusLabel: "Core Focus",
    coreFocusVal: "REST APIs",
    databasesLabel: "Databases",
    databasesVal: "Mongo & Redis",
    databasesSub: "Document & Cache",
    asyncFlowLabel: "Async Flow",
    asyncFlowVal: "Queues & Workers",
    asyncFlowSub: "Background Jobs",

    // Recruiter Quick Card
    recruiterCardTitle: "RECRUITER QUICK CARD",
    recruiterSnapshot: "Verified Candidate Snapshot",
    openToWork: "Open to Work",
    targetRoleLabel: "TARGET ROLE",
    targetRoleVal: "Backend Developer / Software Engineer",
    primaryStackLabel: "PRIMARY PRODUCTION STACK",
    productionGrade: "Production Grade",
    noticePeriodLabel: "NOTICE PERIOD",
    noticePeriodVal: "1 Month / Immediate",
    noticePeriodSub: "Negotiable",
    locationLabel: "LOCATION & BASE",
    locationVal: "Denpasar, Bali • Open to On-site, Hybrid & Remote (Relocation OK)",
    expLabel: "EXPERIENCE",

    // Tech Stack Section
    techStackTag: "[01] TECH STACK & TECHNICAL EXPERTISE",
    techStackTitle: "Backend Architecture Specialization",
    techStackDesc: "Production-tested frameworks, data stores, and queue architectures engineered under high-concurrency workloads.",
    catLanguages: "Languages & Runtimes",
    catLanguagesBadge: "CORE SYNTAX",
    catLanguagesDesc: "High-concurrency languages and efficient runtime engines.",
    catFrameworks: "Frameworks & Protocols",
    catFrameworksBadge: "FAST EXECUTION",
    catFrameworksDesc: "High-throughput HTTP routers, RPC transports, and microservice foundations.",
    catDatabases: "Databases & Storage",
    catDatabasesBadge: "OLTP & MEMORY",
    catDatabasesDesc: "ACID relational schemas, distributed in-memory caching, and hybrid stores.",
    catQueues: "Messaging & Queues",
    catQueuesBadge: "EVENT-DRIVEN",
    catQueuesDesc: "Reliable asynchronous brokers providing at-least-once processing guarantees.",
    catDevops: "DevOps & Infra",
    catDevopsBadge: "CONTAINERIZATION",
    catDevopsDesc: "Containerized microservices and automated GitOps CI/CD delivery pipelines.",
    catObservability: "Observability & Testing",
    catObservabilityBadge: "SRE & QUALITY",
    catObservabilityDesc: "Structured telemetry, metric monitors, and automated AAA test suites.",

    // Case Studies Section
    caseStudiesTag: "[02] PRODUCTION CASE STUDIES (STAR FORMAT)",
    caseStudiesTitle: "Production System Case Studies",
    caseStudiesDesc: "Real-world backend projects demonstrating Clean Architecture, asynchronous queues, database optimization, and type-safe APIs.",
    colProblems: "01. Problems & Challenges",
    colSolution: "02. Architecture Solution",
    colResults: "03. Tested Impact & Results",
    githubRepo: "GitHub Repository",
    archBlueprint: "Architecture Blueprint",

    caseStudyOverrides: {},

    // Experience Section
    expTag: "[03] WORK HISTORY",
    expTitle: "Professional Experience",
    expDesc: "Track record of backend technical execution, monolithic decomposition, and large-scale architectural ownership.",
    coreFocusPrefix: "Core Focus: ",
    presentLabel: "Present",

    expOverrides: {},

    // Credentials Section
    credTag: "[04] CREDENTIALS & QUALIFICATIONS",
    credTitle: "Certifications & Education",
    credDesc: "Formal education background in software engineering and verified technical specializations.",
    verifiedBadge: "Verified",
    issuedLabel: "Issued: ",
    credOverrides: {},

    // API Playground Section
    apiTag: "[05] INTERACTIVE BACKEND & WEBHOOK PLAYGROUND",
    apiTitle: "Live System Telemetry & Webhook Simulator",
    apiDesc: "Test real Go backend runtime queries and simulate cryptographically signed webhooks live in the browser.",
    telemetryTitle: "RUNTIME ENGINE TELEMETRY",
    serverUptime: "Server Uptime",
    goroutines: "Goroutines",
    heapAlloc: "Heap Alloc",
    gcCycles: "GC Cycles",
    simulatorTitle: "HMAC-SHA256 WEBHOOK INGESTION SIMULATOR",
    providerLabel: "Webhook Provider",
    eventTypeLabel: "Event Type",
    payloadLabel: "JSON Event Payload",
    sigLabel: "Custom Signature (Optional — leave blank to auto-calculate valid HMAC)",
    sigPlaceholder: "e.g. test invalid signature to simulate tamper detection",
    dispatchBtn: "DISPATCH & VERIFY SIGNATURE",
    dispatchingBtn: "DISPATCHING...",
    hmacEvaluator: "Zero-Allocation HMAC Evaluator",
    sigValid: "SIGNATURE VALIDATED (200 OK)",
    sigInvalid: "SIGNATURE MISMATCH / TAMPERED (400)",
    execLatency: "Execution Latency: ",
    providedSig: "Provided: ",
    expectedSig: "Expected: ",

    // Footer
    footerSub: "Engineered with Go Clean Architecture, SQLite WAL, and Swiss Precision React UI.",
    apiOnline: "API Online: 99.95% SLA",
    topBtn: "Top",
    rightsReserved: "All rights reserved. Built with Go & React.",
  },
  id: {
    // Navigation & Status Banner
    status: "SIAP BEKERJA (AVAILABLE)",
    statusText: "TERBUKA UNTUK PELUANG KERJA",
    locationText: "Denpasar, Bali • Siap WFO (On-site), Hybrid & Remote (Siap Relokasi)",
    noticePeriodText: "Masa Notice: 1 Bulan / Langsung Siap",
    emailDirectly: "Kirim Email Langsung →",
    backendPos: "Posisi Backend Developer",
    navOverview: "Ringkasan",
    navTechStack: "Keahlian",
    navCaseStudies: "Studi Kasus",
    navExperience: "Pengalaman",
    navEducation: "Pendidikan",
    navApiPlayground: "Uji API",
    downloadCv: "CV (PDF)",
    contactBtn: "Kontak",
    directContact: "Kontak Langsung",

    // Hero Section
    roleBadge: "BACKEND DEVELOPER",
    heroHeadline: "Mengembangkan RESTful API Handal & Arsitektur Backend Berskala Besar.",
    heroBio: "Backend Developer berfokus pada pengembangan sistem berskala produksi menggunakan NestJS & Node.js, pemrosesan real-time (Socket.IO), serta manajemen data dengan PostgreSQL, MongoDB, dan Redis. Terbiasa mengelola infrastruktur observabilitas (Grafana, Loki) dan object storage (MinIO). Siap berkontribusi sebagai Backend Developer.",
    yearsExp: "2+ Tahun",
    yearsExpSub: "Backend Dev",
    coreFocusLabel: "Fokus Utama",
    coreFocusVal: "REST APIs",
    databasesLabel: "Basis Data",
    databasesVal: "Mongo & Redis",
    databasesSub: "Dokumen & Caching",
    asyncFlowLabel: "Alur Asinkron",
    asyncFlowVal: "Queue & Worker",
    asyncFlowSub: "Background Job",

    // Recruiter Quick Card
    recruiterCardTitle: "RINGKASAN REKRUTER",
    recruiterSnapshot: "Profil Ringkas Kandidat Terverifikasi",
    openToWork: "Siap Bekerja",
    targetRoleLabel: "POSISI INCARAN",
    targetRoleVal: "Backend Developer / Software Engineer",
    primaryStackLabel: "TECH STACK UTAMA PRODUKSI",
    productionGrade: "Standar Produksi",
    noticePeriodLabel: "MASA NOTICE",
    noticePeriodVal: "1 Bulan / Langsung Siap",
    noticePeriodSub: "Dapat Dinegosiasikan",
    locationLabel: "LOKASI & DOMISILI",
    locationVal: "Denpasar, Bali • Siap WFO (On-site), Hybrid & Remote (Siap Relokasi)",
    expLabel: "PENGALAMAN",

    // Tech Stack Section
    techStackTag: "[01] TECH STACK & KEAHLIAN TEKNIS",
    techStackTitle: "Spesialisasi Arsitektur Backend",
    techStackDesc: "Framework, penyimpan data, dan antrean pesan teruji di lingkungan produksi dengan konkurensi tinggi.",
    catLanguages: "Bahasa Pemrograman & Runtime",
    catLanguagesBadge: "SINTAKS UTAMA",
    catLanguagesDesc: "Bahasa berkonkurensi tinggi dan mesin runtime yang efisien.",
    catFrameworks: "Framework & Protokol",
    catFrameworksBadge: "EKSEKUSI CEPAT",
    catFrameworksDesc: "Router HTTP throughput tinggi, transport RPC, dan fondasi mikroservis.",
    catDatabases: "Basis Data & Penyimpanan",
    catDatabasesBadge: "OLTP & MEMORI",
    catDatabasesDesc: "Skema relasional ACID, caching terdistribusi dalam memori, dan penyimpan hibrida.",
    catQueues: "Antrean Pesan & Messaging",
    catQueuesBadge: "EVENT-DRIVEN",
    catQueuesDesc: "Broker asinkron handal dengan jaminan pemrosesan at-least-once.",
    catDevops: "DevOps & Infrastruktur",
    catDevopsBadge: "KONTAINERISASI",
    catDevopsDesc: "Mikroservis terkontainerisasi dan alur otomatisasi pengiriman GitOps CI/CD.",
    catObservability: "Observabilitas & Pengujian",
    catObservabilityBadge: "SRE & KUALITAS",
    catObservabilityDesc: "Telemetri terstruktur, pemantau metrik, dan pengujian otomatis berstandar AAA.",

    // Case Studies Section
    caseStudiesTag: "[02] STUDI KASUS PRODUKSI (FORMAT STAR)",
    caseStudiesTitle: "Studi Kasus Sistem Produksi",
    caseStudiesDesc: "Proyek nyata backend yang menerapkan Clean Architecture, antrean asinkron, optimasi basis data, dan API berjenis data ketat.",
    colProblems: "01. Masalah & Tantangan",
    colSolution: "02. Solusi Arsitektur",
    colResults: "03. Hasil & Dampak Teruji",
    githubRepo: "Repositori GitHub",
    archBlueprint: "Cetakan Arsitektur",

    caseStudyOverrides: {
      "nontonplus-v2-backend": {
        title: "Backend NontonPlus V2 — Platform IPTV Hospitality & Manajemen ISP Multi-Tenant",
        domain_category: "Backend IPTV & Manajemen ISP",
        badge_label: "Sistem Produksi Hospitality",
        problems_challenges: [
          "Refactoring sistem legacy backend menjadi arsitektur berbasis NestJS & Fastify berskala produksi dengan stack 100% MongoDB & Mongoose untuk melayani IPTV rumah sakit, hotel, serta manajemen ISP multi-tenant.",
          "Menangani komunikasi real-time Socket.IO untuk pembaruan status channel IPTV, permintaan layanan kamar, dan sinkronisasi log tanpa delay.",
          "Mengintegrasikan MinIO object storage untuk manajemen aset media serta Grafana & Loki untuk observabilitas log terpusat."
        ],
        architecture_solution: [
          "Merancang arsitektur backend berkinerja tinggi menggunakan NestJS dan Fastify dengan penyimpanan dokumen MongoDB multi-tenant yang efisien.",
          "Memanfaatkan Redis Caching dan Socket.IO gateway guna menjamin pengiriman sinyal real-time dengan latensi terendah.",
          "Mengimplementasikan infrastruktur pemantauan terintegrasi dengan Grafana & Loki untuk analisis log terpusat dan penyimpanan media di MinIO."
        ],
        metrics: [
          { label: "Waktu Respon API", value: "< 45ms", delta: "Optimasi Query MongoDB" },
          { label: "Arsitektur Sistem", value: "Multi-Tenant", delta: "Isolasi Data ISP & Hotel" },
          { label: "Sinyal Real-Time", value: "100% Sync", delta: "Socket.IO & Event Gateway" },
          { label: "Pemantauan Log", value: "Grafana & Loki", delta: "Log Terpusat Real-Time" }
        ]
      },
      "nontonplus-v1-internship": {
        title: "Backend NontonPlus V1 — Sistem IPTV Rumah Sakit, Survei Pasien & Nurse-Call (Magang)",
        domain_category: "Magang Backend Enterprise",
        badge_label: "Sistem IPTV Rumah Sakit",
        problems_challenges: [
          "Mengembangkan modul backend untuk IPTV rumah sakit (NontonPlus V1) mencakup fitur survei kepuasan pasien dan pemanggilan perawat (nurse-call).",
          "Membangun API untuk pemrosesan survei interaktif yang berjalan langsung di layar TV pasien kamar rumah sakit.",
          "Memastikan pengiriman alur sinyal pemanggilan perawat terhubung secara andal dan bebas hambatan."
        ],
        architecture_solution: [
          "Membangun REST API dan modul pengumpulan data survei pasien yang terstruktur dan responsif.",
          "Mengintegrasikan alur pengiriman sinyal nurse-call secara cepat dan stabil dari TV pasien ke sistem perawat.",
          "Menyusun dokumentasi teknis dan skenario pengujian API pendukung untuk keandalan deployment NontonPlus V1."
        ],
        metrics: [
          { label: "Proyek Magang", value: "IPTV V1", delta: "Sistem Rumah Sakit" },
          { label: "Modul Survei", value: "Interaktif", delta: "Responsif di TV Pasien" },
          { label: "Modul Nurse-Call", value: "Integrasi API", delta: "Sinyal Panggilan Cepat" },
          { label: "Pengujian API", value: "Teruji (AAA)", delta: "Integrasi Berhasil" }
        ]
      }
    },

    // Experience Section
    expTag: "[03] RIWAYAT PEKERJAAN",
    expTitle: "Pengalaman Profesional",
    expDesc: "Rekam jejak eksekusi teknis backend, modularisasi sistem, dan tanggung jawab arsitektur berskala produksi.",
    coreFocusPrefix: "Fokus Utama: ",
    presentLabel: "Sekarang",

    expOverrides: {
      "saia-fulltime": {
        role_title: "Backend Developer",
        company_tagline: "NontonPlus V2 Hospitality IPTV & Platform ISP Multi-Tenant",
        employment_type: "Full-time",
        location: "Surabaya, Jawa Timur",
        core_focus: "Mengembangkan backend NontonPlus V2 menggunakan NestJS, Fastify, MongoDB, Redis, Socket.IO, MinIO, serta pemantauan log terpusat Grafana & Loki.",
        achievements: [
          {
            number: "01.",
            title: "Pengembangan Backend NontonPlus V2",
            metric: "NestJS & MongoDB Stack",
            description: "Membangun sistem backend berskala produksi untuk IPTV hospitality dan manajemen jaringan ISP multi-tenant."
          },
          {
            number: "02.",
            title: "Sistem Real-Time & Observabilitas",
            metric: "Socket.IO & Grafana/Loki",
            description: "Mengimplementasikan komunikasi Socket.IO real-time dan sistem log terpusat Grafana & Loki."
          }
        ]
      },
      "saia-intern": {
        role_title: "Backend Developer Intern",
        company_tagline: "NontonPlus V1 Hospital IPTV",
        employment_type: "Magang",
        location: "Surabaya, Jawa Timur",
        core_focus: "Mengembangkan API backend NontonPlus V1 untuk survei kepuasan pasien rumah sakit dan pengiriman sinyal panggilan perawat (nurse-call).",
        achievements: [
          {
            number: "01.",
            title: "Modul Survei Pasien & Nurse-Call",
            metric: "Integrasi NontonPlus V1",
            description: "Membangun endpoint API survei di TV kamar pasien serta integrasi sinyal panggilan perawat yang cepat dan stabil."
          },
          {
            number: "02.",
            title: "Dokumentasi & Pengujian API",
            metric: "Kualitas Kode API",
            description: "Menyusun skenario pengujian API dan dokumentasi modul backend untuk mendukung deployment NontonPlus V1."
          }
        ]
      }
    },

    // Credentials Section
    credTag: "[04] PENDIDIKAN & SERTIFIKASI",
    credTitle: "Pendidikan & Sertifikasi",
    credDesc: "Latar belakang pendidikan formal rekayasa perangkat lunak dan kualifikasi teknis terverifikasi.",
    verifiedBadge: "Terverifikasi",
    issuedLabel: "Diterbitkan: ",
    credOverrides: {},

    // API Playground Section
    apiTag: "[05] INTERAKTIF BACKEND & WEBHOOK PLAYGROUND",
    apiTitle: "Telemetri Sistem Langsung & Simulator Webhook",
    apiDesc: "Uji query runtime backend Go secara langsung dan simulasikan webhook bertanda tangan kriptografi live di browser.",
    telemetryTitle: "TELEMETRI MESIN RUNTIME",
    serverUptime: "Uptime Server",
    goroutines: "Goroutines",
    heapAlloc: "Memori Heap",
    gcCycles: "Siklus GC",
    simulatorTitle: "SIMULATOR PENERIMAAN WEBHOOK HMAC-SHA256",
    providerLabel: "Penyedia Webhook",
    eventTypeLabel: "Jenis Event",
    payloadLabel: "Payload Event (JSON)",
    sigLabel: "Tanda Tangan Kustom (Opsional — biarkan kosong untuk hitung otomatis HMAC valid)",
    sigPlaceholder: "contoh: tes tanda tangan salah untuk simulasikan manipulasi data",
    dispatchBtn: "KIRIM & VERIFIKASI TANDA TANGAN",
    dispatchingBtn: "MENGIRIM...",
    hmacEvaluator: "Evaluasi HMAC Tanpa Alokasi Memori (Zero-Allocation)",
    sigValid: "TANDA TANGAN TERVERIFIKASI (200 OK)",
    sigInvalid: "TANDA TANGAN TIDAK COCOK / DIMANIPULASI (400)",
    execLatency: "Latensi Eksekusi: ",
    providedSig: "Diberikan: ",
    expectedSig: "Diharapkan: ",

    // Footer
    footerSub: "Direkayasa dengan Go Clean Architecture, SQLite WAL, dan Swiss Precision React UI.",
    apiOnline: "API Online: 99.95% SLA",
    topBtn: "Atas",
    rightsReserved: "Hak cipta dilindungi undang-undang. Dibuat dengan Go & React.",
  }
};
