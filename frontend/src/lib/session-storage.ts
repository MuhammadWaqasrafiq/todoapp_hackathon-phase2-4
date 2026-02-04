// Session storage utility for managing authentication state

export const getSession = async (): Promise<any> => {
    if (typeof window !== 'undefined') {
        const sessionStr = localStorage.getItem('session');
        if (sessionStr) {
            try {
                return JSON.parse(sessionStr);
            } catch (e) {
                console.error('Error parsing session:', e);
                return null;
            }
        }
    }
    return null;
};

export const setSession = async (session: any): Promise<void> => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('session', JSON.stringify(session));
    }
};

export const clearSession = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('session');
    }
};