"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, LayoutGrid, Settings, Info, AlertCircle, Pencil, Thermometer, Droplets, Cpu, HardDrive, Activity, Wifi, TrendingUp, Clock } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/app/theme-toggle";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

// --- Data Fetching and State Management ---
interface SensorData {
    id: string;
    temperature: number;
    humidity: number;
    cpuTemp: number;
    lm75Temp: number; // Add lm75Temp to SensorData interface
    memoryUse: number;
    cpuUse: number;
    wifiRssi: number;
    lastUpdated: string;
    history: { time: string; temperature: number; humidity: number }[];
}

async function fetchIotData(): Promise<SensorData> {
    const response = await fetch("/api/iot-data");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // 兜底处理 memoryUse，防止 NaN
    const rawMemoryUse = data.current.memoryUse;
    const validMemoryUse = typeof rawMemoryUse === 'number' && !isNaN(rawMemoryUse) ? rawMemoryUse : 0;

    // Map the received data to the SensorData interface
    return {
        id: "ESP32", // Assuming a fixed ID for now, or you can get it from the API if available
        temperature: data.current.temperature,
        humidity: data.current.humidity,
        cpuTemp: data.current.cpuTemp,
        lm75Temp: data.current.lm75Temp, // Map lm75Temp from the API response
        memoryUse: 320 - validMemoryUse, // 兜底后再计算
        cpuUse: data.current.cpuUse,
        wifiRssi: data.current.wifiRssi,
        lastUpdated: data.current.lastUpdated,
        history: data.history.map((item: any) => ({
            time: item.name,
            temperature: item.temperature,
            humidity: item.humidity,
        })),
    };
}

// --- Enhanced shadcn Components ---

function CircularGauge({ value, unit, label, setLabel, maxValue = 100, color = "hsl(var(--primary))", icon: Icon }: { 
    value: number, 
    unit: string, 
    label: string, 
    setLabel: (label: string) => void,
    maxValue?: number,
    color?: string,
    icon?: any
}) {
    const circumference = 2 * Math.PI * 45;
    const progress = Math.min(Math.max(value, 0), maxValue) / maxValue;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <Card className="h-full group hover:shadow-lg transition-all duration-300 border-border/50">
            <CardContent className="flex flex-col items-center justify-center p-8 h-full">
                <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                            className="text-muted/30" 
                            strokeWidth="8" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="45" 
                            cx="50" 
                            cy="50" 
                        />
                        <circle
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke={color}
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: strokeDashoffset,
                                transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            className="drop-shadow-sm"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {Icon && (
                            <div className="mb-3 p-2 rounded-full bg-primary/10">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                        )}
                        <span className="text-4xl md:text-5xl font-bold text-foreground">
                            {value.toFixed(1)}
                            <span className="text-2xl md:text-3xl align-top text-muted-foreground ml-1">{unit}</span>
                        </span>
                    </div>
                </div>
                <div className="w-full max-w-[200px]">
                    <Input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="text-center text-lg font-medium border-dashed focus:border-solid transition-all duration-200"
                        placeholder="Enter label"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function HistoryCard({ historyData }: { historyData: SensorData['history'] }) {
    return (
        <Card className="h-full hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-xl">环境数据趋势</CardTitle>
                        <CardDescription>最近30分钟的温湿度变化曲线</CardDescription>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        实时
                    </Badge>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <div className="mb-4 flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-muted-foreground">温度 (°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-muted-foreground">湿度 (%)</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0.05}/>
                            </linearGradient>
                            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0.05}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <XAxis 
                            dataKey="time" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: 'white' }}
                        />
                        <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: 'white' }}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                `${value.toFixed(1)}${name === 'temperature' ? '°C' : '%'}`,
                                name === 'temperature' ? '温度' : '湿度'
                            ]}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'calc(var(--radius) - 2px)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="temperature" 
                            stroke="hsl(0 84% 60%)" 
                            strokeWidth={2.5}
                            fill="url(#temperatureGradient)"
                            dot={false}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="humidity" 
                            stroke="hsl(221 83% 53%)" 
                            strokeWidth={2.5}
                            fill="url(#humidityGradient)"
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

function SensorDetails({ data, sensorName, setSensorName }: { data: SensorData, sensorName: string, setSensorName: (name: string) => void }) {
    const detailItems = [
        { 
            label: "环境温度 (SHT20)", 
            value: `${data.temperature.toFixed(1)}°C`, 
            icon: Thermometer, 
            trend: data.temperature > 25 ? "high" : "normal",
            color: "text-red-600 dark:text-red-400"
        },
        { 
            label: "板载温度 (LM75)", 
            value: `${data.lm75Temp.toFixed(1)}°C`, 
            icon: Thermometer, 
            trend: data.lm75Temp > 35 ? "high" : "normal",
            color: "text-yellow-600 dark:text-yellow-400"
        },
        { 
            label: "空气湿度", 
            value: `${data.humidity.toFixed(1)}%`, 
            icon: Droplets,
            trend: data.humidity > 60 ? "high" : "normal",
            color: "text-blue-600 dark:text-blue-400"
        },
        { 
            label: "CPU温度", 
            value: `${data.cpuTemp.toFixed(1)}°C`, 
            icon: Cpu,
            trend: data.cpuTemp > 45 ? "high" : "normal",
            color: "text-purple-600 dark:text-purple-400"
        },
        { 
            label: "内存使用", 
            value: `${data.memoryUse} KB`,
            icon: HardDrive,
            trend: "normal",
            color: "text-green-600 dark:text-green-400"
        },
        { 
            label: "CPU使用率", 
            value: `${data.cpuUse.toFixed(0)}%`, 
            icon: Activity,
            trend: data.cpuUse > 80 ? "high" : "normal",
            color: "text-orange-600 dark:text-orange-400"
        },
        { 
            label: "WiFi信号", 
            value: `${data.wifiRssi} dBm`, 
            icon: Wifi,
            trend: data.wifiRssi < -70 ? "low" : "normal",
            color: "text-cyan-600 dark:text-cyan-400"
        },
    ];

    return (
        <Card className="h-full hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                            <Wifi className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={sensorName}
                                    onChange={(e) => setSensorName(e.target.value)}
                                    className="border-none p-0 h-auto text-xl font-semibold bg-transparent focus-visible:ring-0 shadow-none"
                                />
                                <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs font-mono">
                                    ID: {data.id}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-muted-foreground">在线</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {detailItems.map((item, index) => (
                        <div 
                            key={item.label} 
                            className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-md bg-muted/50 group-hover:bg-muted transition-colors ${item.color.replace('text-', 'text-').replace('dark:', '')}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{item.label}</div>
                                    {item.trend === "high" && (
                                        <Badge variant="secondary" className="text-xs mt-1">
                                            偏高
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-lg">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="w-full p-3 rounded-lg bg-muted/30 border border-dashed">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>最后更新于 {new Date(data.lastUpdated).toLocaleTimeString()}</span>
              </div>
              </div>
            </CardFooter>
        </Card>
    );
}

// --- Main Component ---
export default function Home() {
    const [data, setData] = useState<SensorData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sensorName, setSensorName] = useState("智能环境传感器");
    const [tempLabel, setTempLabel] = useState("环境温度");
    const [humidityLabel, setHumidityLabel] = useState("空气湿度");

    useEffect(() => {
        const getData = async () => {
            try {
                const iotData = await fetchIotData();
                setData(iotData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            }
        };

        getData(); // 首次立即请求
        const intervalId = setInterval(getData, 30000); // 30秒请求一次

        return () => clearInterval(intervalId);
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>连接错误</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-foreground mb-2">连接传感器中...</p>
                <p className="text-sm text-muted-foreground">正在获取实时数据</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {/* 关键改动在这里：应用和 main 内容区完全一样的居中和宽度限制 */}
                <div className="flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">IoT 监控面板</h1>
                            <p className="text-sm text-muted-foreground">实时环境数据监测</p>
                        </div>
                    </div>
                    <nav className="flex items-center space-x-1">
                        <Link href="/History" passHref>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                                <LineChart className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="https://spitha.pages.dev" passHref>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                                <LayoutGrid className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="rounded-lg">
                            <Settings className="w-5 h-5" />
                        </Button>
                        <Link href="/About" passHref>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                                <Info className="w-5 h-5" />
                            </Button>
                        </Link>
                        <ModeToggle />
                    </nav>
                </div>
            </header>

            <main className="flex-1 py-8 px-4">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <CircularGauge 
                            value={data.temperature} 
                            unit="°C" 
                            label={tempLabel} 
                            setLabel={setTempLabel}
                            maxValue={50}
                            color="hsl(0 84% 60%)"
                            icon={Thermometer}
                        />
                        <CircularGauge 
                            value={data.humidity} 
                            unit="%" 
                            label={humidityLabel} 
                            setLabel={setHumidityLabel}
                            maxValue={100}
                            color="hsl(221 83% 53%)"
                            icon={Droplets}
                        />
                        <div className="lg:row-span-2">
                            <SensorDetails data={data} sensorName={sensorName} setSensorName={setSensorName} />
                        </div>
                        <div className="lg:col-span-2">
                            <HistoryCard historyData={data.history} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}