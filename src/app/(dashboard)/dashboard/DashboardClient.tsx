'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Plus, ArrowRight } from 'lucide-react'

export function DashboardClient() {
    const router = useRouter()
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
    const [roomIdInput, setRoomIdInput] = useState('')
    const [error, setError] = useState('')

    const handleCreateRoom = () => {
        // Generate random room ID (e.g., 4 characters)
        const randomId = Math.random().toString(36).substring(2, 6).toUpperCase()
        router.push(`/room/${randomId}`)
    }

    const handleJoinRoom = () => {
        if (!roomIdInput.trim()) {
            setError('Vui lòng nhập ID phòng!')
            return
        }
        // Redirect to the joined room
        router.push(`/room/${roomIdInput.toUpperCase()}`)
    }

    return (
        <>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Create Room */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="pb-2">
                        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-2">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Tạo Phòng Mới</CardTitle>
                        <CardDescription>
                            Tạo phòng và mời bạn bè cùng chơi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button size="lg" className="w-full h-14 text-lg" onClick={handleCreateRoom}>
                            <Plus className="h-5 w-5 mr-2" />
                            Tạo Phòng
                        </Button>
                    </CardContent>
                </Card>

                {/* Join Room */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-linear-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="pb-2">
                        <div className="h-12 w-12 rounded-xl bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-2">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Vào Phòng</CardTitle>
                        <CardDescription>
                            Nhập ID phòng để tham gia
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full h-14 text-lg border-2 hover:bg-accent/10"
                            onClick={() => setIsJoinDialogOpen(true)}
                        >
                            <ArrowRight className="h-5 w-5 mr-2" />
                            Vào Phòng
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Join Room Dialog */}
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nhập ID Phòng</DialogTitle>
                        <DialogDescription>
                            Nhập mã phòng mà bạn bè đã chia sẻ để tham gia.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Nhập ID phòng (VD: AX92)"
                                value={roomIdInput}
                                onChange={(e) => {
                                    setRoomIdInput(e.target.value)
                                    setError('') // Clear error on typing
                                }}
                                className="text-center text-lg tracking-widest uppercase"
                            />
                            {error && <p className="text-sm text-red-500 font-medium text-center shake">{error}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleJoinRoom}>Vào Phòng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
