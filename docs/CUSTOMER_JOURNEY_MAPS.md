# 🗺️ Customer Journey Maps (CJM)

Mapping the end-to-end experience for every primary user of The Bean Route.

---

## 1. The Vendor Journey (Onboarding to Winning)
*Goal: Move from "Interested Vendor" to "Booked Pro".*

### Stage 1: Awareness
- **Entry Point:** Landing page or SEO blog (Pricing Guide).
- **Need:** Understand value proposition and visibility potential.
- **Pain Point:** Is it worth my time to list?

### Stage 2: Registration (`/vendors/register`)
- **Action:** Multi-step application submission.
- **Barrier:** 30+ character description requirement; Multiple choice suburbs.
- **Gap:** No way to show off their setup (Images).

### Stage 3: The Wait
- **Trigger:** Application Received email.
- **Pain Point:** 24hr review cycle is "dead time" without a dashboard.

### Stage 4: Activation
- **Trigger:** Admin Approval → Welcome Email.
- **Result:** Listing goes live on `/app`.

---

## 2. The Event Planner Journey (Browse to Inquire)
*Goal: Find the perfect cart without the back-and-forth.*

### Stage 1: Discovery (`/app`)
- **Action:** Filter by suburb and type (Cart vs Shop).
- **Need:** Instant price transparency and availability.

### Stage 2: Investigation (`/vendors/[slug]`)
- **Action:** Review specialty, pricing, and capacity.
- **Gap:** Lack of photos makes it hard to trust the brand's aesthetic.

### Stage 3: The Connection
- **Action:** Direct Inquiry (Dual email trigger).
- **Result:** Planner gets confirmation; Vendor gets lead.

---

## 3. The Job Owner Journey (Post to Connect)
*Goal: Crowdsource quotes for a specific event.*

### Stage 1: Posting (`/jobs/create`)
- **Action:** Define event details and budget range.
- **Pain Point:** No account means they must save the confirmation email to return.

### Stage 2: The Harvest
- **Action:** Receiving quotes via email alerts.
- **Interaction:** Reviewing Quote Card in `/jobs/[id]`.

### Stage 3: Decision
- **Action:** Contacting the vendor directly (or "Accept Quote" flow).

---

## 4. Admin Journey (Manage & Moderate)
*Goal: Keep the marketplace clean and high-quality.*

- **Login:** OTP via email (AuthGate).
- **Table View:** Scanning Inquiries, Applications, and Jobs.
- **Mutation:** Approve/Reject (Triggers decision emails).

---

## 5. Technical Guardrails & Safety
*Goal: Ensure the integrity of the marketplace.*

- **Rate Limiting:** Protects the funnel at every stage (Registration, Inquiry, Job Post). 
- **Atomic Verification:** OTP codes are purged from the DB immediately upon successful verification.
- **Signed Sessions:** Admin session cookies are encrypted with a rotating secret to prevent session hijacking.
- **RLS Lockdown:** The database itself rejects any unauthorized mutations, even if an API key is leaked.
