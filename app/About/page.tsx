"use client";

import { Home, Info, Code, User, Github, Mail, Link as LinkIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/app/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';

const techStack = [
    { name: "Next.js", description: "React 框架" },
    { name: "TypeScript", description: "强类型 JavaScript" },
    { name: "Tailwind CSS", description: "CSS 框架" },
    { name: "shadcn/ui", description: "UI 组件库" },
    { name: "Recharts", description: "图表库" },
    { name: "Lucide React", description: "图标库" },
];

const AboutPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between max-w-5xl mx-auto px-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" passHref>
                            <Button variant="outline" size="icon" className="rounded-lg">
                                <Home className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold">关于此项目</h1>
                            <p className="text-sm text-muted-foreground">ESP32 Web 监控工具</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="rounded-lg" asChild>
                           <Link href="https://github.com/your-repo" target="_blank">
                             <Github className="w-5 h-5" />
                           </Link>
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            <main className="flex-1 py-8 px-4">
                <div className="w-full max-w-5xl mx-auto grid gap-8">
                    {/* Project Info Card */}
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-md bg-primary/10">
                                    <Info className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">项目简介</CardTitle>
                            </div>
                            <CardDescription>
                                一个用于实时监控 ESP32 设备传感器数据的现代化 Web 面板。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                该项目旨在提供一个美观、易用的界面，用于可视化来自 ESP32 微控制器的环境数据，例如温度、湿度、CPU 状态等。用户可以直观地看到实时数据仪表盘、历史数据图表以及详细的设备状态信息。
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tech Stack Card */}
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                           <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-md bg-primary/10">
                                    <Code className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">技术栈</CardTitle>
                            </div>
                            <CardDescription>
                                构建此项目所使用的核心技术。
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {techStack.map((tech) => (
                                <div key={tech.name} className="p-4 rounded-lg border bg-card/50 flex items-center gap-3">
                                    <div className="font-semibold">{tech.name}</div>
                                    <Badge variant="outline">{tech.description}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Developer Info Card */}
                    <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-md bg-primary/10">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">关于开发者</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">虚拟开发者</h3>
                                <p className="text-muted-foreground">全栈工程师 & IoT 爱好者</p>
                                <div className="flex items-center gap-4 pt-2">
                                    <Link href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </Link>
                                    <Link href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </Link>
                                     <Link href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                        <LinkIcon className="w-4 h-4" />
                                        Website
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default AboutPage;
