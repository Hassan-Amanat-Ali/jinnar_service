import { FileText, Shield } from "lucide-react";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Introduction",
      subsections: [
        {
          title: "1.1 Purpose and Scope",
          content:
            "These Terms of Service ('Terms' or 'ToS') constitute a legally binding agreement between you and Jinnar. These Terms govern your access to and use of Jinnar's websites, mobile applications, training portals, customer support portals, and related services (collectively, the 'Platform'). The Platform is a digital marketplace that enables Customers to discover and purchase services from independent Workers. Jinnar provides Platform services only; it does not provide the underlying labor or professional services.",
        },
        {
          title: "1.2 Agreement to Terms",
          content:
            "By creating an account, clicking to accept these Terms, or accessing any part of the Platform, you acknowledge that you have read, understood, and agreed to these Terms. If you do not agree, you must not use the Platform. If you use the Platform on behalf of a company or legal entity, you represent and warrant that you have authority to bind that entity to these Terms.",
        },
        {
          title: "1.3 Marketplace Nature & Contracting Entity",
          content:
            "Jinnar operates a technology Platform facilitating discovery, communication, scheduling, and payment processing between Users. Jinnar is NOT a party to Service Contracts between Users, is NOT an employer or joint employer, and does NOT supervise, direct, or control the quality or timing of services. Workers are independent providers responsible for determining how and when to work. Your Contracting Entity is the Jinnar affiliate operating in your country or region.",
        },
      ],
    },
    {
      title: "2. Eligibility & Account Creation",
      subsections: [
        {
          title: "2.1 Eligibility Requirements",
          content:
            "You must be at least 18 years old or the age of legal majority in your jurisdiction to register for the Platform. By creating an account, you represent that you meet this requirement and have the legal capacity to enter into binding contracts. You are solely responsible for ensuring your use of the Platform is legal in your jurisdiction.",
        },
        {
          title: "2.2 Account Registration & Verification",
          content:
            "You must provide accurate, current, and complete information during registration. Jinnar may require identity verification through government-issued identification or facial recognition. Workers may be required to provide proof of qualifications, licenses, certifications, insurance, or health and safety compliance documents. Failure to complete verification may limit or suspend account access.",
        },
        {
          title: "2.3 Account Ownership & Non-Transferability",
          content:
            "Your account is personal to you and may not be transferred, sold, or assigned to another person without Jinnar's written consent. Each User may hold only one account per role (Worker or Customer). You are responsible for all activities that occur under your account. You must maintain the confidentiality of your login credentials and notify Jinnar immediately of any security breach.",
        },
        {
          title: "2.4 Account Approval & Suspension",
          content:
            "Jinnar reserves the right, in its sole discretion, to approve, deny, or suspend any account registration for any reason, including concerns regarding fraud, safety, or non-compliance with these Terms. Accounts with incomplete or inaccurate information may be denied or suspended until corrected. Persons previously suspended or banned from the Platform are not permitted to create new accounts.",
        },
      ],
    },
    {
      title: "3. User Roles & Responsibilities",
      subsections: [
        {
          title: "3.1 Worker Responsibilities",
          content:
            "Workers acknowledge they are independent providers, NOT employees or agents of Jinnar. Workers are responsible for determining how, when, and whether to perform services. Workers must arrive on time, perform services within agreed timelines, comply with all safety rules, wear appropriate protective gear, provide truthful information regarding qualifications, and obtain any required licenses, certifications, or insurance.",
        },
        {
          title: "3.2 Customer Responsibilities",
          content:
            "Customers must provide a safe and lawful environment for Workers, disclosing known hazards such as dangerous equipment or health risks. Customers must pay for services promptly and in full through the Platform. Customers must provide honest and accurate ratings and reviews. Customers must treat Workers with respect and fairness, refraining from harassment, threats, or discrimination.",
        },
        {
          title: "3.3 Prohibited Conduct",
          content:
            "Users may NOT: (a) create false accounts or submit false information; (b) harass, abuse, or discriminate against others; (c) engage in conduct that endangers themselves or others; (d) manipulate ratings or post false reviews; (e) resell or exploit the Platform for unauthorized purposes; (f) circumvent Jinnar's payment system.",
        },
        {
          title: "3.4 Partnership Principle",
          content:
            "The success of Jinnar depends on mutual trust, fairness, and accountability. Both Workers and Customers agree to act in good faith, cooperate in resolving issues, uphold community standards of respect and professionalism, and cooperate with Jinnar in resolving complaints and investigations.",
        },
      ],
    },
    {
      title: "4. Use of the Jinnar Platform",
      subsections: [
        {
          title: "4.1 Limited License to Use",
          content:
            "Jinnar grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform solely for lawful purposes. This license does NOT include any rights to: (a) resell or exploit the Platform commercially; (b) copy or create derivative works; (c) use data mining or bots without authorization; or (d) bypass security features.",
        },
        {
          title: "4.2 Restrictions & Prohibited Activities",
          content:
            "You agree NOT to: (a) access the Platform using automated means without authorization; (b) interfere with Platform functionality or introduce malware; (c) circumvent security features; (d) collect User information without consent; (e) use messaging tools for spam or harassment; (f) misrepresent qualifications or job details.",
        },
        {
          title: "4.3 Fair Usage Rules",
          content:
            "Each User may hold only one account per role. Rating manipulation through false reviews or multiple accounts is prohibited. Job descriptions must not be misleading, and qualifications must not be misrepresented. Users may not circumvent Jinnar's payment system by making payments directly outside the Platform.",
        },
        {
          title: "4.4 AI Features & Automated Decisions",
          content:
            "Jinnar incorporates artificial intelligence for fraud detection, rating fairness, job recommendations, and content moderation. If you believe an automated decision was incorrect, you may request human review through support. AI features are designed in compliance with applicable data protection laws to ensure fairness and non-discrimination.",
        },
      ],
    },
    {
      title: "5. Payments & Financial Terms",
      subsections: [
        {
          title: "5.1 Accepted Payment Methods",
          content:
            "Payments on the Platform may be made using mobile money, debit/credit cards, bank transfers, or other approved third-party payment processors. Payments are processed by independent third-party providers. By using any Payment Method, you agree to comply with that provider's terms. Jinnar is not liable for delays, errors, or failures by third-party processors.",
        },
        {
          title: "5.2 Protected Payments & Disbursement",
          content:
            "When a Customer authorizes payment, the amount may be placed on hold by Jinnar's third-party payment processors. Upon completion or milestone acceptance, funds are disbursed to the Worker, less applicable fees. Jinnar is NOT an escrow agent, trustee, fiduciary, bank, or money transmitter. Chargebacks, refunds, and set-offs are handled by the payment processor.",
        },
        {
          title: "5.3 Fees & Charges",
          content:
            "Jinnar charges Workers a service fee (percentage or fixed rate) deducted before fund release. Customers may be charged booking or processing fees. Applicable value-added tax (VAT) will be charged where required. Jinnar may change its fees at any time with reasonable prior notice. Continued use constitutes acceptance of revised fees.",
        },
        {
          title: "5.4 Refunds & Cancellations",
          content:
            "Customers may cancel bookings subject to displayed cancellation policies; cancellation fees may apply. Workers who cancel without valid cause may face penalties or reduced ratings. Refunds are available only where services are not delivered or are fraudulent. Platform fees and transaction charges are non-refundable unless required by law.",
        },
        {
          title: "5.5 Taxes & Compliance",
          content:
            "Workers are independent providers solely responsible for determining, reporting, and remitting applicable income and value-added taxes. Customers may be required to withhold or report taxes under applicable law. Jinnar does not withhold or remit taxes on behalf of Users unless legally required. Where required, Jinnar may issue tax invoices or certifications.",
        },
        {
          title: "5.6 Non-Circumvention Clause",
          content:
            "Users agree NOT to attempt to circumvent the Platform by making payments outside Jinnar for jobs first introduced through the Platform. This obligation applies for twelve (12) months from first connection. Violations may result in liquidated damages, suspension, or permanent banning. Liquidated damages equal the greater of Jinnar's lost fees or a fixed penalty as specified in Jinnar's policies.",
        },
      ],
    },
    {
      title: "6. Complaints, Disputes & Resolution",
      subsections: [
        {
          title: "6.1 Complaints Process",
          content:
            "Users may submit complaints regarding transactions, conduct, or Platform issues through the in-app system, email, or designated dispute channels within the timeframe specified in Jinnar's policies (generally no later than seven [7] days after job completion). Jinnar will acknowledge receipt and review complaints in good faith, examining ratings, communications, and transaction records.",
        },
        {
          title: "6.2 Jinnar's Mediation Role",
          content:
            "Jinnar is NOT a court, arbitrator, or insurer but provides a neutral complaints process designed to promote fairness and efficiency. Jinnar may, at its sole discretion: (a) issue refunds or credits; (b) release or withhold Worker payments; (c) adjust ratings or remove unfair reviews; (d) suspend or terminate accounts; (e) provide warnings or impose penalties.",
        },
        {
          title: "6.3 Resolution of Disputes Between Users",
          content:
            "Users are encouraged to attempt direct resolution before escalating to Jinnar. Users involved in disputes must cooperate with Jinnar's information requests. For Platform transactions, Jinnar may instruct payment processors to release or withhold payouts, authorize refunds, or maintain compliance holds. These determinations are final within the Platform.",
        },
        {
          title: "6.4 Arbitration & Legal Action",
          content:
            "Disputes not resolved through Jinnar's internal process shall be submitted to binding arbitration in accordance with the governing law specified in Section 17. Arbitration shall be conducted by a neutral arbitrator in the Contracting Entity's jurisdiction. Either party may seek injunctive relief in a court of competent jurisdiction to prevent misuse of intellectual property or safety threats.",
        },
        {
          title: "6.5 Class Action Waiver",
          content:
            "To the maximum extent permitted by law, Users agree that disputes must be resolved on an individual basis. Users waive the right to participate in any class, collective, consolidated, or representative action against Jinnar.",
        },
        {
          title: "6.6 Limitation on Claims",
          content:
            "Any claim or cause of action arising from or related to the Platform must be filed within twelve (12) months after the event giving rise to the claim. Claims filed beyond this period are permanently barred.",
        },
      ],
    },
    {
      title: "7. Ratings, Reviews & Accountability",
      subsections: [
        {
          title: "7.1 Fair Ratings & Reviews",
          content:
            "After job completion, Customers may rate Workers based on punctuality, quality, professionalism, communication, and safety. Workers may rate Customers based on clarity, payment timeliness, safe environment, and conduct. All ratings and reviews must be truthful, accurate, and reflective of actual experiences. Fabricated or misleading reviews are prohibited.",
        },
        {
          title: "7.2 Worker Accountability",
          content:
            "Workers' ongoing access to features, badges, and job visibility is linked to performance metrics including timeliness, completion rate, quality ratings, cleanliness, and safety compliance. Consistently low ratings may result in reduced visibility, suspension from premium features, or account termination. Workers with declining performance may be offered training or remedial measures.",
        },
        {
          title: "7.3 Review Moderation & Removal",
          content:
            "Jinnar reserves the right to monitor, moderate, edit, or remove ratings and reviews that violate these Terms. Reviews may be removed if they are fraudulent, offensive, discriminatory, irrelevant, part of manipulation schemes, or violations of the non-circumvention rule. Users may dispute ratings by filing a complaint; Jinnar will review and take corrective action if evidence supports manipulation.",
        },
        {
          title: "7.4 Consequences of Manipulation",
          content:
            "Users may NOT artificially inflate or deflate ratings through fake accounts, paying for false ratings, or retaliatory practices. Violations may result in removal of manipulated reviews, reduced visibility, suspension, account termination, and recovery of damages including Jinnar's lost fees.",
        },
      ],
    },
    {
      title: "8. Training, Growth & Certifications",
      subsections: [
        {
          title: "8.1 Mandatory & Voluntary Training",
          content:
            "Jinnar may provide or require participation in training modules through the Jinnar Training Hub or partner platforms covering time discipline, customer service, safety, and platform usage. Certain Worker categories may be required to complete training before offering services or earning badges. Voluntary training programs are also available to improve skills and job opportunities.",
        },
        {
          title: "8.2 Badges, Rewards & Career Growth",
          content:
            "Workers who complete training or meet performance benchmarks may earn badges such as 'Jinnar Certified,' 'Top Performer,' 'Safety Verified,' or 'Customer Favorite.' Badges increase visibility in job listings and may unlock eligibility for premium services or reduced fees. Jinnar may revoke badges if Worker performance falls below standards, safety obligations are violated, or badges are fraudulently obtained.",
        },
        {
          title: "8.3 Partner Training Providers",
          content:
            "Jinnar may collaborate with independent training institutions, NGOs, government programs, or professional bodies to provide certified training. Participation may be subject to additional terms by the training provider. Jinnar does not endorse or guarantee the quality of third-party training programs but may facilitate access as a value-added service.",
        },
        {
          title: "8.4 No Guarantee of Employment",
          content:
            "Participation in training programs, obtaining badges, or receiving certifications does NOT guarantee job offers, earnings, or continued Platform use. Success depends on Worker performance, Customer demand, and compliance with these Terms.",
        },
      ],
    },
    {
      title: "9. Safety, Security & Emergencies",
      subsections: [
        {
          title: "9.1 Worker Safety Guidelines",
          content:
            "Workers must use appropriate personal protective equipment (PPE) suitable for services performed. Workers are responsible for ensuring tools and equipment are safe and properly maintained. Workers must avoid reckless, negligent, or unlawful behavior that could endanger themselves, Customers, or others. Workers must assess job sites for hazards and may refuse work in unsafe or unlawful conditions.",
        },
        {
          title: "9.2 Customer Safety Duties",
          content:
            "Customers must provide safe, lawful, and accessible environments for services. Customers must disclose known risks such as electrical hazards, unsafe structures, aggressive animals, or hazardous chemicals. Customers must ensure necessary safety measures are in place (adequate lighting, ventilation, secure access). Customers are responsible for maintaining their premises safely.",
        },
        {
          title: "9.3 Emergency Handling & Reporting",
          content:
            "In case of accidents, injuries, fires, harassment, or emergencies during a job, Users must immediately take reasonable steps to protect safety. Users must promptly contact local emergency services (police, fire, ambulance) where required. All emergencies must be reported to Jinnar within 24 hours using in-app reporting tools or support channels. Users must cooperate with Jinnar and law enforcement in investigating incidents.",
        },
        {
          title: "9.4 Children & Vulnerable Persons Policy",
          content:
            "Jinnar strictly prohibits child labor in violation of applicable laws. Workers under the legal working age are not permitted on the Platform. Customers requesting child care, elder care, or services involving vulnerable persons must comply with all applicable laws. Workers providing such services must exercise heightened care and professionalism. Users aware of abuse or neglect must report incidents to Jinnar and authorities immediately.",
        },
      ],
    },
    {
      title: "10. Privacy & Data Protection",
      subsections: [
        {
          title: "10.1 Data Collection & Usage",
          content:
            "Jinnar may collect: (a) identification data (name, DOB, ID, passport, driver's license); (b) contact data (email, address); (c) financial data (payment methods, transaction history); (d) employment data (skills, qualifications, ratings, certifications); (e) technical data (device, IP, geolocation, cookies); (f) communications data (messages, tickets, reviews). Data is used for identity verification, transaction facilitation, fraud prevention, Platform improvement, compliance, and user communication.",
        },
        {
          title: "10.2 Storage & Retention",
          content:
            "Data may be stored on secure servers by Jinnar or third-party providers in jurisdictions other than the User's home country. Data will be retained for as long as necessary to provide services, fulfill legal obligations, resolve disputes, and enforce agreements. Upon account closure, Jinnar will delete or anonymize personal data except where retention is required by law or legitimate business needs.",
        },
        {
          title: "10.3 Data Sharing with Third Parties",
          content:
            "Jinnar may share User data with operational partners (payment processors, identity verification providers, training institutions). Jinnar may disclose data where required by law, legal process, or governmental authority. In the event of merger, acquisition, or asset sale, User data may be transferred to the successor entity. Jinnar does NOT sell personal data to third parties for advertising or commercial resale.",
        },
        {
          title: "10.4 User Rights & Privacy",
          content:
            "Users may request access to personal data and correct inaccuracies. Users may request deletion of personal data subject to legal and operational limitations. Users may request limitations on data use where legally required. Users may withdraw consent for specific data collection via account settings. The full Jinnar Privacy & Data Protection Policy, which forms part of these Terms, governs personal data matters.",
        },
      ],
    },
    {
      title: "11. Third-Party Services & Integrations",
      subsections: [
        {
          title: "11.1 Payment Gateways & Financial Partners",
          content:
            "Payments are facilitated by third-party payment processors or financial institutions. Users agree to comply with the terms of such payment partners. Jinnar is NOT responsible for errors, delays, or losses by payment processors or banks. Financial partners may conduct KYC, AML, or fraud screening; Users must comply with these requirements.",
        },
        {
          title: "11.2 Training Partners & Content Providers",
          content:
            "Jinnar may offer training through independent third-party providers, educational institutions, or government-authorized bodies. Participation may be subject to additional terms by the provider. Jinnar does NOT guarantee the quality or outcomes of third-party training and is NOT responsible for disputes arising from such services.",
        },
        {
          title: "11.3 Insurance Providers",
          content:
            "Jinnar may make available optional or required insurance products through third-party providers. Any insurance purchased is subject to the provider's terms and conditions. Jinnar is NOT responsible for claims decisions, coverage denial, or benefit determinations. Users must carefully review insurance policy terms before relying on coverage.",
        },
        {
          title: "11.4 Integration & Independence",
          content:
            "Third-party providers are independent entities. Jinnar does NOT endorse third-party services or warrant their reliability, safety, or legality. Users remain responsible for ensuring use of third-party services complies with applicable law. Users agree to indemnify Jinnar from claims arising from their use of third-party services.",
        },
      ],
    },
    {
      title: "12. Insurance & Risk Mitigation",
      subsections: [
        {
          title: "12.1 Worker Insurance Requirements",
          content:
            "Workers may be required to maintain insurance coverage (liability, accident, professional indemnity) depending on jurisdiction and service category. For high-risk categories (electrical, roofing, plumbing, HVAC, structural work, moving/transport, gas fitting, pest control, security), Jinnar may require proof of current insurance. Proof must include valid Certificate of Insurance showing policy number, effective/expiration dates, coverage types, limits, and applicable endorsements.",
        },
        {
          title: "12.2 Insurance Verification & Compliance",
          content:
            "Users must upload documentation and promptly update upon renewal or material change. Jinnar may verify documentation with carriers or third-party services. Failure to maintain required coverage may result in removal of badges, category restrictions, job cancellations, and account termination. Providing false or altered insurance documents may result in payout limitations and permanent banning.",
        },
        {
          title: "12.3 Jinnar's Role & Limitations",
          content:
            "Jinnar is NOT an insurer or insurance producer and does NOT sell, solicit, or advise on insurance. All insurance is provided by third-party carriers under their terms. Claims are handled by the applicable carrier. Jinnar does NOT guarantee acceptance of insurance applications, claim approvals, or coverage adequacy.",
        },
        {
          title: "12.4 Risk Allocation",
          content:
            "In the absence of applicable insurance, Workers and Customers are directly responsible for any damages, losses, injuries, or liabilities arising from services. Users agree to indemnify Jinnar against claims or liabilities arising from uninsured risks including personal injury, property damage, and third-party claims.",
        },
      ],
    },
    {
      title: "13. Communication & Notifications",
      subsections: [
        {
          title: "13.1 Official Communication Channels",
          content:
            "The primary method of communication is through in-app messaging, notifications, and support tickets. Jinnar may also communicate via email, SMS, or push notifications. Communications delivered through official channels are valid and binding. Users consent to receive all agreements, notices, and disclosures electronically.",
        },
        {
          title: "13.2 Language & Updates",
          content:
            "Unless otherwise specified, communications are provided in English. Jinnar may provide translations in Swahili or other languages for convenience. In case of conflict, the English version prevails. Users relying on translations are responsible for understanding the obligations. Policy changes are communicated through official channels; continued use constitutes acceptance.",
        },
        {
          title: "13.3 User-Initiated Communications",
          content:
            "Users may contact Jinnar through in-app support, email, or designated points on the Platform. Legal notices must be sent to the official contact address identified in these Terms. Jinnar will use reasonable efforts to respond promptly but does not guarantee specific response times except where legally required.",
        },
        {
          title: "13.4 Communication Standards & Delivery",
          content:
            "Users must communicate respectfully with Jinnar staff, Workers, and Customers. Abusive or threatening communications may result in suspension or termination. Users may not use channels for spam, fraud, defamation, or unlawful material. Notices are deemed delivered when sent via in-app (time of posting), email (time of transmission), or SMS (time of transmission). Failure to update contact information remains the User's responsibility.",
        },
      ],
    },
    {
      title: "14. Intellectual Property & Content",
      subsections: [
        {
          title: "14.1 Jinnar's Intellectual Property",
          content:
            "The Platform, including software, algorithms, databases, logos, trademarks, designs, graphics, interfaces, text, images, audio, and video (collectively, 'Jinnar IP'), is owned by or licensed to Jinnar. These Terms do NOT transfer any intellectual property rights from Jinnar to Users except the limited license granted in Section 4.1. Unauthorized use may result in legal action.",
        },
        {
          title: "14.2 User Content Licensing",
          content:
            "Users retain ownership of content they upload (service listings, photos, reviews, comments). By submitting User Content, Users grant Jinnar a worldwide, non-exclusive, royalty-free, transferable, sublicensable license to use, reproduce, distribute, display, and adapt such content for operating, improving, promoting, and securing the Platform. This license continues for as long as the content is available on the Platform.",
        },
        {
          title: "14.3 Content Standards",
          content:
            "User Content must be lawful, accurate, and respectful. Content must NOT be defamatory, discriminatory, obscene, harassing, infringing intellectual property rights, fraudulent, misleading, contain malware, or be unrelated to services. Users may NOT use Jinnar's trademarks or proprietary content without written consent except as permitted by fair use.",
        },
        {
          title: "14.4 Content Moderation & Removal",
          content:
            "Jinnar reserves the right to monitor, review, and remove User Content that violates these Terms or harms community trust. Content may be removed if it violates content standards, is reported and found to breach policies, appears fraudulent or spam, or contains personally identifiable information posted without consent. Jinnar will notify Users of removal where feasible but reserves the right to act without notice in urgent cases.",
        },
      ],
    },
    {
      title: "15. Termination & Suspension",
      subsections: [
        {
          title: "15.1 Grounds for Termination",
          content:
            "Jinnar may suspend or terminate accounts for: (a) breach of these Terms or Incorporated Policies; (b) fraudulent activity or misrepresentation; (c) harassment, discrimination, unsafe acts, or conduct endangering others; (d) payment manipulation or circumvention; (e) inactive accounts (e.g., 12+ months). Immediate suspension may occur without prior notice where urgent action is required to protect safety or prevent fraud.",
        },
        {
          title: "15.2 Suspension Process",
          content:
            "Unless severity warrants immediate action, Jinnar may apply progressive enforcement: (a) warning notice; (b) temporary feature suspension; (c) permanent termination. Suspension may apply to specific features or the entire account.",
        },
        {
          title: "15.3 Voluntary Termination & Effects",
          content:
            "Users may terminate their account anytime through account settings or by contacting support. Account closure does NOT release Users from prior obligations including payment duties and disputes. Upon termination, Users lose access; their profile, ratings, and content may be disabled or removed. Pending jobs may be canceled or settled at Jinnar's discretion.",
        },
        {
          title: "15.4 Appeals & Consequences",
          content:
            "Users may appeal termination decisions within seven (7) days of termination. Jinnar's determination on appeal is final within the Platform. Users who repeatedly violate Terms or commit severe breaches may be permanently banned. Terminated Users may NOT create new accounts without Jinnar's written consent.",
        },
        {
          title: "15.5 Survival of Obligations",
          content:
            "Payment obligations, dispute obligations, ratings records, privacy obligations, and indemnification obligations survive account termination. Termination does NOT prevent Jinnar from pursuing legal remedies for violations.",
        },
      ],
    },
    {
      title: "16. Limitation of Liability & Disclaimers",
      subsections: [
        {
          title: "16.1 Marketplace Nature",
          content:
            "Jinnar is a technology platform facilitating connections between independent Workers and Customers. Nothing creates an employment, agency, partnership, or joint venture relationship. Jinnar does NOT supervise, direct, or control Workers and is NOT responsible for the quality, timing, legality, or outcome of services performed under Service Contracts.",
        },
        {
          title: "16.2 No Guarantee of Jobs or Earnings",
          content:
            "Jinnar does NOT guarantee that Workers will receive jobs, earnings, or continued access. Opportunities depend on ratings, performance, demand, and compliance. Jinnar does NOT guarantee that Customers will find Workers meeting expectations or that services will be completed without delays or errors.",
        },
        {
          title: "16.3 Service Disclaimer",
          content:
            "The Platform is provided on an 'as is' and 'as available' basis WITHOUT warranties of any kind. To the maximum extent permitted by law, Jinnar disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, non-infringement, reliability, or accuracy. Jinnar does NOT endorse, guarantee, or verify the identity, background, skills, or reliability of any Worker or Customer.",
        },
        {
          title: "16.4 Limitation of Liability",
          content:
            "To the maximum extent permitted by law, Jinnar is NOT liable for indirect, incidental, special, consequential, exemplary, or punitive damages including lost profits, loss of data, business interruption, or reputational harm. Jinnar's total liability for direct damages shall NOT exceed the greater of: (a) total fees paid by the User in the preceding 3 months, or (b) USD $100.",
        },
        {
          title: "16.5 Force Majeure",
          content:
            "Jinnar is NOT liable for failure or delay caused by events beyond its reasonable control including natural disasters, war, terrorism, civil unrest, strikes, government actions, power outages, internet disruptions, or pandemics. Jinnar's obligations are suspended during Force Majeure Events; Jinnar will make reasonable efforts to notify Users and resume services.",
        },
        {
          title: "16.6 User Indemnification",
          content:
            "Users agree to indemnify, defend, and hold harmless Jinnar from claims, damages, liabilities, costs, or expenses arising from: (a) User's breach of these Terms; (b) services performed or received; (c) User Content infringing intellectual property rights; (d) User's negligence, misconduct, or unlawful acts. Users must cooperate fully in defense of indemnified claims.",
        },
      ],
    },
    {
      title: "17. Governing Law & Jurisdiction",
      subsections: [
        {
          title: "17.1 Applicable Law",
          content:
            "These Terms are governed by the laws of the Contracting Entity's jurisdiction (Jinnar's incorporation/registration jurisdiction) without regard to conflict-of-law principles. Where Users access the Platform outside the Contracting Entity's jurisdiction, local laws may also apply. Jinnar will comply with mandatory consumer protection and data protection laws in each jurisdiction of operation. If provisions conflict with mandatory local law, local law prevails but remaining Terms stay enforceable.",
        },
        {
          title: "17.2 Arbitration & Alternative Dispute Resolution",
          content:
            "Disputes not resolved through Jinnar's internal process shall be submitted to final and binding arbitration under the rules of a recognized arbitration body in the Contracting Entity's jurisdiction, unless prohibited by law. Arbitration shall take place in the principal city of the Contracting Entity's jurisdiction (e.g., Dar es Salaam, Tanzania). Proceedings shall be conducted in English unless otherwise required by law. Arbitration costs are shared equally unless the arbitrator determines otherwise.",
        },
        {
          title: "17.3 Exclusive Jurisdiction",
          content:
            "Users agree to submit to the exclusive jurisdiction of courts located in the Contracting Entity's jurisdiction for any legal proceedings. Venue lies exclusively in the courts of the principal city of the Contracting Entity's jurisdiction unless law provides otherwise. Either party may seek injunctive relief in any court of competent jurisdiction without waiving arbitration rights.",
        },
        {
          title: "17.4 Class Action Waiver",
          content:
            "To the fullest extent permitted by law, Users agree that disputes must be resolved individually. Users waive the right to participate in class, collective, consolidated, or representative actions against Jinnar. If this waiver is unenforceable, Section 17.2 (Arbitration) is void as to that dispute.",
        },
      ],
    },
    {
      title: "18. Final Provisions",
      subsections: [
        {
          title: "18.1 Entire Agreement",
          content:
            "These Terms, together with all Incorporated Policies, Supplemental Terms, and country-specific addenda, constitute the entire agreement between Users and Jinnar regarding Platform use. These Terms supersede all prior or contemporaneous understandings, agreements, or representations, whether written or oral.",
        },
        {
          title: "18.2 Severability",
          content:
            "If any provision is held invalid or unenforceable by a court or arbitrator, remaining provisions remain in full force. To the extent permitted by law, invalid provisions are replaced with valid provisions most closely reflecting original intent.",
        },
        {
          title: "18.3 Assignment & Transferability",
          content:
            "Jinnar may assign or transfer these Terms without notice to Users, including in connection with merger, acquisition, restructuring, or asset sale. Users may NOT assign or transfer rights or obligations without Jinnar's written consent. Unauthorized assignments are void.",
        },
        {
          title: "18.4 Notices & Contact Information",
          content:
            "Jinnar may provide notices through in-app notifications, email, SMS, or by posting on the Platform. Users may send formal legal notices to Jinnar's Legal Department at: [Insert Jinnar Contracting Entity Name], [Insert Physical Address], Email: [Insert Official Legal Contact Email]. Notices are deemed received: (a) if by email when transmitted; (b) if by in-app notification upon posting; (c) if by mail 5 business days after dispatch.",
        },
        {
          title: "18.5 Relationship of Parties",
          content:
            "Nothing in these Terms creates an employment, agency, partnership, or joint venture relationship between Jinnar and Users. Workers and Customers remain independent parties who contract directly with each other for services.",
        },
        {
          title: "18.6 Effective Date & Updates",
          content:
            "These Terms become effective on the Effective Date specified at the top of the document. The current version is always available on the Platform. Jinnar may modify these Terms with material changes communicated via email, in-app notice, or platform posting. Continued use after updates constitutes acceptance of revised Terms.",
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText size={32} className="text-[#38BDF8]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-600">
              "Trusted. Fair. Secure. Together on Jinnar."
            </p>
          </div>
        </div>

        <p className="text-xs font-medium text-gray-500 mt-4">
          Effective Date: November 26, 2025
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Table of Contents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
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
            Jinnar Platform, you acknowledge that you have read, understood, and
            agreed to these Terms of Service. These Terms constitute a legally
            binding agreement. If you do not agree to any part of these Terms,
            you must not use the Jinnar Platform. For questions or concerns
            regarding these Terms, please contact us at support@jinnar.com or
            through the in-app Help Center.
          </p>
        </div>
      </div>

      {/* Trust Statement */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-[#38BDF8] shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Our Commitment to You
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Jinnar is committed to operating fairly, transparently, and
                securely. We believe that trust is the foundation of our
                marketplace. These Terms reflect our commitment to protecting
                both Workers and Customers while fostering a community of
                respect, professionalism, and mutual accountability. Together,
                we're building an African informal sector marketplace that works
                for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
