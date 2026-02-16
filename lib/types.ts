
export type Role={
    name:string;
    skills:string[];
    resume_text?:string;
    mentions?:string;
    projects?:string[];
}

export type Experience={
    company:string;
    role:string;
    duration:string;
    description?:string;
}

export type User={
    name:string;
    email:string;
    primary_role?: string;
    roles_looking_for:Role[];
    experience:Experience[];
    resume_text:string;
    linkedin_url?:string;
    github_url?:string;
    portfolio_url?:string;
    proof_points?: string[];
    location?: string; 
    availability?: "immediate" | "1_month" | "3_months";
    custom_prompt?:string;
    GroqAPI:string;
}


export type ColdMailDraft={
    subject:string;
    body:string;
}   

export type ColdMailPreferences={
    tone:"casual"|"formal"|"professional";
    length:"short"|"medium"|"long";
    role:Role;
    mention:string;
    for:"Networking"|"Referral"|"Job Application";
}

