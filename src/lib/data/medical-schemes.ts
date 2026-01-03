
export type MedicalScheme = {
    name: string;
    description: string;
    eligibility: string;
    link: string;
};

// This is a small, mock dataset. In a real application, this would come from a database or a reliable API.
export const medicalSchemes: MedicalScheme[] = [
    {
        name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
        description: "Provides a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 10.74 crore poor and vulnerable families.",
        eligibility: "Based on Socio-Economic Caste Census (SECC) 2011 data for rural and urban areas. It targets poor, deprived rural families and identified occupational category of urban workers' families.",
        link: "https://pmjay.gov.in/"
    },
    {
        name: "Rashtriya Swasthya Bima Yojana (RSBY)",
        description: "Provides health insurance coverage to Below Poverty Line (BPL) families. Beneficiaries are entitled to hospitalization coverage up to Rs. 30,000.",
        eligibility: "BPL families and 11 other defined categories of unorganized workers.",
        link: "https://www.india.gov.in/spotlight/rashtriya-swasthya-bima-yojana"
    },
    {
        name: "Central Government Health Scheme (CGHS)",
        description: "Provides comprehensive medical care to the Central Government employees and pensioners enrolled under the scheme.",
        eligibility: "Serving and retired Central Government employees, their families, and other specific groups.",
        link: "https://cghs.gov.in/"
    },
    {
        name: "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
        description: "Aims to provide assured, comprehensive and quality antenatal care, free of cost, universally to all pregnant women on the 9th of every month.",
        eligibility: "All pregnant women in their second or third trimesters.",
        link: "https://pmsma.nhp.gov.in/"
    },
    {
        name: "Janani Shishu Suraksha Karyakram (JSSK)",
        description: "Entitles all pregnant women delivering in public health institutions to absolutely free and no expense delivery, including caesarean section. Also covers sick infants.",
        eligibility: "All pregnant women and sick newborns accessing public health institutions.",
        link: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=841&lid=223"
    },
    {
        name: "Rashtriya Bal Swasthya Karyakram (RBSK)",
        description: "An initiative for early identification and early intervention for children from birth to 18 years to cover 4 ‘D’s viz. Defects at birth, Deficiencies, Diseases, Development delays including disability.",
        eligibility: "Children aged 0–18 years in rural areas and urban slums.",
        link: "https://rbsk.gov.in/"
    },
     {
        name: "Health Minister's Cancer Patient Fund (HMCPF)",
        description: "Provides financial assistance to the poor patients suffering from cancer.",
        eligibility: "Patients living below poverty line, suffering from cancer and undergoing treatment in any of the 27 Regional Cancer Centres (RCCs).",
        link: "https://main.mohfw.gov.in/?q=major-programmes/poor-patients-financial-assistance/health-ministers-cancer-patient-fund-hmcpf-ran"
    },
    {
        name: "Janani Suraksha Yojana (JSY)",
        description: "A safe motherhood intervention under the National Health Mission (NHM) to reduce maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.",
        eligibility: "Pregnant women from Below Poverty Line (BPL), SC, ST households in all states and UTs. In states with low institutional delivery rates, it covers all pregnant women.",
        link: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=840&lid=222"
    },
    {
        name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        description: "A maternity benefit program offering cash incentives of ₹5,000 in three installments to pregnant women and lactating mothers for the first live birth.",
        eligibility: "All pregnant women and lactating mothers, excluding those who are in regular employment with the Central Government or State Government or PSUs or those who are in receipt of similar benefits under any law for the time being.",
        link: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana"
    },
    {
        name: "Ayushman Bharat – Senior Citizen Extension",
        description: "An extension of the PM-JAY scheme to cover senior citizens (aged 70 and above) who are not part of the SECC database, providing them with a health cover of Rs. 5 lakhs per family per year.",
        eligibility: "All senior citizens aged 70 years and above who are not currently beneficiaries under PM-JAY or other government-funded health insurance schemes.",
        link: "https://pmjay.gov.in/senior-citizen-health-insurance-scheme"
    },
    {
        name: "Free Diagnostics Service Initiative (FDSI)",
        description: "Aims to provide a set of essential diagnostics (laboratory and radiology) free of cost in public health facilities.",
        eligibility: "All patients visiting public health facilities. The range of free diagnostics varies by facility level (Sub-centre, PHC, CHC, District Hospital).",
        link: "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1063&lid=641"
    },
    {
        name: "National Programme for the Health Care for the Elderly (NPHCE)",
        description: "Provides for accessible, affordable, and high-quality long-term, comprehensive and dedicated care services to an Ageing population. This includes services for common elderly diseases like dementia and Alzheimer's.",
        eligibility: "All senior citizens (60 years and above) in identified districts. Services are provided at various levels from PHC to District Hospitals and Regional Geriatric Centres.",
        link: "https://main.mohfw.gov.in/major-programmes/Non-Communicable-Diseases-Injury-Trauma/national-programme-health-care-elderly-nphce"
    }
];
