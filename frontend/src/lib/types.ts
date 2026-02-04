export interface Category {
    id: number;
    name: string;
    color: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    category_id?: number;
}
