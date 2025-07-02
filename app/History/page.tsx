"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, History as HistoryIcon, ArrowRight, ArrowLeft } from "lucide-react";

// --- Data Fetching and State Management ---
interface HistoryData {
    time: string;
    temperature: number;
    humidity: number;
}

interface SensorData {
    history: HistoryData[];
}

async function fetchIotData(): Promise<SensorData> {
    const response = await fetch("/api/iot-data");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
        history: data.history.map((item: any) => ({
            // 保留时分秒
            time: new Date(item.timestamp || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temperature: item.temperature,
            humidity: item.humidity,
        })),
    };
}

// --- Main Component ---
export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getData = async () => {
            try {
                const iotData = await fetchIotData();
                // Reverse the history to show the latest data first
                setHistory(iotData.history.slice().reverse());
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            }
        };

        getData();
        const intervalId = setInterval(getData, 60000); // 每1分钟刷新一次

        return () => clearInterval(intervalId);
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Connection Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-foreground mb-2">Loading History...</p>
                <p className="text-sm text-muted-foreground">Fetching historical data</p>
            </div>
        );
    }

    return (
        <main className="flex-1 py-8 px-4">
            <div className="w-full max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                    <HistoryIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Historical Data</CardTitle>
                                    <CardDescription>Detailed log of sensor readings.</CardDescription>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => router.back()}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Temperature (°C)</TableHead>
                                    <TableHead className="text-right">Humidity (%)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((entry, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{entry.time}</TableCell>
                                        <TableCell className="text-right">{entry.temperature.toFixed(1)}</TableCell>
                                        <TableCell className="text-right">{entry.humidity.toFixed(1)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
