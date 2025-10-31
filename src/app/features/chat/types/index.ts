export interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
}

export interface Employer {
    id: string;
    company_name: string;
    email: string;
    logo_url: string;
}

export interface Conversation {
    id: number;
    employer_id: number;
    user: User;
    employer: Employer;
    unread_count: number;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: string;
    sender_type: 'user' | 'employer';
    recipient_id: string;
    recipient_type: 'user' | 'employer';
    content: string;
    read: boolean;
    created_at: string;
}

export interface PaginatedMessages {
    data: Message[];
    total: number;
    page: number;
    limit: number;
}

export interface NewMessagePayload {
    conversation_id: number;
    recipient_id: string;
    recipient_type: 'user' | 'employer';
    content: string;
}
