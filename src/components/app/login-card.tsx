import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LoginCardProps = {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function LoginCard({ title, description, children }: LoginCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
