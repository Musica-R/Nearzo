import LegalPage from "../../components/LegalPage/LegalPage";

const sections = [
  {
    heading: "About Lokal",
    blocks: [
      "Lokal provides an online platform through which businesses and service providers may create or submit listings and users may discover and contact those businesses.",
      "Lokal primarily acts as a platform for discovery and connection. Unless specifically stated otherwise, Lokal is not the service provider, seller, contractor, trainer, shop owner, gym owner, electrician, plumber or other business listed on the platform.",
    ],
  },
  {
    heading: "Eligibility",
    blocks: [
      "You must provide accurate information when using Lokal. By using Lokal, you represent that you are legally capable of entering into an agreement under applicable law. If you use Lokal on behalf of a business or organization, you represent that you have authority to act on its behalf.",
    ],
  },
  {
    heading: "User Accounts",
    blocks: [
      "Where account registration is available, users may be required to provide a name, phone number, email address, password and other required information. Users are responsible for maintaining the confidentiality of their account credentials.",
      "Users must not:",
      [
        "Share account credentials with unauthorized persons",
        "Create accounts using false information",
        "Impersonate another person",
        "Use another person's account without authorization",
        "Attempt to access another user's account",
      ],
    ],
  },
  {
    heading: "Vendor Registration",
    blocks: [
      "Businesses and service providers may register or submit their businesses for listing on Lokal, providing information such as business name, contact person's name, phone/WhatsApp number, email, address, category, description, services, photographs, Google Maps location, operating hours and expected pricing.",
      "The vendor is responsible for ensuring that all submitted information is accurate, lawful and up to date.",
    ],
  },
  {
    heading: "Vendor Listing Rules",
    blocks: [
      "Vendors must not submit misleading, fraudulent or false information, or use Lokal to promote:",
      [
        "Illegal activities or fraudulent businesses",
        "Fake services or misleading offers",
        "Inappropriate content",
        "Content that infringes intellectual property rights",
        "Content that violates applicable law",
        "False claims about qualifications or certifications",
        "Another person's business without authorization",
      ],
      "Lokal may reject, edit, suspend or remove a listing if it believes the listing violates these Terms or creates legal, safety or reputational concerns.",
    ],
  },
  {
    heading: "Vendor Responsibility",
    blocks: [
      "Vendors are solely responsible for their services, products, employees or representatives, pricing, business licenses and registrations, professional qualifications, service quality, customer communication and relationships, taxes and regulatory obligations, and compliance with applicable laws. Lokal does not take responsibility for the acts, omissions, representations or services of independent vendors.",
    ],
  },
  {
    heading: "No Automatic Endorsement",
    blocks: [
      "The appearance of a business on Lokal does not necessarily mean that Lokal endorses, certifies, guarantees or recommends that business. A listing should not be interpreted as a guarantee of quality, safety, qualification, license, certification, experience, reliability, pricing, availability or performance.",
    ],
  },
  {
    heading: "User Responsibility",
    blocks: [
      "Users are responsible for evaluating a business before purchasing or using its services, and should independently confirm business identity, availability, price, address, hours, qualifications, licenses, service terms, cancellation policies and payment terms.",
    ],
  },
  {
    heading: "Enquiries and Communication",
    blocks: [
      "Lokal may provide features that allow users to send enquiries to vendors. Relevant information may be shared with the applicable vendor to facilitate the enquiry. Once a user contacts a vendor directly through phone, WhatsApp or other external channels, the communication is between the user and vendor, and Lokal is not responsible for it.",
    ],
  },
  {
    heading: "Pricing",
    blocks: [
      "Vendors may provide expected or estimated prices, which may be subject to change based on service requirements, quantity, location, materials, travel, duration, additional work or vendor pricing policies. Users should confirm the final price directly with the vendor before purchasing or engaging a service.",
    ],
  },
  {
    heading: "Business Photos and Content",
    blocks: [
      "By submitting content to Lokal, the vendor confirms they have the necessary rights, permissions or authorization to submit and display that content, and must not upload content that infringes another person's copyright, trademark, privacy or other legal rights.",
    ],
  },
  {
    heading: "Google Maps and Business Location",
    blocks: [
      "Vendors are responsible for ensuring that the location submitted for their business is accurate. Lokal does not guarantee the accuracy of map information, directions, addresses or location data.",
    ],
  },
  {
    heading: "Third-Party Services",
    blocks: [
      "Lokal may use third-party mapping, hosting, payment, authentication, analytics, communication and storage services. Use of these services may be subject to the respective third party's own terms and policies.",
    ],
  },
  {
    heading: "Prohibited Use",
    blocks: [
      "You must not use Lokal to:",
      [
        "Commit or facilitate unlawful activities",
        "Submit fraudulent information or create fake listings",
        "Impersonate another person or business",
        "Scrape or copy platform information without authorization",
        "Attempt unauthorized access to Lokal systems",
        "Introduce malware or harmful code",
        "Interfere with platform operations",
        "Abuse enquiry or communication features",
        "Harass or threaten users or vendors",
        "Publish confidential information belonging to others",
        "Infringe intellectual property rights",
        "Circumvent security mechanisms",
      ],
    ],
  },
  {
    heading: "Intellectual Property",
    blocks: [
      "The Lokal platform, including branding, logo, design, layout, software and original content, may be protected by applicable intellectual property laws. You may not reproduce, modify, distribute, sell, publish or commercially exploit Lokal's protected materials without authorization.",
      "By submitting content for listing purposes, the vendor grants Lokal permission to host, display, reproduce, format and use that content as reasonably necessary to operate, promote and improve the platform.",
    ],
  },
  {
    heading: "Availability of the Platform",
    blocks: [
      "Lokal aims to provide reliable access but does not guarantee the website or services will always be available, uninterrupted, error-free, secure or free from technical problems.",
    ],
  },
  {
    heading: "Listing Modification, Suspension and Removal",
    blocks: [
      "Lokal may, at its discretion and subject to applicable law, reject, edit, suspend or remove a listing, or suspend or terminate an account, where information is false, misleading, unlawful, outdated, abusive, inappropriate or otherwise violates these Terms.",
    ],
  },
  {
    heading: "Disclaimer Regarding Vendor Services",
    blocks: [
      "Lokal does not directly control the quality, safety, legality, availability or performance of services provided by independent vendors. Any agreement or transaction between a user and vendor is primarily between those parties.",
    ],
  },
  {
    heading: "Limitation of Liability",
    blocks: [
      "To the extent permitted by applicable law, Lokal shall not be responsible for losses, damages, disputes or claims arising from vendor services or misconduct, incorrect vendor information or pricing, vendor availability, user-vendor communications, products or services purchased from vendors, delays or cancellations, third-party websites, or temporary platform interruptions.",
    ],
  },
  {
    heading: "User-Vendor Disputes",
    blocks: [
      "If a dispute arises between a user and a vendor, the parties should first attempt to resolve the matter directly. Lokal may assist with communication or platform-related concerns where appropriate, but is not automatically a party to agreements between users and vendors.",
    ],
  },
  {
    heading: "Privacy",
    blocks: [
      "Your use of Lokal is also subject to our Privacy Policy, which explains how information is collected and processed.",
    ],
  },
  {
    heading: "Third-Party Links",
    blocks: [
      "Lokal listings or platform content may contain links or references to third-party websites and services. Users access third-party websites at their own discretion and risk.",
    ],
  },
  {
    heading: "Changes to These Terms",
    blocks: [
      "Lokal may update these Terms from time to time. Continued use of Lokal after updated Terms are published may constitute acceptance of the updated Terms, to the extent permitted by applicable law.",
    ],
  },
  {
    heading: "Termination",
    blocks: [
      "Users may stop using Lokal at any time. Lokal may suspend or terminate access due to violation of these Terms, fraudulent activity, abuse, security concerns, legal requirements or other legitimate operational reasons.",
    ],
  },
  {
    heading: "Governing Law and Jurisdiction",
    blocks: [
      "These Terms shall be governed by the applicable laws of India. Subject to applicable law, disputes shall be subject to the jurisdiction of the competent courts in Salem, Tamil Nadu, India.",
    ],
  },
];

const TermsAndConditions = () => (
  <LegalPage
    title="Terms and Conditions"
    lastUpdated="27 August 2026"
    intro={[
      "Welcome to Lokal.",
      "These Terms and Conditions govern your access to and use of the Lokal website, applications and related services. By accessing or using Lokal, you agree to comply with these Terms and Conditions. If you do not agree with these Terms, please do not use the platform.",
    ]}
    sections={sections}
    contact={{
      intro:
        "If you have questions, complaints, suggestions or concerns regarding these Terms and Conditions, please contact:",
      name: "Lokal",
      address: [
        "1/248, Raja Ganapathy Complex,",
        "2nd Floor, Opposite BSNL Office,",
        "Meyyanur Main Road,",
        "Salem – 636004, Tamil Nadu, India.",
      ],
      email: "mpeoplesofficial@gmail.com",
      phone: "+919487812715",
    }}
  />
);

export default TermsAndConditions;