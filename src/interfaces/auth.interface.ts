export interface LoginRequest{
    email: string;
    password: string;
}

export interface LoginResponse{
    success: boolean;
    message: string;
    flag?: boolean;
}

export interface LoginFormProps{
    onLogin: (
        email: string, 
        password: string
    ) => void;
    onRegister: () => void;
    loading: boolean;
    error: string;
}