'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Settings, Trophy, BookOpen } from 'lucide-react'
import { DashboardClient } from '@/app/(dashboard)/dashboard/DashboardClient'
import { Header } from '@/components/common/Header'

export function DashboardScreen() {
    return (
        <div className="min-h-screen bg-linear-to-br from-pink-50 via-fuchsia-50 to-rose-50 dark:from-pink-950/20 dark:via-fuchsia-950/20 dark:to-rose-950/20">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="container px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Welcome Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                            Chào mừng đến Nhà bếp!
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Chọn chế độ chơi và bắt đầu nấu ăn cùng Myna! 🍳
                        </p>
                    </div>

                    {/* Game Mode Cards */}
                    <DashboardClient />

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
                            <CardContent className="pt-6 text-center">
                                <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                                <p className="font-medium">Bảng xếp hạng</p>
                                <p className="text-xs text-muted-foreground">Sắp ra mắt</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
                            <CardContent className="pt-6 text-center">
                                <BookOpen className="h-8 w-8 mx-auto text-accent mb-2" />
                                <p className="font-medium">Hướng dẫn</p>
                                <p className="text-xs text-muted-foreground">Học cách chơi</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
                            <CardContent className="pt-6 text-center">
                                <Settings className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="font-medium">Cài đặt</p>
                                <p className="text-xs text-muted-foreground">Tùy chỉnh</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
