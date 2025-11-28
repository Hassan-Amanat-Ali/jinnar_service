import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      subsections: [
        {
          title: "1.1 Purpose of this Privacy Policy",
          content:
            "This Privacy Policy explains how Jinnar ('we,' 'our,' or 'the Platform') collects, uses, stores, shares, and protects the personal information of all individuals who access or use our services, including workers, customers, partners, trainees, and visitors (collectively, 'Users'). The purpose of this Policy is to provide transparency, to safeguard your rights, and to comply with applicable privacy, data protection, and consumer protection laws in the jurisdictions where we operate.",
        },
        {
          title: "1.2 Commitment to Privacy and Trust",
          content:
            "At Jinnar, we recognize that the success of our platform depends on the trust placed in us by both workers and customers. Protecting the privacy and integrity of personal data is not only a legal obligation but also a core part of our mission to operate fairly, responsibly, and securely. We are committed to handling personal data with integrity, transparency, and accountability.",
        },
        {
          title: "1.3 Scope of this Policy",
          content:
            "This Policy applies to all users of the Jinnar platform, including registered workers, registered customers, and visiting users. Data collected through Jinnar websites, mobile applications, customer support systems, training portals, and associated digital services. Data provided directly by users, collected automatically through technology, or received from authorized third-party partners.",
        },
        {
          title: "1.4 Acceptance of this Policy",
          content:
            "By accessing or using the Jinnar Platform, you acknowledge that you have read, understood, and agreed to this Privacy Policy. If you do not agree, you should immediately discontinue the use of Jinnar services. Continued use of the platform following changes to this Privacy Policy will constitute acceptance of those changes.",
        },
      ],
    },
    {
      title: "2. Information We Collect",
      subsections: [
        {
          title: "2.1 Personal Identification Information",
          content:
            "We may collect personal identification information that you voluntarily provide when registering an account, completing a booking, or interacting with Jinnar services. This includes: Full name, email address, telephone number, date of birth, and physical address. Government-issued identification documents, such as passports, national IDs, or driver's licenses. Profile photographs, identity verification photos, and training certificates. This information is necessary to establish accounts, verify identity, ensure compliance with legal requirements, and provide access to platform services.",
        },
        {
          title: "2.2 Account and Profile Data",
          content:
            "When you create or update your profile, we may collect: Worker details (skills, work experience, certifications, service categories). Customer details (service preferences, addresses for service delivery). Job history, reviews, ratings, and user-generated feedback. Account security credentials (username, password, security settings).",
        },
        {
          title: "2.3 Transactional Information",
          content:
            "In the course of using Jinnar, we collect and process financial and transactional records, including: Job bookings, service confirmations, invoices, and receipts. Payment details (bank account, mobile money, credit or debit card information). Refunds, chargebacks, disputes, and transaction histories. We do not store raw payment credentials (such as full credit card numbers); these are processed securely by licensed third-party payment providers.",
        },
        {
          title: "2.4 Device and Technical Data",
          content:
            "When you interact with Jinnar, our systems automatically collect technical information, such as: Device identifiers (IP address, device ID, browser type, operating system). Log files, cookies, session identifiers, and usage data. Performance metrics, crash reports, and security diagnostic data. This information helps us operate the platform securely, troubleshoot issues, optimize performance, and improve user experience.",
        },
        {
          title: "2.5 Location Information",
          content:
            "We may collect location data in the following ways: Directly provided location such as addresses entered for job bookings. Device-based geolocation: GPS or network-based location used to connect workers and customers nearby. Safety verification: to confirm that work is carried out in the agreed location and for emergency or fraud prevention purposes. Users may disable location tracking through device settings, but this may limit platform functionality.",
        },
      ],
    },
    {
      title: "3. How We Collect Information",
      subsections: [
        {
          title: "3.1 Direct Interactions You Initiate",
          content:
            "We collect information you provide directly to us when you: Create or update an account or profile (including identity verification steps). Submit booking requests, accept jobs, send invoices, or process payments. Upload documents, photos, videos, certifications, or work samples. Communicate with us via in-app chat, email, phone, support tickets, or forms. Participate in training, assessments, quizzes, or certification programs. Respond to surveys, participate in promotions, or enroll in beta features.",
        },
        {
          title: "3.2 Automated Collection Through Your Use of the Services",
          content:
            "When you access or use the Platform, we automatically collect certain technical and usage information, including: Log and diagnostic data (IP address, device identifiers, browser type, OS version, timestamps, pages viewed, session duration). Usage telemetry (clicks, navigation paths, feature interactions, response times, latency, and performance metrics). Security signals (failed logins, unusual session behavior, suspected automation, anti-fraud indicators).",
        },
        {
          title: "3.3 Cookies, Pixels, SDKs, and Similar Technologies",
          content:
            "We use cookies, web beacons/pixels, mobile SDKs, and local storage to recognize your device, remember preferences, measure traffic, and support security and analytics. Certain cookies are essential to core functionality.",
        },
      ],
    },
    {
      title: "4. How We Use Information",
      subsections: [
        {
          title: "4.1 To Provide and Operate the Platform",
          content:
            "We use your information to deliver the core services of Jinnar, including: Creating, managing, and authenticating accounts. Matching workers with customers based on preferences, skills, and location. Enabling job postings, bookings, confirmations, and cancellations. Maintaining records of completed and pending jobs.",
        },
        {
          title: "4.2 To Process Transactions",
          content:
            "We use transactional information to: Facilitate secure payments, deposits, refunds, and withdrawals. Generate invoices, receipts, and confirmations. Detect and prevent fraudulent or unauthorized payment activity. All financial transactions are processed using licensed payment providers under strict security standards.",
        },
        {
          title: "4.3 To Verify Identity and Ensure Safety",
          content:
            "We use personal identification data and sensitive information to: Confirm user identity through ID verification or background checks. Prevent the creation of fake, duplicate, or fraudulent accounts. Monitor compliance with community rules, platform standards, and safety protocols. Support investigation and resolution of safety incidents or disputes.",
        },
        {
          title: "4.4 To Support Users and Resolve Disputes",
          content:
            "We use communication records, support tickets, and job histories to: Respond to inquiries, complaints, or requests. Provide technical support and customer service. Investigate disputes between workers and customers. Document outcomes for accountability and fairness.",
        },
        {
          title: "4.5 To Enhance Training, Growth, and Certification",
          content:
            "For workers who engage in training or certification through Jinnar or its partners, we may use collected data to: Track training progress and course participation. Record test results and certification achievements. Issue digital certificates or credentials. Provide feedback to help workers improve performance and opportunities.",
        },
      ],
    },
    {
      title: "5. Basis for Processing Personal Data",
      subsections: [
        {
          title: "5.1 Consent",
          content:
            "We may process your personal data where you have given explicit consent. Examples include: Opting in to receive marketing communications. Enrolling in training or certification programs. Allowing device permissions such as GPS, camera, or microphone access. You may withdraw consent at any time through account settings or by contacting us.",
        },
        {
          title: "5.2 Contractual Necessity",
          content:
            "We may process personal data where it is necessary to perform a contract or to take steps at your request before entering into a contract. Examples include: Registering and authenticating your account. Processing bookings, payments, and invoices. Facilitating communication between workers and customers. Providing training results, certificates, or job-matching services.",
        },
        {
          title: "5.3 Legal Obligations",
          content:
            "We may process personal data when required by applicable laws, regulations, or legal processes. Examples include: Compliance with tax, labor, and employment regulations. Responding to lawful requests from courts, law enforcement, or regulators. Maintaining audit logs, safety records, and statutory retention schedules.",
        },
        {
          title: "5.4 Legitimate Interests",
          content:
            "We may process personal data where it is reasonably necessary for our legitimate business interests, provided such interests are not overridden by your fundamental rights and freedoms. Examples include: Detecting, preventing, and investigating fraud, abuse, or unlawful activity. Ensuring platform safety, quality, and performance. Conducting analytics, research, and product improvement. Providing personalized job suggestions, fair rating algorithms, and AI-driven recommendations.",
        },
      ],
    },
    {
      title: "6. How We Share Information",
      subsections: [
        {
          title: "6.1 Sharing with Other Users",
          content:
            "To facilitate job bookings and transactions, certain limited information is shared: For workers: name, profile photo, skills, ratings, work history, and general location (not exact address unless required for the job). For customers: name, job details, service address (only after booking is confirmed), and ratings/reviews. We do not disclose unnecessary personal information to other users without consent.",
        },
        {
          title: "6.2 Sharing with Service Providers",
          content:
            "We may engage third-party service providers who act on our behalf to deliver key services, such as: Payment processors (transaction handling, refunds, fraud checks). Cloud hosting and IT providers (data storage, content delivery, uptime monitoring). Identity verification and security vendors (background checks, ID validation, fraud detection). All service providers are contractually bound to use personal data only as instructed by Jinnar and not for their own purposes.",
        },
        {
          title: "6.3 Sharing for Safety, Security, and Fraud Prevention",
          content:
            "We may share data where necessary to: Investigate, prevent, or take action against suspected fraud, abuse, or unlawful activity. Protect the safety and integrity of workers, customers, and the public. Enforce Jinnar's Terms of Service and Community Guidelines.",
        },
        {
          title: "6.4 Sharing with Regulators, Law Enforcement, and Legal Proceedings",
          content:
            "We may disclose personal data when required to comply with legal obligations or in response to lawful requests, such as: Subpoenas, court orders, or regulatory directives. Tax reporting obligations or labor law compliance. Investigations of fraud, safety incidents, or suspected crimes. Jinnar limits such disclosures to the minimum necessary for legal compliance.",
        },
      ],
    },
    {
      title: "7. Data Retention",
      subsections: [
        {
          title: "7.1 General Retention Principles",
          content:
            "Jinnar retains personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Service-Related Data: Retained for as long as you maintain an active account or use Jinnar services. Transaction Data: Retained for the legally required period (e.g., tax and accounting laws typically require 5–10 years). Communication Records: Retained as necessary to document interactions, resolve disputes, or comply with regulatory requirements.",
        },
        {
          title: "7.2 Retention for Legal and Compliance Purposes",
          content:
            "Certain categories of information must be retained for longer periods to meet regulatory and legal requirements, including: Tax, audit, and financial records (invoices, payment histories). Safety and incident reports (accidents, disputes, fraud investigations). Compliance with labor and employment laws where workers are engaged in regulated activities.",
        },
        {
          title: "7.3 Account Closure and Deletion Requests",
          content:
            "When you close your account, Jinnar will delete or anonymize your personal data, unless retention is required for legitimate reasons. Certain data (such as completed transactions, safety reports, or training certifications) may need to be retained to comply with legal obligations or to preserve legitimate business records.",
        },
      ],
    },
    {
      title: "8. Data Security",
      subsections: [
        {
          title: "8.1 Technical Safeguards",
          content:
            "Jinnar is committed to safeguarding personal data against unauthorized access, disclosure, alteration, or destruction. We apply: Encryption: Sensitive data, including passwords, payment details, and identity verification documents, are encrypted during transmission (TLS/SSL). Access Controls: Access to personal data is restricted by role-based permissions and authentication requirements. Monitoring & Logging: System activity is logged, monitored, and reviewed to detect anomalies, fraud, or unauthorized access.",
        },
        {
          title: "8.2 Organizational Safeguards",
          content:
            "Staff Confidentiality: All employees, contractors, and support agents with access to personal data are required to sign confidentiality agreements. Training & Awareness: Staff undergo training on data protection, platform security, and safe handling of personal information. Internal Access Policies: Access is granted strictly on a need-to-know basis and revoked immediately when no longer necessary.",
        },
        {
          title: "8.3 User Responsibilities",
          content:
            "While Jinnar implements strong safeguards, users also share responsibility for protecting their data. Users are expected to: Maintain the confidentiality of account credentials (username, password, two-factor authentication). Use strong, unique passwords and update them regularly. Report any suspected unauthorized access or account misuse immediately.",
        },
      ],
    },
    {
      title: "9. User Rights",
      subsections: [
        {
          title: "9.1 Right to Access",
          content:
            "You have the right to request confirmation of whether Jinnar processes your personal data and to obtain a copy of such data, along with details on: Categories of data collected. Purposes for processing. Recipients or categories of recipients with whom data has been shared. Retention periods and legal bases for processing.",
        },
        {
          title: "9.2 Right to Rectification",
          content:
            "You have the right to request correction or completion of any inaccurate or incomplete personal data we hold. Updates may be made through your account settings or by contacting Jinnar Support.",
        },
        {
          title: "9.3 Right to Deletion ('Right to be Forgotten')",
          content:
            "You may request deletion of your personal data in certain circumstances, including: Where the data is no longer necessary for the purposes it was collected. Where consent was withdrawn and no other legal basis applies. Where processing is unlawful. Jinnar may retain certain information as required by law, for legitimate business needs, or to resolve disputes.",
        },
        {
          title: "9.4 Right to Restrict Processing",
          content:
            "You may request that Jinnar temporarily restrict processing of your data where: Accuracy of the data is contested. Processing is unlawful, but you request restriction instead of deletion. Data is no longer needed by Jinnar but required by you for legal claims.",
        },
        {
          title: "9.5 Right to Data Portability",
          content:
            "Where applicable, you may request a structured, commonly used, and machine-readable copy of your personal data, and have it transmitted directly to another data controller, provided this is technically feasible.",
        },
        {
          title: "9.6 Right to Object",
          content:
            "You may object to the processing of your data where it is based on Jinnar's legitimate interests, including: Direct marketing activities. Automated profiling not strictly necessary for safety or compliance.",
        },
      ],
    },
    {
      title: "10. Automated Decision-Making & AI",
      subsections: [
        {
          title: "10.1 Scope of Automated Processing",
          content:
            "Jinnar incorporates artificial intelligence ('AI') and automated decision-making tools into certain features of the Platform. Automated decision-making and AI systems may be applied in the following areas: Identity Verification: Automated document and photo validation for account creation and compliance. Fraud and Risk Scoring: Detection of unusual activity, duplicate accounts, or high-risk behaviors. Fair Rating Suggestions: AI-assisted moderation and balancing of worker and customer reviews. Job Matching and Recommendations: Suggesting workers or jobs based on skills, history, and location.",
        },
        {
          title: "10.2 Safeguards and Human Oversight",
          content:
            "To prevent unfair or harmful impacts: Automated outputs are monitored and periodically reviewed by authorized Jinnar staff. Users have the right to request human review of decisions that significantly affect them. Appeals processes are available for disputed outcomes, such as blocked accounts or disputed ratings. AI models are tested to minimize bias, inaccuracy, and discriminatory outcomes.",
        },
        {
          title: "10.3 User Rights in Automated Decisions",
          content:
            "Users may: Request Explanation: Obtain information on how automated systems contributed to a decision. Request Human Intervention: Seek manual review of outcomes with significant impact. Challenge a Decision: Submit evidence or context to contest automated outputs.",
        },
      ],
    },
    {
      title: "11. Data Breach Notification",
      subsections: [
        {
          title: "11.1 Definition of a Data Breach",
          content:
            "For purposes of this Policy, a data breach includes any accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to personal data transmitted, stored, or otherwise processed by Jinnar.",
        },
        {
          title: "11.2 Breach Detection and Response",
          content:
            "Jinnar maintains monitoring systems and incident response protocols to detect potential security incidents. Upon detection of a suspected breach, Jinnar will: Investigate and confirm the scope and nature of the breach. Contain and mitigate risks to prevent further exposure. Assess potential impact on affected individuals and systems. Document findings and corrective actions.",
        },
        {
          title: "11.3 Notification to Affected Users",
          content:
            "Where required by law, Jinnar will notify affected individuals without undue delay. Notifications may include: A description of the nature of the breach. Categories of data affected. Potential consequences or risks to affected users. Measures taken or proposed to address the breach. Guidance on steps individuals can take to protect themselves.",
        },
        {
          title: "11.4 Notification to Authorities",
          content:
            "If required by applicable law, Jinnar will notify competent supervisory authorities of the breach within legally mandated timelines (e.g., 72 hours under GDPR). Reports will include details of the breach, impact, and mitigation efforts.",
        },
      ],
    },
    {
      title: "12. Data Anonymization & Aggregation",
      subsections: [
        {
          title: "12.1 Anonymization Practices",
          content:
            "Jinnar applies technical and organizational measures to irreversibly remove or modify personal identifiers (such as names, contact details, or identification numbers). Once anonymized, the data is no longer considered 'personal data' under applicable laws. Anonymized data may be retained indefinitely for lawful purposes.",
        },
        {
          title: "12.2 Permitted Uses of Anonymized & Aggregated Data",
          content:
            "Jinnar may use anonymized and aggregated data for: Improving platform functionality and user experience. Conducting research, analytics, and product development. Monitoring fraud, safety, and performance trends. Producing industry insights, reports, or publications. Supporting business planning, partnerships, and investor communications.",
        },
      ],
    },
    {
      title: "13. Worker & Customer Communication Data",
      subsections: [
        {
          title: "13.1 Types of Communication Data Collected",
          content:
            "We may collect and process: In-App Chats: Messages exchanged between workers and customers through Jinnar's platform. Support Tickets & Emails: Correspondence submitted to Jinnar support. Call Records: Metadata (caller, receiver, time, duration) and, where legally permitted, audio recordings of calls facilitated through the platform.",
        },
        {
          title: "13.2 Purposes of Processing Communication Data",
          content:
            "We may process communication data for: Service Delivery: Ensuring effective communication between workers and customers. Quality Assurance: Monitoring support interactions to train staff and improve service. Dispute Resolution: Reviewing records when resolving complaints, cancellations, or rating disputes. Fraud & Safety Monitoring: Detecting suspicious activity, harassment, or abusive content.",
        },
      ],
    },
    {
      title: "14. Marketplace Reviews & Ratings",
      subsections: [
        {
          title: "14.1 Collection of Reviews & Ratings",
          content:
            "After completion of a job, workers and customers may submit ratings and written feedback. Ratings may cover punctuality, quality of work, communication, safety, and overall satisfaction. Jinnar may prompt users to provide reviews, but participation is voluntary unless otherwise stated.",
        },
        {
          title: "14.2 Publication & Display",
          content:
            "Ratings and reviews are generally visible to other users of the platform. Average ratings may be calculated and displayed as part of a user's public profile. Feedback may be summarized in aggregate for reporting and analytics purposes.",
        },
        {
          title: "14.3 Moderation & Removal",
          content:
            "Jinnar reserves the right, but not the obligation, to review and moderate ratings and reviews. Reviews may be removed, edited, or hidden if they: Contain offensive, discriminatory, or harmful content. Violate Jinnar's Terms of Service, Community Guidelines, or applicable law. Are proven to be false, fraudulent, or malicious.",
        },
      ],
    },
    {
      title: "15. Cookies & Tracking",
      subsections: [
        {
          title: "15.1 What Are Cookies?",
          content:
            "Cookies are small text files stored on your device when you access the Jinnar Platform. They may be 'session cookies' (deleted when you close your browser) or 'persistent cookies' (retained until they expire or are deleted).",
        },
        {
          title: "15.2 Types of Cookies We Use",
          content:
            "Essential Cookies: Required for basic platform functions, such as login, account authentication, and fraud prevention. Functional Cookies: Enable enhanced features such as remembering preferences, saved searches, and language settings. Analytics Cookies: Collect data on usage patterns, performance, and interactions to improve services. Security Cookies: Detect suspicious activity, prevent unauthorized access, and support fraud detection.",
        },
        {
          title: "15.3 User Choices & Controls",
          content:
            "Users can manage cookies through browser or device settings, including deleting or disabling them. Certain essential cookies cannot be disabled, as they are necessary for platform functionality. Marketing cookies (where used) will only be applied if you provide consent through banners or settings.",
        },
      ],
    },
    {
      title: "16. Children's Privacy",
      subsections: [
        {
          title: "16.1 Minimum Age Requirement",
          content:
            "Users must generally be 18 years or older to create an account on Jinnar. In jurisdictions where the legal working age is lower, Jinnar may allow users who are 16 or older, provided they have parental or guardian consent and are legally permitted to work. Users under the minimum age are strictly prohibited from using the Platform.",
        },
        {
          title: "16.2 Information Collected from Minors",
          content:
            "Jinnar does not knowingly collect, use, or disclose personal data from children under the age of 16 (or higher local legal threshold). If we become aware that we have inadvertently collected personal data from a child in violation of this Policy, we will take immediate steps to delete such information.",
        },
      ],
    },
    {
      title: "17. International Data Transfers",
      subsections: [
        {
          title: "17.1 Data Storage and Processing Locations",
          content:
            "Personal data may be stored and processed in countries where Jinnar, its affiliates, or authorized service providers maintain facilities. This may include servers located in the United States, Tanzania, or other jurisdictions where Jinnar expands operations.",
        },
        {
          title: "17.2 Cross-Border Transfers",
          content:
            "By using the Jinnar Platform, users acknowledge and agree that their personal data may be transferred to and processed in countries outside of their home jurisdiction. These countries may have different data protection laws, which may not provide the same level of protection as the laws of your jurisdiction.",
        },
        {
          title: "17.3 Safeguards for International Transfers",
          content:
            "To ensure protection, Jinnar applies one or more of the following safeguards: Contractual Protections: Use of data processing agreements and standard contractual clauses (SCCs) approved under applicable law. Adequacy Decisions: Transfers to jurisdictions recognized as providing adequate data protection. Technical Safeguards: Encryption, pseudonymization, and strict access controls applied to cross-border transfers.",
        },
      ],
    },
    {
      title: "18. Government & Regulatory Compliance",
      subsections: [
        {
          title: "18.1 Compliance with Legal Obligations",
          content:
            "We may process or disclose personal data to comply with: Tax, financial reporting, and auditing requirements. Employment and labor regulations related to workers and contractors. Health, safety, and workplace compliance rules. Data protection, cybersecurity, and consumer protection laws.",
        },
        {
          title: "18.2 Lawful Requests and Investigations",
          content:
            "Jinnar may disclose personal data in response to lawful requests from courts, law enforcement, regulators, or other public authorities. Such disclosures will be limited to the minimum necessary to comply with the request. Where legally permitted, Jinnar will notify affected users before disclosing their information.",
        },
      ],
    },
    {
      title: "19. Third-Party Links",
      subsections: [
        {
          title: "19.1 No Responsibility for Third-Party Practices",
          content:
            "When you access a third-party website or service through a link on Jinnar, your interactions are governed by that third party's privacy policy and terms of use, not Jinnar's. Jinnar is not responsible for how third parties collect, use, disclose, or protect personal data.",
        },
        {
          title: "19.2 User Responsibility",
          content:
            "Users should review the privacy policies and terms of any third-party service before providing personal data. Engaging with third-party services is at the user's own risk. Jinnar disclaims liability for loss, damage, or misuse of data that occurs through third-party platforms.",
        },
      ],
    },
    {
      title: "20. Data Subject Complaints & Appeals",
      subsections: [
        {
          title: "20.1 Internal Complaint Process",
          content:
            "Users who believe their data has been mishandled, or who wish to raise a privacy concern, may submit a complaint directly to Jinnar through in-app support tools or by email/postal contact. Complaints should include sufficient detail (such as the nature of the concern, affected data, and supporting evidence).",
        },
        {
          title: "20.2 Timelines for Response",
          content:
            "Jinnar will make reasonable efforts to respond to complaints within 30 days, or within the timeframe required by applicable law. Complex cases may require longer, in which case users will be informed of the delay and estimated resolution timeline.",
        },
        {
          title: "20.3 Appeals Process",
          content:
            "If a user is dissatisfied with the outcome of their complaint, they may request an internal review or escalation. Appeals will be reviewed by a designated Privacy Officer or senior staff member not involved in the original decision.",
        },
      ],
    },
    {
      title: "21. Marketing & Communication Preferences",
      subsections: [
        {
          title: "21.1 Service-Related Communications",
          content:
            "Certain communications are essential to the functioning of the Platform and cannot be opted out of, including: Account verification messages. Job confirmations, cancellations, and updates. Payment receipts, invoices, and refund notices. Security alerts, policy changes, and legal notices.",
        },
        {
          title: "21.2 Marketing Communications",
          content:
            "With your consent where required by law, Jinnar may send promotional messages, newsletters, referral program updates, or offers tailored to your interests. Marketing communications may be delivered by email, SMS, push notifications, in-app messages, or other lawful means.",
        },
        {
          title: "21.3 User Choices & Opt-Out Options",
          content:
            "Users may manage preferences by adjusting settings in their account dashboard or using unsubscribe links included in marketing messages. Users can opt out of marketing communications at any time without affecting access to essential platform services.",
        },
      ],
    },
    {
      title: "22. Updates to Privacy Policy",
      subsections: [
        {
          title: "22.1 Right to Update",
          content:
            "Jinnar reserves the right to amend this Privacy Policy at any time. Updates may be required to ensure compliance with new legal requirements or to reflect enhancements in platform operations.",
        },
        {
          title: "22.2 Notification of Changes",
          content:
            "For material changes (such as new data uses, expanded rights, or broader disclosures), Jinnar will provide notice to users in advance by email to the registered address, in-app notifications or banners, or updates posted on the Privacy Policy page.",
        },
        {
          title: "22.3 User Acceptance",
          content:
            "Continued use of the Jinnar Platform following the effective date of changes constitutes acceptance of the updated Privacy Policy. Users who do not agree with changes must discontinue use of the Platform and may request account closure.",
        },
      ],
    },
    {
      title: "23. Contact Information",
      subsections: [
        {
          title: "23.1 General Privacy Inquiries",
          content:
            "For general privacy-related questions, please contact: Email: support@jinnar.com | Postal Address (U.S. Office): Jinnar Platform – Privacy Office, 9550 Spring Green BLVD, STE 408-336, Katy, TX 77494",
        },
        {
          title: "23.2 Data Protection Officer (DPO)",
          content:
            "Where required by law, Jinnar appoints a Data Protection Officer (DPO) to oversee compliance with applicable data protection laws. The DPO may be contacted at: Email: dpo@jinnar.com",
        },
        {
          title: "23.3 Complaints & Appeals",
          content:
            "Users may submit formal complaints or appeals through the channels listed above. Complaints will be handled in accordance with Section 20: Data Subject Complaints & Appeals.",
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={32} className="text-[#38BDF8]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-600">
              Your data security and privacy is our priority
            </p>
          </div>
        </div>

        <p className="text-xs font-medium text-gray-500 mt-4">
          Effective Date: November 28, 2025
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Table of Contents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sections.map((section, idx) => (
            <a
              key={idx}
              href={`#section-${idx}`}
              className="text-sm text-[#38BDF8] hover:text-[#0284c7] hover:underline"
            >
              {section.title}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {sections.map((section, sectionIdx) => (
          <div
            key={sectionIdx}
            id={`section-${sectionIdx}`}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 sticky top-0 bg-white py-2">
              {section.title}
            </h2>

            <div className="space-y-6 ml-0 md:ml-4">
              {section.subsections.map((subsection, subIdx) => (
                <div
                  key={subIdx}
                  className="border-l-4 border-[#38BDF8] pl-4 py-2"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                    {subsection.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                    {subsection.content}
                  </p>
                </div>
              ))}
            </div>

            {sectionIdx < sections.length - 1 && (
              <div className="border-t border-gray-200 pt-8" />
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs md:text-sm text-amber-900 leading-relaxed">
            <span className="font-semibold">⚖️ Legal Note:</span> By using the
            Jinnar Platform, users acknowledge that they have read and accepted
            this Privacy Policy. For any questions or concerns regarding our
            privacy practices, please contact us at the addresses provided in
            Section 23: Contact Information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
