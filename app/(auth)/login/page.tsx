import LoginForm from "./login-form";

export default async function LoginPage({
    searchParams
}: {searchParams:{message?: string};}){
    const resolvedParams = await searchParams;
    return(
        
        <LoginForm initialMessage={resolvedParams?.message}></LoginForm>
            
    )
}