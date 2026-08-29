import LegalPage from "../../components/LegalPage/LegalPage";

const sections = [
  {
    heading: "About Lokal",
    blocks: [
      "Lokal operates as a platform for discovering and connecting with local businesses and service providers.",
      "Examples of businesses and services that may be listed on Lokal include:",
      [
        "Home services such as electricians, plumbers, cleaning services and technicians",
        "Learning and training providers",
        "Sports and fitness businesses",
        "Gyms and fitness centres",
        "Nearby shops",
        "Professional service providers",
        "Local businesses and service providers in different categories",
      ],
      "Lokal is generally a platform connecting users and vendors. Unless specifically stated otherwise, Lokal does not itself provide the services advertised by vendors.",
    ],
  },
  {
    heading: "Information We Collect",
    blocks: [
      "We may collect information from two main groups: users who use Lokal to discover or contact businesses, and vendors/business owners who register or submit their business for listing. The type of information collected may vary depending on how you use the platform.",
    ],
  },
  {
    heading: "Information Collected From Users",
    blocks: [
      [
        "Name, email address, phone number",
        "Address, where voluntarily provided",
        "Enquiry or message details",
        "Information submitted through contact or enquiry forms",
        "Selected service or business information",
        "Location information, where permission is provided",
        "Device and browser information, IP address",
        "Website usage information and interactions with listings",
      ],
      "Users should only provide information that is necessary for the purpose of making an enquiry or using a Lokal service.",
    ],
  },
  {
    heading: "Information Collected From Vendors",
    blocks: [
      [
        "Vendor/business name, contact person's name",
        "Phone number, WhatsApp number, email address",
        "Business address, category, description, services offered",
        "Business photographs, logo or other uploaded images",
        "Google Maps or business location, operating hours",
        "Expected or displayed pricing",
        "Other business-related information required to create a listing",
      ],
      "Vendors are responsible for ensuring that the information they submit to Lokal is accurate, current and lawful.",
    ],
  },
  {
    heading: "Publicly Displayed Vendor Information",
    blocks: [
      "Some information submitted by vendors may be displayed publicly on Lokal so that users can discover and contact the business, including business name, category, description, services, photographs, address, location/map, hours, phone number, WhatsApp number, email address and pricing.",
      "Vendors should not submit confidential, private, financial, password, identity-document or other sensitive information for public display. By submitting information specifically for a public business listing, the vendor authorizes Lokal to use and display that information for the purpose of operating and promoting the listing.",
    ],
  },
  {
    heading: "How We Use Information",
    blocks: [
      [
        "Creating and managing user and vendor accounts",
        "Publishing business listings and helping users discover nearby businesses",
        "Connecting users with vendors and processing enquiries",
        "Displaying business information and improving search and discovery",
        "Improving website functionality and providing customer support",
        "Verifying or reviewing listings",
        "Detecting misuse, fraud or suspicious activity, and maintaining security",
        "Understanding website usage and improving Lokal's products and services",
        "Complying with applicable legal obligations",
        "Sending service-related communications",
      ],
      "We may also use aggregated or non-identifying information for analytics, reporting and service improvement.",
    ],
  },
  {
    heading: "User Enquiries and Contact Information",
    blocks: [
      "When a user submits an enquiry about a business or service, the information provided may be used to facilitate communication with the relevant vendor. Where necessary to fulfil the enquiry, Lokal may share the relevant enquiry information with the applicable vendor.",
      "Once information is shared with a vendor, the vendor may process it according to the vendor's own privacy practices. Lokal is not responsible for how an independent vendor subsequently uses information received from a user, except to the extent required by applicable law.",
    ],
  },
  {
    heading: "Phone and WhatsApp Communication",
    blocks: [
      "Where a vendor provides a phone number or WhatsApp number for public contact, Lokal may display those contact details through the listing. Lokal does not control communications that occur directly between users and vendors through phone calls, WhatsApp or other external services.",
      "Users and vendors should exercise appropriate caution when sharing personal, financial or confidential information.",
    ],
  },
  {
    heading: "Location and Google Maps",
    blocks: [
      "Lokal may use location information to help users discover nearby businesses. Business locations submitted by vendors may be displayed using mapping services such as Google Maps.",
      "Vendors are responsible for providing an accurate business location. Users may control location permissions through their device or browser settings.",
    ],
  },
  {
    heading: "Photos and Images",
    blocks: [
      "By uploading an image, the vendor represents that they have the necessary rights or permission to use the image, it does not infringe another person's intellectual property rights, it does not contain unlawful content, and appropriate consent has been obtained where required.",
      "Lokal may display, resize, format, store or technically modify submitted images, and may remove images that violate these terms or applicable law.",
    ],
  },
  {
    heading: "Pricing and Business Information",
    blocks: [
      "Pricing displayed on Lokal may be provided by vendors and may change without notice. Lokal does not guarantee that a displayed price will remain current or match the final price charged. Users should confirm the final price, availability and terms directly with the vendor before purchasing a service.",
    ],
  },
  {
    heading: "Cookies and Similar Technologies",
    blocks: [
      "Lokal may use cookies to maintain website functionality, remember preferences, understand usage, improve experience, maintain security, and analyze traffic. Users may control cookies through their browser settings; disabling certain cookies may affect functionality.",
    ],
  },
  {
    heading: "Device and Technical Information",
    blocks: [
      "IP address, browser and device type, operating system, approximate location derived from technical information, pages visited, date and time of access, referring pages and interaction information may be automatically collected for security, analytics, troubleshooting and improvement.",
    ],
  },
  {
    heading: "Third-Party Services",
    blocks: [
      "Lokal may use third-party services relating to maps and location, hosting, analytics, authentication, communication, image/file storage, security and payment processing. Third-party services process information according to their own terms; Lokal does not control their privacy practices.",
    ],
  },
  {
    heading: "Information Sharing",
    blocks: [
      [
        "With the vendor relevant to a user's enquiry",
        "With service providers assisting in operating Lokal (hosting, storage, analytics, security)",
        "Where required by law or legal process",
        "To protect the rights, safety or property of Lokal, users or others",
        "To investigate fraud, abuse or security incidents",
        "In connection with a business transfer, merger, acquisition or restructuring",
      ],
      "Lokal does not intend to sell users' personal information merely for the purpose of selling personal information.",
    ],
  },
  {
    heading: "Vendor Responsibility for Personal Information",
    blocks: [
      "Vendors must not upload or publish personal information belonging to another person without appropriate authority, consent or legal basis, and must not use Lokal to publish passwords, bank credentials, payment card information, government identification numbers, confidential documents or other sensitive personal information that is not necessary for the listing.",
    ],
  },
  {
    heading: "Data Security",
    blocks: [
      "Lokal takes reasonable technical and organizational measures to protect information against unauthorized access, misuse, alteration, disclosure or destruction. No website, application, server or electronic transmission can be guaranteed to be completely secure.",
    ],
  },
  {
    heading: "Data Retention",
    blocks: [
      "Lokal may retain information for as long as reasonably necessary for providing services, maintaining accounts and listings, business and operational purposes, resolving disputes, preventing fraud, maintaining security and complying with legal obligations. When no longer required, information may be deleted or anonymized.",
    ],
  },
  {
    heading: "Account and Listing Deletion",
    blocks: [
      "Users and vendors may contact Lokal to request deletion or correction of information associated with their account or listing, subject to applicable legal, security and operational requirements.",
    ],
  },
  {
    heading: "Children's Privacy",
    blocks: [
      "Lokal is not intended to knowingly collect personal information from children where such collection is prohibited by applicable law. Parents or guardians who believe a child has provided personal information to Lokal may contact us to request appropriate action.",
    ],
  },
  {
    heading: "Vendor Verification and Accuracy",
    blocks: [
      "Lokal may review, verify, modify, reject, suspend or remove business listings where necessary, but does not guarantee that every listing's information is accurate, complete or current. Users should independently verify important information before engaging a vendor.",
    ],
  },
  {
    heading: "Changes to This Privacy Policy",
    blocks: [
      "Lokal may update this Privacy Policy from time to time. Updated versions will be published on this page with a revised 'Last Updated' date.",
    ],
  },
];

const PrivacyPolicy = () => (
  <LegalPage
    title="Privacy Policy"
    lastUpdated="27 August 2026"
    intro={[
      "Welcome to Lokal.",
      "Lokal is a business and service discovery platform that helps users discover and connect with nearby businesses, service providers, shops, learning and training providers, sports and fitness businesses, home-service providers, and other local businesses.",
      "This Privacy Policy explains how Lokal collects, uses, stores, shares and protects information provided by users and vendors while using the Lokal website, applications and related services. By accessing or using Lokal, you acknowledge that you have read and understood this Privacy Policy.",
    ]}
    sections={sections}
    contact={{
      intro:
        "For questions, privacy requests, corrections or concerns regarding this Privacy Policy, please contact:",
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

export default PrivacyPolicy;