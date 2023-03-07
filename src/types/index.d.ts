export interface Description {
    icon: string;
    targetAge: string;
}

export interface User {
    name: string;
    grade: string;
    email: string;
    title: string;
    schedule: string;
}

export type FormStatus = 'closed' | 'accepting' | 'succeeded' | 'failed';