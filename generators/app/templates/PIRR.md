# Private/Internal Reasoning Record

## What visibility is the repository set to?

The repository is set to: **{{ repository_visibility | capitalize }}**

## What decision led to this?

### Good reasons

1. **Infrastructure As Code:**
   - The repository contains infrastructure as code (IaC) scripts that configure critical components of our internal
     systems. Keeping these scripts private/internal helps safeguard sensitive configurations and prevents unauthorised
     access.

2. **Sensitive Data:**
   - The repository contains sensitive data, such as intellectual property/proprietary information. By keeping it
     private/internal, we reduce the risk of unauthorised access and maintain control over who can view or modify the
     code.

3. **Temporary Repository:**
   - This repository is intended for temporary use, such as for testing or experimentation. By keeping it
     private/internal, we maintain control over who can access and modify the code, reducing the risk of unintended
     changes or exposure.

4. **Awaiting Security Risk Adviser Guidance:**
   - Pending guidance from our security risk advisers, it's prudent to keep the repository private/internal to minimise
     exposure to potential vulnerabilities or security risks.

5. **Non-Public Code:**
   - The code in this repository is not intended for public release. It may contain training materials,
     proof-of-concept (PoC) code, or other proprietary information that is not suitable for public distribution.

### Bad reasons

1. **No Use to the Public**

2. **Lack of Understanding (idk..):**
   - Making decisions based on uncertainty or lack of understanding is not advisable. It's essential to thoroughly
     evaluate the implications of repository visibility and consider the broader context of security, compliance, and
     organisational needs.
